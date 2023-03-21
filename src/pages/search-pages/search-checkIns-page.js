import BasePage from "../base-pages/base-page";
import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    noteInput = e => cy.get('.col-md-4').eq(4).should('be.visible').children('input');


export default class SearchCheckInsPage extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Note(note) {
        menu.click_Search__Checkins();
        noteInput().type(note);
        super.click_Search();
        return this;
    };
}
