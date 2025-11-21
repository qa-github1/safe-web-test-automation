const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_organization_tag = function (tagObject) {

    let tagData = tagObject ? Object.assign({}, tagObject) : Object.assign({}, D.newTag);

    let body = {
        tagUsedBy:tagData.tagUsedBy,
        tagName: tagData.tagName,
        color: tagData.color,
    };

    return body;
}