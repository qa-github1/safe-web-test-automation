const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let user = S.getUserData(S.userAccounts.orgAdmin);

describe('Import Cases', function () {

    before(function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);
        api.org_settings.enable_all_Person_fields();
        api.users.update_current_user_settings(user.id, C.currentDateTimeFormat)
        D.generateNewDataSet();
    });

    it('I.C_1 Case with all regular and custom fields -- user and user group in Case Officer(s) field', function () {
        ui.app.log_title(this);
        let fileName = 'CaseImport_allFields_' + S.domain;
        api.auth.get_tokens(user);

        D.getNewCaseData();
        D.getNewItemData(D.newCase);
        D.newCase.caseOfficers_importFormat =
            S.userAccounts.orgAdmin.email + ';' +
            S.selectedEnvironment.admin_userGroup.name
        D.newCase.caseOfficers = [S.userAccounts.orgAdmin.name, S.selectedEnvironment.admin_userGroup.name]

        E.generateDataFor_CASES_Importer([D.newCase], S.customForms.caseFormWithOptionalFields);

        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();
        api.org_settings.update_org_settings(true, true);

        ui.menu.click_Tools__Data_Import();
        ui.importer.precheck_import_data(fileName, C.importTypes.cases)
            .quick_search_for_case(D.newCase.caseNumber, false);

        ui.importer.reload_page()
            .import_data(fileName, C.importTypes.cases)
            .quick_search_for_case(D.newCase.caseNumber);

        ui.caseView
            .verify_Case_View_page_is_open(D.newCase.caseNumber)
            .click_button_on_active_tab(C.buttons.edit)
            .verify_values_on_Edit_form(D.newCase, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.newCase, null, S.customForms.caseFormWithOptionalFields)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)

        // verify new item can be added to the imported case
        D.newItem.caseNumber = D.newCase.caseNumber
        ui.menu.click_Add__Item();
        ui.addItem.enter_Case_Number_and_select_on_typeahead(D.newCase.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem, false, false)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save(D.newItem)
            .verify_Error_toast_message_is_NOT_visible();
    });

    it('I.C_2 Case with minimum number of fields', function () {
        ui.app.log_title(this);
        let fileName = 'CaseImport_minimumFields_' + S.domain;
        api.auth.get_tokens(user);

        D.getCaseDataWithReducedFields();
        E.generateDataFor_CASES_Importer([D.newCase]);
        cy.generate_excel_file(fileName, E.caseImportDataWithMinimumFields);

        api.org_settings.disable_Case_fields();
        api.auto_disposition.edit(false);
        D.newCase.reviewDate = null
        D.newCase.reviewDateNotes = null

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases, C.importMappings.minimumCaseFields)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported])
            .quick_search_for_case(D.newCase.caseNumber);

        ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
            .click_button_on_active_tab(C.buttons.edit)
            .verify_values_on_Edit_form(D.newCase)
            .open_last_history_record()
            .verify_all_values_on_history(D.newCase)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
    });

    //enable test running regression test suite --> no need to import 5 thousand cases every day
    xit('I.C_3 Five thousand cases and verify cases count on search by ', function () {
        ui.app.log_title(this);
        let fileName = '5k_Cases_' + S.domain;
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);

        D.getNewCaseData();
        E.generateDataFor_CASES_Importer([D.newCase], null, null, 5000);

        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                5000 + C.toastMsgs.recordsImported], false, 30);
         ui.menu.click_Search__Case();
         ui.searchCase.enter_Offense_Description(C.searchCriteria.inputFields.equals, D.case1.offenseDescription)
            .enter_Created_Date(C.searchCriteria.dates.exactly, D.newCase.createdDate)
            .click_button(C.buttons.search)
            .verify_toast_title_and_message(C.toastMsgs.resultsLimitExceededTitle, C.toastMsgs.resultsLimitExceeded('5,000').toString())
    });

});
