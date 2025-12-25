const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const D = require('../../../fixtures/data');
const S = require('../../../fixtures/settings');
const api = require("../../api-spec");

exports.add_new_case = function (caseNumber, caseObject, stringToStoreInLocalStorage = 'newCase', isCaseNumberAutoAssigned) {
    generic_request.POST(
        '/api/cases',
        body.generate_POST_request_payload_for_creating_new_case(caseNumber, caseObject, isCaseNumberAutoAssigned),
        'Creating new case via API with ID_______',
        stringToStoreInLocalStorage,
    );

    exports.get_most_recent_case();
    return this;
};



// exports.add_custom_form_data_to_existing_case = function (caseObject) {
//     cy.getLocalStorage("newCase").then(newCase => {
//         let existingCase = Object.assign(JSON.parse(newCase), caseObject);
//
//         generic_request.PUT(
//             '/api/cases/' + existingCase.id,
//             body.generate_PUT_request_payload_for_editing_existing_case(existingCase, true),
//             'Adding custom form to the existing case via API with ID_______' + existingCase.id
//         );
//     });
//     return this;
// };

exports.edit_newly_added_case = function (withCustomFormData = true ) {
    cy.getLocalStorage("newCase").then(newCase => {
        let caseObject = Object.assign(JSON.parse(newCase), D.editedCase);
        caseObject.tags = D.editedCase.tagsForApi
        caseObject.closedDate = D.editedCase.closedDateIsoFormat

        generic_request.PUT(
            '/api/cases/' + caseObject.id,
            body.generate_PUT_request_payload_for_editing_existing_case(caseObject, withCustomFormData),
            'Editing existing case via API with ID_______' + caseObject.id
        );
    });
    return this;
};

exports.assign_Case_Level_Permissions = function (CLP_permissionGroup, user, userGroup, office_permissionGroup, caseId) {
    cy.getLocalStorage("newCase").then(newCase => {
        newCase = JSON.parse(newCase);
        caseId = caseId || newCase.id;

        generic_request.POST(
            '/api/cases/' + caseId + '/permissions',
            body.generate_POST_request_payload_for_CLP(CLP_permissionGroup, user, userGroup, office_permissionGroup),
            'Assigning CLP via API')
    });
};

exports.turn_off_Case_Level_Permissions = function (caseId) {
    cy.getLocalStorage("newCase").then(newCase => {
        newCase = JSON.parse(newCase);
        caseId = caseId || newCase.id;

        generic_request.POST(
            '/api/cases/' + caseId + '/permissions',
            body.generate_POST_request_payload_for_CLP(S.selectedEnvironment.admin_permissionGroup, null, null, null, false),
            'Turning OFF CLP via API')
    });
};

exports.get_most_recent_case = function () {
    generic_request.GET(
        '/api/cases/mostRecent',
        'Getting the most recent case via API',
        'recentCase')
};

exports.get_old_case_data = function (oldClosedCaseId) {
    generic_request.GET(
        '/api/cases/' + oldClosedCaseId,
        'Getting the old case data via API',
        'oldClosedCase')
};

exports.quick_case_search = function (caseNumber) {
        generic_request.GET(
            '/api/cases/typeahead?allOffices=true&hideOverlay=true&search=' + caseNumber,
            'Getting the current case data via API',
            'currentCase')
  //  });
};

exports.fetch_updated_data_for_new_case = function () {
    cy.getLocalStorage("newCase").then(newCase => {
        newCase = JSON.parse(newCase);
        let caseId = newCase.id;

        generic_request.GET(
            '/api/cases/' + caseId,
            'Getting the new case data via API',
            'newCase')
    });
};
