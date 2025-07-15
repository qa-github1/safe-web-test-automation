import AddPersonPage from "../add-pages/add-person-page";

const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const addPersonPage = new AddPersonPage();
import BaseViewPage from "../base-pages/base-view-page";

//************************************ ELEMENTS ***************************************//

let
    submitForDisposition = e => cy.get('[ng-click="submitForDisposition()"]'),
    noteInput = e => cy.get('[ng-model="vm.newTaskNote"]'),
    actionsButton = e => cy.get('[title="Select an item or items for which you would like to perform Action."]'),
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
    dispoAuthJobStatus = e => cy.get('[ng-if="job.status !== jobStatusEnum.error"]'),
    claimantInputFieldOnApproveForReleaseModal = e => cy.get('input[placeholder="Select person linked to the case or search for any other person"]'),
    specificClaimantOnTypeahead = personName => cy.get('[ng-repeat="person in $select.items"]').children().contains(personName).first(),
    resultsTable = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('tbody'),
    approveButtonInSpecificRow = (rowNumber) => cy.get('tbody').find('tr').eq(rowNumber - 1).find('[translate="DISPO.AUTH_ACTION_APPROVE"]'),
    rejectButtonInSpecificRow = (rowNumber) => cy.get('tbody').find('tr').eq(rowNumber - 1).find('[translate="DISPO.AUTH_ACTION_REJECT"]'),
    rejectionNote = e => cy.get('[placeholder="Add notes for case officer"]'),
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

    click_Submit_for_Disposition() {
        submitForDisposition().scrollIntoView()
        submitForDisposition().should('be.visible');
        submitForDisposition().click()
        return this;
    };

    enter_and_save_note(note) {
        noteInput().should('be.visible');
        noteInput().type(note);
        this.click(C.buttons.addNote);
        return this;
    }

    select_Action_on_modal(action) {
        dispositionAuthorizationActionOnModal().should('be.visible')
        dispositionAuthorizationActionOnModal().select(action)
        return this;
    }

    set_Action___Hold(rowNumberRange, holdReason, isIndefinite = false, days) {
        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Hold')

        if (isIndefinite) {
            isIndefiniteRetentionCheckbox().click()
        } else {
            this.enterValue(holdDays, days)
        }
        holdReasonDropdown().select(holdReason)
        this.click_button_on_modal('Ok')

        const numberOfItemsProcessed = rowNumberRange[1] - rowNumberRange[0] + 1
        const expectedMessage = numberOfItemsProcessed > 50
            ? 'Processing...'
            : 'Saved';

        this.verify_single_toast_message_if_multiple_shown(expectedMessage)
        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete', 120)
        }
        this.wait_until_spinner_disappears(80)

        return this;
    };

    click_Actions() {
        this.pause(1)
        this.wait_until_modal_disappears()
        this.wait_until_spinner_disappears()
        actionsButton().click()
        return this;
    };

    click__Approve__from_grid_for_specific_item(rowNumber) {
        this.pause(1)
        this.wait_until_spinner_disappears()
        approveButtonInSpecificRow(rowNumber).click()
        return this;
    };

    click__Reject__from_grid_for_specific_item(rowNumber, note = 'Rejection Note') {
        this.pause(1)
        this.wait_until_spinner_disappears()
        rejectButtonInSpecificRow(rowNumber).click()
        this.add_Rejection_note(note)
            .click_Ok()
        return this;
    };

    add_Rejection_note(text) {
        this.enterValue(rejectionNote, text)
        return this;
    };

    set___Approve__from_Actions_menu(rowNumberRange) {
        let numberOfItemsProcessed =  (rowNumberRange[1])? (rowNumberRange[1] - rowNumberRange[0] + 1) : 1
        const alertMessage = 'You are going to approve Disposition Action for ' + numberOfItemsProcessed + ' items'
        const toastMessage = numberOfItemsProcessed > 50
            ? 'Processing...'
            : 'Saved';

        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .pause(0.5)
            .click_Actions()
            .click_option_on_expanded_menu('Mass Approve Disposition Action')
            .verify_messages_on_sweet_alert([alertMessage])
            .click_button_on_sweet_alert('Yes')
            .verify_toast_message(toastMessage)

        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete')
        }
        this.wait_until_spinner_disappears(80)
        return this;
    };

    set___Reject__from_Actions_menu(rowNumberRange, note) {
        const numberOfItemsProcessed = rowNumberRange[1] - rowNumberRange[0] + 1
        const itemOrItems = (numberOfItemsProcessed === 1) ? ' item' : ' items'
        const alertMessage = 'Rejecting ' + numberOfItemsProcessed + itemOrItems
        const toastMessage = numberOfItemsProcessed > 50
            ? 'Processing...'
            : 'Saved';

        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .click_Actions()
            .click_option_on_expanded_menu('Mass Reject Disposition Action')
            .add_Rejection_note(note)
            .verify_modal_content(alertMessage)
            .click_Ok()
            .verify_toast_message(toastMessage)

        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete')
        }
        this.wait_until_spinner_disappears(80)
        return this;
    };

    set_Action___Approve_for_Disposal(rowNumberRange) {
        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Approve for Disposal')
            .click_button_on_modal('Ok')

        const numberOfItemsProcessed = rowNumberRange[1] - rowNumberRange[0] + 1
        const expectedMessage = numberOfItemsProcessed > 50
            ? 'Processing...'
            : 'Saved';

        this.verify_single_toast_message_if_multiple_shown(expectedMessage)
        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete')
        } this.wait_until_spinner_disappears(80)
        return this;
    };

    set_Action___Timed_Disposal(rowNumberRange, timeShortcut) {
        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Timed Disposal')
            .enterValue(disposeAfterDate, timeShortcut)
            .click_button_on_modal('Ok')

        const numberOfItemsProcessed = rowNumberRange[1] - rowNumberRange[0] + 1
        const expectedMessage = numberOfItemsProcessed > 50
            ? 'Processing...'
            : 'Saved';

        this.verify_single_toast_message_if_multiple_shown(expectedMessage)
        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete', 120)
        }
        this.wait_until_spinner_disappears(80)

        return this;
    };

    set_Action___Approve_for_Release(rowNumberRange, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, isDelayedRelease, duplicateDetected, useDuplicatePerson) {
        let personName = personObject.firstName
        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
            .click_Actions()
            .click_option_on_expanded_menu('Disposition Authorization Action')
            .select_Action_on_modal('Approve for Release')

        if (isDelayedRelease) {
            delayedReleaseCheckbox().click({force: true})
            releaseAfterDate().type('3m')
            this.press_ENTER(releaseAfterDate)
        }

        if (isExistingPerson) {
            this.pause(1.5)
            claimantFieldOnApproveForReleaseModal().click()
            this.pause(0.7)

            if (isPersonLinkedToCase) {
                specificClaimantOnTypeahead(personName).click()
            } else {
                claimantInputFieldOnApproveForReleaseModal().clear()
                claimantInputFieldOnApproveForReleaseModal().type(personName)
                claimantInputFieldOnApproveForReleaseModal().should('have.class', 'ng-not-empty')
                this.wait_until_spinner_disappears()
                cy.contains(personName).click()
                personTypeOnModal().select(personObject.personType)
            }
        } else {
            existingNewPersonToggle().click()
            addPersonPage.populate_all_fields(personObject)

            if (duplicateDetected) {
                addPersonPage
                    //     .verify_number_of_warnings_for_potential_duplicates
                    // (4, true, true, true, true)
                    .potentialDuplicatePersonLink().first().click()

                if (useDuplicatePerson) {
                    addThisPersonAsClaimantButton().click()
                } else {
                    addPersonPage.proceedAnywayButton().click()
                }
            }
        }

        if ((!personHasAddress || !isExistingPerson) && (addressObject && addressObject.addressType)) {
            addressTypeOnModal().select(addressObject.addressType)
            this.enterValue(address1OnModal, addressObject.line1)
        } else if (personHasAddress) {
            this.verify_text_is_NOT_present_on_main_container('Address 1')
        }

        okButtonOnModal().click()

        const numberOfItemsProcessed = rowNumberRange[1] - rowNumberRange[0] + 1

        const expectedMessage = !isExistingPerson && !useDuplicatePerson
            ? 'A new person created as a Claimant. Person ID is'
            : numberOfItemsProcessed > 50
                ? 'Processing...'
                : 'Saved';

        this.verify_single_toast_message_if_multiple_shown(expectedMessage)
        //  this.verify_toast_message(expectedMessage)
        if (numberOfItemsProcessed > 50) {
            this.verify_text(dispoAuthJobStatus, 'Complete', 120)
        }
        this.wait_until_spinner_disappears(80)

        return this;
    };

    set_Action___Delayed_Release(rowNumberRange, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress) {
        this.set_Action___Approve_for_Release(rowNumberRange, personObject, addressObject, isExistingPerson, isPersonLinkedToCase, personHasAddress, true)
        return this;
    };

    verify_Disposition_Statuses_on_the_grid(arrayOfArrays_rowNumberAndStatusInEach) {
        this.wait_until_spinner_disappears()
        arrayOfArrays_rowNumberAndStatusInEach.forEach(array => {
            // array[0] --> as first element in each array represents the ROW NUMBER which can be single number or again array of row numbers
            if (Array.isArray(array[0])) {
                array[0].forEach(row => {
                    // array[1] --> as second element in each array represents THE VALUE that we expect for 'Disposition Status' column in that row number
                    this.verify_content_of_specified_cell_in_specified_table_row(row, 'Disposition Status', array[1])
                })
            } else {
                this.verify_content_of_specified_cell_in_specified_table_row(array[0], 'Disposition Status', array[1])
            }
        })
        return this;
    };

    verify_Dispo_Auth_Job_Status(status) {
        this.verify_text(dispoAuthJobStatus, status, 120)
        this.pause(1)
        return this;
    };


}
