const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const S = require('../../../fixtures/settings');

exports.get_task_templates = function () {
    generic_request.GET(
        '/api/taskTemplates',
        'Getting all task templates via API',
        'allTaskTemplates'
    );
    return this;
};

exports.delete_task_template = function (taskTemplateId) {
    generic_request.DELETE(
        '/api/taskTemplates/' + taskTemplateId,
        [],
        'Deleting taskTemplate via API'
    );
    return this;
};

exports.delete_all_task_templates = function () {
    exports.get_task_templates();
    cy.getLocalStorage("allTaskTemplates").then(allTaskTemplates => {
        allTaskTemplates = JSON.parse(allTaskTemplates);

        allTaskTemplates.forEach(function (taskTemplate) {
            if (taskTemplate.id !== S.selectedEnvironment.taskTemplate.otherTaskTemplateId) {
                exports.delete_task_template(taskTemplate.id)
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

exports.add_new_task = function (taskTitle) {
    generic_request.POST(
        '/api/tasks/saveNewTask',
        body.generate_POST_request_payload_for_creating_new_task(taskTitle),
        'Creating new task via API and saving to local storage __ ',
        'newTaskId',
    );
    return this;
};
