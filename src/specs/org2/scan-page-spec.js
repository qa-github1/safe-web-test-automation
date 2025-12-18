const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let startTime;
let randomNo = D.setNewRandomNo();


for (let i = 0; i < 1; i++) {

    describe('Scan Items', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            D.getStorageLocation()
            D.generateNewDataSet();
            startTime = Date.now();
        });

        after(function () {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Scanning Checked In Item using Barcode', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);

            D.location1 = D.getStorageLocationData('loc1')

            api.locations.add_storage_location(D.location1)
            api.items.add_new_item(true, D.location1, 'item1InLocation')


            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()

            cy.getLocalStorage(D.location1.name).then(loc1 => {
                cy.getLocalStorage('item1InLocation').then(item_1 => {
                    const item1 = JSON.parse(item_1)
                    D.location1 = JSON.parse(loc1)

                    ui.scan.scan_barcode(item1.barcode)
                    ui.app.verify_content_of_first_row_in_results_table_on_active_tab(item1.barcode)

                })
            })


            ui.app.verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                .select_tab('Scan history')
                .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                .verify_content_of_first_row_in_results_table_on_active_tab('Items')
        })

        it('2. Scanning Checked In Item using Serial Number', function () {

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);

            D.location2 = D.getStorageLocationData('loc2')

            api.locations.add_storage_location(D.location2)
            api.items.add_new_item(true, D.location2, 'item1InLocation')


            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()

            cy.getLocalStorage(D.location2.name).then(loc2 => {
                cy.getLocalStorage('item1InLocation').then(item_1 => {
                    const item1 = JSON.parse(item_1)
                    D.location2 = JSON.parse(loc2)

                    ui.scan.scan_barcode(item1.serialNumber)
                    ui.app.verify_content_of_first_row_in_results_table_on_active_tab(item1.serialNumber)

                })
            })

            ui.app.verify_content_of_first_row_in_results_table_on_active_tab(D.location2.name)
                .select_tab('Scan history')
                .verify_content_of_first_row_in_results_table_on_active_tab(D.location2.name)
                .verify_content_of_first_row_in_results_table_on_active_tab('Items')
        })

        it('3. Scanning Checked In Item using Additional Barcode', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);

            D.location1 = D.getStorageLocationData('loc1')

            api.locations.add_storage_location(D.location1)
            api.items.add_new_item(true, D.location1, 'item1InLocation')


            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()

            cy.getLocalStorage(D.location1.name).then(loc1 => {
                cy.getLocalStorage('item1InLocation').then(item_1 => {
                    const item1 = JSON.parse(item_1)
                    D.location1 = JSON.parse(loc1)

                    ui.scan.scan_barcode(item1.barcodes[0].value)
                })
            })

            ui.app.verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
            ui.app.verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.additionalBarcodes)
                .select_tab('Scan history')
                .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                .verify_content_of_first_row_in_results_table_on_active_tab('Items')
                .verify_content_of_first_row_in_results_table_on_active_tab('Scanned')
        })
    })

}


