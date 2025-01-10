const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
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

    set_Action___Approve_for_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, isDelayedRelease) {
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

        claimantFieldOnApproveForReleaseModal().click()

        if (!isPersonLinkedToCase) {
            claimantInputFieldOnApproveForReleaseModal().type(personName)
            this.pause(0.3)
            this.firstTypeaheadOption().click()
            personTypeOnModal().select(personObject.personType)
        } else {
            claimantInputFieldOnApproveForReleaseModal().click()
            specificClaimantOnTypeahead(personName).click()
        }

        if (!personHasAddress && addressObject.addressType) {
            addressTypeOnModal().select(addressObject.addressType)
            this.enterValue(address1OnModal, addressObject.line1)
        }
        else if (personHasAddress){
            this.verify_text_is_NOT_present_on_main_container('Address 1')
        }

        okButtonOnModal().click()
        this.verify_toast_message('Saved')
        return this;
    };

    set_Action___Delayed_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress) {
        this.set_Action___Approve_for_Release(rowNumbers, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, true)
        return this;
    };


}
