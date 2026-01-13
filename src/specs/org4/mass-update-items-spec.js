const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const {editedCase} = require("../../fixtures/data");
const helper = require("../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {
    describe('Mass Update Items', function () {

        before(function () {
            startTime = Date.now();

        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
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

        let optionalFieldsLabels = [
            'Make',
            'Model',
            'Tags'
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
                    D.editedItem.submittedBy = 'Power User',
                    D.editedItem.category,
                    D.editedItem.custodyReason,
                    D.editedItem.recoveryDate,
                    D.editedItem.make,
                    D.editedItem.model,
                    D.editedItem.itemBelongsTo,
                    D.editedItem.tags[0]
                ]

                api.org_settings.enable_all_Item_fields()
                api.items.add_new_item(false, null, 'newItem1')
                ui.menu.click_Search__Item()
                ui.searchItem
                    .enter_Description('contains', D.newItem.description)
                    .click_Search()
                    .select_checkbox_on_first_table_row()
                    .click_Actions_on_Search_Page()
                    .click_Mass_Update()
                    .turn_on_and_enter_values_to_all_fields_on_Mass_Update_Items_modal(allFieldsLabels, allValues)
                    .verify_text_above_modal_footer('Mass updating 1 item')
                    .click_Ok()
                    .verify_toast_message(C.toastMsgs.saved)

                cy.getLocalStorage('newItem1').then(item => {
                    ui.app.open_item_url(JSON.parse(item).id)
                    ui.itemView.select_tab(C.tabs.basicInfo)
                })
                D.editedItem.submittedBy = 'Power User'
                // TODO: Please review if this is enough to verify only fields that are modified
                ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.massUpdateModal, D.editedItem)
                    .click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.massUpdateModal, D.editedItem)
                    .open_last_history_record(0)
                    .verify_red_highlighted_history_records(C.itemFields.massUpdateModal)
                //TODO: Please review this method below if we want to  include an extra verification
                // .verify_all_values_on_history(D.editedItem, D.newItem)

                api.auth.log_out(user)

            });

            it('1.2 All fields turned on but value is edited on required fields only', function () {
                ui.app.log_title(this);
                api.auth.get_tokens(user);
                D.generateNewDataSet();

                let requiredValues = [
                    D.editedItem.recoveryLocation,
                    D.editedItem.description,
                    D.editedItem.recoveryDate,
                    D.editedItem.itemBelongsTo,
                    D.editedItem.recoveredBy,
                    D.editedItem.submittedBy = 'Power User',
                    D.editedItem.category,
                    D.editedItem.custodyReason,
                ]

                api.org_settings.enable_all_Item_fields()
                api.items.add_new_item(true, null, 'newItem1')
                ui.menu.click_Search__Item()
                ui.searchItem
                    .enter_Description('contains', D.newItem.description)
                    .click_Search()
                    .select_checkbox_on_first_table_row()
                    .click_Actions_on_Search_Page()
                    .click_Mass_Update()
                    .verify_Ok_button_is_disabled()
                    .turnOnTogglesBasedOnFieldLabels(allFieldsLabels)
                    .verify_asterisk_is_shown_for_fields_on_modal(requiredFieldsLabels)
                    .turnOffTogglesBasedOnFieldLabels(optionalFieldsLabels) // #19466 ⁃ Items - Uncategorized Issues (issue #4)
                    .enter_values_to_all_fields_on_modal(requiredFieldsLabels, requiredValues)
                    .verify_text_above_modal_footer('Mass updating 1 item')
                    .click_Ok()


                cy.getLocalStorage('newItem1').then(item => {
                    ui.app.open_item_url(JSON.parse(item).id)
                    ui.itemView.select_tab(C.tabs.basicInfo)
                })
                D.editedItem.make = ''
                D.editedItem.model = ''
                D.editedItem.submittedBy = 'Power User'
                // TODO: Please review this part below - I verified only values that are changed through the mass update modal
                ui.itemView.verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.massUpdateModalWhenAllTogglesAreOn, D.editedItem)
                ui.itemView.click_Edit()
                ui.itemView.verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.massUpdateModalWhenAllTogglesAreOn, D.editedItem)
                    .open_last_history_record(0)
                    .verify_red_highlighted_history_records(requiredFieldsLabels)
                //TODO: failing od this method below - we need to see what is the problem if we want to include this method also
                // .verify_all_values_on_history(D.editedItem, D.newItem)

            });
        });
    });
}
