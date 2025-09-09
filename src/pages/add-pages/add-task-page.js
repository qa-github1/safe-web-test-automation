import C from "../../fixtures/constants";

const S = require('../../fixtures/settings')
import BasePage from "../base-pages/base-page";

//************************************ ELEMENTS ***************************************//
let
    taskType = e => cy.get('[ng-model="newTask.taskType"]'),
    titleInput = e => cy.get('[name="taskTitle"]'),
    messageInput = e => cy.get('[name="taskMessage"]'),
    dueDateInput = e => cy.get('[name="DUEDate"]').find('input').first(),
    plusIcon = e => cy.get('[ng-click="attachToTask()"]'),
    attachmentTypeDropdown = e => cy.get('#taskAttachmentType'),
    itemTypeaheadInputField = e => cy.get('#attach-item'),
    itemTypeaheadDivField = e => cy.get('[aria-label="Select box activate"]').last(),
    itemObjectTypeahead = e => cy.get('[repeat="task in availableItems"]'),
    personInputField = e => cy.get('[ng-model="person.text"]').last(),
    assignedToInput = e => cy.contains('Assigned to').parent('div').find('input'),
    saveButton = e => cy.findAllByText('Save').last()

export default class AddTaskPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//
    select_assignees(arrayOfValues) {
        this.enter_values_on_single_multi_select_typeahead_field(['Assigned to', arrayOfValues, "users/groups"])
        return this;
    }

    // select_assignees(groupName) {
    //     this.type_if_value_provided(assignedToInput, groupName)
    //     this.pause(1)
    //     this.click_highlighted_option_on_typeahead(groupName);
    //     return this;
    // }

    populate_all_fields(taskObject, keepDefaultDueDate = true, keepTemplateValues = true, templateObject) {

        this.select_dropdown_option('Task Template', taskObject.template)

        if(keepTemplateValues){
            this.verify_value_in_textarea_field('Title', templateObject.title)
            this.verify_value_in_textarea_field('Message', templateObject.message)
        }

        if (!keepTemplateValues) {
            this.clearAndEnterValue(titleInput, taskObject.title)
                .clearAndEnterValue(messageInput, taskObject.message)
        }


        if (!keepDefaultDueDate) {
            dueDateInput().clear().type(taskObject.dueDate).then(function (value) {
                taskObject.dueDate = value
            });
        }

       this.select_assignees([taskObject.assignees])

        if (taskObject.linkedObjects) {
            const linkedObjects = Array.isArray(taskObject.linkedObjects)
                ? taskObject.linkedObjects : [taskObject.linkedObjects];

            linkedObjects.forEach(object => {
                if (object.type === 'case') {
                    plusIcon().click()
                    this.findElementByLabelEnterValueAndPressEnter('Case', object.caseNumber)
                    this.caseNumberOnTypeahead().click()
                    this.click_button_on_modal('Add')
                }
                if (object.type === 'item') {
                    plusIcon().click()
                    attachmentTypeDropdown().select('Item')
                    this.findElementByLabelEnterValueAndPressEnter('Case', object.caseNumber)
                    this.caseNumberOnTypeahead().click()
                    this.pause(1)
                    itemTypeaheadInputField().click()
                    itemObjectTypeahead().should('be.visible')
                    itemTypeaheadInputField().type('{enter}')
                    this.click_button_on_modal('Add')
                    this.verify_toast_message('Added!')
                    this.click_button_on_modal('Finish Adding')
                }
                if (object.type === 'person') {
                    plusIcon().click()
                    attachmentTypeDropdown().select('Person')
                    personInputField().type(object.personName)
                    this.dropdownTypeaheadOption().click()
                    this.click_button_on_modal('Add')
                }
            })
        }
        this.define_API_request_to_be_awaited('POST', 'api/tasks/getmytasks', 'getMyTasks')
        return this;
    }

    populate_and_submit_form(title, message, user) {
        titleInput().type(title);
        messageInput().type(message);
        assignedToInput.type(user.email);
        this.click_highlighted_option_on_typeahead(user.email);
        this.click_Save();
        return this;
    }

    store_Task_Number_from_API_response_to_local_storage() {
        this.wait_response_from_API_call('getMyTasks', 200, 'myTasks')
        return this;
    };

    click_Save_() {
        this.click_Save()
        this.store_Task_Number_from_API_response_to_local_storage()
        return this;
    };


    verify_email_content_(recipient, emailTemplate, taskObject, assignedTo, numberOfExpectedEmails = 1, markSeen = true) {
        cy.getLocalStorage("taskNumber").then(number => {

            taskObject.taskNumber = '#' + number

            if (taskObject.subtype && emailTemplate.content1_withSubtype) {
                this.verify_email_content
                (recipient, emailTemplate.subject, emailTemplate.content1_withSubtype(taskObject), numberOfExpectedEmails, false)
            } else {
                this.verify_email_content
                (recipient, emailTemplate.subject, emailTemplate.content1(taskObject), numberOfExpectedEmails, false)
            }

            this.verify_email_content
            (recipient, emailTemplate.subject, emailTemplate.content2(assignedTo), numberOfExpectedEmails, markSeen)
        })
    };
}

