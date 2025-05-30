import BasePage from "./base-pages/base-page";

const S = require('../fixtures/settings');
const C = require('../fixtures/constants');
const D = require('../fixtures/data');

//************************************ ELEMENTS ***************************************//
let
    searchInput = e => cy.get('#searchtask'),
    sortingArrow = columnTitle => cy.get('.order').first(),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    tableColumn_header_sortingArrow = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order')


export default class TaskListPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    verify_task_data_on_grid(taskObject, enableFields = true) {

        if (enableFields) {
            this.enable_all_standard_columns_on_the_grid(C.pages.taskList)
        }

        this.verify_values_on_the_grid([
            ['Assigned to', taskObject.assignedTo],
            ['Case Review Date', taskObject.caseReviewDate.substring(0, 10)],
            ['Case Review Notes', taskObject.caseReviewNotes],
            ['Closed Date', taskObject.closedDate],
            ['Creation Date', taskObject.creationDate],
            ['Due Date', taskObject.dueDate],
            ['Last Action Date', taskObject.lastActionDate],
            ['State', taskObject.state],
            ['Status', taskObject.status],
            ['Type', taskObject.type],
            ['Sub Type', taskObject.subtype],
            ['Title', taskObject.title]
        ])

        if (Array.isArray(taskObject.linkedObjects) && taskObject.linkedObjects.length > 0) {
            taskObject.linkedObjects.forEach(object => {
                this.verify_values_on_the_grid([
                    ['Linked Objects', object.caseNumber],
                    ['Linked Objects', object.orgNumber],
                    ['Linked Objects', object.personName]
                ]);
            });
        }
        return this;
    }

    verify_newly_created_task_is_shown_in_first_table_row() {
        cy.getLocalStorage("myTasks").then(tasks => {
            let taskNumber = JSON.parse(tasks).tasks[0].taskNumber
            this.verify_content_of_first_table_row_by_provided_column_title_and_value('Task #', taskNumber)
            D.newTask.taskNumber = taskNumber
        })
        return this;
    };

    search_for_the_task(keyword) {
        this.enterValue(searchInput, keyword)
        this.pause(0.3)
        return this;
    };

    search_for_the_newly_created_task() {
        cy.getLocalStorage("myTasks").then(tasks => {
            let taskNumber = JSON.parse(tasks).tasks[0].taskNumber
            this.search_for_the_task(taskNumber)
        })
        return this;
    };

    sort_by_descending_order(columnTitle) {
        tableColumn_header(columnTitle).click()
        this.pause(0.3)
        this.click_element_if_has_a_class(tableColumn_header_sortingArrow(columnTitle), 'dropup')
        tableColumn_header_sortingArrow(columnTitle).should('not.have.class', 'dropup')
        return this;
    };


}
