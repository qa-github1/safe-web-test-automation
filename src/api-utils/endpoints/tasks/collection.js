const generic_request = require('../../generic-api-requests');
const body = require('./payload');

exports.add_new_task = function (taskTitle) {
    generic_request.POST(
        '/api/tasks/saveNewTask',
        body.generate_POST_request_payload_for_creating_new_task(taskTitle),
        'Creating new task via API and saving to local storage __ ',
        'newTaskId',
    );
    return this;
};
