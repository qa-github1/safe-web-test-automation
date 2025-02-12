const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_creating_new_item = function (specificCaseObject, locationObject, newPerson) {

    let itemData = Object.assign({}, D.newItem);

    let caseNumber = specificCaseObject? specificCaseObject.caseNumber : itemData.caseNumber;
    let primaryCaseId = specificCaseObject? specificCaseObject.id : itemData.primaryCaseId;
    let person = (newPerson && newPerson.id) ? newPerson : S.selectedEnvironment.person;
    let locationId = locationObject? locationObject.id : itemData.locationId;
    let randomNo = D.setNewRandomNo();


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
        barcodes: [{id:0 , value: randomNo}],
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

exports.generate_PUT_request_payload_for_editing_existing_item = function (itemObject, addCustomFormData) {

    let formData = addCustomFormData ?
        [{
            data: `{
            "${S.selectedEnvironment.itemCustomForm.checkboxListId}":${JSON.stringify(itemObject.custom_checkboxListOption_apiFormat)},
            "${S.selectedEnvironment.itemCustomForm.radioButtonListId}":"${itemObject.custom_radiobuttonListOption_apiFormat}",
            "${S.selectedEnvironment.itemCustomForm.selectListId}":"${itemObject.custom_selectListOption_apiFormat}",
            "${S.selectedEnvironment.itemCustomForm.number}":${itemObject.custom_number},
            "${S.selectedEnvironment.itemCustomForm.password}":"${itemObject.custom_password}",
            "${S.selectedEnvironment.itemCustomForm.textbox}":"${itemObject.custom_textbox}",
            "${S.selectedEnvironment.itemCustomForm.email}":"${itemObject.custom_email}",
            "${S.selectedEnvironment.itemCustomForm.textarea}":"${itemObject.custom_textarea}",
            "${S.selectedEnvironment.itemCustomForm.user}":"user-${itemObject.custom_userId}",
            "${S.selectedEnvironment.itemCustomForm.person}":${itemObject.custom_personId},
            "${S.selectedEnvironment.itemCustomForm.dropdownTypeahead}":${itemObject.custom_dropdownTypeaheadOption_apiFormat},
            "${S.selectedEnvironment.itemCustomForm.checkbox}":"${itemObject.custom_checkbox}",
            "${S.selectedEnvironment.itemCustomForm.date}":"${itemObject.custom_dateISOFormat}"}`,
            dateFields: [S.selectedEnvironment.itemCustomForm.date],
            entityId: itemObject.id.toString(),
            formId: S.selectedEnvironment.itemCustomForm.id,
            formName: S.selectedEnvironment.itemCustomForm.name
        }] : [];

    itemObject.formData = formData;

    let body = {};
    Object.assign(body, itemObject);
    body.primaryCaseId

   //cy.log('REQUEST BODY IS ' + JSON.stringify(body));

    return body;
};

