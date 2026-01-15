const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_item = function (itemObject, specificCaseObject, locationObject, newPerson) {

    let itemData = itemObject ? Object.assign({}, itemObject) : Object.assign({}, D.newItem);

    let caseNumber = specificCaseObject? specificCaseObject.caseNumber : itemData.caseNumber;
    let primaryCaseId = specificCaseObject? specificCaseObject.id : itemData.primaryCaseId;
    let person = (newPerson && newPerson.id) ? newPerson : S.selectedEnvironment.person;
    let locationId = locationObject? locationObject.id : itemData.locationId;
    let randomNo = D.setNewRandomNo();


    let body = {
        caseNumber: caseNumber,
        description: itemData.description,
        publicFacingDescription: itemData.description,
        active: itemData.active,
        categoryId: itemData.categoryId,
        recoveredById: person.id,
        recoveryLocation: itemData.recoveryLocation,
        locationId: locationId,
        recoveryDate: itemData.recoveryDateInIsoFormat,
        createdDate: itemData.createdDate,
        barcodes: itemData.barcodes,
        formData: itemData.formData,
        cases: itemData.cases,
        people: [person],
        make: itemData.make,
        model: itemData.model,
        serialNumber: itemData.serialNumber,
        additionalBarcodes: [randomNo],
        primaryCaseId: primaryCaseId,
        custodyReasonId: itemData.custodyReasonId ?? 0,
        peopleIds: [person.id],
        tags: itemData.tagsForApi,
        containerModel: itemData.containerModel,
    };

    if (itemData.tags && itemData.tags[0].name) body.tags = itemData.tags
   //cy.log('New item created with data ' + JSON.stringify(body));
    return body;
};

exports.generate_PUT_request_payload_for_editing_existing_item = function (itemObject, addCustomFormData) {

    let formData = addCustomFormData ?
        [{
            data: `{
            "${S.selectedEnvironment.itemOptionalCustomForm.checkboxListId}":${JSON.stringify(itemObject.custom_checkboxListOption_apiFormat)},
            "${S.selectedEnvironment.itemOptionalCustomForm.radioButtonListId}":"${itemObject.custom_radiobuttonListOption_apiFormat}",
            "${S.selectedEnvironment.itemOptionalCustomForm.selectListId}":"${itemObject.custom_selectListOption_apiFormat}",
            "${S.selectedEnvironment.itemOptionalCustomForm.number}":${itemObject.custom_number},
            "${S.selectedEnvironment.itemOptionalCustomForm.password}":"${itemObject.custom_password}",
            "${S.selectedEnvironment.itemOptionalCustomForm.textbox}":"${itemObject.custom_textbox}",
            "${S.selectedEnvironment.itemOptionalCustomForm.email}":"${itemObject.custom_email}",
            "${S.selectedEnvironment.itemOptionalCustomForm.textarea}":"${itemObject.custom_textarea}",
            "${S.selectedEnvironment.itemOptionalCustomForm.user}":"user-${itemObject.custom_userId}",
            "${S.selectedEnvironment.itemOptionalCustomForm.person}":${itemObject.custom_personId},
            "${S.selectedEnvironment.itemOptionalCustomForm.dropdownTypeahead}":${itemObject.custom_dropdownTypeaheadOption_apiFormat},
            "${S.selectedEnvironment.itemOptionalCustomForm.checkbox}":${itemObject.custom_checkbox},
            "${S.selectedEnvironment.itemOptionalCustomForm.date}":"${itemObject.custom_dateISOFormat}"}`,
            dateFields: [S.selectedEnvironment.itemOptionalCustomForm.date],
            entityId: itemObject.id.toString(),
            formId: S.selectedEnvironment.itemOptionalCustomForm.id,
            formName: S.selectedEnvironment.itemOptionalCustomForm.name
        }] : [];

    itemObject.formData = formData;

    let body = {};
    Object.assign(body, itemObject);
    body.primaryCaseId

   //cy.log('REQUEST BODY IS ' + JSON.stringify(body));

    return body;
};

