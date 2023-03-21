import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";
import C from "../../fixtures/constants";
import S from "../../fixtures/settings";

const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    noteInput = e => cy.get('.col-md-4').eq(4).should('be.visible').children('input'),
    checkedOutTo = e => cy.get('[ng-model="person.text"]').eq(0),
    checkOutToValueInTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    custodian = e => cy.get('[ng-model="item.takenById"]'),
    optionOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),

    //search criteria input fields
    checkedOutToInput = e => cy.contains('Checked Out To').parent().find('[ng-model="person.text"]'),

    // search Criteria dropdowns
    checkedOutToSearchCriteria = e => cy.contains('Checked Out To').parent().find('[ng-model="field.searchCriteria"]'),


// search criteria options
    notEquals = C.searchCriteria.inputFields.notEquals,
    equals = C.searchCriteria.inputFields.equals,
    equalsOr = C.searchCriteria.dates.equalsOr,
    before = C.searchCriteria.dates.before


export default class SearchCheckOuts extends BaseSearchPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    run_search_by_Note(note) {
        menu.click_Search__Checkouts();
        noteInput().type(note);
        super.click_Search();
        return this;
    };

    enter_CheckedOutTo(value, searchCriteria = equals) {
        if (searchCriteria !== equals) {
            checkedOutToSearchCriteria().select(searchCriteria);
        }
        checkedOutToInput().type(value);
        optionOnTypeahead().click();
        return this;
    };

    enter_CheckOutDate(searchCriteria = before, firstValue, secondValue) {
       this.enter_Date_as_search_criteria('Check Out Date', searchCriteria, firstValue, secondValue)
        return this;
    };

    verify_data_on_the_grid(dataObject) {

        S.getCurrentDate();
        this.verify_content_of_specific_cell_in_first_table_row('Media', 'Media')
        this.verify_content_of_specific_cell_in_first_table_row('Transaction Date', S.currentDate)
        this.verify_content_of_specific_cell_in_first_table_row('Reason', dataObject.reason)
        this.verify_content_of_specific_cell_in_first_table_row('Notes', dataObject.notes)
        this.verify_content_of_specific_cell_in_first_table_row('Expected Return Date', dataObject.expectedReturnDate)
        this.verify_content_of_specific_cell_in_first_table_row('Items', dataObject.itemsCount)
        this.verify_content_of_specific_cell_in_first_table_row('Media Count', dataObject.mediaCount)
        this.verify_content_of_specific_cell_in_first_table_row('Checked Out To', dataObject.checkedOutTo)
        this.verify_content_of_specific_cell_in_first_table_row('Checked out by', dataObject.checkedOutBy)

        return this;
    }

}
