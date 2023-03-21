const S = require('../../../fixtures/settings.js');

exports.generate_POST_request_payload_for_Add_Locations = function (locationNameOrArray) {

    let body = Array.isArray(locationNameOrArray) ? locationNameOrArray :
        [{
            "name": locationNameOrArray,
            "active": true,
            "parentId": null,
            "canStoreHere": true
        }]

    return body;
};

exports.generate_POST_request_payload_for_Adding_Groups_to_Locations = function (location, groups) {

    let body = {
        "groupsString": "",
        "count": 20,
        "parentLocationId": null,
        "level": 1,
        "groupsList": [],
        "id": location.id,
        "name": location.name,
        "active": true,
        "barcode": location.barcode,
        "legacyBarcode": null,
        "canStoreHere": true,
        "lineage": "/" + location.id + "/",
        "hasChildren": false,
        "isContainer": false,
        "expanded": false,
        "icon": "glyphicon glyphicon-file",
        "selected": true,
        "parentId": null,
        "groups": [
            // {
            //     "id": groupId,
            //     "name": "Power User",
            //     "description": "Power Users (All except Admin)",
            //     "organizationId": 541,
            //     "organizationName": "Web Test Automation",
            //     "hasUsers": true
            // }
        ]
    }

    if (groups) {
        for (let i = 0; i < groups.length; i++) {
            body.groups[i] = groups[i]
        }
    } else {
        body.groups = []
    }

    return body;
};
