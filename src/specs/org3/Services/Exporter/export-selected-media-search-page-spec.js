const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');
const {editedCase} = require("../../../../fixtures/data");
const helper = require("../../../../support/e2e-helper");

let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;
const exactly = C.searchCriteria.dates.exactly


for (let i = 0; i < 1; i++) {
    describe('Exporter ', function () {

        beforeEach(function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet();
            api.cases.add_new_case()
            ui.caseView.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.media)
                .click_button(C.buttons.add)
                .verify_element_is_visible('Drag And Drop your files here')
                .upload_file_and_verify_toast_msg('image.png')
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


        it('1. Export Selected Media - Excel (Search Media Page)', function () {
            ui.menu.click_Search__Media()
            ui.searchMedia.enter_Uploaded_Date(exactly, S.currentDate)
                .click_Search()
                .select_checkbox_on_specific_table_row(0)
                .click_button('Export')
                .click_option_on_expanded_menu('Selected - Excel');
        });

        it('2. Export Selected Media - CSV (Search Media Page)', function () {
            ui.menu.click_Search__Media()
            ui.searchMedia.enter_Uploaded_Date(exactly, S.currentDate)
                .click_Search()
                .select_checkbox_on_specific_table_row(0)
                .click_button('Export')
                .click_option_on_expanded_menu('Selected - CSV');
        });
    });

}

