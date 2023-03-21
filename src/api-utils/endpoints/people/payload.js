const D = require('../../../fixtures/data.js');

exports.generate_POST_request_payload_for_Add_Person = function () {

    let personData = D.newPerson;
    let addressData = D.newPersonAddress;

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
        address: {
            id: addressData.id,
            date: addressData.date,
            entityId: addressData.entityId,
            line1: addressData.line1,
            line2: addressData.line2,
            city: addressData.city,
            zip: addressData.zip,
            stateId: addressData.stateId,
            addressTypeId: addressData.addressTypeId,
            countryId: addressData.countryId,
            isDefaultAddress: addressData.isDefaultAddress,
        }
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
