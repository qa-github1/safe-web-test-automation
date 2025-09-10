const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

// Aug 11, 2025, Sumejja's Note ----> Test passed on Dev - Org#3 ---> Total time: 185 sec (cca 3 min)

describe('Import Case Updates', function () {

    let user = S.userAccounts.orgAdmin;

    before(function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        api.users.update_current_user_settings(user.id)
        api.auto_disposition.edit(true);
    });

    it('I.C.U_1. Import Case Updates for all regular and custom fields -- user and user group in Case Officer(s) field', function () {
        ui.app.log_title(this);

        let fileName = 'CaseUpdatesImport_allRegularFieldsUpdated-CustomFormAttached';

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();

        D.generateNewDataSet();
        api.cases.add_new_case();

        D.editedCase.caseNumber = D.newCase.caseNumber;
        D.editedCase.caseOfficers_importFormat =
            S.userAccounts.powerUser.email + ';' +
            S.selectedEnvironment.readOnly_userGroup.name
        E.editedCustomFieldsValues = E.generateCustomValues()
        D.editedCase = Object.assign(D.editedCase, D.newCustomFormData)
        D.editedCase.caseOfficers = [S.userAccounts.powerUser.name, S.selectedEnvironment.readOnly_userGroup.name]
        E.generateDataFor_CASES_Importer([D.editedCase], S.customForms.caseFormWithOptionalFields, true);
        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        // verify case data precheck
        ui.importer.precheck_import_data(fileName, C.importTypes.cases, true)
        ui.app.open_newly_created_case_via_direct_link();
        ui.caseView.select_tab(C.tabs.history)
            .verify_title_on_active_tab(1)

        // verify case updates import -- with custom form attached and initially populated by importer
        ui.importer.open_direct_url_for_page()
            .click_Play_icon_on_first_row()
            .check_import_status_on_grid('1 records imported')
            .quick_search_for_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link();
        let redHighlightedFields = ui.app.getArrayWithoutSpecificValue(C.caseFields.allEditableFieldsArray, ['Case Number']);
        ui.caseView.click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedCase, D.newCase, S.customForms.caseFormWithOptionalFields, true)
            .verify_red_highlighted_history_records(redHighlightedFields)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(2)
            .select_tab(C.tabs.basicInfo)
            .edit_Status(true)
            .click_Save()
            .verify_toast_message('Saved')

        fileName = 'CaseUpdatesImport_CustomFieldsUpdated';
        // verify case updates import -- with custom data updated by importer
        E.editedCustomFieldsValues = E.generateEditedCustomValues()
        D.editedCase.caseNumber = D.newCase.caseNumber;
        D.editedCase.active = true
        D.editedCase = Object.assign(D.editedCase, D.editedCustomFormData)
        E.generateDataFor_CASES_Importer([D.editedCase], S.customForms.caseFormWithOptionalFields, true);
        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        // verify case updates import
        ui.importer.import_data(fileName, C.importTypes.cases, true)
        ui.caseView.open_newly_created_case_via_direct_link()
            .click_Edit()
            .verify_custom_data_on_Edit_form(D.editedCustomFormData)

        // verify new item can be added to the case edited by importer
        D.getItemDataWithReducedFields(D.editedCase)
        api.org_settings.disable_Item_fields()
        ui.menu.click_Add__Item();
        ui.addItem.enter_Case_Number_and_select_on_typeahead(D.editedCase.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem, false, false)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save()
            .verify_Error_toast_message_is_NOT_visible();
        ui.itemView.verify_Item_View_page_is_open(D.editedCase.caseNumber)
    });

});
