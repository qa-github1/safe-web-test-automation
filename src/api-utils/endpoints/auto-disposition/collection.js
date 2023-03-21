const generic_request = require('../../generic-api-requests');
const E = require('../../enums');
const body = require('./payload');
const D = require("../../../fixtures/data");

exports.edit = function (enable) {
    generic_request.PUT(
        '/api/autoDisposition/settings',
        body.generate_PUT_request_payload_for_Editing_Auto_Disposition(enable),
        'Editing Auto-Disposition via API'
    );
    return this;
};

