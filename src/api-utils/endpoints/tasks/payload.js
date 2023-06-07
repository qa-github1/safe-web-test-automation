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

exports.generate_POST_request_payload_for_creating_new_task_template = function (taskTemplate) {

    let body = {
        "taskTypeId": S.selectedEnvironment.taskTemplate.taskTypeId.errorCorrection,
        "taskSubTypeId": S.selectedEnvironment.taskTemplate.taskSubTypeId.packagingAndLabeling,
        "title": taskTemplate.title,
        "message": taskTemplate.message,
        "dueDays": taskTemplate.dueDateDays,
        "taskActions": [
            {
                "id": S.selectedEnvironment.taskTemplate.taskActionId.packageMustBeSealed,
                "name": "Package Must be Sealed",
                "organizationId": S.selectedEnvironment.orgSettings.id,
                "route": "taskActions",
                "reqParams": null,
                "restangularized": true,
                "fromServer": true,
                "parentResource": null,
                "restangularCollection": false
            },
            {
                "id": S.selectedEnvironment.taskTemplate.taskActionId.mustBeRenderedSafe,
                "name": "Must be Rendered Safe",
                "organizationId": S.selectedEnvironment.orgSettings.id,
                "route": "taskActions",
                "reqParams": null,
                "restangularized": true,
                "fromServer": true,
                "parentResource": null,
                "restangularCollection": false
            }]
    }
    return body;
};
