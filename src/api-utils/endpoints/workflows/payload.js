const S = require('../../../fixtures/settings.js');
const E = require('../../enums');

exports.generate_POST_request_payload_for_Create_Workflow = function
    (name, type, executionType, user, filter = E.workflowFilters.all, action = E.workflowActions.email) {

    let body = {
        "executionType": executionType,
        "recordSelectionFilter": filter,
        "action": action,
        "name": name,
        "type": type,
        "usersSelected": [
            {
                "userId": user.id
            }
        ]
    };
    return body;
};
