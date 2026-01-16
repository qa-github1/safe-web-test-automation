import Menu from "../menu";
import BaseSearchPage from "../base-pages/base-search-page";
import S from "../../fixtures/settings";
import authApi from "../../api-utils/endpoints/auth";
const C = require('../../fixtures/constants');
const menu = new Menu();

//************************************ ELEMENTS ***************************************//
let
    createdBySearchCriteria = e => cy.get('[translate="ITEM_CREATED_BY"]').parent().find('[ng-model="field.searchCriteria"]'),
    createdByInput = e => cy.get('[translate="ITEM_CREATED_BY"]').parent().find('[ng-model="user.text"]'),
    createdDateSearchCriteria = e => cy.get('[translate="ITEM_DATE_CREATED"]').parent().find('[ng-model="field.searchCriteria"]'),
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
    orgItemNoInput = e => cy.get('[translate="ITEM_SEQUENTIAL_ORG_ID"]').parent().find('[ng-model="field.model"]'),
    custodyReasonDropdown = e => cy.get('[translate="ITEM_CUSTODY_REASON"]').parent().find('select').eq(1),
    statusDropdown = e => cy.get('[translate="ITEM_STATUS"]').parent().find('select').eq(1),
    actionsOnSearchResultsButton = e => cy.get('[ng-disabled="selectedItems.length > 0 || options.items.length === 0"]'),
    categoryDropdown = e => cy.get('[class="btn btn-default form-control ui-select-toggle"]').eq(1),
    categoryDropdownOption = e => cy.get('[id="ui-select-choices-row-6-0"]'),
    //categoryDropdown = e => cy.get('[translate="ITEM_CATEGORY"]').parent().find('select').eq(1),
    typeaheadOption = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    splitButton = e => cy.get('[translate="ITEMS.LIST.BUTTON_SPLIT"]').parent(),
    subsetType = e => cy.get('[ng-model="userSubsetSelection.subsetTypeSelection"]'),
    percentageOrNumberOfItems = e => cy.get('[name="numberFrom"]')

export default class SearchItemPage extends BaseSearchPage {

    constructor() {
        super()
    }

//************************************ ACTIONS ***************************************//

