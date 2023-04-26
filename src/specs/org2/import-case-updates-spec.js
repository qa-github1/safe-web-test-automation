const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import Case Updates', function () {

    let user = S.userAccounts.orgAdmin;

    before(function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        api.users.update_current_user_settings(user.id)
        api.auto_disposition.edit(true);
    });

    it('I.C.U_1. Import Case Updates - all fields -- user and user group in Case Officer(s) field', function () {
        ui.app.log_title(this);
        let fileName = 'CaseUpdatesImport_allFields_' + S.domain;

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();

         D.generateNewDataSet();
        D.editedCase.caseNumber = D.newCase.caseNumber;
        D.editedCase.caseOfficers_importFormat =
            'user-' + S.userAccounts.powerUser.guid + ',' +
            'group-' + S.selectedEnvironment.readOnly_userGroup.id
        D.editedCase.caseOfficers = [S.userAccounts.powerUser.name, S.selectedEnvironment.readOnly_userGroup.name]
        D.editedCase.status = 'Closed'
        D.editedCase.active = false
        E.generateDataFor_CASES_Importer([D.editedCase], null, true);

        api.cases.add_new_case();
        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_update_importing(fileName, C.importTypes.cases, 'CaseNumber')
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);
        ui.app.open_newly_created_case_via_direct_link();

        // D.editedCase.tags = null // #14580
        // D.editedCase.tagsOnHistory = null // #14580
         let redHighlightedFields = ui.app.getArrayWithoutSpecificValue(C.caseFields.allEditableFieldsArray, ['Case Number']);
        ui.caseView.click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedCase, D.newCase, null)
            .verify_red_highlighted_history_records(redHighlightedFields)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(2)

        ui.menu.click_Add__Item();
        ui.addItem.enter_Case_Number_and_select_on_typeahead(D.newCase.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem, false, true)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save()
            .verify_Error_toast_message_is_NOT_visible();
        ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
            .click_Edit()
            .verify_values_on_Edit_form(D.newItem)
            .edit_all_values(D.editedItem)
            .click_Save()
            .verify_Error_toast_message_is_NOT_visible();
    });

    it('I.C.U_2 Case Updates Import - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'CaseUpdates_precheckOnly_' + S.domain;
        api.auth.get_tokens(user);
        api.org_settings.enable_all_Case_fields();
        D.generateNewDataSet();
        E.generateDataFor_CASES_Importer([D.editedCase]);
        api.cases.add_new_case(D.newCase.caseNumber);

        E.caseImportDataWithAllFields[1][1] = D.newCase.caseNumber;
        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_updates_precheck(fileName, C.importTypes.cases, 'CaseNumber')
            .verify_toast_message([
                C.toastMsgs.precheckComplete,
                1 + C.toastMsgs.recordsPrechecked])
        ui.app.open_newly_created_case_via_direct_link();

        ui.caseView.select_tab(C.tabs.history)
            .verify_title_on_active_tab(1)
    });

});
