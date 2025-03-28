const S = require('../../../fixtures/settings');

exports.generate_POST_request_payload_for_bulk_saving_VIEW_PERMISSIONS = function (group, shouldEnable) {

    let body = [
        // Cases --> modelTypeId = 4
        {
            "id": group.startingIndexForViewPermissions,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1, // view All
            "modelTypeId": 4,
            "grant": shouldEnable,

        },
        {
            "id": group.startingIndexForViewPermissions + 1,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,  // view ifOwner
            "modelTypeId": 4,
            "grant": !shouldEnable,

        },

        // Items --> modelTypeId = 5
        {
            "id": group.startingIndexForViewPermissions + 2,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 5,
            "grant": shouldEnable,

        },
        {
            "id": group.startingIndexForViewPermissions + 3,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 5,
            "grant": !shouldEnable,
        },

        // Media --> modelTypeId = 7
        {
            "id": group.startingIndexForViewPermissions + 4,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 7,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForViewPermissions + 5,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 7,
            "grant": !shouldEnable,
        },

        // Share Media --> modelTypeId = 44
        {
            "id": group.startingIndexForViewPermissions + 6,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 44,
            "grant": shouldEnable
        },

        // Thumbnails --> modelTypeId = 36
        {
            "id": group.startingIndexForViewPermissions + 7,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 36,
            "grant": shouldEnable
        },
        {
            "id": group.startingIndexForViewPermissions + 8,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 36,
            "grant": !shouldEnable,
        },

        // Notes --> modelTypeId = 27
        {
            "id": group.startingIndexForViewPermissions + 9,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 27,
            "grant": shouldEnable
        },
        {
            "id": group.startingIndexForViewPermissions + 10,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 27,
            "grant": !shouldEnable
        },

        // People --> modelTypeId = 11
        {
            "id": group.startingIndexForViewPermissions + 11,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 11,
            "grant": shouldEnable
        },

        // Tasks --> modelTypeId = 14
        {
            "id": group.startingIndexForViewPermissions + 12,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 14,
            "grant": shouldEnable,
        },

        // User Admin --> modelTypeId = 10
        {
            "id": group.startingIndexForViewPermissions + 13,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 10,
            "grant": shouldEnable,
        },

        // Storage Locations --> modelTypeId = 6
        {
            "id": group.startingIndexForViewPermissions + 14,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 6,
            "grant": shouldEnable,
        },

        // AutoDisposition --> modelTypeId = 32
        {
            "id": group.startingIndexForViewPermissions + 15,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 32,
            "grant": shouldEnable,
        },

        // Inventory Reports --> modelTypeId = 34
        {
            "id": group.startingIndexForViewPermissions + 16,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 34,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForViewPermissions + 17,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 34,
            "grant": !shouldEnable,
        },

        // Random Audits --> modelTypeId = 45
        {
            "id": group.startingIndexForViewPermissions + 18,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 45,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForViewPermissions + 19,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 9,
            "modelTypeId": 45,
            "grant": !shouldEnable,
        },

        // Tags --> modelTypeId = 8
        {
            "id": group.startingIndexForViewPermissions + 20,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 8,
            "grant": shouldEnable,
        },

        // Tag Groups--> modelTypeId = 43
        {
            "id": group.startingIndexForViewPermissions + 21,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 1,
            "modelTypeId": 43,
            "grant": shouldEnable,
        }
    ]
    return body;
};

exports.generate_PUT_request_payload_for_setting_specific_permission = function (group, permissionId, modelTypeId, accessType, shouldEnable) {

    let body = {
        "id": permissionId,
        "entityId": S.selectedEnvironment.orgSettings.id,
        "groupId": group.id,
        "accessTypeId": accessType,
        "modelTypeId": modelTypeId,
        "grant": shouldEnable,
    }

    return body;
};

