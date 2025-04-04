import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";
import C from "../../fixtures/constants";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    textInput = e => cy.get('[translate="NOTES.TEXT"]').parent().find('textarea'),
    textInputSearchCriteria = e => cy.get('[translate="NOTES.TEXT"]').parent().find('[ng-model="field.searchCriteria"]')


    export default class SearchNotes extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Text(note, searchOperator= C.searchCriteria.inputFields.contains) {
        menu.click_Search__Notes();
        this.searchParametersExpandedPanel().should('be.visible');
        textInputSearchCriteria().select(searchOperator);
        textInput().type(note);
        super.click_Search();
        return this;
    };
}
