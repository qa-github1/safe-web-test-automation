const C = require('../../fixtures/constants');
import BaseViewPage from "../base-pages/base-view-page";

//************************************ ELEMENTS ***************************************//

let
    noteInput = e => cy.get('[ng-model="vm.newTaskNote"]'),
    searchInput = e => cy.get('#searchtask'),
    sortingArrow = columnTitle => cy.get('.order').first(),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    tableColumn_header_sortingArrow = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order')


    export default class TaskViewPage extends BaseViewPage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    verify_Task_View_page_is_open() {
        this.toastMessage().should('not.exist');
        noteInput().should('be.visible');
        return this;
    };

    search_for_the_task(keyword) {
        this.enterValue(searchInput, keyword)
        return this;
    };

    sort_by_descending_order(columnTitle) {
        sortingArrow().parents('th').invoke('text').then((text) => {
            //cy.log('Data is sorted by  '+ text)
            if (!text.includes(columnTitle)) {
                tableColumn_header(columnTitle).click()
            }
            this.pause(1)
            this.click_element_if_has_a_class(tableColumn_header_sortingArrow(columnTitle), 'dropup')
            tableColumn_header_sortingArrow(columnTitle).should('not.have.class', 'dropup')

        });
        return this;
    };

    enter_and_save_note(note) {
        noteInput().should('be.visible');
        noteInput().type(note);
        this.click(C.buttons.addNote);
        return this;
    }

}
