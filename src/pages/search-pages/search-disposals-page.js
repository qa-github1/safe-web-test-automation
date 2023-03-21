import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    noteInput = e => cy.get('[translate="ITEMS.VIEW.NOTES"]').parent().find('input')


export default class SearchDisposals extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Note(note) {
        menu.click_Search__Disposals();
        noteInput().type(note);
        super.click_Search();
        return this;
    };
}
