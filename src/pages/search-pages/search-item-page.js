import BasePage from "../base-pages/base-page";
import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";

const C = require('../../fixtures/constants');
const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    createdBySearchCriteria = e => cy.get('[translate="ITEM_CREATED_BY"]').parent().find('[ng-model="field.searchCriteria"]'),
    createdByInput = e => cy.get('[translate="ITEM_CREATED_BY"]').parent().find('[ng-model="user.text"]'),
    createdDateSearchCriteria  = e => cy.get('[translate="ITEM_DATE_CREATED"]').parent().find('[ng-model="field.searchCriteria"]'),
    createdDateInput = e => cy.get('[translate="ITEM_DATE_CREATED"]').parent().find('[ng-model="ngModel"]'),
    descriptionSearchCriteria = e => cy.get('[translate="ITEM_DESCRIPTION"]').parent().find('[ng-model="field.searchCriteria"]'),
    descriptionInput = e => cy.get('[translate="ITEM_DESCRIPTION"]').parent().find('[ng-model="field.model"]'),
    recoveryDateInput = e => cy.get('[translate="ITEM_RECOVERY_DATE"]').parent().find('[ng-model="ngModel"]'),
    recoveredAtInput = e => cy.get('[translate="ITEM_RECOVERED_AT"]').parent().find('[ng-model="field.model"]'),
    recoveredByInput = e => cy.get('[translate="ITEM_RECOVERED_BY"]').parent().find('[ng-model="person.text"]'),
    storageLocationInput = e => cy.get('[translate="ITEM_LOCATION"]').parent().find('[ng-model="locationText"]'),
    makeInput = e => cy.get('[translate="ITEM_MAKE"]').parent().find('[ng-model="field.model"]'),
    modelInput = e => cy.get('[translate="ITEM_MODEL"]').parent().find('[ng-model="field.model"]'),
    serialNoInput = e => cy.get('[translate="ITEM_SERIAL_NUMBER"]').parent().find('[ng-model="field.model"]'),
    orgItemNoInput = e => cy.get('[translate="ITEM_SEQUENTIAL_ORG_ID"]').parent().find('[ng-model="field.model"]'),custodyReasonDropdown = e => cy.get('[translate="ITEM_CUSTODY_REASON"]').parent().find('select').eq(1),
    statusDropdown = e => cy.get('[translate="ITEM_STATUS"]').parent().find('select').eq(1),
    actionsOnSearchResultsButton = e => cy.get('[ng-disabled="!isAdmin || !canUpdateByQuery"]'),
    categoryDropdown = e => cy.get('[class="btn btn-default form-control ui-select-toggle"]').eq(1),
    categoryDropdownOption = e => cy.get('[id="ui-select-choices-row-6-0"]'),
    //categoryDropdown = e => cy.get('[translate="ITEM_CATEGORY"]').parent().find('select').eq(1),
    typeaheadOption = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    splitButton = e => cy.get('[translate="ITEMS.LIST.BUTTON_SPLIT"]').parent()

export default class SearchItemPage extends BaseSearchPage {

    constructor() {
        super()
    }

//************************************ ACTIONS ***************************************//

    enter_Description(searchCriteria, itemDescription) {
        this.searchParametersExpandedPanel().should('be.visible');
        descriptionSearchCriteria().select(searchCriteria);
        descriptionInput().clear()
        descriptionInput().invoke('val', itemDescription).trigger('input')
        return this;
    };

    enter_Created_By(userEmail) {
        createdByInput().type(userEmail);
        typeaheadOption().click();
        return this;
    };

    enter_Created_Date(date, searchCriteria = C.searchCriteria.dates.before) {
        if (searchCriteria !== C.searchCriteria.dates.before){
            createdDateSearchCriteria().select(searchCriteria);
        }
        createdDateInput().type(date);
        createdDateInput().should('have.value', date);
        return this;
    };

    enter_Recovery_Date(date) {
        recoveryDateInput().type(date);
        recoveryDateInput().should('have.value', date);
        return this;
    };

    enter_Recovered_At(location) {
        recoveredAtInput().type(location);
        recoveredAtInput().should('have.value', location);
        return this;
    };

    enter_Recovered_By(personName) {
        recoveredByInput().type(personName);
        typeaheadOption().click();
        return this;
    };

    enter_Storage_Location(storageLoc) {
        storageLocationInput().type(storageLoc);
        typeaheadOption().click();
        return this;
    };

    enter_Make(make) {
        makeInput().type(make);
        makeInput().should('have.value', make);
        return this;
    };

    enter_Model(model) {
        modelInput().type(model);
        modelInput().should('have.value', model);
        return this;
    };

    enter_Serial_Number(serialNo) {
        serialNoInput().type(serialNo);
        serialNoInput().should('have.value', serialNo);
        return this;
    };

    enter_Org_Item_Number(orgItemNo) {
        orgItemNoInput().type(orgItemNo);
        orgItemNoInput().should('have.value', orgItemNo);
        return this;
    }

