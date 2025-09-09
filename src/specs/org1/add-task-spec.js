const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const helper = require("../../support/e2e-helper");
const DF = require("../../support/date-time-formatting");

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
        api.org_settings.enable_all_Item_fields();
        api.org_settings.enable_all_Person_fields()
        api.auto_disposition.edit(true)
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


                 D.getNewTaskData(null, null, orgAdmin, selectedTemplate.dueDays);
                 D.newTask = Object.assign(D.newTask, selectedTemplate)

                 // add task -- keep template content
                ui.menu.click_Tasks();
                ui.addTask.click_button(C.buttons.addTask)
                      .populate_all_fields(D.newTask, true, true, selectedTemplate)
                     .click_Save()
                     .verify_toast_message(C.toastMsgs.saved)
                 ui.taskList.search_for_the_task(orgAdmin.firstName)
                     .sort_by_descending_order('Creation Date')
                     .verify_task_data_on_grid(D.newTask, orgAdmin)
        });

        it('1.1.2.' +
            'Add task with all fields' +
            '-- assign to 1 user and 1 user group' +
            '-- attach 1 case, 1 item and 1 person' +
            '-- override template content' +
            '-- search for task on the grid by Assignee name' +
            '--verify values on grid' +
            '-- check email notification with more Task details' , function () {

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
                    sendEmailNotifications: true
                }
            )
            let selectedTemplate = S.selectedEnvironment.taskTemplates.other
            D.getNewTaskData(powerUser, admin_userGroup, S.userAccounts.orgAdmin, 8);

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
                    .select_assignees([D.newTask.userGroupName])
                    .click_Save_()
                    .verify_toast_message(C.toastMsgs.saved)
                ui.taskList.search_for_the_task(powerUser.firstName)
                    .sort_by_descending_order('Creation Date')
                    .verify_newly_created_task_is_shown_in_first_table_row()
                    .search_for_the_newly_created_task()
                    .verify_task_data_on_grid(D.newTask, orgAdmin)
                ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name, 2, false)
                ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
            })

        });


        it('1.1.3.' +
             'Add task - assigned to 1 User Group' +
             '-- check email notification with less Task details', function () {
             ui.app.log_title(this);
             api.auth.get_tokens(orgAdmin);
             D.getEditedTaskTemplateData(D.editedTaskTemplate);
             D.editedTaskTemplate = Object.assign(D.editedTaskTemplate);
             api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
             api.org_settings.update_org_settings_by_specifying_property_and_value(
                 'tasksSettingsConfiguration',
                 {
                     moreDetailsInEmails: false,
                     sendEmailNotifications: true
                 }
             )

             D.editedTaskTemplate.dueDateDays = null
             api.tasks.edit_task_template(D.editedTaskTemplate)
             D.getNewTaskData(null, admin_userGroup);
             D.newTask.template = D.editedTaskTemplate.template
             D.newTask.title = D.editedTaskTemplate.title
             D.newTask.message = D.editedTaskTemplate.message

             ui.menu.click_Tasks();
             ui.addTask.click_button(C.buttons.addTask)
                 .populate_all_fields(D.newTask, true, true, D.editedTaskTemplate)
                 .click_Save()
                 .verify_toast_message(C.toastMsgs.saved)
             ui.taskList.verify_task_data_on_grid(D.newTask)
                 .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'th')
             ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name, 2, false)
             ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated_noDetails, D.newTask, admin_userGroup.name)
         });


         it('1.1.4. ' +
             'Add task assigned to 1 User' +
             '--verify no email arrives due to turned off Task notifications on Org Level', function () {
             ui.app.log_title(this);
             api.auth.get_tokens(orgAdmin);
             api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
             api.org_settings.update_org_settings_by_specifying_property_and_value(
                 'tasksSettingsConfiguration',
                 {
                     moreDetailsInEmails: true,
                     sendEmailNotifications: false
                 }
             )
             D.getNewTaskTemplateData()
             D.newTaskTemplate.dueDateDays = null

             // add task -- override template content
             D.getNewTaskData(powerUser, null);
             D.newTask.template = D.newTaskTemplate.template
             D.newTask.title = D.newTaskTemplate.title
             D.newTask.message = D.newTaskTemplate.message
             ui.menu.click_Tasks();
             ui.addTask.click_button(C.buttons.addTask)
                 .populate_all_fields(D.newTask, true, false, D.newTaskTemplate)
                 .click_Save()
                 .verify_toast_message(C.toastMsgs.saved)
             ui.taskList.verify_task_data_on_grid(D.newTask)
                 .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'th')
                 .verify_no_new_email_arrived_with_specific_subject('qa@trackerproducts.com', 'Task')
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
     });
});
