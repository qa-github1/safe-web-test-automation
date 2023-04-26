const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
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

        it('1.1.1 Add task with required fields only -- Unassigned', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskData(null, null);

            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask, orgAdmin)
        });

        it('1.1.2. Add task assigned to 1 User and check email notification with more Task details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskData(powerUser, null);
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails : true,
                    sendEmailNotifications: true
                }
            )

            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask)
                .click_Save()
                .verify_toast_message_(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', D.newTask, 'number', 'td')
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name)

        });

        it('A.T_1.3. Add task assigned to 1 User Group and check email notification with less Task details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskData(null, admin_userGroup);
            api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails : false,
                    sendEmailNotifications: true
                }
            )

            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', D.newTask, 'taskNumber', 'td')
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name)
        });

        it.only('A.T_1.3. Add task assigned to 1 User and 1 User Group and check email notification with more Task details', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewTaskData(powerUser, admin_userGroup);
            api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails : true,
                    sendEmailNotifications: true
                }
            )

            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_task_data_on_grid(D.newTask)
                .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
                .c
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
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
