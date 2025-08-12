const generic_request = require('../../generic-api-requests');
const E = require('../../enums');
const body = require('../org-settings/payload');
const D = require("../../../fixtures/data");

exports.edit = function (enable) {
    generic_request.PUT(
        '/api/autoDisposition/settings',
        body.generate_request_payload_for_setting_dispo_config_for_offense_types(enable),
        'Editing Auto-Disposition via API'
    );
    return this;
};

