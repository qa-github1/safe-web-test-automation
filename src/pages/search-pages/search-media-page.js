import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    descriptionInput = e => cy.get('.col-md-4').eq(3).should('be.visible').children('input');


export default class SearchMedia extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Description(description) {
        menu.click_Search__Media();
        this.wait_search_criteria_to_be_visible();
        descriptionInput().type(description);
        this.click_Search();
        return this;
    };
}
