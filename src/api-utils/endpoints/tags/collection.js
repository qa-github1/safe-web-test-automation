const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const D = require('../../../fixtures/data');
const S = require('../../../fixtures/settings');
const api = require("../../api-spec");

exports.add_new_organization_tag = function (tagObject) {
    generic_request.POST(
        '/api/tagModels',
        body.generate_POST_request_payload_for_creating_new_organization_tag(tagObject),
        'Creating new Organization Tag via API with ID_______',
        'newOrganizationTag',
    );

   // exports.get_most_recent_case();
    return this;
};