exports.generate_POST_request_payload_for_bulk_saving_CREATE_PERMISSIONS = function (group, shouldEnable) {

    let body = [
        // Cases --> modelTypeId = 4
        {
            "id": group.startingIndexForCreatePermissions,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4, // create
            "modelTypeId": 4,
            "grant": shouldEnable,
        },

        // Items --> modelTypeId = 5
        {
            "id": group.startingIndexForCreatePermissions + 1,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 5,
            "grant": shouldEnable,
        },

        // Media --> modelTypeId = 7
        {
            "id": group.startingIndexForCreatePermissions + 2,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 7,
            "grant": shouldEnable,
        },

        // Share Media --> modelTypeId = 44
        {
            "id": group.startingIndexForCreatePermissions + 3,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 44,
            "grant": shouldEnable,
        },

        // Notes --> modelTypeId = 27
        {
            "id": group.startingIndexForCreatePermissions + 4,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 27,
            "grant": shouldEnable,
        },

        // People --> modelTypeId = 11
        {
            "id": group.startingIndexForCreatePermissions + 5,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 11,
            "grant": shouldEnable,
        },

        // CheckIns --> modelTypeId = 16
        {
            "id": group.startingIndexForCreatePermissions + 6,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 16,
            "grant": shouldEnable,
        },

        // CheckOuts --> modelTypeId = 17
        {
            "id": group.startingIndexForCreatePermissions + 7,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 17,
            "grant": shouldEnable,
        },

        // Disposals --> modelTypeId = 19
        {
            "id": group.startingIndexForCreatePermissions + 8,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 19,
            "grant": shouldEnable,
        },

        // Moves --> modelTypeId = 20
        {
            "id": group.startingIndexForCreatePermissions + 9,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 20,
            "grant": shouldEnable,
        },

        // Transfers --> modelTypeId = 18
        {
            "id": group.startingIndexForCreatePermissions + 10,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 18,
            "grant": shouldEnable,
        },

        // Tasks --> modelTypeId = 14
        {
            "id": group.startingIndexForCreatePermissions + 11,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 14,
            "grant": shouldEnable,
        },

        // User Admin --> modelTypeId = 10
        {
            "id": group.startingIndexForCreatePermissions + 12,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 10,
            "grant": shouldEnable,
        },

        // Storage Locations --> modelTypeId = 6
        {
            "id": group.startingIndexForCreatePermissions + 13,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 6,
            "grant": shouldEnable,
        },

        // AutoDisposition --> modelTypeId = 32
        {
            "id": group.startingIndexForCreatePermissions + 14,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 32,
            "grant": shouldEnable,
        },

        {
            "id": group.startingIndexForCreatePermissions + 15,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 16, // setDispoAction
            "modelTypeId": 32,
            "grant": shouldEnable,
        },

        // Inventory Reports --> modelTypeId = 34
        {
            "id": group.startingIndexForCreatePermissions + 16,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 34,
            "grant": shouldEnable,
        },

        // Random Audits --> modelTypeId = 45
        {
            "id": group.startingIndexForCreatePermissions + 17,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 45,
            "grant": shouldEnable,
        },

        // Imports --> modelTypeId = 35
        {
            "id": group.startingIndexForCreatePermissions + 18,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 35,
            "grant": shouldEnable,
        },

        // Tags --> modelTypeId = 8
        {
            "id": group.startingIndexForCreatePermissions + 19,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 11, // create ORG tags
            "modelTypeId": 8,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForCreatePermissions + 20,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 12, // create GROUP tags
            "modelTypeId": 8,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForCreatePermissions + 21,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 13, // create PERSONAL tags
            "modelTypeId": 8,
            "grant": shouldEnable,
        },

        // Tag Groups --> modelTypeId = 43
        {
            "id": group.startingIndexForCreatePermissions + 22,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4,
            "modelTypeId": 43,
            "grant": shouldEnable,
        }
    ]
    return body;
};

exports.generate_POST_request_payload_for_bulk_saving_UPDATE_PERMISSIONS = function (group, shouldEnable) {

    let body = [
        // Cases --> modelTypeId = 4
        {
            "id": group.startingIndexForUpdatePermissions,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3, // update All
            "modelTypeId": 4,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 1,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14,  // update ifOwner
            "modelTypeId": 4,
            "grant": !shouldEnable,
        },

        {
            "id": group.startingIndexForUpdatePermissions + 2,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 17,  // update Case Officers field
            "modelTypeId": 4,
            "grant": false,
        },

        // Items --> modelTypeId = 5
        {
            "id": group.startingIndexForUpdatePermissions + 3,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 5,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 4,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14,
            "modelTypeId": 5,
            "grant": !shouldEnable,
        },

        // Media --> modelTypeId = 7
        {
            "id": group.startingIndexForUpdatePermissions + 5,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 7,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 6,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14,
            "modelTypeId": 7,
            "grant": !shouldEnable,
        },

        // Share Media --> modelTypeId = 44
        {
            "id": group.startingIndexForUpdatePermissions + 7,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 44,
            "grant": shouldEnable
        },

        // Notes --> modelTypeId = 27
        {
            "id": group.startingIndexForUpdatePermissions + 8,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 27,
            "grant": shouldEnable
        },
        {
            "id": group.startingIndexForUpdatePermissions + 9,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14,
            "modelTypeId": 27,
            "grant": !shouldEnable
        },

        // People --> modelTypeId = 11
        {
            "id": group.startingIndexForUpdatePermissions + 10,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 11,
            "grant": shouldEnable
        },

        // Tasks --> modelTypeId = 14
        {
            "id": group.startingIndexForUpdatePermissions + 11,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 14,
            "grant": shouldEnable,
        },

        // User Admin --> modelTypeId = 10
        {
            "id": group.startingIndexForUpdatePermissions + 12,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 10,
            "grant": shouldEnable,
        },

        // Storage Locations --> modelTypeId = 6
        {
            "id": group.startingIndexForUpdatePermissions + 13,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 6,
            "grant": shouldEnable,
        },

        // AutoDisposition --> modelTypeId = 32
        {
            "id": group.startingIndexForUpdatePermissions + 14,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 32,
            "grant": shouldEnable,
        },

        // Inventory Reports --> modelTypeId = 34
        {
            "id": group.startingIndexForUpdatePermissions + 15,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 34,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 16,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14,
            "modelTypeId": 34,
            "grant": !shouldEnable,
        },

        // Random Audits --> modelTypeId = 45
        {
            "id": group.startingIndexForUpdatePermissions + 17,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 45,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 18,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 14, // ifOwner
            "modelTypeId": 45,
            "grant": !shouldEnable,
        },

        // Tags --> modelTypeId = 8
        {
            "id": group.startingIndexForUpdatePermissions + 19,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5, // detach org tags
            "modelTypeId": 8,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForUpdatePermissions + 20,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 4, // attach org tags
            "modelTypeId": 8,
            "grant": shouldEnable,
        },

        // Tag Groups--> modelTypeId = 43
        {
            "id": group.startingIndexForUpdatePermissions + 21,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 3,
            "modelTypeId": 43,
            "grant": shouldEnable,
        }
    ]
    return body;
};

