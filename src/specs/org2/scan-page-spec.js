const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {

    describe('Scan Items', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.org_settings.enable_all_Item_fields()
            api.cases.add_new_case();
            D.location1 = D.getStorageLocationData('loc1111')
            api.locations.add_storage_location(D.location1)
            startTime = Date.now();
        });

        after(function () {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Scanning Checked In Item using Barcode', function () {
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData()
            api.locations.get_and_save_any_location_data_to_local_storage(D.location1.name)
            api.items.add_new_item(true, D.location1, 'item1')

            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()
                .enable_all_standard_columns_on_the_grid(C.pages.scanPage, true)

            cy.getLocalStorage('item1').then(newItem => {
                const item = JSON.parse(newItem)

                ui.scan.scan_barcode(item.barcode)
                    .verify_content_of_first_row_in_results_table_on_active_tab(item.barcode)
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .select_tab('Scan history')
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .verify_content_of_first_row_in_results_table_on_active_tab('Items')
            })
        })

        it('2. Scanning Checked In Item using Serial Number', function () {
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData()
            api.locations.get_and_save_any_location_data_to_local_storage(D.location1.name)
            api.items.add_new_item(true, D.location1, 'item2')

            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()
                .enable_all_standard_columns_on_the_grid(C.pages.scanPage, true)

            cy.getLocalStorage('item2').then(newItem => {
                const item = JSON.parse(newItem)

                ui.scan.scan_barcode(item.serialNumber)
                    .verify_content_of_first_row_in_results_table_on_active_tab(item.serialNumber)
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .select_tab('Scan history')
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .verify_content_of_first_row_in_results_table_on_active_tab('Items')
            })
        })

        it('3. Scanning Checked In Item using Additional Barcode', function () {
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData()
            api.locations.get_and_save_any_location_data_to_local_storage(D.location1.name)
            api.items.add_new_item(true, D.location1, 'item3')

            ui.menu.click_Scan()
            ui.scan.close_Item_In_Scan_List_alert()
                .enable_all_standard_columns_on_the_grid(C.pages.scanPage, true)

            cy.getLocalStorage('item3').then(newItem => {
                const item = JSON.parse(newItem)

                ui.scan.scan_barcode(item.barcodes[0].value)
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.additionalBarcodes)
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .select_tab('Scan history')
                    .verify_content_of_first_row_in_results_table_on_active_tab(D.location1.name)
                    .verify_content_of_first_row_in_results_table_on_active_tab('Items')
            })
        })
    })
}


