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

    it('I.C_1 Case with all fields -- user and user group in Case Officer(s) field', function () {
        ui.app.log_title(this);
        let fileName = 'CaseImport_allFields_' + S.domain;
        api.auth.get_tokens(user);

        D.getNewCaseData();
        D.getNewItemData(D.newCase);
        D.newCase.caseOfficers_importFormat =
            'user-' + S.userAccounts.orgAdmin.guid + ',' +
            'group-' + S.selectedEnvironment.admin_userGroup.id
        D.newCase.caseOfficers = [S.userAccounts.orgAdmin.name, S.selectedEnvironment.admin_userGroup.name]
        E.generateDataFor_CASES_Importer([D.newCase]);

        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
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

        D.newItem.caseNumber = D.newCase.caseNumber
        ui.menu.click_Add__Item();
        ui.addItem.enter_Case_Number_and_select_on_typeahead(D.newCase.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem, false)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save(D.newItem)
            .verify_Error_toast_message_is_NOT_visible();
        ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
            .click_Edit()
            .verify_values_on_Edit_form(D.newItem)
            .edit_all_values(D.editedItem)
            .click_Save()
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
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
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

    it('I.C_3 Case with custom fields', function () {
        ui.app.log_title(this);
        let fileName = 'CaseImport_customFields_' + S.domain;
        api.auth.get_tokens(user);

        D.getCaseDataWithReducedFields();
        D.newCase.reviewDate = null
        D.newCase.reviewDateNotes = null
        E.generateDataFor_CASES_Importer([D.newCase], C.customForms.casesFormWithOptionalFields);
        cy.generate_excel_file(fileName, E.caseImportDataWithMinimumFields);

        api.org_settings.disable_Case_fields();
        api.auto_disposition.edit(false);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported])
            .quick_search_for_case(D.newCase.caseNumber);

        ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
            .click_button_on_active_tab(C.buttons.edit)
            .verify_values_on_Edit_form(D.newCase, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.newCase, null, C.customForms.casesFormWithOptionalFields)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
    });

    //enable test running regression test suite
    // no need to import 5 thousand cases every day
    xit('I.C_4 Five thousand cases and verify cases count on search by ', function () {
        ui.app.log_title(this);
        let fileName = '60k_Cases_' + S.domain;
        api.auth.get_tokens(user);

        D.getNewCaseData();
        D.newCase.offenseDescription = 'imported';
        E.generateDataFor_CASES_Importer(D.newCase, 60000);

        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                5000 + C.toastMsgs.recordsImported], false, 30);
        ui.menu.click_Search__Case();
        ui.searchCase.enter_Offense_Description(D.newCase.offenseDescription)
            .enter_Created_Date(D.newCase.createdDate)
            .click_button(C.buttons.search)
            .verify_toast_message(C.toastMsgs.resultsLimitExceeded)
            .verify_toast_message('60,000')
    });

    it('I.C_5 Case Import - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'Case_PrecheckOnly_' + S.domain;
        api.auth.get_tokens(user);

        D.generateNewDataSet();
        E.generateDataFor_CASES_Importer([D.newCase]);
        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        api.org_settings.enable_all_Case_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.precheckComplete,
                1 + C.toastMsgs.recordsPrechecked])
            .quick_search_for_case(D.newCase.caseNumber, false);
    });

});
