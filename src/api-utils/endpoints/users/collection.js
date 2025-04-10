const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const C = require('../../../fixtures/constants');
const S = require('../../../fixtures/settings');
const DF = require('../../../support/date-time-formatting');

exports.add_new_user = function (propertyToSave = 'newUser', dataObject) {
    generic_request.POST(
        '/api/users',
        body.generate_POST_request_payload_for_Add_User(dataObject),
        'Adding new user via API with ID_______',
        propertyToSave,
    );
    return this;
};

exports.send_verification_email = function (userObjectNameInLocalStorage) {
    cy.getLocalStorage(userObjectNameInLocalStorage).then(user => {
        generic_request.PUT(
            '/api/users/SendVerificationEmails',
            [JSON.parse(user).id],
            'Sending verification email for the user'
        );
    })
    return this;
};

exports.accept_SLA = function () {
    generic_request.POST(
        '/api/slaacceptances',
        {},
    );
    return this;
};

exports.deactivate_users = function (arrayOfUsersIdsOrObjectsInStorage) {
    let userIds = []
    arrayOfUsersIdsOrObjectsInStorage.forEach((user, index, array) => {
        cy.getLocalStorage(user).then(user => {

            if (user) {
                userIds.push(JSON.parse(user).id)
            } else {
                userIds = arrayOfUsersIdsOrObjectsInStorage
            }

            if (index === (array.length - 1)) {
                generic_request.PUT(
                    '/api/users/DeactivateUsers',
                    userIds,
                    'Deactivating users via API with IDs_______' + userIds
                );
            }
        })
    })
    return this;
};

exports.deactivate_previously_created_user = function () {
    cy.getLocalStorage("newUser").then(newUser => {
        newUser = JSON.parse(newUser) || S.selectedEnvironment.newUser

        generic_request.PUT(
            '/api/users/DeactivateUsers',
            [newUser.id],
            'Deactivating previously created user via API with ID_______' + newUser.id
        );
    });
    return this;
};

exports.remove_external_users = function (arrayOfUsersIdsOrObjectsInStorage) {

    let userIds = []

    arrayOfUsersIdsOrObjectsInStorage.forEach((user, index, array) => {
        cy.getLocalStorage(user).then(user => {

            if (user) {
                userIds.push(JSON.parse(user).id)
            } else {
                userIds = arrayOfUsersIdsOrObjectsInStorage
            }

            if (index === (array.length - 1)) {
                generic_request.POST(
                    '/api/groups/removeExternal',
                    userIds,
                    'Removing external users via API with IDs_______' + userIds
                );
            }
        })
    })
    return this;
};

exports.get_current_user_settings = function (userId) {

    generic_request.GET(
        '/api/users/' + userId + '/userSettings',
        'Getting current user settings via API for user with ID_____' + userId,
        'currentUserSettings'
    );
    return this;
}

exports.update_current_user_settings = function (userObjectFromLocalStorageOrUserId, dateTimeFormat = 'short', dateFormat = 'shortDate') {
    cy.getLocalStorage(userObjectFromLocalStorageOrUserId).then(user => {
        let userId = user ? JSON.parse(user).id : userObjectFromLocalStorageOrUserId
        exports.get_current_user_settings(userId);

        cy.getLocalStorage('currentUserSettings').then(userSettings => {
            cy.getLocalStorage('orgSettings').then(orgSettings => {
                userSettings = JSON.parse(userSettings);
                orgSettings = JSON.parse(orgSettings);


                userSettings.dateFormat = dateFormat.name || dateFormat;
                userSettings.dateTimeFormat = dateTimeFormat.name || dateTimeFormat;

                cy.setLocalStorage("profile", JSON.stringify(
                    {
                        "id": userSettings.id,
                        "organizationId": userSettings.organizationId,
                        "officeId": userSettings.officeId,
                        "dateFormat": userSettings.dateFormat,
                        "dateTimeFormat": userSettings.dateTimeFormat,
                        "useDateFormatOnly": userSettings.useDateFormatOnly,
                        "idle": orgSettings.idle,
                        "timeout": orgSettings.timeout,
                        "isAdmin": userSettings.isAdmin,
                        "showNewUserPopup": true,
                        "signatureConfig": orgSettings.signatureConfiguration,
                        "organizationType": 1
                    }))

                generic_request.PUT(
                    '/api/users/' + userSettings.id + '/updateownprofile',
                    userSettings,
                    'Updating current settings via API for the user with ID_______',
                    'currentUserSettings'
                );
            })
        })
    })

    C.currentDateTimeFormat = DF.dateTimeFormats[dateTimeFormat.name] || DF.dateTimeFormats[dateTimeFormat]
    C.currentDateFormat = DF.dateFormats[dateFormat.name] || DF.dateFormats[dateFormat]

    return this;
}

exports.update_password = function (currentPassword, newPassword) {

    generic_request.POST(
        '/api/users/updatePassword',
        body.generate_POST_request_payload_for_Update_Password(currentPassword, newPassword),
        'Updating password via API for the user with ID_______'
    );
    return this;
}


