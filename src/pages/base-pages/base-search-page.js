import BasePage from "./base-page";
import Menu from "../menu";

const menu = new Menu();
const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');

//************************************ ELEMENTS ***************************************//

let searchCriteriaBasedOnFieldLabel = fieldLabel => cy.contains(fieldLabel).parent().find('select[ng-model="field.searchCriteria"]'),
    searchCriteriaBasedOnSelectedField = fieldName => cy.get('select[ng-model="field.selectedField"]').contains('option', fieldName).parents('div.field-selector').next('.search-fields').find('select[ng-model="field.searchCriteria"]'),
    typeaheadFieldBasedOnSelectedField = fieldName => cy.get('select[ng-model="field.selectedField"]').contains('option', fieldName).closest('div.field-selector').next('.search-fields').find('div[ng-if*="TYPEAHEAD"]').find('input[ng-model="user.text"]'),
    removeAllButtonForOffices = e => cy.get('[translate="SEARCH.OFFICE_SELECTION"]').parents('.form-group').find('[translate="ORGS.SETTINGS.FORMS.LISTBOX.REMOVE_ALL_BUTTON"]'),
    inputForOffices = e => cy.get('[translate="SEARCH.OFFICE_SELECTION"]').parents('.form-group').find('input[placeholder="Select an office..."]'),
    dateInputField = fieldLabel => cy.contains(fieldLabel).parent().find('input').first(),
    dateInputField_2 = fieldLabel => cy.contains(fieldLabel).parent().find('input').eq(1),
    dateField_calendar = fieldLabel => cy.contains(fieldLabel).parent('div').find('.glyphicon-calendar'),
    dateField_today = fieldLabel => cy.contains(fieldLabel).parent('div').contains('Today'),
    typeaheadInputField = fieldLabel => cy.contains(fieldLabel).parent('div').find('input').first(),
    dropdownField = fieldLabel => cy.contains(fieldLabel).parent('div').find('select').eq(1),
    inputField = fieldLabel => cy.contains(fieldLabel).parent('div').find('input').eq(0),
    textareaField = fieldLabel => cy.contains(fieldLabel).parent('div').find('textarea').eq(0),
    typeaheadOption = fieldLabel => cy.contains(fieldLabel).parent('div').find('ul').find('li').eq(0),
    resultsItemsCount = e => cy.get('[translate="BSGRID.DISPLAY_STATS_ROWS"]')