exports.generate_POST_request_payload_for_bulk_saving_DELETE_PERMISSIONS = function (group, shouldEnable) {
    let body = [
        // MEDIA
        {
            "id": group.startingIndexForDeletePermissions,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 7,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForDeletePermissions + 1,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 15, // delete ifOwner
            "modelTypeId": 7,
            "grant": !shouldEnable,
        },

        // SHARE MEDIA
        {
            "id": group.startingIndexForDeletePermissions + 2,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 44,
            "grant": shouldEnable,
        },

        //NOTES
        {
            "id": group.startingIndexForDeletePermissions + 3,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 27,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForDeletePermissions + 4,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 15, // delete ifOwner
            "modelTypeId": 27,
            "grant": !shouldEnable,
        },

        //
        {
            "id": group.startingIndexForDeletePermissions + 5,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 19,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForDeletePermissions + 6,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 14,
            "grant": shouldEnable,
        },
        {
            "id": group.startingIndexForDeletePermissions + 7,
            "entityId": S.selectedEnvironment.orgSettings.id,
            "groupId": group.id,
            "accessTypeId": 5,
            "modelTypeId": 6,
            "grant": shouldEnable,
        }
    ];
    return body;
};

exports.generate_POST_request_payload_for_assigning_office_based_permissions = function (userId, isOrgAdmin, office1_ID, group1_ID, office2_ID = null, group2_ID = null, office3_ID = null, group3_ID = null) {
    let body = {
        "UserIds": [
            userId
        ],
        "OfficeToGroups": [
            {
                "officeId": office1_ID,
               // "groupIds": [group1_ID]
            }
        ],
        "isOrgAdmin": isOrgAdmin,
        "ExternalUserIdsForRemoval": []
    };

    if (group1_ID) {
        body.OfficeToGroups[0].groupIds = [group1_ID];
    }
// this commented part is an old method and test was failing, so I changed this with a new one
    // if (office2_ID) {
    //     body.OfficeToGroups[1].officeId = office2_ID
    //     body.OfficeToGroups[1].groupIds = [group2_ID]
    // }
    //
    // if (office3_ID) {
    //     body.OfficeToGroups[1].officeId = office3_ID
    //     body.OfficeToGroups[1].groupIds = [group3_ID]
    // }

    if (office2_ID) {
        body.OfficeToGroups.push({
            officeId: office2_ID,
            ...(group2_ID ? { groupIds: [group2_ID] } : {})
        });
    }

    if (office3_ID) {
        body.OfficeToGroups.push({
            officeId: office3_ID,
            ...(group3_ID ? { groupIds: [group3_ID] } : {})
        });
    }

    return body;
};

exports.generate_PUT_request_payload_for_assigning_user_to_User_Group = function (user, group) {
    let body = {
        id: group.id,
        name: group.name,
        description: 'for test automation',
        userIds: [user.id]
    }
    return body;
};

exports.generate_PUT_request_payload_for_assigning_multiple_users_to_User_Group = function (userIdsArray, group) {
    let body = {
        id: group.id,
        name: group.name,
        description: 'for test automation',
        userIds: userIdsArray
    }
    return body;
};


