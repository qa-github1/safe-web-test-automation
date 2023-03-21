const generic_request = require('../../generic-api-requests');
const E = require('../../enums');
const body = require('./payload');

exports.get_workflows = function () {
    generic_request.GET(
        '/api/workflows',
        'Getting all workflows via API',
        'allWorkflows'
    );
    return this;
};

exports.delete_workflow = function (workflowId) {
    generic_request.DELETE(
        '/api/workflows/' + workflowId,
        [],
        'Deleting workflow via API'
    );
    return this;
};

exports.delete_all_workflows= function () {
    exports.get_workflows();
    cy.getLocalStorage("allWorkflows").then(allWorkflows => {
        allWorkflows = JSON.parse(allWorkflows);

        allWorkflows.forEach(function (workflow) {
            exports.delete_workflow(workflow.id)
        });

    });
    return this;
}

exports.create_workflow = function (name, type, executionType, user, filter = E.workflowFilters.all, action = E.workflowActions.email) {
    generic_request.POST(
        '/api/workflows',
        body.generate_POST_request_payload_for_Create_Workflow
        (name, type, executionType, user, filter = E.workflowFilters.all, action = E.workflowActions.email),
        'Adding new workflow via API'
    );
    return this;
};