    select_Custody_Reason(option) {
        custodyReasonDropdown().select(option);
        custodyReasonDropdown().should('contain', option);
        return this;
    };

    select_Status(option) {
        statusDropdown().select(option);
        statusDropdown().should('contain', option);
        return this;
    };

    click_Actions_On_Search_Results() {
        actionsOnSearchResultsButton().click()
        return this;
    };

    select_option_on_Actions_On_Search_Results(option) {
        actionsOnSearchResultsButton().click()
        this.click_option_on_expanded_menu(option)
        return this;
    };

    select_Category(option) {
        categoryDropdown().type(option);
        categoryDropdownOption().should('contain', option);
        categoryDropdownOption().type('{enter}')
        return this;
    };

    run_search_by_Item_Description(itemDescription, searchOperator= C.searchCriteria.inputFields.textSearch) {
       // this.define_API_request_to_be_awaited('POST', 'items/search')
        cy.getLocalStorage("newCaseId").then(caseId => {
            menu.click_Search__Item();
            this.enter_Description(searchOperator, itemDescription || caseId);
            super.click_Search();
        });
        this.wait_until_spinner_disappears();
     //   this.wait_response_from_API_call('items/search', 200)
        return this;
    };

    verify_item_data_on_grid(userObject, customFormName) {
        if (customFormName) this.enable_columns_for_specific__Custom_Form_on_the_grid(customFormName)
        this.enable_all_standard_columns_on_the_grid(C.pages.itemSearch)

        this.verify_values_on_the_grid([
            ['Office', userObject.officeName.substring(0, 9)],
            ['Primary Case #', userObject.caseNumber],
            ['Case Officer(s)', userObject.caseOfficers],
         //   ['Org#', userObject.],
          //  ['Item#', userObject.],
            ['Category', userObject.category],
            ['Description', userObject.description],
            ['Recovery Date', userObject.recoveryDate],
            ['Status', userObject.status],
            ['Storage Location', userObject.location],
            ['Created By', userObject.submittedByName],
            ['Created Date', userObject.createdDate],
            ['Checkout Reason', userObject.checkoutReason],
            ['Check Out Date', userObject.checkoutDate],
            ['Checked Out To', userObject.checkedOutTo_name],
            ['Expected Return Date', userObject.expectedReturnDate],
            ['Checked Out Notes', userObject.checkedOutNotes],
            ['Disposal Method', userObject.disposalMethod],
            ['Dispose Date', userObject.disposedDate],
            ['Actual Disposed Date', userObject.actualDisposedDate],
            ['Disposed By', userObject.disposedByName],
            ['Disposal Notes', userObject.disposalNotes],
            ['Additional Barcodes', userObject.additionalBarcodes],
            ['Tags', userObject.tags],
            ['Recovered At', userObject.recoveryLocation],
            ['Recovered By', userObject.recoveredByName],
            ['Custody Reason', userObject.custodyReason],
            ['Custodian', userObject.custodian_name],
            ['Make', userObject.make],
            ['Model', userObject.model],
            ['Serial Number', userObject.serialNumber],
            ['Item Belongs to', userObject.itemBelongsTo],
        ])

        // this approach is more precise (checking value in specific cell based on its title)
        // and it would be better than the one below (checking values are present "anywhere" in the first row)
        // BUT it's hard to traverse through the table with many possible custom fields since it takes even the index of the cells that are hidden as we have them in DOM
        // regardless of setting the selector '.not('ng-hide'), so we don't get the precise index of the visible column

        if (customFormName) {
            //     this.verify_values_on_the_grid([
            //         [customFormName + '-Textarea', userObject.custom_textarea],
            //         [customFormName + '-Textbox', userObject.custom_textbox],
            //         [customFormName + '-Person', userObject.custom_person],
            //         [customFormName + '-User', userObject.custom_user_name],
            //         [customFormName + '-Date', userObject.custom_date],
            //         [customFormName + '-Email', userObject.custom_email],
            //         [customFormName + '-Password', userObject.custom_password],
            //         [customFormName + '-Number', userObject.custom_number],
            //         [customFormName + '-Checkbox List', userObject.custom_checkboxListOption],
            //         [customFormName + '-Radiobutton List', userObject.custom_radiobuttonListOption],
            //         [customFormName + '-Dropdown Typeahead', userObject.custom_dropdownTypeaheadOption],
            //     ])

            this.verify_content_of_first_row_in_results_table([
                userObject.custom_textarea,
                userObject.custom_textbox,
                userObject.custom_person,
                userObject.custom_user_name,
                userObject.custom_date,
                userObject.custom_email,
                userObject.custom_password,
                userObject.custom_number,
                userObject.custom_checkboxListOption,
                userObject.custom_radiobuttonListOption,
                userObject.custom_dropdownTypeaheadOption,
            ])
            if (userObject.custom_checkbox) {
                this.verify_content_of_first_row_in_results_table(
                    userObject.custom_checkbox.toString().charAt(0).toUpperCase() + userObject.custom_checkbox.toString().slice(1),
                )
            }
        }
        return this;
    }
}
