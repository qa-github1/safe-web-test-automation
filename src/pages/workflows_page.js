const S = require('../fixtures/settings');
const C = require('../fixtures/constants');
const workflowsAPI = require('../api-utils/endpoints/workflows/collection');

import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    nameInput = e => cy.get('[placeholder="Name"]'),
    typeDropdown = e => cy.get('[ng-model="workflow.selectedType"]'),
    usersOrGroupsInput = e => cy.get('input[placeholder="Start typing to search for users/groups"]'),
    userTypeahead = e => cy.get('[ng-repeat="item in $group.items"]'),
    matchingCriteriaField = e => cy.get('[ng-model="filter.selectedRecordSelectionFilterField"]'),
    matchingCriteriaCustomField = e => cy.get('[ng-model="workflowRecordSelectionTypeahead"]'),
    matchingCriteriaOperator = e => cy.get('[ng-model="filter.selectedRecordSelectionFilterOperation"]'),
    matchingCriteriaDropdownValue_2 = e => cy.get('[class="col-sm-7 ng-scope"]'),
    matchingCriteriaDropdownValue = e => cy.get('[ng-model="filter.recordSelectionFilterEnumValue"]'),
    matchingCriteriaInputFieldValue = e => cy.get('[ng-model="filter.recordSelectionFilterValue"]'),
    fieldEditedDropdown = e => cy.get('[ng-model="workflow.selectedExecutionEditedField"]'),
    filterByOfficeCheckbox = e => cy.get('[ng-model="workflow.filterByOffice"]'),
    officeTextbox = e => cy.get('input[placeholder="Select an office..."]'),
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

    select_user_or_group(userEmailOrGroupName) {
        this.define_API_request_to_be_awaited('GET', 'multiselecttypeahead')
        usersOrGroupsInput().type(userEmailOrGroupName);
        this.wait_response_from_API_call('multiselecttypeahead')
        userTypeahead().should('have.length', 1)
        userTypeahead().click();
        return this;
    }

    set_up_workflow(name, type, userOrGroup, actions, trigger, whichRecords, fieldEdited = null, officeName = null) {
        this.enter_name(name);
        this.select_type(type);
        this.select_user_or_group(userOrGroup);
        actions.forEach(action =>{
            cy.findByText(action).prev().click();
        })
        cy.findByText(trigger).prev().click();

        if (fieldEdited) {
            if (trigger === C.workflows.executeWhen.fieldEdited) {
                fieldEditedDropdown().select(fieldEdited);
            } else if (trigger === C.workflows.executeWhen.customFieldEdited) {
                customFieldEditedTypeaheadInput().type(fieldEdited);
                customFieldTypeaheadDropdown().filter(':has(strong)').first().click();
            }
        }

        if(whichRecords){
            cy.findByText('Add Filter Criteira').prev().click();
            cy.findByText(whichRecords).prev().click();
        }

        if (officeName) {
            filterByOfficeCheckbox().click();
            officeTextbox().type(officeName);
            this.click_highlighted_option_on_typeahead()
        }

        return this;
    }

    // set_matching_criteria(field, operator, value, isInputField = true) {
    //     matchingCriteriaField().select(field);
    //
    //     matchingCriteriaOperator().select(operator);
    //
    //     if (isInputField) {
    //         matchingCriteriaInputFieldValue().type(value);
    //     } else {
    //         matchingCriteriaDropdownValue().select(value)
    //     }
    //     return this;
    // }

    set_matching_criteria(field, operator, value, isInputField = true) {
        matchingCriteriaField().select(field);
        matchingCriteriaOperator().select(operator);

        if (isInputField) {
            matchingCriteriaInputFieldValue().type(value);
        } else {
            cy.get('body').then($body => {
                if ($body.find('[ng-model="filter.recordSelectionFilterEnumValue"]').length > 0) {
                    matchingCriteriaDropdownValue()
                        .should('exist')
                        .should('be.visible')
                        .select(value)
                } else {
                    cy.log(`Selector NOT found, using different one`);
                     matchingCriteriaDropdownValue_2().type(value);
                     this.pause(2)
                     this.press_ENTER(matchingCriteriaDropdownValue_2)
                }
            });
        }
        return this;
    }






    set_matching_criteria_custom_field(field, operator, value, isInputField = true) {
        matchingCriteriaCustomField().type(field);
        customFieldTypeaheadDropdown().filter(':has(strong)').first().click();
        matchingCriteriaOperator().select(operator);

        if (isInputField) {
            matchingCriteriaInputFieldValue().type(value);
        } else {
            matchingCriteriaDropdownValue().select(value);
        }

        return this;
    }

    verify_email_content_(emailAccount, workflowTemplate, dataObject, fieldEdited, numberOfExpectedEmails = 1, markSeen = true) {

        if (dataObject.location) {

            cy.getLocalStorage("newItem").then(newlyAddedItem => {
                let updatedItemObject = Object.assign(JSON.parse(newlyAddedItem), dataObject);

                this.verify_email_content(emailAccount, workflowTemplate.subject, workflowTemplate.content(updatedItemObject, fieldEdited), numberOfExpectedEmails, markSeen);
            });

        } else if (dataObject.offenseType) {

            cy.getLocalStorage("newCase").then(newlyAddedCase => {
                let updatedCaseObject = Object.assign(JSON.parse(newlyAddedCase), dataObject);

                this.verify_email_content(emailAccount, workflowTemplate.subject, workflowTemplate.content(updatedCaseObject, fieldEdited), numberOfExpectedEmails, markSeen);
            });
        }
        return this;
    }

}

