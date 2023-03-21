const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_item = function (specificCaseObject, locationObject, newPerson) {

    let itemData = Object.assign({}, D.newItem);

    let caseNumber = specificCaseObject? specificCaseObject.caseNumber : itemData.caseNumber;
    let primaryCaseId = specificCaseObject? specificCaseObject.id : itemData.primaryCaseId;
    let person = (newPerson && newPerson.id) ? newPerson : S.selectedEnvironment.person;
    let locationId = locationObject? locationObject.id : itemData.locationId;

    let body = {
        caseNumber: caseNumber,
        description: itemData.description,
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
        primaryCaseId: primaryCaseId,
        custodyReasonId: itemData.custodyReasonId,
        peopleIds: [person.id],
        tags: itemData.tagsForApi
    };

    if (itemData.tags && itemData.tags[0].name) body.tags = itemData.tags
   //cy.log('New item created with data ' + JSON.stringify(body));
    return body;
};

exports.generate_PUT_request_payload_for_editing_existing_item = function (existingItem, addCustomFormData) {

    let formData = addCustomFormData ?
        [{
            data: `{
            "${S.selectedEnvironment.caseCustomForm.checkboxListId}":{"1":true},
            "${S.selectedEnvironment.itemCustomForm.radioButtonListId}":"2",
            "${S.selectedEnvironment.itemCustomForm.selectListId}":"3",
            "${S.selectedEnvironment.itemCustomForm.number}":${existingItem.custom_number},
            "${S.selectedEnvironment.itemCustomForm.password}":"${existingItem.custom_password}",
            "${S.selectedEnvironment.itemCustomForm.textbox}":"${existingItem.custom_textbox}",
            "${S.selectedEnvironment.itemCustomForm.email}":"${existingItem.custom_email}",
            "${S.selectedEnvironment.itemCustomForm.textarea}":"${existingItem.custom_textarea}",
            "${S.selectedEnvironment.itemCustomForm.checkbox}":${existingItem.custom_checkbox},
            "${S.selectedEnvironment.itemCustomForm.date}":"${existingItem.custom_date}"}`,
            dateFields: [S.selectedEnvironment.itemCustomForm.date],
            entityId: existingItem.id.toString(),
            formId: S.selectedEnvironment.itemCustomForm.id,
            formName: S.selectedEnvironment.itemCustomForm.name
        }] : [];

    existingItem.formData = formData;

    let body = {};
    Object.assign(body, existingItem);

   //cy.log('REQUEST BODY IS ' + JSON.stringify(body));

    return body;
};