export default class BaseSearchPage extends BasePage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    click_on_Items_count() {
        this.itemsCountOnSearchGrid().click();
        return this;
    };

    select_Office(officeName) {
        removeAllButtonForOffices().click()
        this.enterValue(inputForOffices, officeName)
        this.click_highlighted_option_on_typeahead()
        return this;
    };

    click_View_on_first_table_row() {
        this.click(C.buttons.view, this.resultsTable());
        return this;
    };

    enter_value_to_input_field(fieldLabel, value, clearExistingValue) {
        if (clearExistingValue) inputField(fieldLabel).clear()
        inputField(fieldLabel).type(value)
        inputField(fieldLabel).should('have.value', value);
        return this;
    };

    enter_search_criteria_and_value_in_input_field(fieldLabel, searchCriteria, value) {
        searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
        this.enter_value_to_input_field(fieldLabel, value)
        return this;
    }

    enter_Date_as_search_criteria(fieldLabel, searchCriteria, firstInput, secondInput) {
        //searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
searchCriteriaBasedOnSelectedField(fieldLabel).select(searchCriteria)
        if (firstInput === 'today') {
            dateField_calendar(fieldLabel).click()
            dateField_today(fieldLabel).click()
        } else if (!['Current week', 'Last week', 'Month to date', 'Last month', 'Year to date', 'Last year'].includes(searchCriteria)) {
            dateInputField(fieldLabel).type(firstInput);
            dateInputField(fieldLabel).should('have.value', firstInput);

            if (secondInput) {
                dateInputField_2(fieldLabel).type(secondInput)
                dateInputField_2(fieldLabel).should('have.value', secondInput);
            }
        }
        return this;
    };

    // enter_value_in_typeahead_search_field(fieldLabel, searchCriteria, value) {
    //     this.define_API_request_to_be_awaited('GET', 'typeahead', 'typeahead')
    //     searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
    //     typeaheadInputField(fieldLabel).type(value);
    //     this.wait_response_from_API_call('typeahead')
    //     this.pause(0.3)
    //     typeaheadOption(fieldLabel).click();
    //     return this;
    // };

    // enter_value_in_typeahead_search_v2_field(fieldName, searchCriteria, value) {
    //     this.define_API_request_to_be_awaited('GET', 'typeahead', 'typeahead')
    //     searchCriteriaBasedOnSelectedField(fieldName).select(searchCriteria);
    //     typeaheadFieldBasedOnSelectedField(fieldName).type(value)
    //         this.pause(3)
    //             typeaheadFieldBasedOnSelectedField(fieldName).type('{enter}');
    //     //this.wait_response_from_API_call('typeahead')
    //    // this.pause(0.3)
    //    // typeaheadOption(fieldName).click();
    //     return this;
    // }

    //TODO: delete two methods commented above after we check that this method below works fine in both scenarios
    enter_value_in_typeahead_search_field(fieldLabelOrName, searchCriteria, value) {
        cy.get('toggle[ng-model="searchV2.isV2"]').then($toggle => {
            const isOn = $toggle.find('.toggle-on').hasClass('btn-primary');

            if (isOn) {
                searchCriteriaBasedOnSelectedField(fieldLabelOrName).select(searchCriteria);
                typeaheadFieldBasedOnSelectedField(fieldLabelOrName).type(value);
                this.pause(3);
                typeaheadFieldBasedOnSelectedField(fieldLabelOrName).type('{enter}');
            } else {
                this.define_API_request_to_be_awaited('GET', 'typeahead', 'typeahead');
                searchCriteriaBasedOnFieldLabel(fieldLabelOrName).select(searchCriteria);
                typeaheadInputField(fieldLabelOrName).type(value);
                this.wait_response_from_API_call('typeahead');
                this.pause(0.3);
                typeaheadOption(fieldLabelOrName).click();
            }
        });

        return this;
    }

    choose_search_criteria_v2(fieldName, searchCriteria) {
        searchCriteriaBasedOnSelectedField(fieldName).select(searchCriteria);
        return this;
    };

    enter_values_in_multiselect_typeahead_search_field(fieldLabel, searchCriteria, values, typeahead) {
        searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
        this.enter_values_on_several_multi_select_typeahead_fields(
            [
                [fieldLabel, values, typeahead],
            ]);
        this.pause(0.3)
        return this;
    };

    select_dropdown_option(fieldLabel, searchCriteria, option) {
        searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
        dropdownField(fieldLabel).select(option)
        return this;
    };

    enter_search_criteria_and_value_to_input_field(fieldLabel, searchCriteria, value) {
        searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
        inputField(fieldLabel).type(value)
        inputField(fieldLabel).should('have.value', value);
        return this;
    };

    enter_search_criteria_and_value_to_textarea_field(fieldLabel, searchCriteria, value) {
        searchCriteriaBasedOnFieldLabel(fieldLabel).select(searchCriteria);
        textareaField(fieldLabel).type(value)
        textareaField(fieldLabel).should('have.value', value);
        return this;
    };

    verify_results_count(totalCount, pageSize = 25) {
        if (totalCount < pageSize) pageSize = totalCount
        resultsItemsCount().should('contain', `Showing 1 to ${pageSize} of ${totalCount} rows`)
        return this;
    };


    expand_search_criteria() {
        this.searchParametersAccordion().scrollIntoView()
        this.searchParametersAccordion().click()
        return this;
    };


}
