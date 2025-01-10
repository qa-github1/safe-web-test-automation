const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const S = require('../../../fixtures/settings');
const D = require("../../../fixtures/data");
const ui = require('../../../pages/ui-spec');

exports.get_task_templates = function () {
    generic_request.GET(
        '/api/taskTemplates',
        'Getting all task templates via API',
        'allTaskTemplates'
    );
    return this;
};

// exports.delete_task_template = function (taskTemplateId) {
//     generic_request.DELETE(
//         '/api/taskTemplates/' + taskTemplateId,
//         [],
//         'Deleting taskTemplate via API'
//     );
//     return this;
// };

// exports.deactivate_task_template = function (taskTemplateId) {
//     generic_request.PUT(
//         '/api/taskTemplates/activate' + taskTemplateId,
//         [],
//         'Deactivating taskTemplate via API'
//     );
//     return this;
// };

exports.deactivate_task_template = function (taskTemplateId) {
    generic_request.POST(
        '/api/taskTemplates/activate',
        [],
        'Deactivating taskTemplate via API'
    );
    return this;
};

exports.delete_all_task_templates = function () {
    exports.get_task_templates();
    cy.getLocalStorage("allTaskTemplates").then(allTaskTemplates => {
        allTaskTemplates = JSON.parse(allTaskTemplates);

        allTaskTemplates.forEach(function (taskTemplate) {
            if (taskTemplate.id !== S.selectedEnvironment.taskTemplate.otherTaskTemplateId) {
                exports.deactivate_task_template(taskTemplate.id)
            }
        });

    });
    return this;
}

exports.add_new_task_template = function (taskTemplate) {
    generic_request.POST(
        '/api/taskTemplates',
        body.generate_POST_request_payload_for_creating_new_task_template(taskTemplate),
        'Creating new task template via API and saving to local storage __ ',
        'newTaskTemplateId',
    );
    return this;
};

exports. add_new_task = function (taskObject, numberOfItemsAttached) {
    cy.getLocalStorage("newCase").then(newCase => {
            cy.getLocalStorage("newItem").then(newItem => {
                cy.getLocalStorage("newPerson").then(newPerson => {

                    taskObject.attachments = []
                    if (newCase !== 'undefined') {
                        taskObject.attachments.push( {entityId: JSON.parse(newCase).id, entityType: 0, taskId: null})
                    }
                    if (newItem !== 'undefined') {
                        taskObject.attachments.push(  {entityId: JSON.parse(newItem).id, entityType: 1, taskId: null})
                    }
                    if (newPerson !== 'undefined') {
                        taskObject.attachments.push(  {entityId: JSON.parse(newPerson).id, entityType: 2, taskId: null})
                    }

                    for (let i = 0; i < numberOfItemsAttached; i++) {
                        cy.getLocalStorage('item' + i).then(item => {
                            taskObject.attachments.push({entityId: JSON.parse(item).id, entityType: 1, taskId: null})
                        })
                    }
                    ui.app.pause(5)

                    generic_request.POST(
                        '/api/tasks/saveNewTask',
                        body.generate_POST_request_payload_for_creating_new_task(taskObject),
                        'Creating new task via API and saving to local storage __ ',
                        'newTaskId');
            });
        });
    });
    return this;
};

exports.get_my_tasks = function () {
    generic_request.POST(
        '/api/tasks/saveNewTask',
        {
            "pageNumber": 1,
            "sort": "LastActionDate",
            "tasksPerPage": 25,
            "asc": false,
            "search": "",
            "isClosed": false,
            "showItemsTasks": true,
            "taskTypeId": null,
            "taskSubTypeId": null,
            "taskStatus": 1,
            "taskStatuses": [1, 4]
        },
        'Fetching my tasks via API and saving to local storage __ ',
        'myTasks',
    );
    return this;
};
