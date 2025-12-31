const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');
const {editedCase} = require("../../../../fixtures/data");
const helper = require("../../../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {
describe('Mass Update Custom Data through Actions on Search Results', function () {

    before(function () {
        startTime = Date.now();

    });

    after(() => {
        const endTime = Date.now();
        const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
        cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
    });

    let allFieldsLabels = C.itemFields.massUpdateCFModal

    let requiredFieldsLabels = [
        'Recovered At',
        'Description',
        'Recovery Date',
        'Item Belongs to',
        'Recovered By',
        'Submitted By',
        'Category',
        'Custody Reason'
    ]

    let multiSelectFieldsLabels = [
        'Tags',
    ]
    //TODO: Sumejja should check further

    xit('1. Mass Update Custom Data when "Overwrite existing form data?" is ON', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(user);
        api.org_settings.update_org_settings(false, true);
        D.generateNewDataSet();

        let allValues = [
            D.editedCustomFormData.custom_textbox,
            D.editedCustomFormData.custom_email,
            D.editedCustomFormData.custom_number,
            D.editedCustomFormData.custom_password,
            D.editedCustomFormData.custom_textarea,
            D.editedCustomFormData.custom_checkbox,
            D.editedCustomFormData.custom_checkboxListOption,
            D.editedCustomFormData.custom_radiobuttonListOption,
            D.editedCustomFormData.custom_selectListOption,
            D.editedCustomFormData.custom_dropdownTypeaheadOption,
            D.editedCustomFormData.custom_user_or_group_names,
            D.editedCustomFormData.custom_personEmail,
            D.editedCustomFormData.custom_date
        ]

        api.org_settings.enable_all_Item_fields();
        api.cases.add_new_case()
        api.items.add_new_item()
            .add_custom_form_data_to_existing_item_2(D.newCustomFormData);
        ui.menu.click_Search__Item()
        ui.searchItem
            .select_Status('Checked In')
            .select_Office(S.selectedEnvironment.office_1.name)
            .enter_Description('contains', D.newItem.description)
            .click_Search()
            .click_Actions_On_Search_Results()
            .click_option_on_expanded_menu(C.dropdowns.itemActionsOnSearchResults.massUpdateCF)
            .choose_custom_form_from_mass_update_cf_modal(S.selectedEnvironment.itemCustomForm)
            .turn_on_and_enter_values_to_all_fields_on_custom_form_modal(allFieldsLabels, allValues)
            .verify_text('Warning! This action will mass update all items found by the current search, except items shared among Organizations')
            .enable_overwrite_existing_form_data()
             .click_Ok()
             .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
             .sort_by_descending_order('Start Date')
             .verify_content_of_first_row_in_results_table('Completed')

        cy.getLocalStorage('newItem').then(item => {
            ui.app.open_item_url(JSON.parse(item).id)
            ui.itemView.select_tab(C.tabs.basicInfo)
        })
         ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allFieldsOnItemView, D.newItem)
              .click_Edit()
             .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.newItem)
             .verify_custom_data_on_Edit_form(D.editedCustomFormData)
         .open_last_history_record(0)
         .verify_red_highlighted_history_records(C.itemFields.massUpdateCFModal)
        // // TODO: Add later more verifications related to History Page - maybe verify all records
        api.auth.log_out(user)

    });
    //TODO: Sumejja should check further

    xit('2. Mass Update Custom Data when "Overwrite existing form data?" is OFF', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(user);
        api.org_settings.update_org_settings(false, true);
        D.generateNewDataSet();

        let allValues = [
            D.editedCustomFormData.custom_textbox,
            D.editedCustomFormData.custom_email,
            D.editedCustomFormData.custom_number,
            D.editedCustomFormData.custom_password,
            D.editedCustomFormData.custom_textarea,
            D.editedCustomFormData.custom_checkbox,
            D.editedCustomFormData.custom_checkboxListOption,
            D.editedCustomFormData.custom_radiobuttonListOption,
            D.editedCustomFormData.custom_selectListOption,
            D.editedCustomFormData.custom_dropdownTypeaheadOption,
            D.editedCustomFormData.custom_user_or_group_names,
            D.editedCustomFormData.custom_personEmail,
            D.editedCustomFormData.custom_date
        ]

        api.org_settings.enable_all_Item_fields();
        api.cases.add_new_case()
        api.items.add_new_item()
            .add_custom_form_data_to_existing_item_2(D.newCustomFormData);
        ui.menu.click_Search__Item()
        ui.searchItem
            .select_Status('Checked In')
            .select_Office(S.selectedEnvironment.office_1.name)
            .enter_Description('contains', D.newItem.description)
            .click_Search()
            .click_Actions_On_Search_Results()
            .click_option_on_expanded_menu(C.dropdowns.itemActionsOnSearchResults.massUpdateCF)
            .choose_custom_form_from_mass_update_cf_modal(S.selectedEnvironment.itemCustomForm)
            .turn_on_and_enter_values_to_all_fields_on_custom_form_modal(allFieldsLabels, allValues)
            .verify_text('Warning! This action will mass update all items found by the current search, except items shared among Organizations')
            .click_Ok()
            .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
            .sort_by_descending_order('Start Date')
            .verify_content_of_first_row_in_results_table('Completed')

        cy.getLocalStorage('newItem').then(item => {
            ui.app.open_item_url(JSON.parse(item).id)
            ui.itemView.select_tab(C.tabs.basicInfo)
        })
        ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allFieldsOnItemView, D.newItem)
            .click_Edit()
            .verify_custom_data_on_Edit_form(D.newCustomFormData)
            .delete_custom_form_on_edit_page()
            .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.newItem)
            .verify_custom_data_on_Edit_form(D.editedCustomFormData)
            .open_last_history_record(0)
            .verify_red_highlighted_history_records(C.itemFields.massUpdateCFModal)
        // TODO: Add later more verifications related to History Page - maybe verify all records
        api.auth.log_out(user)

    });
});
}