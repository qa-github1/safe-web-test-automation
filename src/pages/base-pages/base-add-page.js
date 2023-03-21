import BasePage from "../base-pages/base-page";

const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
let casesApi = require('../../api-utils/endpoints/cases/collection')

//************************************ ELEMENTS ***************************************//

let
    mainContainer = e => cy.get('.ibox-content'),
    nextButton = e => cy.get('[translate="GENERAL.BUTTON_NEXT"]'),
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    offenseTypeInput = e => cy.get('[ng-model="case.offenseTypeId"]').eq(0),
    caseNumberInput_enabled = e => active_form().find('[for="caseNumber"]').parent('div').find('input'),
    caseNumberInput_disabled = e => active_form().find('[for="caseNumber"]').parent('div').find('input'),
    postSaveAction = e => cy.get('#routeSelect'),
    checkbox = e => cy.get('.iCheck-helper'),
    caseNumberInput = e => cy.get('[name="caseNumber"]'),
    caseMinLimitError = e => cy.get('[translate="GENERAL.MIN_TEXT_INPUT_3"]'),
    caseMaxLimitError = e => cy.get('[translate="ERRORS.TOO_LONG"]');

export default class BaseAddPage extends BasePage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//


    click_Next() {
        this.wait_until_spinner_disappears()
        nextButton().should('be.enabled');
        nextButton().click();
        return this;
    };

    verify_text_on_main_Form(text) {
        this.toastMessage().should('not.exist');
        mainContainer().should('contain', text);
        return this;
    };

    clear_Case_Number() {
        caseNumberInput().clear();
    }

    enter_Case_Number(caseNo) {
        caseNumberInput_enabled().should('be.enabled');
        caseNumberInput_enabled().clear().type(caseNo);
        return this;
    };

    wait_most_recent_case_to_be_populated() {
        cy.getLocalStorage("recentCase").then(recentCase => {
            if (recentCase) {
                caseNumberInput_enabled().should('have.class', 'ng-not-empty');
                caseNumberInput_enabled().should('have.value', JSON.parse(recentCase).caseNumber);
            }
        });
        return this;
    };

    enter_Case_Number_and_select_on_typeahead(caseNo) {
        this.wait_most_recent_case_to_be_populated()
        caseNumberInput_enabled().should('be.visible');
        caseNumberInput_enabled().should('be.enabled');
        caseNumberInput_enabled().clear();
        caseNumberInput_enabled().should('have.class', 'ng-empty');
        caseNumberInput_enabled().type(caseNo);
        this.caseNumberOnTypeahead().click();
        return this;
    };

    enter_Offense_Type_and_select_on_typeahead(offenseType) {
        offenseTypeInput().should('be.visible');
        offenseTypeInput().should('be.enabled');
        offenseTypeInput().type(offenseType);
        this.offenseTypeOnTypeahead().click();
        return this;
    };

    select_post_save_action(action) {
        postSaveAction().select(action);
        return this;
    };

    select_checkbox() {
        checkbox().click();
        return this;
    };

    verify_Case_Number_is_NOT_populated_on_enabled_input_field() {
        this.toastMessage().should('not.exist');
        caseNumberInput_enabled().should('be.enabled');
        caseNumberInput_enabled().should('have.class', 'ng-empty');
        return this;
    };

    verify_Case_Number_is_populated_on_enabled_input_field(caseNo, ) {
        casesApi.get_most_recent_case();
        cy.getLocalStorage("recentCase").then(recentCase => {
           //cy.log('Fetching the most recent case from local storage');
            if (recentCase) {
                if (caseNo){
                    expect(JSON.parse(recentCase).caseNumber).to.eq(caseNo);
                }
                else {
                    caseNo = JSON.parse(recentCase).caseNumber;
                }
            }

            this.toastMessage().should('not.exist');
            this.caseNumberInput_enabled().should('be.enabled');
            caseNumberInput_enabled().should('have.class', 'ng-not-empty');
            caseNumberInput_enabled().should('have.value', caseNo);

        });
        return this;
    };

    verify_Case_Number_is_populated_on_disabled_input_field(caseNo) {
        this.toastMessage().should('not.exist');
        this.caseNumberInput_disabled().should('not.be.enabled');
        this.caseNumberInput_enabled().should('have.value', caseNo);
        return this;
    };

    verify_limits_for_Case_Number_length(caseNumberLimit) {
        this.enter_Case_Number(D.getRandomNo(caseNumberLimit));
        if (caseNumberLimit < 3) {
            caseMinLimitError().should('contain', 'Minimum 3 characters');
        } else if (caseNumberLimit > 75) {
            caseMaxLimitError().should('contain', 'Too long!');
        } else {
            caseMinLimitError().should('not.exist');
            caseMaxLimitError().should('not.exist');
        }
        return this;
    }
}

