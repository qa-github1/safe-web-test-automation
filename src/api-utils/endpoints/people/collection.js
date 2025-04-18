const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');

exports.add_new_person = function (addToCase, caseObject, personObject, propertyToSave = 'newPerson') {

    generic_request.POST(
        '/api/people',
        body.generate_POST_request_payload_for_Add_Person(personObject),
        'Adding new person via API with ID_______',
        propertyToSave,
    );

    caseObject = caseObject || S.selectedEnvironment.oldClosedCase;

    cy.getLocalStorage(propertyToSave).then(person => {
        const personObjectFromLocalStorage = JSON.parse(person)

        if (addToCase) {
            if (caseObject.caseNumber === D.newCase.caseNumber) {
                exports.add_person_to_case(personObjectFromLocalStorage, true)
            } else {
                exports.add_person_to_case(personObjectFromLocalStorage, false, false, caseObject.id)
            }
        }
    })
    return this;
};

exports.add_person_to_case = function (personObjectFromLocalStorage, useNewCase, specificPersonId, specificCaseID) {
    cy.getLocalStorage("newCase").then(newCase => {
        specificCaseID = useNewCase ? JSON.parse(newCase).id : specificCaseID;
        specificPersonId = personObjectFromLocalStorage ? personObjectFromLocalStorage.id : specificPersonId;

        generic_request.POST(
            '/api/people/addPersonToCase/' + specificCaseID,
            body.generate_POST_request_payload_for_Add_Person_to_Case(specificPersonId),
            'Adding person to case via API',
        )
    })
};
