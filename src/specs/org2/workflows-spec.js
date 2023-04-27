const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const C = require('../../fixtures/constants');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.userAccounts.orgAdmin
let powerUser = S.userAccounts.powerUser

describe('Workflows', function () {

    before(function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        api.org_settings.update_org_settings_by_specifying_property_and_value(
            'tasksSettingsConfiguration',
            {
                moreDetailsInEmails : true,
                sendEmailNotifications: true
            }
        )
    });

    beforeEach(function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        D.generateNewDataSet();
        D.newTask.message = 'This task was autogenerated from a custom workflow script that was created in the system.'
        D.newTask.status = 'New'
        D.newTask.title = 'workflow' + D.randomNo
        api.workflows.delete_all_workflows();
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    context('1. Case Workflows - all case fields enabled in Org Settings', function () {

        before(function () {
            api.auth.get_tokens(S.userAccounts.orgAdmin);
            api.org_settings.enable_all_Case_fields()
        });

        it('1.1 Email & Task - when Case created - all records - 1 user as email recipient', function () {
            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    powerUser.email,
                    ['Email',
                        //'Create new Task'
                    ],
                    C.workflows.executeWhen.created)
                .click_Save()

            api.cases.add_new_case();
            // ui.app.open_newly_created_case_via_direct_link()
            //     .select_tab('Tasks')
            //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseCreated, D.newCase, null, 1, false)
           // ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name, 1, false)
        });

        it('1.2 Email & Task  - when Case edited - matching records with "Offense Location equals ..." - 1 user group as email recipient', function () {
            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    powerUser.email,
                    ['Email',
                        //'Create new Task'
                    ],
                    C.workflows.executeWhen.edited,
                    C.workflows.whichRecords.matchingCriteria)
                .set_matching_criteria(
                    C.caseFields.offenseLocation,
                    C.workflows.operators.equals,
                    D.editedCase.offenseLocation)
                .click_Save();

            // edit just Case Number field over API
            let editedCase = Object.assign({}, D.newCase)
            editedCase.caseNumber = D.editedCase.caseNumber
            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .edit_newly_added_case();
            // ui.app.open_newly_created_case_via_direct_link()
            //     .select_tab('Tasks')
            //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseEdited, D.editedCase, null, 1, false)
           // ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name, 1, false)
        });

        it('1.3 Email & Task - when Case created or edited - matching records with "Offense Type not equals ..."', function () {
            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    powerUser.email,
                    ['Email',
                      //  'Create new Task'
                    ],
                    C.workflows.executeWhen.createdOrEdited,
                    C.workflows.whichRecords.matchingCriteria)
                .set_matching_criteria(
                    C.caseFields.offenseType,
                    C.workflows.operators.notEquals,
                    C.offenseTypes.accident,
                    false)
                .click_Save();

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case();
            // ui.app.open_newly_created_case_via_direct_link()
            //     .select_tab('Tasks')
            //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseCreated, D.newCase, null, 1, false)
          //  ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name, 1, false)

            api.cases.edit_newly_added_case();
            // ui.app.reload_page()
            //     .select_tab('Tasks')
            //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseEdited, D.editedCase, null, 3, false)
         //   ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name, 3, false)
        });

        it('1.4 Email & Task - when Case field edited - matching records with "Cypress Case Form Number equals ..."', function () {
            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    powerUser.email,
                    ['Email',
                      //  'Create new Task'
                    ],
                    C.workflows.executeWhen.fieldEdited,
                    C.workflows.whichRecords.matchingCriteriaCustomField,
                    C.caseFields.caseOfficers)
                .set_matching_criteria_custom_field(
                    C.caseCustomFields.cypressCaseForm_Textbox,
                    C.workflows.operators.equals,
                    D.editedCase.custom_textbox)
                .click_Save();

            D.editedCase = D.getEditedCaseData(D.newCase.caseNumber)
            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .edit_newly_added_case(true);
            // ui.app.open_newly_created_case_via_direct_link()
            // ui.app.open_newly_created_case_via_direct_link()
            //     .reload_page()
            //     .select_tab('Tasks')
            //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseFieldEdited, D.editedCase, C.caseFields.caseOfficers, 1, false)

      });

        it('1.5 Email & Task - when Custom Case field edited - matching all records, filtered by Office', function () {
            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    powerUser.email,
                    ['Email',
                        //  'Create new Task'
                    ],
                    C.workflows.executeWhen.customFieldEdited,
                    undefined,
                    C.caseCustomFields.cypressCaseForm_Number,
                    S.selectedEnvironment.office_1.name)
                .click_Save();

            D.editedCase = D.getEditedCaseData(D.newCase.caseNumber)
            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .edit_newly_added_case(true);
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseCustomFieldEdited, D.editedCase, C.caseCustomFields.cypressCaseForm_Number);
         //   ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name, 3, false)
        });

    });

    context('2. Item Workflows - all item fields enabled in Org Settings', function () {

        before(function () {
            api.auth.get_tokens(S.userAccounts.orgAdmin);
            api.org_settings.enable_all_Item_fields()
        });

        it('2.1 Email notification - when Item created - all records ', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    powerUser.email,
                    ['Email'],
                    C.workflows.executeWhen.created)
                .click_Save();

            D.newItem = D.getNewItemData(D.newCase)
            api.cases.add_new_case()
            api.items.add_new_item();
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemCreated, D.newItem)
        });

        it.only('2.2 Email notification - when Item edited - matching records with "Description equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    powerUser.email,
                    ['Email'],
                    C.workflows.executeWhen.edited,
                    C.workflows.whichRecords.matchingCriteria)
                .set_matching_criteria(
                    C.itemFields.description,
                    C.workflows.operators.equals,
                    D.editedItem.description)
                .click_Save();

            D.editedItem = D.getEditedItemData(D.newCase)
            api.org_settings.enable_all_Item_fields();
            api.cases.add_new_case()
            api.items.add_new_item()
                .edit_newly_added_item();
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemEdited, D.editedItem)
        });

        it('2.3 Email notification - when Item created or edited - matching records with "Category not equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    powerUser.email,
                    ['Email'],
                    C.workflows.executeWhen.createdOrEdited,
                    C.workflows.whichRecords.matchingCriteria)
                .set_matching_criteria(
                    C.itemFields.category,
                    C.workflows.operators.notEquals,
                    C.itemCategories.ammunition,
                    false)
                .click_Save();
            D.newItem = D.getNewItemData(D.newCase)
            D.editedItem = D.getEditedItemData(D.newCase)

            api.org_settings.enable_all_Item_fields();
            api.cases.add_new_case()
            api.items.add_new_item()
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemCreated, D.newItem);

            api.items.edit_newly_added_item();
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemEdited, D.editedItem)
        });

        it('2.4 Email notification - when Item field edited - matching records with "Cypress Item Form Number equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    powerUser.email,
                    ['Email'],
                    C.workflows.executeWhen.fieldEdited,
                    C.workflows.whichRecords.matchingCriteriaCustomField,
                    C.itemFields.serialNumber)
                .set_matching_criteria_custom_field(
                    C.itemCustomFields.cypressItemForm_Textbox,
                    C.workflows.operators.equals,
                    D.editedItem.custom_textbox)
                .click_Save();

            D.editedItem = D.getEditedItemData(D.newCase)
            api.org_settings.enable_all_Item_fields();
            api.cases.add_new_case()
            api.items.add_new_item()
                .edit_newly_added_item(true);
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemFieldEdited, D.editedItem, C.itemFields.serialNumber);
        });

        it('2.5 Email notification - when Custom Item field edited - matching all records, filtered by Office', function () {

            D.editedItem = D.getEditedItemData(D.newCase)

            api.org_settings.enable_all_Item_fields();
            api.cases.add_new_case()
            api.items.add_new_item()
                .add_custom_form_data_to_existing_item(D.newItem);

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    powerUser.email,
                    ['Email'],
                    C.workflows.executeWhen.customFieldEdited,
                    undefined,
                    C.itemCustomFields.cypressItemForm_Textbox,
                    S.selectedEnvironment.office_1.name)
                .click_Save();

             api.items.edit_newly_added_item(true);
            ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.itemCustomFieldEdited, D.editedItem, C.itemCustomFields.cypressItemForm_Textbox);
        });
    });
});
