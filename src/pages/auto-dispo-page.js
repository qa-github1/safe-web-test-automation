let helper = require('../support/e2e-helper');
let C = require('../fixtures/constants');
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    editButton = e => cy.get('#editAutoDispo'),
    saveButton = e => cy.get('#saveAutoDispo'),
    onOffToggle = e => cy.get('#autoDispoToggle'),
    caseReviewSection = e => cy.get('.well'),
    closeCasesButton = e => cy.get('[ng-click="massCloseCases()"]'),
    viewCasesWithoutTasks = e => cy.get('[ng-click="viewCasesWithoutTasks()"]'),
    closedDateInput = e => cy.get('[close-text="Save"]'),
    reviewDateNotes = e => cy.get('[ng-model="update.notes"]'),
    minRedistributeDate = e => cy.get('input[name="fromDate"]'),
    maxRedistributeDate = e => cy.get('input[name="toDate"]'),
    casesWithNoReviewDate = e => cy.get('[ng-bind-html="openCasesSubWarningFirstMessage"]'),
    casesWithReviewDatePastDue = e => cy.get('[ng-bind-html="openCasesSubWarningSecondMessage"]'),
    casesWithUpcomingReviewDate = e => cy.get('[ng-bind-html="openCasesSubWarningThirdMessage"]'),
    daysToFollowUp = offenseType => cy.contains(offenseType).parent('div').find('[ng-model="setting.daysToFollowUp"]')

