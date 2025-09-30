const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');
const {editedCase} = require("../../../../fixtures/data");
const helper = require("../../../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;
const equals = C.searchCriteria.inputFields.equals


for (let i = 0; i < 1; i++) {
    describe('Exporter ', function () {

        before(function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet();
           api.tasks.add_new_task(D.newTask)
            startTime = Date.now();


        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });


        it('1. Export All - Task Search Page - Excel', function () {
            ui.menu.click_Search__Tasks()
            ui.searchTasks.enter_task_title(equals, D.newTask)
                .click_Search()
                .click_button('Export')
                .click_option_on_expanded_menu('All - Excel')
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
            cy.reload()
            ui.app.verify_content_of_specific_cell_in_first_table_row('Download Link', 'Download')

        });

        it('2. Export All - Task Search Page - CSV', function () {
            ui.menu.click_Search__Tasks()
            ui.searchTasks.enter_task_title(equals, D.newTask)
                .click_Search()
                .click_button('Export')
                .click_option_on_expanded_menu('All - CSV')
            ui.app.verify_url_contains_some_value('export-jobs')
                .sort_by_descending_order('Start Date')
            cy.reload()
            ui.app.verify_content_of_specific_cell_in_first_table_row('Download Link', 'Download')

        });

    });
}

