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


        it('1. Export All - Case View - Items Tab - Excel', function () {
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.items)
                .select_checkbox_for_all_records()
                .click_element_on_active_tab(C.buttons.export)
                .click_option_on_expanded_menu('All - Excel')
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Download')

        });

        it('2. Export All - Case View - Items Tab - CSV', function () {
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.items)
                .select_checkbox_for_all_records()
                .click_element_on_active_tab(C.buttons.export)
                .click_option_on_expanded_menu('All - CSV')
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Download')

        });

    });
}
