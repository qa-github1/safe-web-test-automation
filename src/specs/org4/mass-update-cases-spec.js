const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const {editedCase} = require("../../fixtures/data");
const helper = require("../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);

describe('Mass Update Cases', function () {

    before(function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);
    });

    let allFieldsLabels = C.caseFields.massUpdateModal
    let requiredFieldsLabels = [
        'Offense Type',
        'Case Officer(s)',
        'Offense Location',
    ]
    let multiSelectFieldsLabels = [
        'Case Officer(s)',
        'Tags',
    ]

    context('1. all fields enabled in Org Settings', function () {
        it('1.1 all fields turned on and edited, "overwrite existing values" turned OFF', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let allValues = [
                D.editedCase.offenseType,
                D.editedCase.caseOfficerName,
                D.editedCase.offenseLocation,
                D.editedCase.offenseDescription,
                D.editedCase.offenseDate,
                D.editedCase.tags[0],
                D.editedCase.status,
                D.editedCase.reviewDate,
                D.editedCase.reviewDateNotes
            ]

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case(D.newCase.caseNumber + ' _1')
            api.cases.add_new_case(D.newCase.caseNumber + ' _2')

            ui.menu.click_Search__Case()
            ui.searchCase.enter_Case_Number('equals', D.newCase.caseNumber, C.searchCriteria.inputFields.textSearch)
                .click_Search()
                .select_checkbox_on_specific_table_row(1)
                .select_checkbox_on_specific_table_row(2)
                .click_button(C.buttons.actions)
                .click_Mass_Update()
                .turn_on_and_enter_values_to_all_fields_on_Mass_Update_Cases_modal(allFieldsLabels, allValues)
                .verify_text_above_modal_footer('Mass updating 2 cases')
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)
                .quick_search_for_case(D.newCase.caseNumber + ' _1')
                .click_Edit()
            ui.caseView.verify_edited_and_not_edited_values_on_Case_Edit_form(allFieldsLabels, D.editedCase, D.newCase)
                .quick_search_for_case(D.newCase.caseNumber + ' _2')
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Case_Edit_form(allFieldsLabels, D.editedCase, D.newCase)
        });

        it('1.2 all fields turned on and edited, "overwrite existing values" turned ON', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let multiSelectFieldsValues = [
                D.editedCase.caseOfficerName,
                D.editedCase.tags[0],
            ]

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case(D.newCase.caseNumber + ' _1')
            api.cases.add_new_case(D.newCase.caseNumber + ' _2')

            ui.menu.click_Search__Case()
            ui.searchCase.enter_Case_Number('equals', D.newCase.caseNumber, C.searchCriteria.inputFields.textSearch)
                .click_Search()
                .select_checkbox_on_specific_table_row(1)
                .select_checkbox_on_specific_table_row(2)
                .click_button(C.buttons.actions)
                .click_Mass_Update()
                .turnOnOnlySpecificTogglesOnModal([2, 6])
                .enter_values_to_all_fields_on_Mass_Update_modal(multiSelectFieldsLabels, multiSelectFieldsValues)
                .enable_Case_Officers_overwrite()
                .click_on_replace_tags()
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)
                .quick_search_for_case(D.newCase.caseNumber + ' _1')
                .click_Edit()
            ui.caseView.verify_edited_and_not_edited_values_on_Case_Edit_form(multiSelectFieldsLabels, D.editedCase, D.newCase, true)
                .quick_search_for_case(D.newCase.caseNumber + ' _2')
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Case_Edit_form(multiSelectFieldsLabels, D.editedCase, D.newCase, true)
        });

        it('1.3 all fields turned on but value is edited on required fields only', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let requiredValues = [
                D.editedCase.offenseType,
                D.editedCase.caseOfficerName,
                D.editedCase.offenseLocation,
            ]

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case(D.newCase.caseNumber + ' _1')
            api.cases.add_new_case(D.newCase.caseNumber + ' _2')

            ui.menu.click_Search__Case()
            ui.searchCase.enter_Case_Number('equals', D.newCase.caseNumber, C.searchCriteria.inputFields.textSearch)
                .click_Search()
                .select_checkbox_on_specific_table_row(1)
                .select_checkbox_on_specific_table_row(2)
                .click_button(C.buttons.actions)
                .click_Mass_Update()
                .verify_Ok_button_is_disabled()
                .verify_asterisk_is_shown_for_fields_on_modal(requiredFieldsLabels)
                .enter_values_to_all_fields_on_Mass_Update_modal(requiredFieldsLabels, requiredValues)
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)
                .quick_search_for_case(D.newCase.caseNumber + ' _1')
                .click_Edit()
            D.newCase.offenseDescription = ''
            D.newCase.reviewDateNotes = ''
            D.newCase.offenseDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode)
            D.newCase.reviewDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode)
            ui.caseView.verify_edited_and_not_edited_values_on_Case_Edit_form(requiredFieldsLabels, D.editedCase, D.newCase)
                .quick_search_for_case(D.newCase.caseNumber + ' _2')
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Case_Edit_form(requiredFieldsLabels, D.editedCase, D.newCase)
        });
    });
});