export default class AutoDispoPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    click_Recalculate_Cases_to_Dispose() {
        this.define_API_request_to_be_awaited('GET', 'requestCountingCasesToClose');
        this.pause(0.5)
        this.scroll_to_button(C.buttons.redestributeCaseReviewDates);
        this.click_button(C.buttons.recalculateCasesToDispose);
        this.wait_response_from_API_call('requestCountingCasesToClose', 200);
        cy.wait(1000)
        this.wait_until_label_disappears(C.labels.autoDisposition.calculatingCasesToDispose);
        cy.wait(500)
        return this;
    };

    click_Edit() {
        editButton().should('be.enabled');
        editButton().click();
        saveButton().should('be.visible');
        return this;
    };

    click_Save() {
        saveButton().should('be.enabled');
        saveButton().click();
        return this;
    };

    turn_On_the_toggle() {
        this.turn_ON_the_toggle(onOffToggle);
        return this;
    };

    turn_Off_the_toggle() {
        this.turn_ON_the_toggle(onOffToggle);
        return this;
    };

    enter_Closed_date(date) {
        closedDateInput().type(date);
        return this;
    };

    get_open_cases_with_review_date_past_due() {
        casesWithReviewDatePastDue().should('contain', "Open Cases");
        this.get_text_after_the_character_and_save_to_local_storage(
            casesWithReviewDatePastDue, ": ", "casesWithReviewDatePastDue");
        return this;
    };

    get_open_cases_with_upcoming_review_date() {
        casesWithUpcomingReviewDate().should('contain', "Open Cases");
        this.get_text_after_the_character_and_save_to_local_storage(
            casesWithUpcomingReviewDate, ": ", "casesWithUpcomingReviewDate");
        return this;
    };

    populate_Update_Cases_modal(minDate, maxDate, note) {
        this.enterValue(minRedistributeDate, minDate)
        this.enterValue(maxRedistributeDate, maxDate)
        this.enterValue(reviewDateNotes, note)
        return this;
    };

    get_statistics_for_Review_Dates() {
        this.get_open_cases_with_review_date_past_due();
        this.get_open_cases_with_upcoming_review_date();
        return this;
    };

    verifY_label(element, label, incrementBy) {
        cy.getLocalStorage(label).then(labelValue => {

            if (incrementBy) {
                labelValue = parseInt(labelValue) + incrementBy;
            }

            this.verify_text(element, C.labels.autoDisposition[label](labelValue));
        });
    }


    verify_Redistribute_Case_Review_Date_labels(storeNewValuesToCache, importedPastDueCases = 1, importedUpcomingCases = 2) {
        if (storeNewValuesToCache) {
            this.get_statistics_for_Review_Dates();
            importedPastDueCases = 0;
            importedUpcomingCases = 0;
        }

    //    this.verifY_label(casesWithNoReviewDate, 'casesWithNoReviewDate', 0);
        this.verifY_label(casesWithReviewDatePastDue, 'casesWithReviewDatePastDue', importedPastDueCases);
        this.verifY_label(casesWithUpcomingReviewDate, 'casesWithUpcomingReviewDate', importedUpcomingCases);

        return this;
    };

    get_number_of_cases_without_items() {
        closeCasesButton().should('contain', "Close");
        this.get_text_between_two_values_and_save_to_local_storage(
            closeCasesButton, "Close ", " Cases", "numberOfCasesWithoutItems");
        return this;
    };

    get_number_of_cases_without_task() {
        viewCasesWithoutTasks().should('contain', "View");
        this.get_text_between_two_values_and_save_to_local_storage(
            viewCasesWithoutTasks, "View ", " Cases", "numberOfCasesWithoutTasks");
        return this;
    };

    verify_labels_for_cases_to_dispose(previousNumberIncrementedBy) {
        cy.getLocalStorage("numberOfCasesWithoutItems").then(numberOfCases => {

            if (previousNumberIncrementedBy) {
                numberOfCases = parseInt(numberOfCases) + parseInt(previousNumberIncrementedBy)
            } else {
                numberOfCases = parseInt(numberOfCases);
            }

            this.verify_text(caseReviewSection, C.labels.autoDisposition.casesWithoutItems(numberOfCases));

            this.verify_multiple_text_values_in_one_container(
                caseReviewSection,
                C.labels.autoDisposition.lastCasesCalculation(numberOfCases));
        });
        return this;
    };

    verify_label_for_cases_without_open_tasks(previousNumberIncrementedBy) {
        cy.getLocalStorage("numberOfCasesWithoutTasks").then(numberOfCases => {

            if (previousNumberIncrementedBy) {
                numberOfCases = parseInt(numberOfCases) + parseInt(previousNumberIncrementedBy)
            } else {
                numberOfCases = parseInt(numberOfCases);
            }

            this.verify_text(caseReviewSection, C.labels.autoDisposition.casesWithoutTasks(numberOfCases));
        });
        return this;
    };

    click_Close_X_Cases_button() {
        cy.getLocalStorage("numberOfCasesWithoutItems").then(numberOfCasesWithoutItems => {
            this.click_button(C.buttons.closeXCases(numberOfCasesWithoutItems));
        });
        return this;
    };

    click_View_X_Cases_button() {
        cy.getLocalStorage("numberOfCasesWithoutTasks").then(numberOfCasesWithoutTasks => {
            this.click_button(C.buttons.viewXCases(numberOfCasesWithoutTasks));
        });
        return this;
    };

    clear_and_enter_value_for_Days_to_follow_up(offenseType, number) {
        daysToFollowUp(offenseType).clear();
        if (number !== '') {
            daysToFollowUp(offenseType).type(number);
        }
        return this;
    };

    verify_case_gets_closed_after_triggerring_Close_Cases_action() {
        var isValueUpdated = false
        var self = this

        function retryFewTimesBeforeMakingAssertion(i = 0) {
            for (i; i < 5; i++) {
               //cy.log('trying-- #' + i)
                if (!isValueUpdated) {
                    self.mainContainer().invoke('text').then(function (text) {
                        if (!text.includes('Closed Date')) {
                            self.pause(2)
                            self.open_base_url()
                            self.wait_all_dashboard_GET_requests()
                            self.open_newly_created_case_via_direct_link()
                            retryFewTimesBeforeMakingAssertion(i++)
                        } else {
                            self.verify_text(self.mainContainer, 'Closed Date')
                            i = 5
                            isValueUpdated = true
                        }
                    });
                }
            }
        }

        retryFewTimesBeforeMakingAssertion()
        return this;
    };
}
