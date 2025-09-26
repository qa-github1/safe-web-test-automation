const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');
const {editedCase} = require("../../../../fixtures/data");
const helper = require("../../../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);

describe('Mass Update Items through Actions on Search Results', function () {

    before(function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);
    });

    let allFieldsLabels = C.itemFields.massUpdateModal

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

    context('1. All fields enabled in Org Settings', function () {
        it('1.1 All fields turned on and edited', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let allValues = [
                D.editedItem.description,
                D.editedItem.recoveryLocation,
                D.editedItem.recoveredBy,
                D.editedItem.submittedBy,
                D.editedItem.category,
                D.editedItem.custodyReason,
                D.editedItem.recoveryDate,
                D.editedItem.make,
                D.editedItem.model,
                D.editedItem.itemBelongsTo,
                D.editedItem.tags[0]
            ]

            api.org_settings.enable_all_Item_fields()
            api.items.add_new_item(true, null, 'newItem1')
            ui.menu.click_Search__Item()
            ui.searchItem
                .select_Status('Checked In')
                .select_Office(S.selectedEnvironment.office_1.name)
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .click_Actions_On_Search_Results()
                .click_option_on_expanded_menu(C.dropdowns.itemActionsOnSearchResults.massUpdate)
                .turn_on_and_enter_values_to_all_fields_on_modal(allFieldsLabels, allValues)
                .verify_text_above_modal_footer('Warning! This action will mass update all items found by the current search, except items shared among Organizations')
                .click_Ok()
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem1').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.basicInfo)
            })
            ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allFieldsOnItemView, D.newItem)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem)
            //TODO:these three last steps related to History is failing, so if we want to
            //include this in test, we should fix method first
            //.open_last_history_record(0)
            // .verify_all_values_on_history(D.editedItem, D.newItem)
            //.verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)

        });
        it.only('1.2 All fields turned on but value is edited on required fields only', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(user);
            D.generateNewDataSet();

            let requiredValues = [
                D.editedItem.recoveryLocation,
                D.editedItem.description,
                D.editedItem.recoveryDate,
                D.editedItem.itemBelongsTo,
                D.editedItem.recoveredBy,
                D.editedItem.submittedBy,
                D.editedItem.category,
                D.editedItem.custodyReason
            ]

            api.org_settings.enable_all_Item_fields()
            api.items.add_new_item(true, null, 'newItem1')
            ui.menu.click_Search__Item()
            ui.searchItem
                .select_Status('Checked In')
                .select_Office(S.selectedEnvironment.office_1.name)
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .click_Actions_On_Search_Results()
                .click_option_on_expanded_menu(C.dropdowns.itemActionsOnSearchResults.massUpdate)
                .verify_Ok_button_is_disabled()
                .turn_on_all_toggles_on_modal(allFieldsLabels)
                .verify_asterisk_is_shown_for_fields_on_modal(requiredFieldsLabels)
                .enter_values_to_all_fields_on_modal(requiredFieldsLabels, requiredValues)
            //     .verify_text_above_modal_footer('Warning! This action will mass update all items found by the current search, except items shared among Organizations')
            //     .click_Ok()
            //     .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
            //     .sort_by_descending_order('Start Date')
            //     .verify_content_of_first_row_in_results_table('Completed')
            //
            // cy.getLocalStorage('newItem1').then(item => {
            //     ui.app.open_item_url(JSON.parse(item).id)
            //     ui.itemView.select_tab(C.tabs.basicInfo)
            // })
            // ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(allFieldsLabels, D.editedItem, D.newItem)
            //     .click_Edit()
            //     .verify_edited_and_not_edited_values_on_Item_Edit_form(allFieldsLabels, D.editedItem, D.newItem)
            // //these three last steps related to History is failing, so if we want to
            // //include this in test, we should fix method first
            // .open_last_history_record(0)
            //  .verify_all_values_on_history(D.editedItem, D.newItem)
            // .verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)
        });
    });
});
