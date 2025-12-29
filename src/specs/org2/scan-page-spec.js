const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

const orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 10; i++) {
    describe('Scan Items', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.org_settings
                .enable_all_Item_fields()
                .update_org_settings_by_specifying_property_and_value('useContainers', true)
                .update_org_settings_by_specifying_property_and_value('showCheckedOutItemsInContainerScan', false)
                .update_org_settings_by_specifying_property_and_value('showItemsInContainerScan', true);
            api.cases.add_new_case();
            startTime = Date.now();
        });

        after(function () {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        afterEach(function () {
            cy.clearLocalStorage()
        });

        it('1. Scanning checked-in items via barcode, serial, location and container', function () {

            D.location1 = D.getStorageLocationData('loc1', null, true, true, false);
            D.container1 = D.getStorageLocationData('cont1', null, true, true, true);

            api.locations.add_storage_location(D.location1);
            api.locations.add_storage_location(D.container1);

            api.items.add_new_item(true, D.location1, 'item1', D.getNewItemData());
            api.items.add_new_item(true, D.location1, 'item2', D.getNewItemData());
            api.items.add_new_item(true, D.container1, 'item3', D.getNewItemData());

            cy.then(() => ({
                loc1: JSON.parse(localStorage.getItem(D.location1.name)),
                cont1: JSON.parse(localStorage.getItem(D.container1.name)),
                item1: JSON.parse(localStorage.getItem('item1')),
                item2: JSON.parse(localStorage.getItem('item2')),
                item3: JSON.parse(localStorage.getItem('item3')),
            }))
                .then(({loc1, cont1, item1, item2, item3}) => {

                    ui.menu.click_Scan();

                    cy.log(" 🟢🟢🟢  1. Scan Item by Barcode 🟢🟢🟢")
                    ui.scan.close_Item_In_Scan_List_alert()
                        .enable_all_standard_columns_on_the_grid(C.pages.scanPage, true)
                        .scan_barcode(item1.barcode)
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item1.barcode, D.location1.name]);

                    cy.log(" 🟢🟢🟢  2. Scan Item by Serial Number 🟢🟢🟢")
                    ui.scan.scan_barcode(item2.serialNumber)
                        .verify_records_count_on_grid(2)
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item2.barcode, D.location1.name]);

                    cy.log(" 🟢🟢🟢  3. Scan Item by Additional Barcode 🟢🟢🟢")
                    ui.scan.scan_barcode(item3.barcodes[0].value)
                        .verify_records_count_on_grid(3)
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item3.barcode, D.container1.name])
                        .clear_scanned_barcodes('Items')
                        .select_tab('Scan history')
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item3.barcode, D.container1.name, 'Items'])
                        .verify_content_of_specific_row_in_results_table_on_active_tab(2, [item2.barcode, D.location1.name, 'Items'])
                        .verify_content_of_specific_row_in_results_table_on_active_tab(3, [item1.barcode, D.location1.name, 'Items'])
                        .clear_scanned_barcodes('Scan history');
                    ui.app.verify_records_count_on_grid(0);

                    cy.log(" 🟢🟢🟢  4. Scan Location Barcode 🟢🟢🟢")
                    ui.scan.scan_barcode(loc1.barcode)
                        .verify_records_count_on_grid(2)
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item1.barcode, D.location1.name])
                        .verify_content_of_specific_row_in_results_table_on_active_tab(2, [item2.barcode, D.location1.name])
                        .clear_scanned_barcodes('Items');
                    ui.app.verify_records_count_on_grid(0);

                    cy.log(" 🟢🟢🟢  5. Scan Container Barcode with Checked-IN container Items being auto-scanned 🟢🟢🟢")
                    ui.scan.scan_barcode(cont1.barcode)
                        .verify_records_count_on_grid(1)
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [item3.barcode, D.container1.name])
                        .select_tab('Containers')
                        .verify_content_of_specific_row_in_results_table_on_active_tab(1, [cont1.name, ''])
                        .clear_scanned_barcodes('Containers')
                        .close_Item_In_Scan_List_alert()

                    cy.log(" 🟢🟢🟢  6. Scan Container Barcode without Checked-IN container Items being auto-scanned 🟢🟢🟢")
                    api.org_settings
                        .update_org_settings_by_specifying_property_and_value('useContainers', true)
                        .update_org_settings_by_specifying_property_and_value('showCheckedOutItemsInContainerScan', false)
                        .update_org_settings_by_specifying_property_and_value('showItemsInContainerScan', false);
                    ui.scan.scan_barcode(cont1.barcode)
                        .select_tab('Items')
                        .verify_records_count_on_grid(0)
                        .select_tab('Containers')
                        .verify_records_count_on_grid(1)
                        .clear_scanned_barcodes('Containers')
                        .close_Item_In_Scan_List_alert()

                });
        });
    });
}
