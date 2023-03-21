import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    messageInput = e => cy.get('[translate="GENERAL.MESSAGE"]').parent().find('input')


export default class SearchTasks extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Message(note) {
        menu.click_Search__Tasks();
        messageInput().type(note);
        super.click_Search();
        return this;
    };
}
