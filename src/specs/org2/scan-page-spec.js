const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let startTime;

for (let i = 0; i < 1; i++) {

    describe('Scan Items', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            D.getStorageLocation()
            D.generateNewDataSet();
            //  api.locations.add_storage_location('0 - automation - do not touch')
            startTime = Date.now();
        });

        after(function () {
            //  api.locations.delete_storage_location_by_name(D.editedStorageLocation.parentMoveLocation)
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it.only('1. Scanning Checked In Item Barcode', function () {

            cy.log(" 🟢🟢🟢  1. Scan Checked In Item Barcode 🟢🟢🟢 ")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();

            D.location1 = D.getStorageLocationData('loc1')

            api.locations.add_storage_location(D.location1)
            api.items.add_new_item(true, D.location1, 'item1InContainer')

            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()

            cy.getLocalStorage(D.location1.name).then(loc1 => {
                cy.getLocalStorage('item1InContainer').then(item_1 => {
                    const item1 = JSON.parse(item_1)
                    D.location1 = JSON.parse(loc1)

                    ui.scan.scan_barcode(D.location1.barcode)
                })
            })
                ui.app.verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .select_tab('Scan history')
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .verify_content_of_first_row_in_results_table_on_active_tab('Items')
        })
    })

}
