import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    textInput = e => cy.get('.col-md-4').eq(2).should('be.visible').children('input');


export default class SearchNotes extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Text(note) {
        menu.click_Search__Notes();
        textInput().type(note);
        super.click_Search();
        return this;
    };
}
