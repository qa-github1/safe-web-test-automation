import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";
import C from "../../fixtures/constants";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let descriptionField = e => cy.get('[translate="GENERAL.DESCRIPTION"]').parent().find('input'),
    descriptionFieldSearchCriteria = e => cy.get('[translate="GENERAL.DESCRIPTION"]').parent().find('[ng-model="field.searchCriteria"]'),
    uploadedDateSearchCriteria = e => cy.get('[translate="MEDIA.UPLOADED_DATE"]').parent().find('[ng-model="field.searchCriteria"]')


export default class SearchMedia extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Description(note, searchOperator= C.searchCriteria.inputFields.contains) {
        menu.click_Search__Media();
        this.searchParametersExpandedPanel().should('be.visible');
        descriptionFieldSearchCriteria().select(searchOperator);
        descriptionField().type(note);
        super.click_Search();
        return this;
    };

    enter_Uploaded_Date(searchCriteria, firstInput, secondInput) {
        this.enter_Date_as_search_criteria('Uploaded Date', searchCriteria, firstInput, secondInput)
        return this;
    };

}
