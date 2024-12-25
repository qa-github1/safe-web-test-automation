import BaseAddPage from "../base-pages/base-add-page";

const C = require('../../fixtures/constants');

//************************************ ELEMENTS ***************************************//

let
    caseNumberInput_enabled = e => cy.get('[ng-model="case.caseNumber"]').eq(0),
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    caseNumberInput_autoAssigned = e => cy.get('[placeholder="Case Number Auto Assigned"]'),
    requiredAsterisk = e => cy.get('[translate="ERRORS.REQUIRED_SIMPLE"]'),
    offenseType = e => cy.get('[ng-model="case.offenseTypeId"]').eq(0),
    caseOfficerInput = e => cy.get('[label="\'CASE_OFFICERS\'"]').find('input'),
    caseOfficerTypeahead = e => cy.get('[ng-repeat="item in $group.items"]').first(),
    offenseLocationInput = e => cy.findByPlaceholderText(C.placeholders.addCase.offenseLocation),
    tagsInput = e => cy.findAllByPlaceholderText(C.placeholders.addCase.addTags).eq(1),
    offenseDescriptionInput = e => cy.findByPlaceholderText(C.placeholders.addCase.offenseDescription),
    reviewDateNotes = e => cy.findByPlaceholderText(C.placeholders.addCase.reviewDateNotes),
    offenseDateInput = e => cy.get('[ng-model="ngModel"]').eq(0),
    reviewDateInput = e => cy.get('[ng-model="case.reviewDate"]').find('[ng-model="ngModel"]'),
    addCaseHeader = e => cy.get('[translate="CASES.ADD.MODAL_HEADING"]'),
    toastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout})

export default class AddCasePage extends BaseAddPage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    verify_Add_Case_page_is_open() {
        requiredAsterisk().should('be.visible');
        addCaseHeader().should('contain', C.labels.addCase.title);
        return this;
    };

    select_Offense_Type(option) {
        offenseType().select(option);
        offenseType().should('contain', option);
        return this;
    };

    populate_all_fields_on_second_form(caseObject) {

        this.select_location(offenseLocationInput, caseObject.offenseLocation)

        this.type_if_values_provided(
            [
                [offenseDateInput, caseObject.offenseDate],
                [reviewDateInput, caseObject.reviewDate],
                [reviewDateNotes, caseObject.reviewDateNotes],
                [offenseDescriptionInput, caseObject.offenseDescription],
            ]);

        this.enter_values_on_multi_select_typeahead_fields(
            [
                [caseOfficerInput, caseObject.caseOfficers, "users/groups"],
                [tagsInput, caseObject.tags, this.lastTagOnTypeahead],
            ]);



        this.define_API_request_to_be_awaited('POST', 'api/cases', 'addCase', 'newCase')

        return this;
    };

    verify_toast_message(text, includesRecentCaseNumber = false, timeoutInMinutes = 1) {

        let timeoutInMiliseconds = timeoutInMinutes * 60000;

        cy.getLocalStorage("recentCase").then(recentCase => {
            toastMessage(timeoutInMiliseconds).should('be.visible');
            toastMessage(timeoutInMiliseconds).invoke('text').then(function (toastMsg) {
                if (text instanceof Array) {
                    text.forEach(element =>
                        expect(toastMsg).to.contain(element)
                    );
                } else {
                    expect(toastMsg).to.contain(text);
                }

                if (includesRecentCaseNumber) expect(toastMsg).to.contain(JSON.parse(recentCase).caseNumber)
            });
        });

        this.wait_response_from_API_call('addCase', 200, 'newCase')
        return this;
    };

    enter_Case_Number(caseNo, clearPrefix = true) {
        this.pause(1)
        caseNumberInput_enabled().should('be.enabled');
        if (clearPrefix) {
            caseNumberInput_enabled().clear()
        }
        caseNumberInput_enabled().type(caseNo);
        return this;
    };

    populate_all_fields_on_both_forms(caseObject, clearPrefix = false) {
        this.wait_until_spinner_disappears();
        if (caseObject.caseNumber) {
            this.enter_Case_Number(caseObject.caseNumber, clearPrefix)
        }
        this.select_Offense_Type(caseObject.offenseType)
            .click_Next()
            .populate_all_fields_on_second_form(caseObject);
        return this;
    };

    verify_Case_Number_value(caseNo) {
        active_form().should('be.visible');
        caseNumberInput_enabled().should('be.enabled');
        cy.wait(1000)
        caseNumberInput_enabled().should('have.value', caseNo);
        return this;
    };

    verify_Case_Number_field_is_disabled_and_shows_Auto_Assigned_placeholder() {
        caseNumberInput_autoAssigned().should('not.be.enabled');
        caseNumberInput_autoAssigned().should('be.visible');
        return this;
    };

}

