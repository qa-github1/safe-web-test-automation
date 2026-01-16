const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {
    describe('Mass Update Items Custom Data', function () {

        before(function () {
            startTime = Date.now();
            api.auth.get_tokens(user)
            api.users.update_current_user_settings(user.id, C.currentDateTimeFormat)
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        let addFieldsOnHistory = [
            ...C.itemFields.allFieldsOnHistory,
            ...C.customFieldLabels
        ];

        it('1. Mass Update Custom Data when "Overwrite existing form data?" is ON', function () {
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
                .add_custom_form_data_to_existing_item(D.newCustomFormData);
            ui.menu.click_Search__Item()
            ui.searchItem
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .select_checkbox_on_first_table_row()
                .click_Actions_on_Search_Page()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.massUpdateCustomData)
                .choose_custom_form_from_mass_update_cf_modal(S.selectedEnvironment.itemOptionalCustomForm)
                .turn_on_and_enter_values_to_all_fields_on_custom_form_modal(C.customFieldLabels, allValues)
                .verify_text_is_visible('Mass updating 1 item')
                .enable_overwrite_existing_form_data()
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.basicInfo)
            })
            D.newItem.caseNumber = D.newCase.caseNumber
            ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allFieldsOnItemView, D.newItem)
                .click_Edit()
                .verify_custom_data_on_Edit_form(D.editedCustomFormData)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.newItem, D.newItem, S.customForms.itemFormWithOptionalFields, false, D.editedCustomFormData, D.newCustomFormData)
                .verify_red_highlighted_history_records(C.customFieldLabels, addFieldsOnHistory)
        });

        it('2. Mass Update Custom Data when "Overwrite existing form data?" is OFF', function () {
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
                .add_custom_form_data_to_existing_item(D.newCustomFormData);
            ui.menu.click_Search__Item()
            ui.searchItem
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .select_checkbox_on_first_table_row()
                .click_Actions_on_Search_Page()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.massUpdateCustomData)
                .choose_custom_form_from_mass_update_cf_modal(S.selectedEnvironment.itemOptionalCustomForm)
                .turn_on_and_enter_values_to_all_fields_on_custom_form_modal(C.customFieldLabels, allValues)
                .verify_text('Mass updating 1 item')
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.basicInfo)
            })
            D.newItem.caseNumber = D.newCase.caseNumber
            ui.itemView.click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.newItem)
                .verify_custom_data_on_Edit_form(D.newCustomFormData)
                .delete_first_custom_form_on_edit_page()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.newItem)
                .verify_custom_data_on_Edit_form(D.editedCustomFormData)
                .click_Save()
                .open_last_history_record(0)
                .verify_all_values_on_history(D.newItem, D.newItem, S.customForms.itemFormWithOptionalFields, false, D.editedCustomFormData, D.newCustomFormData)
        });
    });
}