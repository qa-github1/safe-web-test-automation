const C = require('../../fixtures/constants');
import BaseViewPage from "../base-pages/base-view-page";

//************************************ ELEMENTS ***************************************//

let
    noteInput = e => cy.get('[ng-model="vm.newTaskNote"]')

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

    enter_and_save_note(note) {
        noteInput().should('be.visible');
        noteInput().type(note);
        this.click(C.buttons.addNote);
        return this;
    }

}
