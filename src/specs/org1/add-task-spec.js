const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const helper = require('../../support/e2e-helper');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.userAccounts.orgAdmin;
let powerUser = S.userAccounts.powerUser;
let powerUser2 = S.userAccounts.basicUser;
let admin_userGroup = S.selectedEnvironment.admin_userGroup;
let readOnly_userGroup = S.selectedEnvironment.readOnly_userGroup;

describe('Add Task', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.permissions.assign_user_to_User_Group(powerUser, admin_userGroup)
        api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    context('1.1 Org Admin', function () {

        it('1.1.1 ' +
            'Add task template for type + subtype' +
            '-- and add task with required fields only - Unassigned' +
            '--keep template content  -- verify values on grid' +
            '--delete task template', function () {
            ui.app.clear_gmail_inbox(S.gmailAccount);
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskTemplateData()

            api.tasks.delete_all_task_templates();
            // add task template
            ui.menu.click_Settings__Task_Settings()
                .click('Task Templates')
                .click_button_on_active_tab('Add')
            ui.modal
                .select_dropdown_option('Task Type', D.newTaskTemplate.type)
                .select_dropdown_option('Sub Type', D.newTaskTemplate.subtype)
                .enter_value_in_multi_select_typeahead_field('Task Actions', D.newTaskTemplate.taskActions)
                .enter_value_to_textarea_field('Title', D.newTaskTemplate.title)
                .enter_value_to_textarea_field('Message', D.newTaskTemplate.message)
                .enter_value_to_input_field('Due Date', D.newTaskTemplate.dueDateDays, true)
                .click_button('Ok')
                .verify_toast_message('Saved')

            // add task -- keep template content
            D.getNewTaskData(null, null, D.newTaskTemplate.dueDateDays);
            D.newTask = Object.assign({}, D.newTaskTemplate)

            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask, true, true, D.newTaskTemplate)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask, orgAdmin)

            // delete task template
            ui.menu.click_Task_Settings()
                .click('Task Templates')
                .click(D.newTaskTemplate.subtype)
                .click_Actions()
                .click_Delete()
                .click('Yes')
                .verify_toast_message('Deleted')
        });

        it('1.1.2.' +
            'Add task template for type only (include title, message and due date)' +
            '-- add task with required fields only - assigned to 1 User' +
            '-- override template content  -- verify values on grid' +
            '-- check email with more details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskTemplateData()
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails: true,
                    sendEmailNotifications: true
                }
            )

            api.tasks.delete_all_task_templates();
            // add task template
            ui.menu.click_Settings__Task_Settings()
                .click('Task Templates')
                .click_button_on_active_tab('Add')
            ui.modal
                .select_dropdown_option('Task Type', D.newTaskTemplate.type)
                .enter_value_in_multi_select_typeahead_field('Task Actions', D.newTaskTemplate.taskActions)
                .enter_value_to_textarea_field('Title', D.newTaskTemplate.title)
                .enter_value_to_textarea_field('Message', D.newTaskTemplate.message)
                .enter_value_to_input_field('Due Date', D.newTaskTemplate.dueDateDays, true)
                .click_button('Ok')
                .verify_toast_message('Saved')

            // add task -- override template content
            D.getNewTaskData(powerUser, null, S.userAccounts.orgAdmin, 8);
            D.newTask.type = D.newTaskTemplate.type
            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask, false, false, D.newTaskTemplate)
                .click_Save()
                .verify_toast_message_(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name)

        });

        it('1.1.3.' +
            'Add task - assigned to 1 User Group' +
            '-- check email notification with less Task details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskData(null, admin_userGroup);
            D.getNewTaskTemplateData();
            api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails: false,
                    sendEmailNotifications: true
                }
            )

            api.tasks.delete_all_task_templates();
            D.newTaskTemplate.dueDateDays = null
            api.tasks.add_new_task_template(D.newTaskTemplate)

            // add task -- override template content
            D.getNewTaskData(null, admin_userGroup);
            D.newTask.type = D.newTaskTemplate.type
            D.newTask.subtype = D.newTaskTemplate.subtype
            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask, true, false, D.newTaskTemplate)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name, 2, false)
            ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name)
        });

        it('1.1.4. ' +
            'Add task assigned to 1 User and 1 User Group' +
            '-- check email notification with more Task details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails: true,
                    sendEmailNotifications: true
                }
            )

            api.tasks.delete_all_task_templates();
            D.getNewTaskTemplateData()
            D.newTaskTemplate.dueDateDays = null
            api.tasks.add_new_task_template(D.newTaskTemplate)

            // add task -- override template content
            D.getNewTaskData(powerUser, admin_userGroup);
            D.newTask.type = D.newTaskTemplate.type
            D.newTask.subtype = D.newTaskTemplate.subtype
            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask, true, false, D.newTaskTemplate)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name, 2, false)
            ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
        });

    });

    // it('A.T_1.4. Add task assigned to multiple Users and User Groups', function () {
    // });
    //
    // it('A.T_1.5. Add task with linked Case', function () {
    // });
    //
    // it('A.T_1.6. Add task with linked Item', function () {
    // });
    //
    // it('A.T_1.6. Add task with linked Person', function () {
    // });
});
