import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    messageInput = e => cy.get('[translate="GENERAL.MESSAGE"]').parent().find('input'),
    taskNumberSearchCriteria = e => cy.get('[translate="TASKS.TASK_NUMBER"]').parent().find('[ng-model="field.searchCriteria"]'),
    taskTitleSearchCriteria = e => cy.get('[translate="WIDGETS.SAVED_SEARCH.TITLE"]').parent().find('[ng-model="field.searchCriteria"]'),
    taskNumberInput = e => cy.get('[name="inpText0"]'),
    taskTitleInput = e => cy.get('[name="inpText2"]')



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

    enter_task_title(searchCriteria, data) {
        taskTitleSearchCriteria().select(searchCriteria);
        taskTitleInput().clear().type(data.title);
        taskTitleInput().should('have.value', data.title);
        return this;
    };
}
