const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const helper = require('../../support/e2e-helper');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const taskList = require("../../pages/ui-spec");

let orgAdmin = S.userAccounts.orgAdmin;
let powerUser = S.userAccounts.powerUser;
let powerUser2 = S.userAccounts.basicUser;
let admin_userGroup = S.selectedEnvironment.admin_userGroup;
let readOnly_userGroup = S.selectedEnvironment.readOnly_userGroup;

//we need to modify this spec because task template now cannot be deleted, only deactivated
describe('Add Task', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.permissions.assign_user_to_User_Group(powerUser, admin_userGroup)
        api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
    });

    context('1.1 Org Admin', function () {

        it('1.1.1 ' +
           'Add task with required fields only ' +
            '-- Unassigned' +
            '-- keep template content' +
            '-- search for task on the grid by Creator name' +
            '-- verify values on grid', function () {

                ui.app.log_title(this);
                api.auth.get_tokens(orgAdmin);

                 let selectedTemplate = S.selectedEnvironment.taskTemplates.other

                 // add task -- keep template content
                 D.getNewTaskData(null, null, orgAdmin, selectedTemplate.dueDays);
                 D.newTask = Object.assign(D.newTask, selectedTemplate)

                ui.menu.click_Tasks();
                ui.addTask.click_button(C.buttons.addTask)
                     .populate_all_fields(D.newTask, true, true, selectedTemplate)
                    .click_Save()
                    .verify_toast_message(C.toastMsgs.saved)
                ui.taskList.search_for_the_task(orgAdmin.firstName)
                    .sort_by_descending_order('Creation Date')
                    .verify_task_data_on_grid(D.newTask, orgAdmin)
        });

        it.only('1.1.2.' +
            'Add task with all fields' +
            '-- assign to 1 user' +
            '-- attach 1 case, 1 item and 1 person' +
            '-- override template content' +
            '-- search for task on the grid by Assignee name' +
            '--verify values on grid' +
            '--verify no email arrives due to turned off Task notifications on Org Level' , function () {

            ui.app.clear_gmail_inbox(S.gmailAccount);
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.cases.add_new_case()
            api.items.add_new_item()
            api.people.add_new_person()
            api.org_settings.update_org_settings_by_specifying_property_and_value(
                'tasksSettingsConfiguration',
                {
                    moreDetailsInEmails: true,
                    sendEmailNotifications: false
                }
            )
            let selectedTemplate = S.selectedEnvironment.taskTemplates.other
            D.getNewTaskData(powerUser, null, S.userAccounts.orgAdmin, 8);

            cy.getLocalStorage('newItem').then(newItem => {
                D.newItem = Object.assign(D.newItem, JSON.parse(newItem))

                D.newTask.title = 'edited template title'
                D.newTask.message = 'edited template message'
                D.newTask.linkedObjects = [
                    {type: 'case', caseNumber: D.newCase.caseNumber},
                    {type: 'item',  caseNumber: D.newCase.caseNumber, orgNumber: D.newItem.sequentialOrgId},
                    {type: 'person',  personName: D.newPerson.businessName}
                ]

                D.newTask.caseReviewDate = helper.getSpecificDateInSpecificFormat(C.currentDateFormat.mask, D.newCase.reviewDate)
                D.newTask.caseReviewNotes = D.newCase.reviewDateNotes
                ui.menu.click_Tasks();
                ui.addTask.click_button(C.buttons.addTask)
                    .populate_all_fields(D.newTask, false, false, selectedTemplate)
                    .click_Save_()
                    .verify_toast_message(C.toastMsgs.saved)

                ui.taskList.search_for_the_task(powerUser.firstName)
                    .sort_by_descending_order('Creation Date')
                    .verify_newly_created_task_is_shown_in_first_table_row()
                    .search_for_the_newly_created_task()
                    .verify_task_data_on_grid(D.newTask, orgAdmin)
                    .verify_no_new_email_arrived_with_specific_subject('qa@trackerproducts.com', 'Task')
            })

        });


        ///old tests, need to be updated
    //     xit('1.1.3.' +
    //         'Add task - assigned to 1 User Group' +
    //         '-- check email notification with less Task details', function () {
    //         ui.app.log_title(this);
    //         api.auth.get_tokens(orgAdmin);
    //         D.getNewTaskData(null, admin_userGroup);
    //         D.getNewTaskTemplateData();
    //         api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
    //         api.org_settings.update_org_settings_by_specifying_property_and_value(
    //             'tasksSettingsConfiguration',
    //             {
    //                 moreDetailsInEmails: false,
    //                 sendEmailNotifications: true
    //             }
    //         )
    //
    //         api.tasks.delete_all_task_templates();
    //         D.newTaskTemplate.dueDateDays = null
    //         api.tasks.add_new_task_template(D.newTaskTemplate)
    //
    //         // add task -- override template content
    //         D.getNewTaskData(null, admin_userGroup);
    //         D.newTask.type = D.newTaskTemplate.type
    //         D.newTask.subtype = D.newTaskTemplate.subtype
    //         ui.menu.click_Tasks();
    //         ui.addTask.click_button(C.buttons.addTask)
    //             .populate_all_fields(D.newTask, true, false, D.newTaskTemplate)
    //             .click_Save()
    //             .verify_toast_message(C.toastMsgs.saved)
    //             .verify_task_data_on_grid(D.newTask)
    //             .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
    //         ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name, 2, false)
    //         ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name)
    //     });
    //
    //     xit('1.1.4. ' +
    //         'Add task assigned to 1 User and 1 User Group' +
    //         '-- check email notification with more Task details', function () {
    //         ui.app.log_title(this);
    //         api.auth.get_tokens(orgAdmin);
    //         api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
    //         api.org_settings.update_org_settings_by_specifying_property_and_value(
    //             'tasksSettingsConfiguration',
    //             {
    //                 moreDetailsInEmails: true,
    //                 sendEmailNotifications: true
    //             }
    //         )
    //
    //         api.tasks.delete_all_task_templates();
    //         D.getNewTaskTemplateData()
    //         D.newTaskTemplate.dueDateDays = null
    //         api.tasks.add_new_task_template(D.newTaskTemplate)
    //
    //         // add task -- override template content
    //         D.getNewTaskData(powerUser, admin_userGroup);
    //         D.newTask.type = D.newTaskTemplate.type
    //         D.newTask.subtype = D.newTaskTemplate.subtype
    //         ui.menu.click_Tasks();
    //         ui.addTask.click_button(C.buttons.addTask)
    //             .populate_all_fields(D.newTask, true, false, D.newTaskTemplate)
    //             .click_Save()
    //             .verify_toast_message(C.toastMsgs.saved)
    //             .verify_task_data_on_grid(D.newTask)
    //             .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
    //         ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name, 2, false)
    //         ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
    //     });
    //
    // });

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
     });
});
