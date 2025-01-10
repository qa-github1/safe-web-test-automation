const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_Add_Person = function (personObject) {

    let personData = personObject || Object.assign({}, D.newPerson)
    let addressData = Object.assign({}, D.newPersonAddress)
    addressData.state = null
    addressData.addressType = null
    addressData.country = null

    let body = {
        person: {
            id: personData.id,
            businessName: personData.businessName,
            firstName: personData.firstName,
            middleName: personData.middleName,
            lastName: personData.lastName,
            alias: personData.alias,
            mobilePhone: personData.mobilePhone,
            otherPhone: personData.otherPhone,
            email: personData.email,
            driverLicence: personData.driversLicense,
            raceId: personData.raceId,
            genderId: personData.genderId,
            dob: personData.dateOfBirthForApi,
            active: personData.active,
            deceased: personData.deceased,
            juvenile: personData.juvenile,
            notes: personData.notes,
            formData: personData.formData,
            createdDate: personData.createdDate,
        },
        address: addressData
    };
    return body;
};

exports.generate_POST_request_payload_for_Add_Person_to_Case = function (personId) {

    let body = {
        personId: personId,
        typeId: D.newPerson.personTypeId,
        notes: ""
    };
    return body;
};
