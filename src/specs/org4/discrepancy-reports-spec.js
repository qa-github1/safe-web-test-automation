const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.userAccounts.orgAdmin;

describe('Discrepancy Reports', function () {

    context('1. Parent/child locations with items but without containers', function () {

        let locations = [
            'Parent1',
            'Child1_1',
            'Child1_2',
            'Parent2',
            'Child2_1',
        ]

        let items = [
            'item0',
            'item1',
            'item2',
            'item3',
            'item4',
            'item5',
            'item6',
            'item7',
        ]

        let barcodes = [];

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields()
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();

            api.locations.add_storage_location('Parent1')
            api.locations.add_storage_location('Child1_1', 'Parent1')
            api.locations.add_storage_location('Child1_2', 'Parent1')

            api.locations.add_storage_location('Parent2')
            api.locations.add_storage_location('Child2_1', 'Parent2')

            api.items.add_new_item(true, 'Parent1', 'item0')

            api.items.add_new_item(true, 'Child1_1', 'item1')
            api.items.add_new_item(true, 'Child1_1', 'item2')

            api.items.add_new_item(true, 'Child1_2', 'item3')
            api.items.add_new_item(true, 'Child1_2', 'item4')

            api.items.add_new_item(true, 'Parent2', 'item5')

            api.items.add_new_item(true, 'Child2_1', 'item6')
            api.items.add_new_item(true, 'Child2_1', 'item7')

            for (let i = 0; i < 8; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)
                })
            }
        });

        after(function () {
            let arrayOfPropertiesInLocalStorage = locations.concat(items);
            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            // api.locations.delete_empty_storage_locations()
            api.locations.get_and_save_any_location_data_to_local_storage('root')
            api.locations.move_location('Parent1', 'root')
            api.locations.move_location('Child1_1', 'root')
            api.locations.move_location('Child1_2', 'root')
            api.locations.move_location('Parent2', 'root')
            api.locations.move_location('Child2_1', 'root')
        })

        it.only('1.1. DR for single parent location - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);
            cy.getLocalStorage('item0').then(item => {
                barcodes.push(JSON.parse(item).barcode)
                ui.menu.click_Tools__Discrepancy_Reports()
                    .click_button(C.buttons.newReport)
                ui.discrepancyReports.start_report(reportName, D['newLocationParent1'][0].barcode)
                    .enter_barcode(barcodes[0])
                    .enter_barcode(D['newLocationChild1_1'][0].barcode, true)
                    .enter_barcode(barcodes[1])
                    .enter_barcode(barcodes[2])
                    .enter_barcode(D['newLocationChild1_2'][0].barcode, true)
                    .enter_barcode(barcodes[3])
                    .enter_barcode(barcodes[4])
                    .click_button(C.buttons.runReport)
                    .verify_text_is_present_on_main_container(C.labels.discrepancyReports.noDiscrepanciesFound)
                    .verify_summary_table(5, 3, 5, 0)
            })
        });

        it('1.2. DR for single child location - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            cy.getLocalStorage('item0').then(item => {
                barcodes.push(JSON.parse(item).barcode)
                ui.menu.click_Tools__Discrepancy_Reports()
                    .click_button(C.buttons.newReport)
                ui.discrepancyReports.start_report(reportName, D['newLocationChild1_1'][0].barcode)
                    .enter_barcode(barcodes[1])
                    .enter_barcode(barcodes[2])
                    .click_button(C.buttons.runReport)
                    .verify_text_is_present_on_main_container(C.labels.discrepancyReports.noDiscrepanciesFound)
                    .verify_summary_table(2, 1, 2, 0)
            })
        });

        it('1.3. DR for multiple parent and child locations - starting with Parent loc - No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            for (let i = 0; i < 8; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)

                    if (i === 7) {
                        ui.menu.click_Tools__Discrepancy_Reports()
                            .click_button(C.buttons.newReport)
                        ui.discrepancyReports.start_report(reportName, D['newLocationParent1'][0].barcode)
                            .enter_barcode(barcodes[0])
                            .enter_barcode(D['newLocationChild1_1'][0].barcode, true)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D['newLocationChild1_2'][0].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D['newLocationParent2'][0].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D['newLocationChild2_1'][0].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.discrepancyReports.noDiscrepanciesFound)
                    }
                })
            }
        });

        it('1.4. Create and run DR for multiple parent and child locations - starting with Child loc -  No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            for (let i = 0; i < 8; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)

                    if (i === 7) {
                        ui.menu.click_Tools__Discrepancy_Reports()
                            .click_button(C.buttons.newReport)
                        ui.discrepancyReports.start_report(reportName, D['newLocationChild1_1'][0].barcode)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D['newLocationChild1_2'][0].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D['newLocationParent2'][0].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D['newLocationChild2_1'][0].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.discrepancyReports.noDiscrepanciesFound)
                    }
                })
            }
        });

        it('1.5. Create and run DR for multiple parent and child locations  - starting with Child loc - switching back to parent location-  No Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            for (let i = 0; i < 8; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)

                    if (i === 7) {
                        ui.menu.click_Tools__Discrepancy_Reports()
                            .click_button(C.buttons.newReport)
                        ui.discrepancyReports.start_report(reportName, D['newLocationChild1_1'][0].barcode)
                            .enter_barcode(barcodes[1])
                            .enter_barcode(D['newLocationParent1'][0].barcode, true)
                            .enter_barcode(barcodes[0])
                            .enter_barcode(D['newLocationChild1_1'][0].barcode, true)
                            .enter_barcode(barcodes[2])
                            .enter_barcode(D['newLocationParent2'][0].barcode, true)
                            .enter_barcode(barcodes[5])
                            .enter_barcode(D['newLocationChild1_2'][0].barcode, true)
                            .enter_barcode(barcodes[3])
                            .enter_barcode(barcodes[4])
                            .enter_barcode(D['newLocationChild2_1'][0].barcode, true)
                            .enter_barcode(barcodes[6])
                            .enter_barcode(barcodes[7])
                            .click_button(C.buttons.runReport)
                            .verify_text_is_present_on_main_container
                            (C.labels.discrepancyReports.noDiscrepanciesFound)
                    }
                })
            }
        });

        it('1.6. Create and run DR for single parent location - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            ui.menu.click_Tools__Discrepancy_Reports()
                .click_button(C.buttons.newReport)
            ui.discrepancyReports.start_report(reportName, D['newLocationParent1'][0].barcode)
                .enter_barcode(barcodes[1])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.itemsNotScanned(4))
                .verify_summary_table(5, 1, 1, 5)
        })

        it('1.7. Create and run DR for single child location - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            ui.menu.click_Tools__Discrepancy_Reports()
                .click_button(C.buttons.newReport)
            ui.discrepancyReports.start_report(reportName, D['newLocationChild1_1'][0].barcode)
                .enter_barcode(barcodes[0])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.itemsNotScanned(2))
                .verify_summary_table(2, 1, 1, 3)
        })

        it('1.8. Create and run DR for multiple storage locations - multiple Discrepancies Found', function () {
            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            ui.menu.click_Tools__Discrepancy_Reports()
                .click_button(C.buttons.newReport)
            ui.discrepancyReports.start_report(reportName, D['newLocationParent1'][0].barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[1])
                .enter_barcode(D['newLocationChild1_1'][0].barcode, true)
                .enter_barcode(barcodes[2])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.wrongStorageLocation(1))
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.itemsNotScanned(2))
                .verify_summary_table(5, 2, 3, 3)
        })
    })

    context('2. Parent/child locations with items and containers', function () {

        let locations = [
            'LOC1',
            'Container1',
            'EmptyContainer1',
            'Sublocation1',
            'SubContainer1',
            'LOC2',
            'Container2',
            'EmptyContainer2',
            'Sublocation2',
        ]

        let items = [
            'item0',
            'item1',
            'item2',
            'item3',
            'item4'
        ]

        let barcodes = [];

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields()
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();

            api.locations.add_storage_location('LOC1')
            api.locations.add_storage_location('Container1', 'LOC1')
            api.locations.update_location('Container1', 'isContainer', true)
            api.locations.add_storage_location('EmptyContainer1', 'LOC1')
            api.locations.update_location('EmptyContainer1', 'isContainer', true)
            api.locations.add_storage_location('InactiveContainer1', 'LOC1')
            api.locations.update_location('InactiveContainer1', 'active', false)
            api.locations.add_storage_location('Sublocation1', 'LOC1')
            api.locations.add_storage_location('SubContainer1', 'Sublocation1')
            api.locations.update_location('SubContainer1', 'isContainer', true)

            api.locations.add_storage_location('LOC2')
            api.locations.add_storage_location('Container2', 'LOC2')
            api.locations.update_location('Container2', 'isContainer', true)
            api.locations.add_storage_location('EmptyContainer2', 'LOC2')
            api.locations.update_location('EmptyContainer2', 'isContainer', true)
            api.locations.add_storage_location('Sublocation2', 'LOC2')

            api.items.add_new_item(true, 'LOC1', 'item0')
            api.items.add_new_item(true, 'Container1', 'item1')
            api.items.add_new_item(true, 'Sublocation1', 'item2')
            api.items.add_new_item(true, 'SubContainer1', 'item3')
            api.items.add_new_item(true, 'LOC2', 'item4')
            api.items.add_new_item(true, 'Container2', 'item5')

            for (let i = 0; i < 5; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)
                })
            }
        })

        it('2.1. Create and run DR for storage location that has: ' +
            'container with item, empty container, sub-location, empty sub-container and sub-container with item - No Discrepancies Found', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            ui.menu.click_Tools__Discrepancy_Reports()
                .click_button(C.buttons.newReport)
            ui.discrepancyReports.start_report(reportName, S.LOC1.barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(S.Container1.barcode, false)
                .enter_barcode(S.Sublocation1.barcode, true)
                .enter_barcode(S.SubContainer1.barcode, false)
                .enter_barcode(barcodes[2])
                .enter_barcode(S.LOC2.barcode, true)
                .enter_barcode(S.Container2.barcode, false)
                .enter_barcode(barcodes[4])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.noDiscrepanciesFound)
                .verify_summary_table(3, 3, 6, 0)
        })

        it('2.2. "Items Not Scanned", "Container Not Scanned"  & "Containers in Wrong Location" discrepancies', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);
            let arrayOfPropertiesInLocalStorage = locations.concat(items);

            api.auth.get_tokens(orgAdmin, arrayOfPropertiesInLocalStorage);

            ui.menu.click_Tools__Discrepancy_Reports()
                .click_button(C.buttons.newReport)
            ui.discrepancyReports.start_report(reportName, S.LOC1.barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(S.Container2.barcode, false)
                .enter_barcode(S.SubContainer1.barcode, false)
                .enter_barcode(S.LOC2.barcode, true)
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.itemsNotScanned(2))
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.containersNotScanned(1))
                .verify_text_is_present_on_main_container(C.labels.discrepancyReports.containersInWrongLocation(2))
             .verify_summary_table(3, 1, 3, 5)
        })
    })

});
