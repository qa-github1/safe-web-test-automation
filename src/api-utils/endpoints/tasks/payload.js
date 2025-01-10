const S = require('../../../fixtures/settings.js');
const D = require("../../../fixtures/data");

exports.generate_POST_request_payload_for_creating_new_task = function (taskObject) {
    taskObject.assignedUserIds = taskObject.assignedUserIds ? taskObject.assignedUserIds : []
    taskObject.assignedGroupIds = taskObject.assignedGroupIds ? taskObject.assignedGroupIds : []

    let body = {
        "taskTemplateId": taskObject.templateId,
        "title": taskObject.title,
        "message": taskObject.message,
        "creatorId": taskObject.creatorId,
        "assignedUserIds": taskObject.assignedUserIds,
        "assignedGroupIds": taskObject.assignedGroupIds,
        "userGroupIds": [],
        "taskAttachments": taskObject.attachments
    };
    return body
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
