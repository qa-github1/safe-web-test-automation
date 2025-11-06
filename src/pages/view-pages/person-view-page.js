const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
import BaseViewPage from "../base-pages/base-view-page";

//************************************ ELEMENTS ***************************************//

let
    formContainer = timeout => cy.get('.form-horizontal', timeout),
    view_form = e => cy.get('[name="frms.frmView"]'),
    edit_form = e => cy.get('[name="frms.frmEdit"]'),
    saveButton = e => cy.get('[ng-click="save()"]'),
    editButton = e => cy.get('[translate="GENERAL.EDIT"]').contains('Edit'),
    businessName = e => cy.get('[ng-model="person.businessName"]'),
    firstName = e => cy.get('[ng-model="person.firstName"]'),
    lastName = e => cy.get('[ng-model="person.lastName"]'),
    middleName = e => cy.get('[ng-model="person.middleName"]'),
    alias = e => cy.get('[ng-model="person.alias"]'),
    driversLicense = e => cy.get('[ng-model="person.driverLicence"]'),
    mobilePhone = e => cy.get('[ng-model="person.mobilePhone"]'),
    otherPhone = e => cy.get('[ng-model="person.otherPhone"]'),
    email = e => cy.get('[ng-model="person.email"]'),
    race = e => cy.get('[ng-model="person.raceId"]'),
    gender = e => cy.get('[ng-model="person.genderId"]'),
    personTypeDropdown = e => cy.get('[ng-model="vm.personTypeId"]'),
    caseNote = e => cy.get('[ng-model="vm.caseNotes"]'),
    dateOfBirth = e => cy.get('[ng-model="person.dob"]').find('[ng-model="ngModel"]'),
    deceasedCheckbox = e => cy.contains('Deceased').parents('.checkbox').find('.icheckbox_square-blue'),
    deceasedCheckboxClickable = e => cy.contains('Deceased').parents('.checkbox').find('.icheckbox_square-blue').find('.iCheck-helper'),
    juvenileCheckbox = e => cy.contains('Juvenile').parents('.checkbox').find('.icheckbox_square-blue'),
    juvenileCheckboxClickable = e => cy.contains('Juvenile').parents('.checkbox').find('.icheckbox_square-blue').find('.iCheck-helper')

export default class PersonViewPage extends BaseViewPage {

    constructor() {
        super()
        this.save_button_on_active_tab = saveButton;
    }

    //************************************ ACTIONS ***************************************//

    verify_Person_View_page_is_open() {
        this.toastMessage().should('not.exist');
        this.verify_text_is_present_on_main_container(C.labels.personView.title);
        return this;
    };

    click_Save() {
        saveButton().click();
        return this;
    }

    click_Edit() {
        editButton().should('be.enabled');
        editButton().click();
        saveButton().should('be.visible');
        return this;
    };

    edit_all_values(newPersonObject) {
        this.type_if_values_provided(
            [
                [businessName, newPersonObject.businessName],
                [firstName, newPersonObject.firstName],
                [lastName, newPersonObject.lastName],
                [middleName, newPersonObject.middleName],
                [alias, newPersonObject.alias],
                [this.driversLicenseInput__, newPersonObject.driversLicense],
                [email, newPersonObject.email],
                [dateOfBirth, newPersonObject.dateOfBirth],
            ]);

        if (newPersonObject.mobilePhone) mobilePhone().clear().type(newPersonObject.mobilePhone)
        if (newPersonObject.otherPhone) otherPhone().clear().type(newPersonObject.otherPhone)

        if (newPersonObject.race) race().select(newPersonObject.race);
        if (newPersonObject.gender) gender().select(newPersonObject.gender);

        if (newPersonObject.deceased !== null) {
            deceasedCheckbox().then(($el) => {
                if ($el.hasClass('checked') && !newPersonObject.deceased || !$el.hasClass('checked') && newPersonObject.deceased) {
                    deceasedCheckboxClickable().click()
                }
            });
        }

        if (newPersonObject.juvenile !== null) {
            juvenileCheckbox().then(($el) => {
                if ($el.hasClass('checked') && !newPersonObject.juvenile || !$el.hasClass('checked') && newPersonObject.juvenile) {
                    juvenileCheckboxClickable().click()
                }
            });
        }

        return this;
    };

