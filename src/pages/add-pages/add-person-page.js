import BaseAddPage from "../base-pages/base-add-page";

const C = require('../../fixtures/constants')
import BasePage from "../base-pages/base-page";

let
    caseNumberInput_enabled = e => cy.get('[typeahead="l as l.text for l in getObject($viewValue) | limitTo: 10"]'),
    personType = e => cy.get('[name="personTypeId"]'),
    race = e => cy.get('[ng-options="r.id as r.name for r in races"]'),
    gender = e => cy.get('[ng-options="g.id as g.name for g in genders"]'),
    businessName = e => cy.findByPlaceholderText(C.placeholders.addPerson.businessName),
    firstName = e => cy.findByPlaceholderText(C.placeholders.addPerson.firstName),
    lastName = e => cy.findByPlaceholderText(C.placeholders.addPerson.lastName),
    middleName = e => cy.findByPlaceholderText(C.placeholders.addPerson.middleName),
    alias = e => cy.findByPlaceholderText(C.placeholders.addPerson.alias),
    driversLicense = e => cy.findByPlaceholderText(C.placeholders.addPerson.driversLicense),
    mobilePhone = e => cy.get('.form-horizontal').contains('Mobile Phone').parent('div').find('input'),
    otherPhone = e => cy.get('.form-horizontal').contains('Other Phone').parent('div').find('input'),
    email = e => cy.findByPlaceholderText(C.placeholders.addPerson.email),
    dateOfBirth = e => cy.get('[translate="GENERAL.DOB"]').parents('tp-modal-field').find('[ng-readonly="isDatePickerOnly"]'),
    deceased = e => cy.get('[name="deceased"]').parent('div').find('.iCheck-helper'),
    juvenile = e => cy.get('[name="juvenile"]').parent('div').find('.iCheck-helper'),
    addPersonHeader = e => cy.get('[translate="PEOPLE.HEADING_ADD"]'),
    proceedAnywayButton = e => cy.get('[translate="GENERAL.PROCEED_ANYWAY"]'),
    potentialDuplicatePersonBasedOnBusinessName = e => cy.get('[ng-if="frm.businessName.$error.duplicates"]'),
    potentialDuplicatePersonBasedOnFirstName = e => cy.get('[ng-if="frm.personfirstname.$error.duplicates"]'),
    potentialDuplicatePersonBasedOnLastName = e => cy.get('[ng-if="frm.personlastname.$error.duplicates"]'),
    potentialDuplicatePersonBasedOnDriverLicenseName = e => cy.get('[ng-if="frm.driverLicence.$error.duplicates"]'),
    potentialDuplicatePersonLink = e => cy.get('[translate="GENERAL.PLEASE_CLICK_TO_REVIEW"]'),
    addressType = e => cy.get('[ng-model="model.addressTypeId"]'),
    country = e => cy.get('[ng-model="model.countryId"]'),
    address1 = e => cy.get('[ng-model="model.line1"]'),
    address2 = e => cy.get('[ng-model="model.line2"]'),
    city = e => cy.get('[ng-model="model.city"]'),
    state = e => cy.get('[ng-model="model.stateId"]'),
    zip = e => cy.get('[ng-model="model.zip"]'),
    toastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout})

//************************************ ELEMENTS ***************************************//

export default class AddPersonPage extends BaseAddPage {

    constructor() {
        super();
        this.potentialDuplicatePersonLink = potentialDuplicatePersonLink;
        this.proceedAnywayButton = proceedAnywayButton;
    }

//************************************ ACTIONS ***************************************//


    verify_Add_Person_page_is_open() {
        this.toastMessage().should('not.exist');
        addPersonHeader().should('contain', C.labels.addPerson.title);
        return this;
    };

    verify_Case_Number_is_populated_on_enabled_input_field(caseNo) {
        this.toastMessage().should('not.exist');
        caseNumberInput_enabled().should('be.enabled');
        caseNumberInput_enabled().should('have.value', caseNo);
        return this;
    };

    verify_number_of_warnings_for_potential_duplicates(numberofWarnings, isDuplicateBasedOnBusinessName, isDuplicateBasedOnFirstsName, isDuplicateBasedOnLastName, isDuplicateBasedOnDriverLicense) {
        potentialDuplicatePersonLink().should('have.length', numberofWarnings);

        switch (true) {
            case isDuplicateBasedOnBusinessName:
                potentialDuplicatePersonBasedOnBusinessName().scrollIntoView().should('be.visible')
            case isDuplicateBasedOnFirstName:
                potentialDuplicatePersonBasedOnFirstName().scrollIntoView().should('be.visible')
            case isDuplicateBasedOnLastName:
                potentialDuplicatePersonBasedOnLastName().scrollIntoView().should('be.visible')
            case isDuplicateBasedOnDriverLicense:
                potentialDuplicatePersonBasedOnDriverLicenseName().scrollIntoView().should('be.visible')
            default:
                cy.log("No duplicates found.");
        }
        return this;
    };

    verify_Case_Number_is_NOT_populated_on_enabled_input_field() {
        this.toastMessage().should('not.exist');
        caseNumberInput_enabled().should('be.enabled');
        caseNumberInput_enabled().should('have.class', 'ng-empty');
        return this;
    };


    populate_all_fields(personObject, enterCaseNumber = true) {

        this.type_if_values_provided(
            [
                [businessName, personObject.businessName],
                [firstName, personObject.firstName],
                [lastName, personObject.lastName],
                [middleName, personObject.middleName],
                [alias, personObject.alias],
                [driversLicense, personObject.driversLicense],
                [mobilePhone, personObject.mobilePhone],
                [otherPhone, personObject.otherPhone],
                [email, personObject.email],
                [dateOfBirth, personObject.dateOfBirth]
            ]);

        if (enterCaseNumber) this.type_if_value_provided(caseNumberInput_enabled, personObject.caseNumber);
        if (enterCaseNumber && personObject.personType) personType().select(personObject.personType);

        if (personObject.gender) gender().select(personObject.gender);
        if (personObject.race) race().select(personObject.race);

        if (personObject.deceased) deceased().click();
        if (personObject.juvenile) juvenile().click();

        this.define_API_request_to_be_awaited('POST', 'api/people', 'addPerson', 'newPerson')
        return this;
    };

    verify_toast_message_(text, includesRecentCaseNumber = false, timeoutInMinutes = 1) {

        this.verify_toast_message(text)
        this.wait_response_from_API_call('addPerson', 200, 'newPerson')
        return this;
    };

    add_person_address(data){
        addressType().select(data.addressType);
        country().select(data.country);
        address1().type(data.line1)
        address2().type(data.line2)
        city().type(data.city)
        state().select(data.state)
        zip().type(data.zip)
        return this;
    }

    edit_person_address(data){
        addressType().select(data.addressType);
        country().select(data.country);
        address1().clear().type(data.line1)
        address2().clear().type(data.line2)
        city().clear().type(data.city)
        zip().clear().type(data.zip)
        return this;
    }

    verify_added_address(data){
        this.verify_text_is_present_on_main_container(data.addressType)
        this.verify_text_is_present_on_main_container(data.line1)
        this.verify_text_is_present_on_main_container(data.line2)
        this.verify_text_is_present_on_main_container(data.city)
        this.verify_text_is_present_on_main_container(data.zip)
        return this;
    }



}

