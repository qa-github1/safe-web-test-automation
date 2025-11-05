import BasePage from "../base-pages/base-page";
import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";
import S from "../../fixtures/settings";

const menu = new Menu();
const C = require('../../fixtures/constants');

//************************************ ELEMENTS ***************************************//
let
    searchParameters = e => cy.contains('Search Parameters'),
    createdByInput = e => cy.get('[translate="CASE_CREATED_BY"]').parent().find('[ng-model="user.text"]'),
    currentUserCheckboxForCreatedBy = e => cy.get('input[ng-change*="userCheckboxClicked"]').first(),
    //currentUserCheckboxForCreatedBy = e => cy.get('[ng-change="userCheckboxClicked(\'CASE_CREATED_BY\')"]'),
    //currentUserCheckboxForCreatedBy = e => cy.get('[class="icheckbox_square-blue"]'),
    currentUserCheckboxForCaseOfficers = e => cy.get('[ng-change="userCheckboxClicked(\'CASE_OFFICERS\')"]'),
    caseOfficersInput = e => cy.contains('Case Officer(s)').parent('div').find('input').first(),
    updateMadeByInput = e => cy.get('[translate="HS_UPDATE_MADE_BY"]').parent().find('[ng-model="user.text"]'),
    createdDateInput = e => cy.get('[translate="GENERAL.CREATED_DATE"]').parent().find('input').first(),
    createdDateInput_2 = e => cy.get('[translate="GENERAL.CREATED_DATE"]').parent().find('input').eq(1),
    createdDate_calendar = e => cy.contains('Created Date').parent('div').find('.glyphicon-calendar'),
    createdDate_today = e => cy.contains('Created Date').parent('div').contains('Today'),
    caseNumberInput = e => cy.get('[translate="CASE_NUMBER"]').parent().find('[ng-model="field.model"]'),
    offenseTypeDropdown = e => cy.get('[translate="CASE_OFFENSE_TYPE"]').parent().find('select').eq(1),
    offenseLocationInput = e => cy.get('[translate="CASE_OFFENSE_LOCATION"]').parent().find('[ng-model="field.model"]'),
    offenseDateInput = e => cy.get('[translate="CASE_OFFENSE_DATE"]').parent().find('[ng-model="ngModel"]'),
    offenseDescriptionInput = e => cy.get('[translate="CASE_OFFENSE_DESCRIPTION"]').parent().find('[ng-model="field.model"]'),
    activeDropdown = e => cy.get('[translate="CASE_ACTIVE"]').parent().find('select').eq(1),
    //activeDropdown = e => cy.get('[translate="CASE_ACTIVE"]').parent().next().find('select'),
    tagsInput = e => cy.get('[translate="NAV.TAGS"]').parent().find('[ng-model="$select.search"]'),
    tagsOptionOnTypeahead = e => cy.get('[repeat="tag in tags | filter: $select.search"]').find('.ui-select-choices-row-inner').last(),
    officesInput = e => cy.get('[translate="SEARCH.OFFICE_SELECTION"]').parent().find('[ng-model="$select.search"]'),
    closedDateInput = e => cy.get('[translate="CASE_CLOSED_DATE"]').parent().find('[ng-model="ngModel"]'),
    reviewDateInput = e => cy.get('[translate="CASE_REVIEW_DATE"]').parent().find('[ng-model="ngModel"]'),
    reviewDateNotesInput = e => cy.get('[translate="CASE_REVIEW_DATE_NOTES"]').parent().find('[ng-model="field.model"]'),
    caseOfficersTypeahead = e => cy.get('.ui-select-highlight'),
    resultsTable = e => cy.get('.table-bordered'),
    optionOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    searchCaseTextBox = e => cy.get('#searchinput'),
    selectSearchResult = e => cy.get('[ng-click="selectMatch($index)"]'),
    selectFieldV2 = index => cy.get('[ng-change="v2SelectedFieldChanged(field)"]').eq(index),
    createdByTypeaheadFieldSearchV2 = fieldName => cy.get('select[ng-model="field.selectedField"]').contains('option', fieldName).parents('div.field-selector').next('.search-fields').find('input[id="tpUserTypeAheadId850"]'),

    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),

    // search Criteria dropdowns
    createdBySearchCriteria = e => cy.contains('Created By').parent().find('[ng-model="field.searchCriteria"]'),
    createdDateSearchCriteria = e => cy.get('[translate="GENERAL.CREATED_DATE"]').parent().find('[ng-model="field.searchCriteria"]'),
    caseNumberSearchCriteria = e => cy.get('[translate="CASE_NUMBER"]').parent().find('[ng-model="field.searchCriteria"]'),
    caseOfficersSearchCriteria = e => cy.contains('Case Officer(s)').parent().find('[ng-model="field.searchCriteria"]'),
    offenseTypeSearchCriteria = e => cy.contains('Offense Type').parent().find('[ng-model="field.searchCriteria"]'),
    offenseLocationSearchCriteria = e => cy.contains('Offense Location').parent().find('[ng-model="field.searchCriteria"]'),
    offenseDateSearchCriteria = e => cy.contains('Offense Date').parent().find('[ng-model="field.searchCriteria"]'),
    offenseDescriptionSearchCriteria = e => cy.contains('Offense Description').parent().find('[ng-model="field.searchCriteria"]'),
    //activeSearchCriteria = e => cy.contains('Active').parent().find('[ng-model="field.searchCriteria"]'),
    activeSearchCriteria = e => cy.contains('label', 'Active').parent().find('[ng-model="field.searchCriteria"]'),
    tagsSearchCriteria = e => cy.contains('Tags').parent().find('[ng-model="field.searchCriteria"]'),
    savedSearchesOfItemsSearchCriteria = e => cy.contains('Saved Searches of Items').parent().find('[ng-model="field.searchCriteria"]'),

    // search criteria options
    notEquals = C.searchCriteria.inputFields.notEquals,
    equals = C.searchCriteria.inputFields.equals,
    equalsOr = C.searchCriteria.dates.equalsOr,
    before = C.searchCriteria.dates.before

