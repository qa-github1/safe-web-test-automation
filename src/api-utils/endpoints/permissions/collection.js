const C = require('../../../fixtures/constants');
const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const D = require("../../../fixtures/data");

exports.set_VIEW_permissions_for_an_existing_Permission_group = function (group, shouldEnable) {
    generic_request.POST(
        '/api/security/organizations/bulksave',
        body.generate_POST_request_payload_for_bulk_saving_VIEW_PERMISSIONS(group, shouldEnable),
        "Permissions updated via API")
};

exports.set_CREATE_permissions_for_an_existing_Permission_group = function (group, shouldEnable) {
    generic_request.POST(
        '/api/security/organizations/bulksave',
        body.generate_POST_request_payload_for_bulk_saving_CREATE_PERMISSIONS(group, shouldEnable),
        "Permissions updated via API")
};

exports.set_UPDATE_permissions_for_an_existing_Permission_group = function (group, shouldEnable) {
    generic_request.POST(
        '/api/security/organizations/bulksave',
        body.generate_POST_request_payload_for_bulk_saving_UPDATE_PERMISSIONS(group, shouldEnable),
        "Permissions updated via API")
};

exports.set_DELETE_permissions_for_an_existing_Permission_group = function (group, shouldEnable) {
    generic_request.POST(
        '/api/security/organizations/bulksave',
        body.generate_POST_request_payload_for_bulk_saving_DELETE_PERMISSIONS(group, shouldEnable),
        "Permissions updated via API")
};

function getPermissionId(group, entity, accessType) {
    let id
    // CASES - View
    if (entity === C.perissionMatrixEntity.cases && accessType === C.permissionMatrixAccessType.viewAll) {
        id = group.startingIndexForViewPermissions
    }

    if (entity === C.perissionMatrixEntity.cases && accessType === C.permissionMatrixAccessType.viewIfOwner) {
        id = group.startingIndexForViewPermissions + 1
    }


    // AUTO DISPO - View
    if (entity === C.perissionMatrixEntity.autoDispo && accessType === C.permissionMatrixAccessType.viewAll) {
        id = group.startingIndexForViewPermissions + 15
    }

    // AUTO DISPO - Create
    if (entity === C.perissionMatrixEntity.autoDispo && accessType === C.permissionMatrixAccessType.create) {
        id = group.startingIndexForCreatePermissions + 14
    }
    if (entity === C.perissionMatrixEntity.autoDispo && accessType === C.permissionMatrixAccessType.setDispoAction) {
        id = group.startingIndexForCreatePermissions + 15
    }

    // AUTO DISPO - Update
    if (entity === C.perissionMatrixEntity.autoDispo && accessType === C.permissionMatrixAccessType.updateAll) {
        id = group.startingIndexForUpdatePermissions + 14
    }

    return id
}

exports.set_specific_permission_for_an_existing_Permission_group = function (group, entity, accessType, shouldEnable) {

    let permissionId = getPermissionId(group, entity, accessType)

    generic_request.PUT(
        '/api/security/organizations/' + permissionId,
        body.generate_PUT_request_payload_for_setting_specific_permission(group, permissionId, entity, accessType, shouldEnable),
        "Permissions updated via API")
};