    verify_edited_and_not_edited_values(viewOrEdit, labelsOfEditedFields, editedPersonObject, initialPersonObject) {

        editedPersonObject = Object.assign({}, editedPersonObject)
        initialPersonObject = Object.assign({}, initialPersonObject)

        if (viewOrEdit === 'view') {
            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Date of Birth', this.dateOfBirth__, editedPersonObject.dateOfBirth, initialPersonObject.dateOfBirth)
        } else {
            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Date of Birth', dateOfBirth, editedPersonObject.dateOfBirth, initialPersonObject.dateOfBirth)
        }

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Business Name', this.businessNameInput__, editedPersonObject.businessName, initialPersonObject.businessName)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'First Name', this.firstNameInput__, editedPersonObject.firstName, initialPersonObject.firstName)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Middle Name', this.middleNameInput__, editedPersonObject.middleName, initialPersonObject.middleName)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Last Name', this.lastNameInput__, editedPersonObject.lastName, initialPersonObject.lastName)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Alias', this.aliasInput__, editedPersonObject.alias, initialPersonObject.alias)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Driver\'s License', this.driversLicenseInput__, editedPersonObject.driversLicense, initialPersonObject.driversLicense)

        this.verify_edited_or_old_TEXT_if_field_was_not_edited(
            labelsOfEditedFields, 'Race', this.race__, editedPersonObject.race, initialPersonObject.race)

        this.verify_edited_or_old_TEXT_if_field_was_not_edited(
            labelsOfEditedFields, 'Gender', this.gender__, editedPersonObject.gender, initialPersonObject.gender)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Mobile Phone', this.mobilePhoneInput__, editedPersonObject.mobilePhone, initialPersonObject.mobilePhone)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Other Phone', this.otherPhoneInput__, editedPersonObject.otherPhone, initialPersonObject.otherPhone)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Email', this.emailInput__, editedPersonObject.email, initialPersonObject.email)


        return this;
    };

    verify_edited_and_not_edited_values_on_Person_View_form(labelsOfEditedFields, editedPersonObject, initialPersonObject) {
        view_form().within(($list) => {
            this.verify_edited_and_not_edited_values('view', labelsOfEditedFields, editedPersonObject, initialPersonObject)
        })
        return this;
    };

    verify_edited_and_not_edited_values_on_Person_Edit_form(labelsOfEditedFields, editedPersonObject, initialPersonObject) {
        edit_form().within(($list) => {
            this.verify_edited_and_not_edited_values('edit', labelsOfEditedFields, editedPersonObject, initialPersonObject)
        })
        return this;
    };

    verify_textual_values_on_the_form(arrayOfValues) {
        this.verify_multiple_text_values_in_one_container(
            formContainer,
            arrayOfValues
        )
        return this;
    }

    verify_values_on_Edit_form(personObject, includesCustomData) {

        this.wait_element_to_be_visible(saveButton)

        this.verify_values_on_multiple_elements(
            [
                [businessName, personObject.businessName],
                [firstName, personObject.firstName],
                [middleName, personObject.middleName],
                [lastName, personObject.lastName],
                [alias, personObject.alias],
                [this.driversLicenseInput__, personObject.driversLicense],
                [mobilePhone, personObject.mobilePhone],
                [otherPhone, personObject.otherPhone],
                [email, personObject.email],
                [dateOfBirth, personObject.dateOfBirth]
            ]);

        this.verify_text_on_multiple_elements(
            [
                [race, personObject.race],
                [gender, personObject.gender]
            ]);

        if (includesCustomData) {
            this.verify_custom_data_on_Edit_form(personObject)
        }

        return this;
    };

    verify_all_values_on_history_in_specific_column(dataObject, leftOrRightColumn, customFormName) {

        let columnContainer;

        if (leftOrRightColumn === 'left') {
            columnContainer = this.historyView_leftColumn
        } else if (leftOrRightColumn === 'right') {
            columnContainer = this.historyView_rightColumn
        }

        this.verify_all_values_on_history_for_standard_fields(leftOrRightColumn,
            [
                ['Update Date', dataObject.updateDate],
                ['Business Name', dataObject.businessName],
                ['First Name', dataObject.firstName],
                ['Middle Name', dataObject.middleName],
                ['Last Name', dataObject.lastName],
                ['Alias', dataObject.alias],
                ['Driver\'s License', dataObject.driversLicense],
                ['Date of Birth', dataObject.dateOfBirth],
            ],
            [
                ['Update Made By', dataObject.updateMadeBy],
                ['Email', dataObject.email],
                ['Mobile Phone', dataObject.mobilePhone],
                ['Other Phone', dataObject.otherPhone],
            ]
        )

        this.verify_selected_option_on_Select_list(columnContainer, dataObject.race, 'Race');
        this.verify_selected_option_on_Select_list(columnContainer, dataObject.gender, 'Gender');
        this.verify_if_Deceased_checkbox_is_selected_on_History(columnContainer, dataObject.deceased);
        this.verify_if_Juvenile_checkbox_is_selected_on_History(columnContainer, dataObject.juvenile);

        if (customFormName) {
            this.verify_custom_data_on_History(leftOrRightColumn, customFormName, dataObject)
        }
        return this;
    };

    verify_red_highlighted_history_records(redFields, allFieldsOnHistory) {
        let fieldsToCheck = allFieldsOnHistory || C.personFields.allFieldsOnHistory
        super.verify_red_highlighted_history_records(fieldsToCheck, redFields)
        return this;
    }

    verify_if_Deceased_checkbox_is_selected_on_History(parentContainer, isSelected) {
        if (isSelected) {
            parentContainer().contains('Deceased').parents('.checkbox').find('.icheckbox_square-blue').should('have.class', 'checked');
        } else if (isSelected !== null) {
            parentContainer().contains('Deceased').parents('.checkbox').find('.icheckbox_square-blue').should('not.have.class', 'checked');
        }
        return this;
    };

    verify_if_Juvenile_checkbox_is_selected_on_History(parentContainer, isSelected) {
        if (isSelected) {
            parentContainer().contains('Juvenile').parents('.checkbox').find('.icheckbox_square-blue').should('have.class', 'checked');
        } else if (isSelected !== null) {
            parentContainer().contains('Juvenile').parents('.checkbox').find('.icheckbox_square-blue').should('not.have.class', 'checked');
        }
        return this;
    };

    verify_all_values_on_history(newPersonObject, oldPersonObject, customFormName = null) {

        this.verify_all_values_on_history_in_specific_column(newPersonObject, 'left', customFormName)
        if (oldPersonObject) this.verify_all_values_on_history_in_specific_column(oldPersonObject, 'right', customFormName)

        return this;
    };

    change_person_type_or_case_note(data) {
        personTypeDropdown().select(data.personType);
        caseNote().type(data.caseNote);
        return this;
    }
}
