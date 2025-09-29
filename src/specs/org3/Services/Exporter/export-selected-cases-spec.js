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

            cy.window().then(win => {
                if (win.URL?.createObjectURL) cy.spy(win.URL, 'createObjectURL').as('blobUrl');

                cy.spy(win.HTMLAnchorElement.prototype, 'click').as('aClick');
                cy.spy(win.HTMLFormElement.prototype, 'submit').as('formSubmit');
            });

        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);

            cy.get('@aClick').its('callCount').then(a =>
                cy.get('@formSubmit').its('callCount').then(f =>
                    cy.get('@blobUrl').its('callCount').then(b => {
                        expect(a + f + b, 'download mechanism was triggered').to.be.greaterThan(0);
                    })
                )
            );
        });


        it('1. Export Selected Cases - Excel (Item View - Case Tab)', function () {
            //this api is triggered when User clicks on export selected
             cy.intercept('GET', '**/api/items/*/notesCount').as('notesCount');
            ui.app.open_newly_created_item_via_direct_link()
                .select_tab('Cases')
                .select_checkbox_on_specific_table_row(0)
                .click_element_on_active_tab(C.buttons.export)
                .click_option_on_expanded_menu('Selected - Excel');

            cy.wait('@notesCount').its('response.statusCode').should('eq', 200);

        });

        it('2. Export Selected Cases - CSV (Search Case Page)', function () {
            ui.menu.click_Search__Item()
            ui.searchItem
                .select_Status('Checked In')
                .enter_Description('contains', D.newItem.description)
                .click_Search()
                .click_checkbox_to_select_specific_row(0)
                .click_button('Export')
                .click_option_on_expanded_menu('Selected - CSV')
        });
    });

    //TODO: Later, we can add verification for downloaded place and text in the downloaded file
}

