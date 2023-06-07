const S = require('../../fixtures/settings')
import BasePage from "../base-pages/base-page";

//************************************ ELEMENTS ***************************************//
let
    taskType = e => cy.get('[ng-model="newTask.taskType"]'),
    titleInput = e => cy.get('[name="taskTitle"]'),
    messageInput = e => cy.get('[name="taskMessage"]'),
    dueDateInput = e => cy.get('[name="DUEDate"]').find('input').first(),
    usersAndGroupsInput = e => cy.contains('Users and groups').parent('div').find('input'),
    saveButton = e => cy.findAllByText('Save').last()

export default class AddTaskPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//
    enter_user(email) {
        //this.enter_and_select_value_in_typeahead_field('Users and groups', email)
        this.type_if_value_provided(usersAndGroupsInput, email)
        this.pause(1)
        this.click_highlighted_option_on_typeahead(email);
        return this;
    }

    enter_user_group(groupName) {
        //  this.enter_and_select_value_in_typeahead_field('Users and groups', groupName)
        this.type_if_value_provided(usersAndGroupsInput, groupName)
        this.pause(1)
        this.click_highlighted_option_on_typeahead(groupName);
        return this;
    }

    populate_all_fields(taskObject, keepDefaultDueDate = true, keepTemplateValues = true, templateObject) {

        this.select_dropdown_option('Task Type', taskObject.type)
        if (taskObject.subtype) this.select_dropdown_option('Sub Type', taskObject.subtype)

        this.verify_value_in_textarea_field('Title', templateObject.title)
        this.verify_value_in_textarea_field('Message', templateObject.message)

        if (!keepTemplateValues) {
            this.clearAndEnterValue(titleInput, taskObject.title)
                .clearAndEnterValue(messageInput, taskObject.message)
        }

        if (!keepDefaultDueDate) {
            dueDateInput().clear().type(taskObject.dueDate).then(function (value) {
                taskObject.dueDate = value
            });
        }

        if (taskObject.userEmail) this.enter_user(taskObject.userEmail)
        if (taskObject.userGroupName) this.enter_user_group(taskObject.userGroupName)
        this.define_API_request_to_be_awaited('POST', 'api/tasks', 'addTask', 'newTask')
        return this;
    }

    verify_toast_message_(text) {
        this.verify_toast_message(text)
        return this;
    };

    populate_and_submit_form(title, message, user) {
        titleInput().type(title);
        messageInput().type(message);
        usersAndGroupsInput.type(user.email);
        this.click_highlighted_option_on_typeahead(user.email);
        this.click_Save();
        return this;
    }

    verify_content_of_specific_cell_in_first_table_row_(columnTitle, cellContent) {
        this.verify_content_of_specific_cell_in_first_table_row(columnTitle, cellContent, 'td')
        return this;
    };

    verify_task_data_on_grid(taskObject) {

        S.getCurrentDate();
        this.verify_content_of_specific_cell_in_first_table_row_('Task Type', taskObject.type)
        this.verify_content_of_specific_cell_in_first_table_row_('Sub Type', taskObject.subtype)
        this.verify_content_of_specific_cell_in_first_table_row_('Status', taskObject.status)
        this.verify_content_of_specific_cell_in_first_table_row_('Creation Date', S.currentDate)
        this.verify_content_of_specific_cell_in_first_table_row_('Last Action', S.currentDate)
        this.verify_content_of_specific_cell_in_first_table_row_('Title', taskObject.title)
        this.verify_content_of_specific_cell_in_first_table_row_('Created by', taskObject.createdBy)
        this.verify_content_of_specific_cell_in_first_table_row_('Due Date', taskObject.dueDate)

        if (taskObject.userName || taskObject.userGroupName) {
            if (taskObject.userName) {
                this.verify_content_of_specific_cell_in_first_table_row_('Assigned to', taskObject.userName)
            } else if (taskObject.userGroupName) {
                this.verify_content_of_specific_cell_in_first_table_row_('Assigned to', taskObject.userGroupName)
            }
        } else {
            this.verify_content_of_specific_cell_in_first_table_row_('Assigned to', 'Unassigned')
        }
        return this;
    }

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

