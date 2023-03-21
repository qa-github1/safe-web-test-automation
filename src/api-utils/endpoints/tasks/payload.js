const S = require('../../../fixtures/settings.js');
const C = require('../../../fixtures/constants.js');
const userAccounts = require('../../../fixtures/user-accounts.js');

exports.generate_POST_request_payload_for_creating_new_task = function (taskTitle, entityId) {

    let body = {
        "title": taskTitle,
        "message": taskTitle,
        "creatorId": S.selectedUser.id,
        "assignedUserIds": [],
        "assignedGroupIds": [],
        "userGroupIds": [],
        "taskAttachments": [{"taskId": null, "entityId": entityId, "entityType": 0}]
    };
    return body;
};