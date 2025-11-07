let helper = require('../support/e2e-helper');
let C = require('../fixtures/constants');
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    nameInput = e => cy.findByPlaceholderText('Name for the report.'),
    scanBarcodeInput = e => cy.findByPlaceholderText('Scan barcode.'),
    enterBarcodeButton = e => cy.findByText('Enter Barcode'),
    scannedBarcodesSection = e => cy.get('#barcode'),
    locationBarcodesSection = e => cy.get('#locations'),
    searchReportField = e => cy.get('[placeholder="Search Reports"]'),
    hideReport = e => cy.get('[tp-owner-id="report.createdById"]'),
    inventoryReportsRadiobuttons = e => cy.get('[class="ui-view-main ng-scope"]'),
    storageLocationInput = e => cy.findByPlaceholderText('Please scan or enter the bardcode of the location you would like to audit.')

export default class InventoryReportsPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    start_report(name, locationBarcode) {
        nameInput().type(name)
        storageLocationInput().type(locationBarcode)
        this.click_button(C.buttons.start)
        return this;
    };

    verify_summary_table(totalActiveItems, locationsScanned, itemsScanned, containersScanned, discrepanciesFound) {
        this.verify_content_of_specific_cell_in_first_table_row(C.labels.InventoryReports.summaryTableColumns.totalActiveItems, totalActiveItems)
        this.verify_content_of_specific_cell_in_first_table_row(C.labels.InventoryReports.summaryTableColumns.locationsScanned, locationsScanned)
        this.verify_content_of_specific_cell_in_first_table_row(C.labels.InventoryReports.summaryTableColumns.itemsScanned, itemsScanned)
        this.verify_content_of_specific_cell_in_first_table_row(C.labels.InventoryReports.summaryTableColumns.containersScanned, containersScanned)
        this.verify_content_of_specific_cell_in_first_table_row(C.labels.InventoryReports.summaryTableColumns.discrepanciesFound, discrepanciesFound)
        return this;
    };

    enter_barcode(barcode, isLocationBarcode = false, isScannedMultipleTimes, withVerification = true) {
        scanBarcodeInput().clear().invoke('val', barcode).trigger('input').type('{enter}')

        if (withVerification) {
            if (isLocationBarcode) {
                this.verify_element_does_NOT_contain_text(scannedBarcodesSection, barcode)
                this.verify_text(locationBarcodesSection, barcode)
                this.verify_toast_message(C.toastMsgs.locationChanged)
            } else {
                if (isScannedMultipleTimes) {
                    this.verify_toast_message('has already been scanned')
                }
                this.verify_text(scannedBarcodesSection, barcode)
                this.verify_specific_toast_message_is_NOT_visible(C.toastMsgs.locationChanged)
            }
        }
        return this;
    };

    enter_barcode_(barcode) {
        scanBarcodeInput().clear().invoke('val', barcode).trigger('input').type('{enter}')
        //we might be able to get rid of statis wait here if environment is fast and stable enough
        this.pause(0.6)
        return this;
    };

    search_report(data) {
        searchReportField().type(data);
        searchReportField().type('{enter}');
        this.pause(1)
        return this;
    }

    hide_report() {
        hideReport().click();
        return this;
    }

    select_radiobutton(labelText) {
        inventoryReportsRadiobuttons().should('exist').within(() => {
            cy.contains('label span', new RegExp(`^\\s*${labelText}\\s*$`, 'i'))
                .closest('label')
                .find('input[type="radio"]')
                .wait(300)
                .check({force: true});
        });
        return this;
    }
}
