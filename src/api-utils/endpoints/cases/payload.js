const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_case = function (caseNumber, caseObject) {

    let caseData = caseObject ? Object.assign({}, caseObject) : Object.assign({}, D.newCase);
    caseNumber = caseNumber || caseData.caseNumber;

    let body = {
        caseNumber: caseNumber,
        createdDate: caseData.createdDateIsoFormat,
        reviewDate: caseData.reviewDateIsoFormat,
        active: caseData.active,
        offenseTypeId: caseData.offenseTypeId,
        formData: [],
        reviewDateNotes: caseData.reviewDateNotes,
        checkInProgress: caseData.checkInProgress,
        caseOfficerIds: caseData.caseOfficerIds,
        caseOfficerGroupIds: caseData.caseOfficerGroupIds,
        tags: caseData.tagsForApi,
    };

    body.offenseDate = caseData.offenseDateIsoFormat || undefined
    body.closedDate = caseData.closedDateIsoFormat || undefined
    body.offenseDescription = caseData.offenseDescription || ""
    body.offenseLocation = caseData.offenseLocation || undefined

    return body;
}

exports.generate_PUT_request_payload_for_editing_existing_case = function (existingCase, addCustomFormData) {

    let formData = addCustomFormData ?
        [{
            data: `{
            "${S.selectedEnvironment.caseCustomForm.checkboxListId}":{"1":true},
            "${S.selectedEnvironment.caseCustomForm.radioButtonListId}":"2",
            "${S.selectedEnvironment.caseCustomForm.selectListId}":"3",
            "${S.selectedEnvironment.caseCustomForm.number}":${existingCase.custom_number},
            "${S.selectedEnvironment.caseCustomForm.password}":"${existingCase.custom_password}",
            "${S.selectedEnvironment.caseCustomForm.textbox}":"${existingCase.custom_textbox}",
            "${S.selectedEnvironment.caseCustomForm.email}":"${existingCase.custom_email}",
            "${S.selectedEnvironment.caseCustomForm.textarea}":"${existingCase.custom_textarea}",
            "${S.selectedEnvironment.caseCustomForm.checkbox}":${existingCase.custom_checkbox},
            "${S.selectedEnvironment.caseCustomForm.date}":"${existingCase.custom_date}"}`,
            dateFields: [S.selectedEnvironment.caseCustomForm.date],
            entityId: existingCase.id.toString(),
            formId: S.selectedEnvironment.caseCustomForm.id,
            formName: S.selectedEnvironment.caseCustomForm.name
        }] : [];


   //cy.log('FORM DATA IS ' + JSON.stringify(formData))
    existingCase.createdDate = existingCase.createdDateIsoFormat || undefined
    existingCase.offenseDate = existingCase.offenseDateIsoFormat
    existingCase.followUpDate = existingCase.reviewDateIsoFormat
    existingCase.reviewDate = existingCase.reviewDateIsoFormat

    existingCase.formData = formData;

    let body = {};
    Object.assign(body, existingCase);

   //cy.log('REQUEST BODY IS ' + JSON.stringify(body));

    return body;
};

exports.generate_POST_request_payload_for_CLP = function (CLP_permissionGroup, user, userGroup, office_permissionGroup, isRestricted = true) {

    let CLP_permissionGroupId = CLP_permissionGroup ? CLP_permissionGroup.id : null;
    let userId = user ? user.id : null;
    let userGroupId = userGroup ? userGroup.id : null;
    let office_permissionGroupId = office_permissionGroup ? office_permissionGroup.id : null;

    let body = {
        casePermissionsForGroups: [
            {
                permissionGroup: {
                    id: CLP_permissionGroupId
                },
                permissions: {
                    users: [],
                    userGroups: [],
                    permissionGroups: []
                }
            }
        ],
        isEntityRestricted: isRestricted
    };

    if (userId) {
        body.casePermissionsForGroups[0].permissions.users = [{ id: userId }]
    }
    if (userGroupId) {
        body.casePermissionsForGroups[0].permissions.userGroups = [{ id: userGroupId }]
    }
    if (office_permissionGroupId) {
        body.casePermissionsForGroups[0].permissions.permissionGroups = [{ id: office_permissionGroupId }]
    }
    return body;
}
