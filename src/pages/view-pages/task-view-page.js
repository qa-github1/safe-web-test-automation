import AddPersonPage from "../add-pages/add-person-page";

const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const addPersonPage = new AddPersonPage();
import BaseViewPage from "../base-pages/base-view-page";

//************************************ ELEMENTS ***************************************//

let
    noteInput = e => cy.get('[ng-model="vm.newTaskNote"]'),
    dispositionAuthorizationActionOnModal = e => cy.get('[ng-model="itemsActions.actionId"]'),
    isIndefiniteRetentionCheckbox = e => cy.get('[name="isIndefiniteRetention"]'),
    holdDays = e => cy.get('#holdDays'),
    holdReasonDropdown = e => cy.get('[ng-model="values.holdReasonId"]'),
    delayedReleaseCheckbox = e => cy.get('[name="timeDelayedRelease"]'),
    releaseAfterDate = e => cy.get('[placeholder="Set date or delay - days(d), weeks(w), months(m), years(y)- e.g. 15d"]'),
    disposeAfterDate = e => cy.get('[placeholder="Set date or delay - days(d), weeks(w), months(m), years(y)- e.g. 15d"]'),
    personTypeOnModal = e => cy.get('[ng-model="selectedCase.person.typeId"]'),
    addressTypeOnModal = e => cy.get('[ng-model="model.addressTypeId"]'),
    address1OnModal = e => cy.get('[placeholder="Address 1"]'),
    existingNewPersonToggle = e => cy.get('[ng-model="options.selectExistingPerson"]'),
    addThisPersonAsClaimantButton = e => cy.get('[translate="DISPO.AUTH.ADD_THIS_PERSON_AS_CLAIMANT"]'),
    claimantFieldOnApproveForReleaseModal = e => cy.get('#claimantId'),
    okButtonOnModal = e => cy.get('[translate="GENERAL.BUTTON_OK"]'),
    claimantInputFieldOnApproveForReleaseModal = e => cy.get('input[placeholder="Select person linked to the case or search for any other person"]'),
    specificClaimantOnTypeahead = personName => cy.get('.ui-select-choices-row-inner').contains(personName),
    resultsTable = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('tbody'),
    checkboxOnFirstTableRow = e => resultsTable().find('.bg-grid-checkbox').first()

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

    select_Action_on_modal(action) {
        dispositionAuthorizationActionOnModal().select(action)
        return this;
    }

    set_Action___Hold(rowNumbers, holdReason, isIndefinite = false, days) {
        this.click_checkbox_to_select_specific_rows(rowNumbers)
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Hold')

            if (isIndefinite){
                isIndefiniteRetentionCheckbox().click()
            }
            else{
                this.enterValue(holdDays, days)
            }
            holdReasonDropdown().select(holdReason)
            this.click_button_on_modal('Ok')
            .verify_toast_message('Saved')
        return this;
    };

    set_Action___Approve_for_Disposal(rowNumbers) {
        this.click_checkbox_to_select_specific_rows(rowNumbers)
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Approve for Disposal')
            .click_button_on_modal('Ok')
            .verify_toast_message('Saved')
        return this;
    };

    set_Action___Timed_Disposal(rowNumbers, timeShortcut) {
        this.click_checkbox_to_select_specific_rows(rowNumbers)
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Timed Disposal')
            .enterValue(disposeAfterDate, timeShortcut)
            .click_button_on_modal('Ok')
            .verify_toast_message('Saved')
        return this;
    };

    set_Action___Approve_for_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, isDelayedRelease, duplicateDetected, useDuplicatePerson) {
        let personName = personObject.firstName
        this.click_checkbox_to_select_specific_rows(rowNumbers)
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Approve for Release')

        if (isDelayedRelease) {
            delayedReleaseCheckbox().click({force: true})
            releaseAfterDate().type('3m')
            this.press_ENTER(releaseAfterDate)
        }

        if (isExistingPerson){
            claimantFieldOnApproveForReleaseModal().click()
            this.pause(0.5)

            if (isPersonLinkedToCase) {
                specificClaimantOnTypeahead(personName).click()
            } else {
                this.pause(1)
                claimantInputFieldOnApproveForReleaseModal().type(personName)
                this.pause(1)
                this.firstTypeaheadOption().click()
                personTypeOnModal().select(personObject.personType)
            }
        }
        else {
            existingNewPersonToggle().click()
            addPersonPage.populate_all_fields(personObject)

                if (duplicateDetected){
                    addPersonPage
                    //     .verify_number_of_warnings_for_potential_duplicates
                    // (4, true, true, true, true)
                        .potentialDuplicatePersonLink().first().click()

                    if (useDuplicatePerson){
                        addThisPersonAsClaimantButton().click()
                    }
                    else {
                        addPersonPage.proceedAnywayButton().click()
                    }
                }
        }

        if ((!personHasAddress || !isExistingPerson) && addressObject.addressType) {
            addressTypeOnModal().select(addressObject.addressType)
            this.enterValue(address1OnModal, addressObject.line1)
        }
        else if (personHasAddress){
            this.verify_text_is_NOT_present_on_main_container('Address 1')
        }

        okButtonOnModal().click()

        if (!isExistingPerson && !useDuplicatePerson){
            this.verify_toast_message('A new person created as a Claimant. Person ID is ')
        }
        else{
            this.verify_toast_message('Saved')
        }
        return this;
    };

    set_Action___Delayed_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress) {
        this.set_Action___Approve_for_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, true)
        return this;
    };

    verify_Disposition_Statuses_on_the_grid(arrayOfArrays_rowNumberAndStatusInEach) {
        arrayOfArrays_rowNumberAndStatusInEach.forEach(array => {

            // array[0] --> as first element in each array represents the ROW NUMBER which can be single number or again array of row numbers
            if (Array.isArray(array[0])){
                array[0].forEach(row => {
                    // array[1] --> as second element in each array represents THE VALUE that we expect for 'Disposition Status' column in that row number
                    this.verify_content_of_specified_cell_in_specified_table_row(row, 'Disposition Status', array[1])
                })
            }
            else{
                this.verify_content_of_specified_cell_in_specified_table_row(array[0], 'Disposition Status', array[1])
            }
        })
       return this;
    };


}