    open_direct_url_for_page() {
        this.open_url_and_wait_all_GET_requests_to_finish(S.base_url + '/#/' + C.pages.itemSearch.url)
        return this
    }

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
        if (searchCriteria !== C.searchCriteria.dates.before) {
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


    search_with_minimum_required_fields_and_click_Actions_on_Search_Results(status, office, description) {
        this.select_Status(status)
            .select_Office(office)
            .enter_Description('contains', description)
            .click_Search()

        let that = this
        function checkIfButtonIsVisibleAndRetry(retries) {
            if (retries <= 0) {
                throw new Error('Max retries reached');
            }

            cy.get('.grid-buttons').find('button').first().then(($gridButtons) => {
                const rowText = $gridButtons.text();

                if (rowText.includes('Actions on Search Results')) {
                    cy.log('✅ SUCCESS: ' + rowText);
                    // 👉 click the button here
                    cy.wrap($gridButtons).click();
                } else {
                    cy.log(`🚫 TEXT NOT FOUND, found only "${rowText}". We will retry ${retries - 1} more times.`);

                    // re-auth and refresh search
                    cy.clearLocalStorage()
                    authApi.get_tokens(S.userAccounts.orgAdmin);
                    that.verify_text_is_present_on_main_container('Welcome')
                    menu.click_Search__Item()
                    that.wait_search_criteria_to_be_visible()
                        .select_Status(status)
                        .select_Office(office)
                        .enter_Description('contains', description)
                        .click_Search();

                    cy.wait(1000).then(() => {
                        checkIfButtonIsVisibleAndRetry(retries - 1);
                    });
                }
            });
        }
        checkIfButtonIsVisibleAndRetry(3);
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

    run_search_by_Item_Description(itemDescription, searchOperator = C.searchCriteria.inputFields.textSearch) {
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

    verify_item_data_on_grid(dataObject, customFormName, isDispoStatusEnabled = true) {
        if (customFormName) this.enable_columns_for_specific__Custom_Form_on_the_grid(customFormName)
        this.enable_all_standard_columns_on_the_grid(C.pages.itemSearch, isDispoStatusEnabled)

        this.verify_values_on_the_grid([
            ['Office', dataObject.officeName.substring(0, 9)],
            ['Primary Case #', dataObject.caseNumber],
            ['Case Officer(s)', dataObject.caseOfficers],
            //   ['Org#', dataObject.],
            //  ['Item#', dataObject.],
            ['Category', dataObject.category],
            ['Description', dataObject.description],
            ['Recovery Date', dataObject.recoveryDate],
            ['Status', dataObject.status],
            ['Storage Location', dataObject.location],
            ['Created By', dataObject.submittedByName],
            ['Created Date', dataObject.createdDate],
            ['Checkout Reason', dataObject.checkoutReason],
            ['Check Out Date', dataObject.checkoutDate],
            ['Checked Out To', dataObject.checkedOutTo_name],
            ['Expected Return Date', dataObject.expectedReturnDate],
            ['Checked Out Notes', dataObject.checkedOutNotes],
            ['Disposal Method', dataObject.disposalMethod],
            ['Dispose Date', dataObject.disposedDate],
            ['Actual Disposed Date', dataObject.actualDisposedDate],
            ['Disposed By', dataObject.disposedByName],
            ['Disposal Notes', dataObject.disposalNotes],
            ['Additional Barcodes', dataObject.additionalBarcodes],
           // ['Additional Barcodes', dataObject.barcodes],
            ['Tags', dataObject.tags],
            ['Recovered At', dataObject.recoveryLocation],
            ['Recovered By', dataObject.recoveredByName],
            ['Custody Reason', dataObject.custodyReason],
            ['Custodian', dataObject.custodian_name],
            ['Make', dataObject.make],
            ['Model', dataObject.model],
            ['Serial Number', dataObject.serialNumber],
            ['Item Belongs to', dataObject.itemBelongsTo],
        ])

        if (customFormName) {
            // this approach is more precise (checking value in specific cell based on its title)
            // and it would be better than the one below (checking values are present "anywhere" in the first row)
            // BUT it's hard to traverse through the table with many possible custom fields since it takes even the index of the cells that are hidden as we have them in DOM
            // regardless of setting the selector '.not('ng-hide'), so we don't get the precise index of the visible column
            //     this.verify_values_on_the_grid([
            //         [customFormName + '-Textarea', dataObject.custom_textarea],
            //         [customFormName + '-Textbox', dataObject.custom_textbox],
            //         [customFormName + '-Person', dataObject.custom_person],
            //         [customFormName + '-User', dataObject.custom_user_name],
            //         [customFormName + '-Date', dataObject.custom_date],
            //         [customFormName + '-Email', dataObject.custom_email],
            //         [customFormName + '-Password', dataObject.custom_password],
            //         [customFormName + '-Number', dataObject.custom_number],
            //         [customFormName + '-Checkbox List', dataObject.custom_checkboxListOption],
            //         [customFormName + '-Radiobutton List', dataObject.custom_radiobuttonListOption],
            //         [customFormName + '-Dropdown Typeahead', dataObject.custom_dropdownTypeaheadOption],
            //     ])

            this.verify_content_of_first_row_in_results_table([
                dataObject.custom_textarea,
                dataObject.custom_textbox,
                dataObject.custom_person,
                dataObject.custom_user_name,
                dataObject.custom_date,
                dataObject.custom_email,
                dataObject.custom_password,
                dataObject.custom_number,
                dataObject.custom_checkboxListOption,
                dataObject.custom_radiobuttonListOption,
                dataObject.custom_dropdownTypeaheadOption,
            ])
            if (dataObject.custom_checkbox) {
                this.verify_content_of_first_row_in_results_table(
                    dataObject.custom_checkbox.toString().charAt(0).toUpperCase() + dataObject.custom_checkbox.toString().slice(1),
                )
            }
        }
        return this;
    }

    choose_subset_type(data){
        subsetType().select(data);
        return this;
    }

    type_percentage_or_number_of_items_on_item_subset_modal(data){
        percentageOrNumberOfItems().type(data.percentageOrNumberOfItems);
        return this;
    }

}
