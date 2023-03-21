import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    massImportButton = e => cy.get('[translate="ITEMS.SCAN.MASS_IMPORT_LIST"]')

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


}