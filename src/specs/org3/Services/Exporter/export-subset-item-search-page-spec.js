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
    describe('Exporter ', function () {

        beforeEach(function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet();
            api.org_settings.enable_all_Item_fields()
            api.cases.add_new_case()
            api.items.add_new_item(true)
            startTime = Date.now();

        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);

        });


        it('1. Export Subset Items - Excel (Search Item Page)', function () {
            ui.menu.click_Search__Item()
            ui.searchItem
                .select_Status('Checked In')
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .click_checkbox_to_select_specific_row(0)
                .click_button('Export')
                .click_option_on_expanded_menu('Subset of Search Results - Excel')
                .choose_subset_type(D.newItem.subsetTypePercentage)
                .type_percentage_or_number_of_items_on_item_subset_modal(D.newItem)
                .click_Ok()
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Download')
        });

        it('2. Export Subset Items - CSV (Search Item Page)', function () {
            ui.menu.click_Search__Item()
            ui.searchItem
                .select_Status('Checked In')
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .click_checkbox_to_select_specific_row(0)
                .click_button('Export')
                .click_option_on_expanded_menu('Subset of Search Results - CSV')
                .choose_subset_type(D.newItem.subsetTypeNumber)
                .type_percentage_or_number_of_items_on_item_subset_modal(D.newItem)
                .click_Ok()
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Download')
        });
    });

}

