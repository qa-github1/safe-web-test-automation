const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const E = require("../../fixtures/files/excel-data");

let orgAdmin = S.userAccounts.orgAdmin;
describe('Inventory Reports', function () {

    context('1. Parent/child locations with items but without containers', function () {

        let
            parent1 = D.currentDateAndRandomNumber + '_' +  'Parent1',
            child1_1 = D.currentDateAndRandomNumber + '_' + 'Child1_1',
            child1_2 = D.currentDateAndRandomNumber + '_' + 'Child1_2',
            parent2 = D.currentDateAndRandomNumber + '_' + 'Parent2',
            child2_1 = D.currentDateAndRandomNumber + '_' + 'Child2_1'

        let barcodes = [];

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields([C.itemFields.description])
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();

            api.locations.add_storage_location(parent1)
            api.locations.add_storage_location(child1_1, parent1)
            api.locations.add_storage_location(child1_2, parent1)

            api.locations.add_storage_location(parent2)
            api.locations.add_storage_location(child2_1, parent2)

            api.items.add_new_item(true, parent1, 'item0')

            api.items.add_new_item(true, child1_1, 'item1')
            api.items.add_new_item(true, child1_1, 'item2')

            api.items.add_new_item(true, child1_2, 'item3')
            api.items.add_new_item(true, child1_2, 'item4')

            api.items.add_new_item(true, parent2, 'item5')

            api.items.add_new_item(true, child2_1, 'item6')
            api.items.add_new_item(true, child2_1, 'item7')

            for (let i = 0; i < 8; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)
                })
            }

        });

        after(function () {
            api.auth.get_tokens(orgAdmin);

            // api.locations.delete_empty_storage_locations()
            api.locations.get_and_save_any_location_data_to_local_storage('root')
            api.locations.move_location(parent1, 'root')
            api.locations.move_location(child1_1, 'root')
            api.locations.move_location(child1_2, 'root')
            api.locations.move_location(parent2, 'root')
            api.locations.move_location(child2_1, 'root')
        })

        it('1.1. DR for single parent location - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);
            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[parent1].barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(D[child1_1].barcode, true)
                .enter_barcode(barcodes[1])
                .enter_barcode(barcodes[2])
                .enter_barcode(D[child1_2].barcode, true)
                .enter_barcode(barcodes[3])
                .enter_barcode(barcodes[4])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.noDiscrepanciesFound)
                .verify_summary_table(5, 3, 5, 0, 0)
        });

        it('1.2. DR for single child location - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[child1_1].barcode)
                .enter_barcode(barcodes[1])
                .enter_barcode(barcodes[2])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.noDiscrepanciesFound)
                .verify_summary_table(2, 1, 2, 0, 0)
        })

        it('1.3. DR for multiple parent and child locations - starting with Parent loc - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

                        ui.menu.click_Tools__Inventory_Reports()
                            .click_button(C.buttons.newReport)
                        ui.inventoryReports.start_report(reportName, D[parent1].barcode)
                            .enter_barcode(barcodes[0])
                            .enter_barcode(D[child1_1].barcode, true)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D[child1_2].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D[parent2].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D[child2_1].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.InventoryReports.noDiscrepanciesFound)
        });

        it('1.4. Create and run DR for multiple parent and child locations - starting with Child loc -  No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);
                        ui.menu.click_Tools__Inventory_Reports()
                            .click_button(C.buttons.newReport)
                        ui.inventoryReports.start_report(reportName, D[child1_1].barcode)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D[child1_2].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D[parent2].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D[child2_1].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.InventoryReports.noDiscrepanciesFound)
        });

        it('1.5. Create and run DR for multiple parent and child locations  - starting with Child loc - switching back to parent location-  No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            cy.wrap(null).then(() => {
                expect(barcodes).to.have.length(8);

                ui.menu.click_Tools__Inventory_Reports()
                    .click_button(C.buttons.newReport);
                        ui.inventoryReports.start_report(reportName, D[child1_1].barcode)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(D[parent1].barcode, true)
                            .enter_barcode(barcodes[0])
                            .enter_barcode(D[child1_1].barcode, true)
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D[parent2].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D[child1_2].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D[child2_1].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.InventoryReports.noDiscrepanciesFound)
                })
        });

        it('1.6. Create and run DR for single parent location - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[parent1].barcode)
                .enter_barcode(barcodes[1])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.itemsNotScanned(4))
                .verify_summary_table(5, 1, 1, 0, 5)
        })

        it('1.7. Create and run DR for single child location - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[child1_1].barcode)
                .enter_barcode(barcodes[0])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.itemsNotScanned(2))
                .verify_summary_table(2, 1, 1, 0, 3)
        })

        it('1.8. Create and run DR for multiple storage locations - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[parent1].barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[1])
                .enter_barcode(D[child1_1].barcode, true)
                .enter_barcode(barcodes[2])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.itemsNotScanned(2))
                .verify_summary_table(5, 2, 3, 0, 3)
        })
    })

    context('2. Parent/child locations with items and containers', function () {

        let barcodes = [];

        let
            loc1 = D.currentDateAndRandomNumber + '_' +  'Loc1',
            container1 = D.currentDateAndRandomNumber + '_' + 'Container1',
            emptyContainer1 = D.currentDateAndRandomNumber + '_' + 'EmptyContainer1',
            inactiveContainer1 = D.currentDateAndRandomNumber + '_' + 'InactiveContainer1',
            sublocation1 = D.currentDateAndRandomNumber + '_' + 'Sublocation1',
            subcontainer1 = D.currentDateAndRandomNumber + '_' + 'Subcontainer1',
            loc2 = D.currentDateAndRandomNumber + '_' + 'Loc2',
            container2 = D.currentDateAndRandomNumber + '_' + 'Container2',
            emptyContainer2 = D.currentDateAndRandomNumber + '_' + 'EmptyContainer2',
            sublocation2 = D.currentDateAndRandomNumber + '_' + 'Sublocation2'

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields()
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();


            api.locations.add_storage_location(loc1)
            api.locations.add_storage_location(container1, loc1)
            api.locations.update_location(container1, 'isContainer', true)
            api.locations.add_storage_location(emptyContainer1, loc1)
            api.locations.update_location(emptyContainer1, 'isContainer', true)
            api.locations.add_storage_location(inactiveContainer1, loc1)
            api.locations.update_location(inactiveContainer1, 'active', false)
            api.locations.add_storage_location(sublocation1, loc1)
            api.locations.add_storage_location(subcontainer1, sublocation1)
            api.locations.update_location(subcontainer1, 'isContainer', true)

            api.locations.add_storage_location(loc2)
            api.locations.add_storage_location(container2, loc2)
            api.locations.update_location(container2, 'isContainer', true)
            api.locations.add_storage_location(emptyContainer2, loc2)
            api.locations.update_location(emptyContainer2, 'isContainer', true)
            api.locations.add_storage_location(sublocation2, loc2)


            api.items.add_new_item(true, loc1, 'item0')
            api.items.add_new_item(true, loc1, 'item1')
            api.items.add_new_item(true, container1, 'item2')
            api.items.add_new_item(true, sublocation1, 'item3')
            api.items.add_new_item(true, subcontainer1, 'item4')
            api.items.add_new_item(true, loc2, 'item5')
            api.items.add_new_item(true, container2, 'item6')

            for (let i = 0; i < 7; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)
                })
            }
        })

        it('2.1. Create and run DR for 2 storage locations that have: ' +
            'container with item, empty container, sub-location, empty sub-container and sub-container with item - No Discrepancies Found', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[loc1].barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[1])
                .enter_barcode(D[container1].barcode, false)
                .enter_barcode(D[sublocation1].barcode, true)
                .enter_barcode(D[subcontainer1].barcode, false)
                .enter_barcode(barcodes[3])
                .enter_barcode(D[loc2].barcode, true)
                .enter_barcode(D[container2].barcode, false)
                .enter_barcode(barcodes[5])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.noDiscrepanciesFound)
                .verify_summary_table(4, 3, 4, 3, 0)
        })

        it('2.2. Scanning some barcodes multiple times and checking all types of discrepancies in one Report: ' +
            '"Barcode valid but not found in the system"' +
            '"Items Not Scanned", ' +
            '"Wrong Storage Location",' +
            '"Container Not Scanned",' +
            '"Containers in Wrong Location"', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[loc1].barcode)
                .enter_barcode('test3232')
                .enter_barcode('test3232', false, true)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[0], false, true)
                .enter_barcode(barcodes[0], false, true)
                .enter_barcode(D[container2].barcode, false)
                .enter_barcode(D[container2].barcode, false, true)
                .enter_barcode(barcodes[2])
                .enter_barcode(barcodes[2])
                .enter_barcode(barcodes[5])
                .enter_barcode(D[loc2].barcode, true)
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.barcodeValidButNotFoundInSystem(1))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.wrongStorageLocation(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.itemsNotScanned(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.containersNotScanned(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.containersInWrongLocation(1))
                .verify_summary_table(4, 1, 4, 1, 8)
        })
    });

    xcontext('2. Scanning 1000 items', function () {
        // this test is excluded from the regular regression suite for now, to reduce the total execution time
        it('3. Scanning 1000 items during Inventory report', function () {

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields([C.itemFields.description])
            // setting 20 items here for now, but we can adjust the number at any point
            var numberOfRecords = 1000

            let rootLoc = D.currentDateAndRandomNumber + '_' +  'rootLoc'

            D.getNewCaseData()
            D.getNewItemData(D.newCase)
            api.locations.add_storage_location(rootLoc)
            api.cases.add_new_case()
            D.newItem.location = rootLoc
            E.generateDataFor_ITEMS_Importer([D.newItem], null, null, numberOfRecords);
            cy.generate_excel_file('Items_forTestingInventoryReports', E.itemImportDataWithMinimumFields);
            ui.menu.click_Tools__Data_Import();
            ui.importer.import_data('Items_forTestingInventoryReports', C.importTypes.items)

            api.cases.quick_case_search(D.newCase.caseNumber)
            api.items.get_items_from_specific_case(D.newCase.caseNumber, 1, false, 120000)

            let reportName = D.getCurrentDateAndRandomNumber(4);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)

            cy.getLocalStorage("RootLevel").then(parentLoc => {
                cy.getLocalStorage("barcodes").then(barcodes => {
                    let barcodesArray = barcodes.split(",")
                    ui.inventoryReports.start_report(reportName, D[rootLoc].barcode)
                    for (let i = 0; i < numberOfRecords; i++) {
                        ui.inventoryReports.enter_barcode_(barcodesArray[i])
                        if (i === numberOfRecords - 1) ui.app.pause(3)
                    }
                })
            })
            ui.inventoryReports.click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.noDiscrepanciesFound)
                .verify_summary_table(numberOfRecords, 1, numberOfRecords, 0, 0)
        })
    })
});
