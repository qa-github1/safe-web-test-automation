import BasePage from "./base-page";
const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');

//************************************ ELEMENTS ***************************************//

let searchCriteriaBasedOnFieldLabel = fieldLabel => cy.contains(fieldLabel).parent().find('[ng-model="field.searchCriteria"]'),
    dateInputField = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent().find('input').first(),
    dateInputField_2 = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent().find('input').eq(1),
    dateField_calendar = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('.glyphicon-calendar'),
    dateField_today = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').contains('Today'),
    typeaheadInputField = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('input').first(),
    dropdownField = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('select').eq(0),
    inputField = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('input').eq(0),
    textareaField = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('textarea').eq(0),
    typeaheadOption = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parent('div').find('ul').find('li').eq(0),
    resultsItemsCount = e => cy.get('[translate="BSGRID.DISPLAY_STATS_ROWS"]'),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    tableColumn_header_sortingArrow = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    sortingArrow = columnTitle => cy.get('.order').first()


export default class Modal extends BasePage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    select_dropdown_option(fieldLabel, option) {
        dropdownField(fieldLabel).select(option)
        return this;
    };

    enter_and_select_value_in_typeahead_field(fieldLabel, value) {
        typeaheadInputField(fieldLabel).type(value);
        this.pause(0.3)
        typeaheadOption(fieldLabel).click();
        return this;
    };

    enter_value_in_multi_select_typeahead_field(fieldLabel, valuesArray) {
        valuesArray.forEach(value => {
            typeaheadInputField(fieldLabel).type(value);
            this.pause(0.3)
            typeaheadOption(fieldLabel).click();
        })
        return this;
    };

    enter_value_to_textarea_field(fieldLabel, value) {
        textareaField(fieldLabel).type(value)
        textareaField(fieldLabel).should('have.value', value);
        return this;
    };

    enter_value_to_input_field(fieldLabel, value, clearExistingValue) {
        if (clearExistingValue) inputField(fieldLabel).clear()
        inputField(fieldLabel).type(value)
        inputField(fieldLabel).should('have.value', value);
        return this;
    };

}
