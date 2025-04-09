import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    massImportButton = e => cy.get('[translate="ITEMS.SCAN.MASS_IMPORT_LIST"]'),
    barcodeInput = e => cy.get('[placeholder="Type or scan an item barcode, location barcode, or item serial number"]')


export default class ScanPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    verify_Scan_page_is_open(caseNo) {
        this.toastMessage().should('not.exist');
        massImportButton().should('be.visible');
        return this;
    };

    scan_barcode(value) {
        this.enterValue(barcodeInput, value)
        this.press_ENTER(barcodeInput)
        return this;
    };

    close_Item_In_Scan_List_alert(clearTheList = true) {
        this.pause(1)
             cy.document().then((doc) => {
                const found = doc.body.innerText.includes('Items In Scan List');

                if (found) {
                    if (clearTheList) {
                        this.click_button_on_sweet_alert('Yes')
                    }
                    else{
                        this.click_button_on_sweet_alert('No')
                    }
                }
            });
        return this;
    }


}