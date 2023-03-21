import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const C = require('../../fixtures/constants');
const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    businessNameSearchCriteria = e => cy.get('[translate="GENERAL.BUSINESSNAME"]').parent().find('[ng-model="field.searchCriteria"]'),
    businessNameInput = e => cy.get('[translate="GENERAL.BUSINESSNAME"]').parent().find('[ng-model="field.model"]'),
    firstNameInput = e =>  cy.contains('First Name').parent().find('input').first(),
    firstNameSearchCriteria = e => cy.contains('First Name').parent().find('[ng-model="field.searchCriteria"]')


    export default class SearchPeoplePage extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    enter_Business_Name(businessName, searchCriteria = C.searchCriteria.inputFields.equals) {
        if (searchCriteria !== C.searchCriteria.inputFields.equals) {
            businessNameSearchCriteria().select(searchCriteria);
        }
        businessNameInput().type(businessName);
        businessNameInput().should('have.value', businessName);
        return this;
    };

    enter_First_Name(firstName, searchCriteria = C.searchCriteria.inputFields.equals) {
        if (searchCriteria !== C.searchCriteria.inputFields.equals) {
            firstNameSearchCriteria().select(searchCriteria);
        }
        firstNameInput().type(firstName);
        firstNameInput().should('have.value', firstName);
        return this;
    };
}