export default class SearchCasePage extends BaseSearchPage {

    constructor() {
        super()
    }

//************************************ ACTIONS ***************************************//

    enter_Case_Number(searchCriteria, caseNo) {
        caseNumberSearchCriteria().select(searchCriteria);
        caseNumberInput().clear().type(caseNo);
        caseNumberInput().should('have.value', caseNo);
        return this;
    };

    enter_Created_By(searchCriteria, email) {
        this.enter_value_in_typeahead_search_field('Created By', searchCriteria, email)
        return this;
    };

    select_field_on_search_v2(data, index = 0 ){
        selectFieldV2(index).select(data);
        return this;
    }

    select_current_user_checkbox_for_Created_By(searchCriteria) {
        createdBySearchCriteria().select(searchCriteria);
        currentUserCheckboxForCreatedBy().click();
        return this;
    };

    enter_Created_Date(searchCriteria, firstInput, secondInput) {
        this.enter_Date_as_search_criteria('Created Date', searchCriteria, firstInput, secondInput)
        return this;
    };

    enter_Case_Officers(searchCriteria, values) {
        this.enter_values_in_multiselect_typeahead_search_field('Case Officer(s)', searchCriteria, values,  "users/groups")
        return this;
    };

    enter_Tags(searchCriteria, value) {
        tagsSearchCriteria().select(searchCriteria);
        tagsInput().type(value)
        tagsOptionOnTypeahead().click()
        return this;
    };

    select_Offense_Type(searchCriteria, option) {
        this.select_dropdown_option('Offense Type', searchCriteria, option)
        return this;
    };

    verify_data_on_the_grid(dataObject) {
        this.enable_all_standard_columns_on_the_grid(C.pages.caseSearch)

        this.verify_values_on_the_grid([
            ['Case Officer(s)', dataObject.caseOfficers],
            ['Case Number', dataObject.caseNumber],
            ['Office', dataObject.officeName],
            ['Created By', dataObject.createdBy],
            ['Offense Type', dataObject.offenseType],
            ['Created Date', dataObject.createdDate],
            ['Offense Description', dataObject.offenseDescription],
            ['Tags', dataObject.tags],
            ['Media', dataObject.mediaCount],
            ['Offense Location', dataObject.offenseLocation],
            ['Form Data', dataObject.formsCount],
            ['Offense Date', dataObject.offenseDate],
            ['Closed Date', dataObject.closedDate],
            ['Review Date', dataObject.reviewDate],
            ['Review Date Notes', dataObject.reviewDateNotes]
        ])
    }

    select_option_on_Active_dropdown(searchCriteria, isActive) {
        activeSearchCriteria().should('be.visible').should('contain', searchCriteria).select(searchCriteria);
        if (isActive) {
            activeDropdown().select('True');
        } else {
            activeDropdown().select('False');
        }
        return this;
    };

    enter_Offense_Location(searchCriteria, value) {
        this.enter_search_criteria_and_value_in_input_field('Offense Location', searchCriteria, value)
        return this;
    };

    enter_Offense_Date(searchCriteria, firstInput, secondInput) {
        this.enter_Date_as_search_criteria('Offense Date', searchCriteria, firstInput, secondInput)
        return this;
    };

    enter_Closed_Date(searchCriteria, firstInput, secondInput) {
        this.enter_Date_as_search_criteria('Closed Date', searchCriteria, firstInput, secondInput)
        return this;
    };

    enter_Review_Date(searchCriteria, firstInput, secondInput) {
        this.enter_Date_as_search_criteria('Review Date', searchCriteria, firstInput, secondInput)
        return this;
    };

    enter_Offense_Description(searchCriteria, value) {
       this.enter_search_criteria_and_value_to_textarea_field('Offense Description', searchCriteria, value)
        return this;
    };

    run_search_by_Case_Number(caseNo, searchCriteria) {
        menu.click_Search__Case();
        this.enter_Case_Number(caseNo, searchCriteria)
            .click_button(C.buttons.search);
        return this;
    };

    search_Case_does_not_exist(caseNumber) {
        searchCaseTextBox().clear().type(caseNumber);
        cy.wait(2000);
        return searchCaseTextBox().invoke('hasClass', 'ng-invalid');
    }

    search_existing_Case(caseNumber) {
        searchCaseTextBox().clear().type(caseNumber);
        selectSearchResult().contains(caseNumber).click();
        return this;
    }

    click_Search_Parameters() {
        searchParameters().click()
        return this;
    }

}
