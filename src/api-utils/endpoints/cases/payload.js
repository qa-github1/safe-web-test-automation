const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_case = function (caseNumber, caseObject, isCaseNumberAutoAssigned = false) {

    let caseData = caseObject ? Object.assign({}, caseObject) : Object.assign({}, D.newCase);
    caseNumber = caseNumber || caseData.caseNumber;

    let body = {
       // caseNumber: caseNumber,
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

    if (!isCaseNumberAutoAssigned) {
        body.caseNumber =  caseNumber
    }

    body.offenseDate = caseData.offenseDateIsoFormat || undefined
    body.closedDate = caseData.closedDateIsoFormat || undefined
    body.offenseDescription = caseData.offenseDescription || ""
    body.offenseLocation = caseData.offenseLocation || undefined

    return body;
}

exports.generate_PUT_request_payload_for_editing_existing_case = function (caseObject, addCustomFormData) {

    let formData = addCustomFormData ?
        [{
            data: `{
            "${S.selectedEnvironment.caseOptionalCustomForm.checkboxListId}":${JSON.stringify(caseObject.custom_checkboxListOption_apiFormat)},
            "${S.selectedEnvironment.caseOptionalCustomForm.radioButtonListId}":"${caseObject.custom_radiobuttonListOption_apiFormat}",
            "${S.selectedEnvironment.caseOptionalCustomForm.selectListId}":"${caseObject.custom_selectListOption_apiFormat}",
            "${S.selectedEnvironment.caseOptionalCustomForm.number}":${caseObject.custom_number},
            "${S.selectedEnvironment.caseOptionalCustomForm.password}":"${caseObject.custom_password}",
            "${S.selectedEnvironment.caseOptionalCustomForm.textbox}":"${caseObject.custom_textbox}",
            "${S.selectedEnvironment.caseOptionalCustomForm.email}":"${caseObject.custom_email}",
            "${S.selectedEnvironment.caseOptionalCustomForm.textarea}":"${caseObject.custom_textarea}",
            "${S.selectedEnvironment.caseOptionalCustomForm.user}":"user-${caseObject.custom_userId}",
            "${S.selectedEnvironment.caseOptionalCustomForm.person}":${caseObject.custom_personId},
            "${S.selectedEnvironment.caseOptionalCustomForm.dropdownTypeahead}":${caseObject.custom_dropdownTypeaheadOption_apiFormat},
            "${S.selectedEnvironment.caseOptionalCustomForm.checkbox}":"${caseObject.custom_checkbox}",
            "${S.selectedEnvironment.caseOptionalCustomForm.date}":"${caseObject.custom_dateISOFormat}"}`,
            dateFields: [S.selectedEnvironment.caseOptionalCustomForm.date],
            entityId: caseObject.id.toString(),
            formId: S.selectedEnvironment.caseOptionalCustomForm.id,
            formName: S.selectedEnvironment.caseOptionalCustomForm.name
        }] : [];

    caseObject.formData = formData;

    let body = {};
    caseObject.createdDate = caseObject.createdDateIsoFormat || undefined
    caseObject.offenseDate = caseObject.offenseDateIsoFormat
    caseObject.followUpDate = caseObject.reviewDateIsoFormat
    caseObject.reviewDate = caseObject.reviewDateIsoFormat

    Object.assign(body, caseObject);
   cy.log('REQUEST BODY IS ' + JSON.stringify(body));
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
