const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_Add_User = function (userObject) {

    userObject = D.newUser;

    let body = {
        active: userObject.active,
        email: userObject.email,
        emailDisable: userObject.emailDisable,
        firstName: userObject.firstName,
        groups: [],
        lastName: userObject.lastName,
        middleName: userObject.middleName,
        mobilePhone: userObject.mobilePhone,
        officeId: userObject.officeId,
        organizationId: userObject.organizationId,
        otherphone: userObject.otherPhone,
        note: userObject.note,
        divisionId: userObject.divisionId,
        unitId: userObject.unitId,
        titleId: userObject.titleRankId,
        userSupervisors: userObject.userSupervisorsForApi,
        supervisorIds: userObject.supervisorsIds,
        personFormData: []
    };
    return body;
};

exports.generate_POST_request_payload_for_Update_Password = function (currentPassword, newPassword) {

    let body =
        {
            currentPassword:currentPassword,
            newPassword: newPassword,
            timestamp:"Tue, 31 Aug 2021 11:49:50 GMT",
            timeZone:"&time_zone_offset=-120&time_zone_name=Europe/Berlin"
        };
    return body;
};


