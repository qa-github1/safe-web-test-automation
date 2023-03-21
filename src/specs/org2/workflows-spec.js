const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const C = require('../../fixtures/constants');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

// DO NOT enable this test suite before this card gets verified -- as there is a saved workflow that needs to be tested
// #12607 ⁃ User / User Group field [Custom Forms]
xdescribe('Workflows', function () {

    beforeEach(function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        D.generateNewDataSet();
      //  api.workflows.delete_all_workflows();
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    context('Case Workflows - all case fields enabled in Org Settings', function () {

        before(function () {
            api.auth.get_tokens(S.userAccounts.orgAdmin);
            api.org_settings.enable_all_Case_fields()
        });

        it('C.W_1. Email notification - when Case created - all records ', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.created,
                    C.workflows.whichRecords.all)
                .click_Save();

            api.cases.add_new_case();
            ui.workflows.verify_email_content_( C.workflows.caseCreated, D.newCase)
        });

        it('C.W_2. Email notification - when Case edited - matching records with "Offense Location equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.edited,
                    C.workflows.whichRecords.matchingCriteria)
                .set_matching_criteria(
                    C.caseFields.offenseLocation,
                    C.workflows.operators.equals,
                    D.editedCase.offenseLocation)
                .click_Save();

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .edit_newly_added_case();
            ui.workflows.verify_email_content_( C.workflows.caseEdited, D.editedCase)
        });

        it('C.W_3. Email notification - when Case created or edited - matching records with "Offense Type not equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    S.userAccounts.orgAdmin.email,
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
            ui.workflows.verify_email_content_( C.workflows.caseCreated, D.newCase);

            api.cases.edit_newly_added_case();
            ui.workflows.verify_email_content_( C.workflows.caseEdited, D.editedCase)
        });

        it('C.W_4. Email notification - when Case field edited - matching records with "Cypress Case Form Number equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.fieldEdited,
                    C.workflows.whichRecords.matchingCriteriaCustomField,
                    C.caseFields.caseOfficer)
                .set_matching_criteria_custom_field(
                    C.caseCustomFields.cypressCaseForm_Textbox,
                    C.workflows.operators.equals,
                    D.editedCase.custom_textbox)
                .click_Save();

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .add_custom_form_data_to_existing_case(D.newCase)
                .edit_newly_added_case();
            ui.workflows.verify_email_content_( C.workflows.caseFieldEdited, D.editedCase, C.caseFields.caseOfficer);
        });

        it('C.W_5. Email notification - when Custom Case field edited - matching all records, filtered by Office', function () {

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case()
                .add_custom_form_data_to_existing_case(D.newCase);

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.cases,
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.customFieldEdited,
                    C.workflows.whichRecords.all,
                    C.caseCustomFields.cypressCaseForm_Number,
                    S.selectedEnvironment.office_1.name)
                .click_Save();

            api.cases.edit_newly_added_case();
            ui.workflows.verify_email_content_( C.workflows.caseCustomFieldEdited, D.editedCase, C.caseCustomFields.cypressCaseForm_Number);
        });

    });

    context('Item Workflows - all item fields enabled in Org Settings', function () {

        before(function () {
            api.auth.get_tokens(S.userAccounts.orgAdmin);
            api.org_settings.enable_all_Item_fields()
        });

        it('I.W_1. Email notification - when Item created - all records ', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.created,
                    C.workflows.whichRecords.all)
                .click_Save();

            D.newItem = D.getNewItemData(D.newCase)
            api.cases.add_new_case()
            api.items.add_new_item();
            ui.workflows.verify_email_content_( C.workflows.itemCreated, D.newItem)
        });

        it('I.W_2. Email notification - when Item edited - matching records with "Description equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    S.userAccounts.orgAdmin.email,
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
             //.edit_newly_added_item();
            ui.app.open_newly_created_item_via_direct_link()
                .click_button(C.buttons.edit)
            ui.itemView.edit_all_values(D.editedItem)
                .click_Save()
            ui.workflows.verify_email_content_( C.workflows.itemEdited, D.editedItem)
        });

        it('I.W_3. Email notification - when Item created or edited - matching records with "Category not equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    S.userAccounts.orgAdmin.email,
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
            ui.workflows.verify_email_content_( C.workflows.itemCreated, D.newItem);

            //  api.items.edit_newly_added_item();
            ui.app.open_newly_created_item_via_direct_link()
                .click_button(C.buttons.edit)
            ui.itemView.edit_all_values(D.editedItem)
                .click_Save()
            ui.workflows.verify_email_content_( C.workflows.itemEdited, D.editedItem)
        });

       // bug reported - #11830 ⁃ [Workflows] Emails don't arrive when setting a 'Matching Criteria Custom Fields'
        xit('I.W_4. Email notification - when Item field edited - matching records with "Cypress Item Form Number equals ..."', function () {

            ui.menu.click_Settings__Workflows();
            ui.workflows.click_(C.buttons.add)
                .set_up_workflow(
                    'workflow' + D.randomNo,
                    C.workflows.types.items,
                    S.userAccounts.orgAdmin.email,
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
                .add_custom_form_data_to_existing_item(D.newItem)
            // .edit_newly_added_item();
            ui.app.open_newly_created_item_via_direct_link()
                .click_button(C.buttons.edit)
            ui.itemView.edit_all_values(D.editedItem)
                .click_Save()
            ui.workflows.verify_email_content_( C.workflows.itemFieldEdited, D.editedItem, C.itemFields.serialNumber);
        });

        // bug reported - #11830
        xit('I.W_5. Email notification - when Custom Item field edited - matching all records, filtered by Office', function () {

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
                    S.userAccounts.orgAdmin.email,
                    C.workflows.executeWhen.customFieldEdited,
                    C.workflows.whichRecords.all,
                    C.itemCustomFields.cypressItemForm_Textbox,
                    S.selectedEnvironment.office_1.name)
                .click_Save();

            // api.items.edit_newly_added_item();
            ui.app.open_newly_created_item_via_direct_link()
                .click_button(C.buttons.edit)
            ui.itemView.edit_all_values(D.editedItem)
                .click_Save()
            ui.workflows.verify_email_content_( C.workflows.itemCustomFieldEdited, D.editedItem, C.itemCustomFields.cypressItemForm_Textbox);
        });
    });
});
