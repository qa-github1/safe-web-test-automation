import BaseAddPage from "../base-pages/base-add-page";

const C = require ('../../fixtures/constants')
import BasePage from "../base-pages/base-page";

let
    caseNumberInput_enabled = e => cy.get('[typeahead="l as l.text for l in getObject($viewValue) | limitTo: 10"]'),
    personType = e => cy.get('[ng-model="case.person.typeId"]'),
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
    dateOfBirth = e => cy.get('.ibox-content').contains('Date of Birth').parent('div').find('input'),
    deceased = e => cy.get('.iCheck-helper').eq(0),
    juvenile = e => cy.get('.iCheck-helper').eq(1),
    addPersonHeader = e => cy.get('[translate="PEOPLE.HEADING_ADD"]'),
    toastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout})

//************************************ ELEMENTS ***************************************//

export default class AddPersonPage extends BaseAddPage{

    constructor() {
        super();
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


}