exports.set_CRUD_permissions_for_specific_entity_on_existing_Permission_group = function (group, entity, viewAll, viewIfOwner, create, updateAll, updateIfOwner, setDispoAction, delete_, deleteIfOwner, ) {

    let viewAllPermissionId = getPermissionId(group, entity, C.permissionMatrixAccessType.viewAll)
    let viewIfOwnerPermissionId = getPermissionId(group, entity, C.permissionMatrixAccessType.viewIfOwner)
    let createPermissionId = getPermissionId(group, entity, C.permissionMatrixAccessType.create)
    let updateAllPermissionId = getPermissionId(group, entity, C.permissionMatrixAccessType.updateAll)
    let updateIfOwnerPermissionId = getPermissionId(group, entity, C.permissionMatrixAccessType.updateIfOwner)

    if(viewAll !== null){
        generic_request.PUT(
            '/api/security/organizations/' + viewAllPermissionId,
            body.generate_PUT_request_payload_for_setting_specific_permission(group, viewAllPermissionId, entity, C.permissionMatrixAccessType.viewAll, viewAll),
            "Permissions updated via API")
    }

    if(viewIfOwner !== null){
        generic_request.PUT(
            '/api/security/organizations/' + viewIfOwnerPermissionId,
            body.generate_PUT_request_payload_for_setting_specific_permission(group, viewIfOwnerPermissionId, entity, C.permissionMatrixAccessType.viewIfOwner, viewIfOwner),
            "Permissions updated via API")
    }
    if(create !== null){
        generic_request.PUT(
            '/api/security/organizations/' + createPermissionId,
            body.generate_PUT_request_payload_for_setting_specific_permission(group, createPermissionId, entity, C.permissionMatrixAccessType.create, create),
            "Permissions updated via API")
    }
    if(updateAll !== null){
        generic_request.PUT(
            '/api/security/organizations/' + updateAllPermissionId,
            body.generate_PUT_request_payload_for_setting_specific_permission(group, updateAllPermissionId, entity, C.permissionMatrixAccessType.updateAll, updateAll),
            "Permissions updated via API")
    }
    if(updateIfOwner !== null){
        generic_request.PUT(
            '/api/security/organizations/' + updateIfOwnerPermissionId,
            body.generate_PUT_request_payload_for_setting_specific_permission(group, updateIfOwnerPermissionId, entity, C.permissionMatrixAccessType.updateIfOwner, updateIfOwner),
            "Permissions updated via API")
    }
};

exports.update_ALL_permissions_for_an_existing_Permission_group = function (group, createEnabled, viewEnabled, updateEnabled, deleteEnabled) {
    exports.set_VIEW_permissions_for_an_existing_Permission_group(group, viewEnabled);
    exports.set_CREATE_permissions_for_an_existing_Permission_group(group, createEnabled);
    exports.set_UPDATE_permissions_for_an_existing_Permission_group(group, updateEnabled);
    exports.set_DELETE_permissions_for_an_existing_Permission_group(group, deleteEnabled);
    return this;
};

exports.assign_Org_Admin_permissions_to_user = function (userObjectFromLocalStorageOrId, office1_ID, group1_ID , office2_ID = null, group2_ID = null, office3_ID = null, group3_ID = null) {

    cy.getLocalStorage(userObjectFromLocalStorageOrId).then(user => {
        let userId = user ? JSON.parse(user).id : userObjectFromLocalStorageOrId;

        generic_request.POST(
            '/api/groups/userperms',
            body.generate_POST_request_payload_for_assigning_office_based_permissions(userId, true, office1_ID, group1_ID, office2_ID, group2_ID, office3_ID, group3_ID),
            "Assigning office-based permissions via API")
    })
};

exports.assign_office_based_permissions_to_user = function (userObjectFromLocalStorageOrId, office1_ID, group1_ID, office2_ID = null, group2_ID = null, office3_ID = null, group3_ID = null) {

    cy.getLocalStorage(userObjectFromLocalStorageOrId).then(user => {
        if (user) D.newUser  = Object.assign(D.newUser, JSON.parse(user))
        let userId = user ? JSON.parse(user).id : userObjectFromLocalStorageOrId;
        generic_request.POST(
            '/api/groups/userperms',
            body.generate_POST_request_payload_for_assigning_office_based_permissions(userId, false, office1_ID, group1_ID, office2_ID, group2_ID, office3_ID, group3_ID),
            "Assigning office-based permissions via API")
    })
};

exports.assign_user_to_User_Group = function (user, group) {

    generic_request.PUT(
        '/api/usergroups/editUserGroup',
        body.generate_PUT_request_payload_for_assigning_user_to_User_Group(user, group),
        "Assigning user to User Group via API")
};

exports.assign_multiple_users_to_User_Group = function (userIdsArray, group) {

    generic_request.PUT(
        '/api/usergroups/editUserGroup',
        body.generate_PUT_request_payload_for_assigning_multiple_users_to_User_Group(userIdsArray, group),
        "Assigning user to User Group via API")
};
