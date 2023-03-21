const S = require('../fixtures/settings');
const C = require('../fixtures/constants');
const workflowsAPI = require('../api-utils/endpoints/workflows/collection');

import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    nameInput = e => cy.get('[placeholder="Name"]'),
    typeDropdown = e => cy.get('[ng-model="workflow.selectedType"]'),
    usersInput = e => cy.get('input[placeholder="Users..."]'),
    userTypeahead = e => cy.get('[ng-repeat="user in $select.items"]'),
    matchingCriteriaField = e => cy.get('[ng-model="workflow.selectedRecordSelectionFilterField"]'),
    matchingCriteriaCustomField = e => cy.get('[ng-model="workflowRecordSelectionTypeahead"]'),
    matchingCriteriaOperator = e => cy.get('[ng-model="workflow.selectedRecordSelectionFilterOperation"]'),
    matchingCriteriaValueDropdown = e => cy.get('[ng-model="workflow.recordSelectionFilterEnumValue"]'),
    matchingCriteriaInputField = e => cy.get('[ng-model="workflow.recordSelectionFilterValue"]'),
    fieldEditedDropdown = e => cy.get('[ng-model="workflow.selectedExecutionEditedField"]'),
    filterByOfficeCheckbox = e => cy.get('[ng-model="workflow.filterByOffice"]'),
    officeTextbox = e => cy.get('input[placeholder="Select an office..."]'),
    highlightedOffice = e => cy.get('.ui-select-highlight'),
    customFieldEditedTypeaheadInput = e => cy.get('[ng-model="workflowFieldTypeahead"]'),
    customFieldTypeaheadDropdown = e => cy.get('[ng-repeat="match in matches track by $index"]')

export default class WorkflowsPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    click_(text) {
        this.click(text, this.mainContainer());
        return this;
    }

    enter_name(name) {
        nameInput().type(name);
        return this;
    }

    select_type(type) {
        typeDropdown().select(type);
        return this;
    }

    select_users(userEmail) {
        usersInput().type(userEmail);
        userTypeahead().click();
        return this;
    }

    set_up_workflow(name, type, userEmail, trigger, whichRecords, fieldEdited = null, officeName = null) {
        this.enter_name(name);
        this.select_type(type);
        this.select_users(userEmail);
        cy.findByText(trigger).prev().click();

        if (fieldEdited) {
            if (trigger === C.workflows.executeWhen.fieldEdited) {
                fieldEditedDropdown().select(fieldEdited);
            } else if (trigger === C.workflows.executeWhen.customFieldEdited) {
                customFieldEditedTypeaheadInput().type(fieldEdited);
                customFieldTypeaheadDropdown().click();
            }
        }

        cy.findByText(whichRecords).prev().click();

        if (officeName) {
            filterByOfficeCheckbox().click();
            officeTextbox().type(officeName);
            highlightedOffice().click();
        }

        return this;
    }

    set_matching_criteria(field, operator, value, isInputField = true) {
        matchingCriteriaField().select(field);

        matchingCriteriaOperator().select(operator);

        if (isInputField) {
            matchingCriteriaInputField().type(value);
        } else {
            matchingCriteriaValueDropdown().select(value);
        }
        return this;
    }

    set_matching_criteria_custom_field(field, operator, value, isInputField = true) {
        matchingCriteriaCustomField().type(field);
        customFieldTypeaheadDropdown().click();
        matchingCriteriaOperator().select(operator);

        if (isInputField) {
            matchingCriteriaInputField().type(value);
        } else {
            matchingCriteriaValueDropdown().select(value);
        }

        return this;
    }

    verify_email_content_(account, workflowTemplate, dataObject, fieldEdited) {

        if (dataObject.recoveredById) {

            cy.getLocalStorage("newItem").then(newlyAddedItem => {
                let updatedItemObject = Object.assign(JSON.parse(newlyAddedItem), dataObject);

                this.verify_email_content(account, workflowTemplate.subject, workflowTemplate.content(updatedItemObject, fieldEdited));
            });

        } else if (dataObject.offenseType) {

            cy.getLocalStorage("newCase").then(newlyAddedCase => {
                let updatedCaseObject = Object.assign(JSON.parse(newlyAddedCase), dataObject);

                this.verify_email_content(account, workflowTemplate.subject, workflowTemplate.content(updatedCaseObject, fieldEdited));
            });
        }
        return this;
    }

}

