const api = require('../api-utils/api-spec.js');
const D = exports;
const S = require('../fixtures/settings.js');
const C = require('../fixtures/constants.js');
const helper = require('../support/e2e-helper.js');
const {randomNo, getRandomNo} = require("../support/e2e-helper");
const {testRandomNo, newStorageLocation} = require("./data");

D.setNewRandomNo = function () {
    return helper.setNewRandomNo();
};

D.getRandomNo = function (length) {
    return helper.getRandomNo(length);
};

D.randomNo = D.getRandomNo();
D.unreadEmails = []
D.newCase = {}
D.newItem = {}

D.getCurrentDateAndRandomNumber = function (randomNumberLenght) {
    return helper.mediumDate + '_' + helper.getRandomNo(randomNumberLenght);
}

D.getStorageLocationData = function (locationName, parentId = 0, canStore = true, isActive = true) {
    D[locationName] = {
        "name": D.currentDateAndRandomNumber + '_' + locationName,
        "active": isActive,
        "parentId": parentId,
        "canStoreHere": canStore
    }
    return D[locationName]
}

D.getNewCaseData = function (caseNumber, autoDispoOff = false) {
    // api.cases.get_most_recent_case();
    caseNumber = caseNumber || this.setNewRandomNo();

    D.newCase = Object.assign({}, D.newCustomFormData, {
        caseNumber: caseNumber,
        orgAndOffice: S.selectedEnvironment.orgSettings.name + ' / ' + S.selectedEnvironment.office_1.name,
        createdDate: helper.setDateAndTime(C.currentDateTimeFormat.dateOnly),
        closedDate: '',
        createdDateIsoFormat: helper.setIsoDateAndTime(),
        updateMadeBy: S.userAccounts.orgAdmin.name,
        submittedById: S.userAccounts.orgAdmin.id,
        submittedByName: `${S.userAccounts.orgAdmin.firstName} ${S.userAccounts.orgAdmin.lastName}`,
        createdBy: S.userAccounts.orgAdmin.name,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        offenseDate: helper.setDateAndTime(C.currentDateTimeFormat, 2020, 4, 15, 14, 18),
        offenseDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2020, 4, 15, 14, 18),
        offenseDateIsoFormat: helper.setIsoDateAndTime(2020, 4, 15, 14, 18),
        reviewDate: helper.setDateAndTime(C.currentDateTimeFormat, 2029, 5, 11, 15, 25),
        reviewDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2029, 5, 11, 15, 25),
        reviewDateIsoFormat: helper.setIsoDateAndTime(2029, 5, 11, 15, 25),
        status: 'Open',
        active: true,
        offenseDescription: caseNumber,
        offenseTypeId: S.selectedEnvironment.offenseType.id,
        offenseType: S.selectedEnvironment.offenseType.name,
        offenseTypeIdlinkedToRequiredForm1: S.selectedEnvironment.offenseTypelinkedToRequiredForm1.id,
        offenseTypelinkedToRequiredForm1: S.selectedEnvironment.offenseTypelinkedToRequiredForm1.name,
        offenseTypeIdlinkedToRequiredForm2: S.selectedEnvironment.offenseTypelinkedToRequiredForm2.id,
        offenseTypelinkedToRequiredForm2: S.selectedEnvironment.offenseTypelinkedToRequiredForm2.name,
        formData: [],
        tagsForApi: [S.selectedEnvironment.orgTag1],
        tags: ['sensitive information'],
        tagsOnHistory: ['sensitive information'],
        reviewDateNotes: 'reviewNotes_' + caseNumber,
        checkInProgress: false,
        caseOfficerIds: [S.userAccounts.orgAdmin.id],
        caseOfficerGroupIds: [],
        caseOfficer: S.userAccounts.orgAdmin.email,
        caseOfficers: [S.userAccounts.orgAdmin.name],
        caseOfficers_importFormat: S.userAccounts.orgAdmin.guid,
        caseOfficers_names: [S.userAccounts.orgAdmin.name],
        caseOfficerEmail: S.userAccounts.orgAdmin.name,
        caseOfficerName: S.userAccounts.orgAdmin.name,
        caseOfficerFName: S.userAccounts.orgAdmin.firstName,
        caseOfficerLName: S.userAccounts.orgAdmin.lastName,
        caseOfficersAndGroups: [
            S.userAccounts.orgAdmin.name,
            S.userAccounts.powerUser.name,
            S.selectedEnvironment.admin_userGroup.name,
            S.selectedEnvironment.readOnly_userGroup.name],
        offenseLocation: 'Chicago, IL, USA',
        userGuid: S.userAccounts.orgAdmin.guid,
        officeGuid: S.selectedEnvironment.office_1.guid,
        officeName: S.selectedEnvironment.office_1.name,
        mediaCount: 0,
        formsCount: 0
    });

    if (autoDispoOff) {
        D.newCase.closedDate = null
        D.newCase.reviewDate = null
        D.newCase.reviewDateNotes = null
        D.newCase.reviewDateEditMode = null
    }
    return D.newCase;
};

D.getEditedCaseData = function (caseNumber, autoDispoOff = false) {
    // api.cases.get_most_recent_case();
    caseNumber = caseNumber ? caseNumber + '_edited' : D.getRandomNo() + '_edited';

    D.editedCase = Object.assign({}, D.editedCustomFormData, {
        caseNumber: caseNumber,
        orgAndOffice: S.selectedEnvironment.orgSettings.name + ' / ' + S.selectedEnvironment.office_1.name,
        createdDateIsoFormat: helper.setIsoDateAndTime(),
        offenseDate: helper.setDateAndTime(C.currentDateTimeFormat, 2021, 2, 3, 15, 25),
        offenseDateIsoFormat: helper.setIsoDateAndTime(2021, 2, 3, 15, 25),
        offenseDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2021, 2, 3, 15, 25),
        reviewDate: helper.setDateAndTime(C.currentDateTimeFormat, 2022, 4, 5, 16, 26),
        reviewDateIsoFormat: helper.setIsoDateAndTime(2022, 4, 5, 16, 26),
        reviewDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2022, 4, 5, 16, 26),
        closedDate: helper.setDateAndTime(C.currentDateTimeFormat, 2022, 5, 5, 16, 26),
        closedDateIsoFormat: helper.setIsoDateAndTime(2022, 5, 5, 16, 26),
        closedDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2022, 5, 5, 16, 26),
        createdBy: S.userAccounts.orgAdmin.name,
        updateMadeBy: S.userAccounts.orgAdmin.name,
        submittedById: S.userAccounts.orgAdmin.id,
        submittedByName: `${S.userAccounts.orgAdmin.firstName} ${S.userAccounts.orgAdmin.lastName}`,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        officeName: S.selectedEnvironment.office_1.name,
        officeGuid: S.selectedEnvironment.office_1.guid,
        officeId: S.selectedEnvironment.office_1.id,
        status: 'Closed',
        active: false,
        offenseDescription: caseNumber,
        offenseTypeId: S.selectedEnvironment.offenseType2.id,
        offenseType: S.selectedEnvironment.offenseType2.name,
        formData: [],
        tags: [S.selectedEnvironment.orgTag2.name],
        tagsForApi: [S.selectedEnvironment.orgTag2],
        tagsOnHistory: [S.selectedEnvironment.orgTag2.name],
        reviewDateNotes: 'reviewNotes_EDITED_' + caseNumber,
        checkInProgress: false,
        createdDate: S.currentDate,
        caseOfficerIds: [S.userAccounts.powerUser.id],
        caseOfficerGroupIds: [S.selectedEnvironment.readOnly_userGroup.id],
        caseOfficerId: S.userAccounts.powerUser.id,
        caseOfficer: S.userAccounts.powerUser.email,
        caseOfficers: [S.userAccounts.powerUser.name],
        caseOfficers_importFormat: S.userAccounts.powerUser.guid,
        caseOfficers_userGuid: S.userAccounts.powerUser.guid,
        caseOfficers_userGroupId: S.selectedEnvironment.readOnly_userGroup.id,
        caseOfficerName: S.userAccounts.powerUser.name,
        caseOfficerFName: S.userAccounts.powerUser.firstName,
        caseOfficerLName: S.userAccounts.powerUser.lastName,
        offenseLocation: 'Kentucky, USA',
        userGuid: S.userAccounts.powerUser.guid,
        mediaCount: 0,
        formsCount: 0
    });

    if (autoDispoOff) {
        D.editedCase.closedDate = null
        D.editedCase.reviewDate = null
        D.editedCase.reviewDateNotes = null
        D.editedCase.reviewDateEditMode = null
    }
    return D.editedCase;
};

D.getNewItemData = function (specificCaseObject, locationObject, newPerson) {
    let person = (newPerson && newPerson.id !== '') ? newPerson : S.selectedEnvironment.person;
    locationObject = locationObject || S.selectedEnvironment.locations[0];
    specificCaseObject = specificCaseObject || S.selectedEnvironment.oldActiveCase;
    let randomNo = D.setNewRandomNo();

    D.newItem = Object.assign({}, D.newCustomFormData, {
        primaryCaseId: specificCaseObject.id,
        caseNumber: specificCaseObject.caseNumber,
        description: 'description_' + D.getRandomNo(),
        //publicFacingDescription: D.newItem.description,
        status: C.itemStatuses.checkedIn,
        updateMadeBy: S.userAccounts.orgAdmin.lastName,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        active: false,
        categoryId: S.selectedEnvironment.category.id,
        category: S.selectedEnvironment.category.name,
        categoryIdLinkedToRequiredForm1: S.selectedEnvironment.categorylinkedToRequiredForm1.id,
        categoryLinkedToRequiredForm1: S.selectedEnvironment.categorylinkedToRequiredForm1.name,
        categoryIdLinkedToRequiredForm2: S.selectedEnvironment.categorylinkedToRequiredForm2.id,
        categoryLinkedToRequiredForm2: S.selectedEnvironment.categorylinkedToRequiredForm2.name,
        recoveredById: person.id,
        recoveredBy: person.email,
        recoveredByName: person.fullName,
        recoveredByGuid: person.guid,
        custodianGuid: '',
        custodian: '',
        custodianEmail: '',
        submittedByEmail: S.userAccounts.orgAdmin.email,
        submittedByGuid: S.userAccounts.orgAdmin.guid,
        submittedById: S.userAccounts.orgAdmin.id,
        submittedByName: `${S.userAccounts.orgAdmin.firstName} ${S.userAccounts.orgAdmin.lastName}`,
        userGuid: S.userAccounts.orgAdmin.guid,
        submittedBy: S.userAccounts.orgAdmin.lastName,
        recoveryLocation: 'Chicago, IL, USA',
        locationId: locationObject.id,
        location: locationObject.name,
        locationGuid: locationObject.guid,
        recoveryDate: helper.setDateAndTime(C.currentDateTimeFormat, 2024, 3, 5, 17, 27),
        recoveryDate_withoutTime: helper.setDate(C.currentDateTimeFormat.dateOnly, 2024, 3, 5),
        recoveryDate_withoutTime_editMode: helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2024, 3, 5),
        recoveryDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2024, 3, 5, 17, 27),
        recoveryDateInIsoFormat: helper.setIsoDateAndTime(2024, 3, 5, 17, 27),
        createdDate: helper.setDateAndTime(C.currentDateTimeFormat),
        officeGuid: S.selectedEnvironment.office_1.guid,
        officeName: S.selectedEnvironment.office_1.name,
        formData: [],
        cases: [],
        tags: ['sensitive information'],
        tagsOnHistory: ['sensitive information'],
        tagsForApi: [S.selectedEnvironment.orgTag1],
        people: [person],
        make: 'make_' + randomNo,
        model: 'model_' + randomNo,
        serialNumber: 'serialNo_' + randomNo,
        custodyReasonId: S.selectedEnvironment.custodyReason.id,
        custodyReason: S.selectedEnvironment.custodyReason.name,
        peopleIds: [person.id],
        itemBelongsTo: [person.name],
        itemBelongsToEmail: [person.email],
        itemBelongsToFirstLastName: [person.fullName],
        itemBelongsToOnHistory: [person.name],
        itemBelongsToGuid: [person.guid],
        //itemBelongsToEmail: [person.email],
        barcodes: [{id: 0, value: randomNo}],
        additionalBarcodes: [randomNo],
        actualDisposedDate: '',
        disposedDate: '',
        disposalMethod: '',
        disposedByName: '',
        disposalNotes: '',
        disposalUser: S.userAccounts.powerUser.name,
        disposalUserId: S.userAccounts.powerUser.email,
        transactionNotes: 'Item entered into system.',
        checkoutDate: '',
        checkoutReason: '',
        custodian_name: '',
        checkedOutTo_name: '',
        checkedOutNotes: '',
        expectedReturnDate: '',
        customDataType: 'Optional fields - Cypress Item Form - Org #2',
        dispositionStatus: 'Disposed',
        subsetTypePercentage: 'Percentage',
        subsetTypeNumber: 'Number',
        percentageOrNumberOfItems: '1'
    });

    return D.newItem;

};

D.getDisposedItemData = function (newOrEditedItem = 'editedItem') {
    let disposalData = {
        status: 'Disposed',
        dispositionStatus: 'Approved for Disposal',
        location: '',
        locationGuid: '',
        actualDisposedDate: helper.setDateAndTime(C.currentDateTimeFormat, 2020, 5, 5, 17, 27),
        disposedDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        disposedByName: S.userAccounts.orgAdmin.name,
        disposalMethod: S.selectedEnvironment.disposalMethod2.name,
        disposalNotes: 'Note for Disposed Item',
    }

    if (newOrEditedItem === 'editedItem') {
        D.editedItem = Object.assign({}, D.editedItem, disposalData);
    } else {
        D.newItem = Object.assign({}, D.newItem, disposalData);
    }
};

D.getMovedItemData = function (newLocation) {
    let moveData = {
        location: newLocation.name,
        locationGuid: newLocation.guid,
        moveDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        movedBy_name: S.userAccounts.orgAdmin.name,
        moveNotes: 'Note for Moved Item',
    }
    D.editedItem = Object.assign({}, D.editedItem, moveData);
    // D.newItem = Object.assign({}, D.newItem, moveData);
};

D.getCheckedInItemData = function (location) {
    let checkInData = {
        status: 'Checked In',
        location: location.name,
        locationGuid: location.guid,
        checkInDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        returnedByName_name: S.userAccounts.orgAdmin.name,
        checkInNotes: 'Note for Checked In Item',
    }
    D.editedItem = Object.assign({}, D.editedItem, checkInData);
};

D.getCheckedOutItemData = function (itemAddedInCheckedOutStatus = false) {
    let checkOutData = {
        status: 'Checked Out',
        location: '',
        locationGuid: '',
        checkoutDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        checkoutDateImported: helper.setDateAndTime(C.currentDateTimeFormat, 2021, 5, 5, 17, 27),
        checkoutReason: S.selectedEnvironment.checkoutReason.name,
        checkedOutBy_name: S.userAccounts.orgAdmin.name,
        checkedOutBy_guid: S.userAccounts.orgAdmin.guid,
        checkedOutTo_name: S.selectedEnvironment.person.name,
        checkedOutTo_guid: S.selectedEnvironment.person.guid,
        custodian_name: S.selectedEnvironment.person.name,
        custodian_guid: S.selectedEnvironment.person.guid,
        checkedOutNotes: 'Note for Checked Out Item',
        expectedReturnDate: helper.tomorrowsDate(C.currentDateTimeFormat.dateOnly)
    }

    if (itemAddedInCheckedOutStatus) {
        D.newItem = Object.assign({}, D.newItem, checkOutData);
    }
    D.editedItem = Object.assign({}, D.editedItem, checkOutData);
};

D.setDateOnlyValues = function (dateOrDateTimeFormat) {
    D.newItem.recoveryDate = helper.setDate(dateOrDateTimeFormat)
    D.newItem.recoveryDateEditMode = helper.setDate(dateOrDateTimeFormat.dateOnly.editMode)
    D.newCase.offenseDate = helper.setDate(dateOrDateTimeFormat.dateOnly.editMode)
    D.newCase.offenseDateEditMode = helper.setDate(dateOrDateTimeFormat.dateOnly.editMode)
}

D.getEditedItemData = function (specificCaseObject, locationObject, newPerson, randomNo) {
    let Person_1 = S.selectedEnvironment.person;
    let Person_2 = (newPerson && newPerson.id !== '') ? newPerson : S.selectedEnvironment.person_2;
    locationObject = locationObject || S.selectedEnvironment.locations[0];
    specificCaseObject = specificCaseObject || S.selectedEnvironment.oldClosedCase;

    //let randomNo = getRandomNo()
    randomNo = randomNo ?? getRandomNo();
    D.editedItem = Object.assign({}, D.editedCustomFormData, {
        updateMadeBy: S.userAccounts.orgAdmin.name,
        submittedById: S.userAccounts.orgAdmin.id,
        submittedByName: `${S.userAccounts.orgAdmin.firstName} ${S.userAccounts.orgAdmin.lastName}`,
        submittedByEmail: S.userAccounts.orgAdmin.email,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        description: 'desc_edited' + randomNo,
        status: C.itemStatuses.checkedIn,
        active: true,
        categoryId: S.selectedEnvironment.category2.id,
        category: S.selectedEnvironment.category2.name,
        recoveredById: Person_2.id,
        recoveredBy: Person_2.email,
        recoveredByName: Person_2.fullName,
        recoveryLocation: 'Kentucky, USA',
        locationId: locationObject.id,
        location: locationObject.name,
        locationGuid: locationObject.guid,
        recoveryDate: helper.setDateAndTime(C.currentDateTimeFormat, 2021, 5, 8, 15, 25),
        recoveryDateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2021, 5, 8, 15, 25),
        createdDate: helper.setDateAndTime(C.currentDateTimeFormat),
        submittedByGuid: S.userAccounts.orgAdmin.guid,
        userGuid: S.userAccounts.orgAdmin.guid,
        submittedBy: S.userAccounts.orgAdmin.name,
        officeGuid: S.selectedEnvironment.office_1.guid,
        officeName: S.selectedEnvironment.office_1.name,
        recoveredByGuid: Person_2.guid,
        returnedByGuid: Person_2.guid,
        returnedByEmail: Person_2.email,
        custodianGuid: '',
        custodianEmail: '',
        formData: [],
        cases: [],
        tags: ['eligible for disposal'],
        tagsOnHistory: ['eligible for disposal'],
        tagsForApi: [{tagModelId: -1, name: 'eligible for disposal', color: "#4b749b"}],
        make: 'make_edited' + randomNo,
        model: 'model_edited' + randomNo,
        serialNumber: 'serialNo_edited' + randomNo,
        primaryCaseId: specificCaseObject.id,
        caseNumber: specificCaseObject.caseNumber,
        custodyReasonId: S.selectedEnvironment.custodyReason2.id,
        custodyReason: S.selectedEnvironment.custodyReason2.name,
        people: [Person_1, Person_2],
        peopleIds: [Person_2.id],
        peopleGuids: [Person_2.guid],
        peopleNames: [Person_2.fullName],
        itemBelongsTo: [Person_2.name],
        itemBelongsToOnHistory: [Person_2.name],
        itemBelongsToGuid: [Person_2.guid],
        itemBelongsToEmail: [Person_2.email],
        additionalBarcodes: [randomNo + 2],
        actualDisposedDate: '',
        disposedDate: '',
        disposalMethod: '',
        transactionNotes: 'Item entered into system.',
        checkoutDate: '',
        checkinDate: '',
        returnedByName_name: '',
        checkoutReason: '',
        custodian_name: '',
        checkedOutTo_name: '',
        checkedOutNotes: '',
        expectedReturnDate: '',
        publicFacingDescription: D.newItem.description
    });
    return D.editedItem;
};

D.getNewPersonData = function (caseObject) {
    let randomValue = helper.setNewRandomString();
    caseObject = caseObject || S.selectedEnvironment.oldClosedCase;

    D.newPerson = Object.assign({}, D.newCustomFormData, {
        id: 0,
        updateMadeBy: S.userAccounts.orgAdmin.lastName,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        businessName: 'B' + randomValue,
        firstName: 'F' + randomValue,
        middleName: 'M',
        lastName: 'L' + randomValue,
        alias: 'A', //+ randomValue,
        mobilePhone: '+1 434-345-4355',
        otherPhone: '+1 434-345-4356',
        email: 'qa+' + randomValue + '@trackerproducts.com',
        driversLicense: randomValue,
        race: S.selectedEnvironment.race.name,
        gender: 'Male',
        genderId: 3,
        raceId: S.selectedEnvironment.race.id,
        dateOfBirthForApi: '1970-05-10T23:00:00.000Z',
        dateOfBirth: helper.setDate(C.currentDateFormat.editMode, 1970, 5, 11),
        active: true,
        deceased: true,
        juvenile: true,
        notes: [],
        addresses: [],
        formData: [],
        createdDate: S.currentDate,
        caseNumber: caseObject.caseNumber,
        personType: S.selectedEnvironment.personType.name,
        personTypeId: S.selectedEnvironment.personType.id,
        personTypelinkedToRequiredForm1: S.selectedEnvironment.personTypelinkedToRequiredForm1.name,
        personTypeIdlinkedToRequiredForm1: S.selectedEnvironment.personTypelinkedToRequiredForm1.id,
        personTypelinkedToRequiredForm2: S.selectedEnvironment.personTypelinkedToRequiredForm2.name,
        personTypeIdlinkedToRequiredForm2: S.selectedEnvironment.personTypelinkedToRequiredForm2.id
    });

    D.newPersonAddress = {
        id: 0,
        date: '2020-04-11T05:19:49.040Z',
        entityId: 0,
        line1: 'AddressLine1',
        line2: 'AddressLine2',
        city: 'AddressCity',
        zip: 'ZIP_123',
        stateId: C.states.Kentucky.id,
        state: C.states.Kentucky.name,
        addressTypeId: C.addressTypes.home.id,
        addressType: C.addressTypes.home.name,
        countryId: 231,
        country: 'United States',
        isDefaultAddress: true
    };

    return D.newPerson;
};

D.getNewPersonAddressData = function () {
    let randomValue = helper.setNewRandomString();

    D.newPersonAddress = {
        id: 0,
        date: '2020-04-11T05:19:49.040Z',
        entityId: 0,
        line1: 'Address1' + randomValue,
        line2: 'Address2',
        city: 'AddressCity',
        zip: 'ZIP_123',
        stateId: C.states.Kentucky.id,
        state: C.states.Kentucky.name,
        addressTypeId: C.addressTypes.home.id,
        addressType: C.addressTypes.home.name,
        countryId: 231,
        country: 'United States',
        isDefaultAddress: true
    };

    return D.newPersonAddress;
};

D.getEditedPersonData = function () {
    let randomValue = helper.setNewRandomString() + '_ed';

    D.editedPerson = Object.assign({}, D.editedCustomFormData, {
        id: 0,
        updateMadeBy: S.userAccounts.orgAdmin.name,
        updateDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        businessName: randomValue,
        firstName: 'F' + randomValue,
        middleName: 'M' + randomValue,
        lastName: 'L' + randomValue,
        alias: 'A' + randomValue,
        mobilePhone: '+1 434-345-5555',
        otherPhone: '+1 434-345-5556',
        email: 'qa+' + randomValue + '@trackerproducts.com',
        driversLicense: randomValue,
        race: S.selectedEnvironment.race2.name,
        raceId: S.selectedEnvironment.race2.id,
        gender: 'Female',
        genderId: 2,
        dateOfBirth: helper.setDate(C.currentDateFormat.editMode, 1981, 6, 10),
        active: true,
        deceased: false,
        juvenile: false,
        notes: [],
        addresses: [],
        formData: [],
        caseNumber: S.selectedEnvironment.oldClosedCase.caseNumber,
        personType: S.selectedEnvironment.personType2.name,
        personTypeId: S.selectedEnvironment.personType2.id
    });

    D.editedPersonAddress = {
        id: 0,
        date: '2020-04-11T05:19:49.040Z',
        entityId: 0,
        line1: '',
        line2: '',
        city: '',
        zip: '',
        stateId: '',
        addressTypeId: '',
        countryId: 231,
        isDefaultAddress: true
    };

    return D.editedPerson;
};

D.getNewUserData = function (officeId, organizationId) {

    let randomNo = helper.setNewRandomString();
    officeId = officeId || S.selectedEnvironment.office_1.id;
    // organizationId = organizationId || S.selectedEnvironment.organizationId;

    D.newUser = {
        firstName: 'F' + randomNo,
        //middleName: '',
        middleName: 'M' + randomNo,
        lastName: 'L' + randomNo,
        firstLastName: 'F' + randomNo + ' L' + randomNo,
        fullName: 'F' + randomNo + ' ' + 'M' + randomNo + ' ' + 'L' + randomNo,
        personnelNumber: randomNo,
        email: 'qa+' + randomNo + '@trackerproducts.com',
        emailEncoded: 'qa+' + randomNo + '@trackerproducts.&#173;com',
        mobilePhone: '+1 270-543-3333',
        otherPhone: '+1 270-543-4444',
        office: S.selectedEnvironment.office_1.name,
        officeId: officeId,
        // organizationId: organizationId,
        officeGuid: S.selectedEnvironment.office_1.guid,
        active: true,
        password: 'Test12345.',
        note: D.randomNo,
        permissionGroups: [],
        userGroups: [],
        division: 'Patrol',
        divisionId: S.selectedEnvironment.divisions.div1.id,
        unit: 'UnitA',
//        unitId: S.selectedEnvironment.units.div1_unit1.id,
        external: 'Internal',
        mfaEnabled: 'No',
        emailDisable: false,
        emailDisableGridValue: 'No',
        loginCount: 10,
        titleRank: 'Police Officer',
        titleRankId: S.selectedEnvironment.titleRank.id,
        createdDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        supervisors: [S.userAccounts.powerUser.name],
        supervisorsIds: ['user-' + S.userAccounts.powerUser.id],
        userSupervisorsForApi: [{
            SupervisorUserId: S.userAccounts.powerUser.id
        }]

    };

    return D.newUser;
};

D.getEditedUserData = function () {

    let randomNo = helper.setNewRandomString();

    D.editedUser = {
        firstName: 'edit_F' + randomNo,
        middleName: 'edit_M' + randomNo,
        lastName: 'edit_L' + randomNo,
        fullName: 'edit_F' + randomNo + ' ' + 'edit_M' + randomNo + ' ' + 'edit_L' + randomNo,
        personnelNumber: randomNo,
        email: 'qa+edit_' + randomNo + '@trackerproducts.com',
        emailEncoded: 'qa+edit_' + randomNo + '@trackerproducts.&#173;com',
        mobilePhone: '+1 270-543-3344',
        otherPhone: '+1 270-543-4455',
        office: S.selectedEnvironment.office_2.name,
        officeId: S.selectedEnvironment.office_2.id,
        officeGuid: S.selectedEnvironment.office_2.guid,
        active: false,
        password: 'Test12345.',
        note: 'edit_' + randomNo,
        permissionGroups: [],
        userGroups: [],
        division: 'Investigations',
        divisionId: S.selectedEnvironment.divisions.div2.id,
        unit: 'UnitC',
        unitId: S.selectedEnvironment.units.div2_unit3.id,
        external: 'Internal',
        mfaEnabled: 'No',
        emailDisable: true,
        emailDisableGridValue: 'Yes',
        loginCount: 10,
        titleRank: 'Deputy Chief',
        titleRankId: S.selectedEnvironment.titleRank2.id,
        createdDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        supervisors: [S.userAccounts.basicUser.name],
        supervisorsIds: ['user-' + S.userAccounts.basicUser.id],
        userSupervisorsForApi: [{
            SupervisorUserId: S.userAccounts.basicUser.id
        }]

    };
    return D.editedUser;
};

D.getUserData = function (officeId) {
    D.getNewUserData(officeId)
    D.getEditedUserData()
}

D.getStorageLocation = function () {
    let randomNo = helper.setNewRandomString();

    D.newStorageLocation = {
        name: '0-New-L' + ' ' + randomNo,
        items: 0,
        isActive: true,
        legacyBarcode: '',
        parentLocationBarcode: '',
        isContainer: false,
        isStorage: true,
        groups: '',
    },

        D.editedStorageLocation = {
            name: '0-edited' + ' ' + randomNo,
            items: 0,
            isActive: false,
            legacyBarcode: 'new barcode' + ' ' + randomNo,
            parentLocationBarcode: '',
            isContainer: true,
            isStorage: false,
            groups: 'Power User',
            parentMoveLocation: '0 - automation - do not touch',
            parentStorageLocation: '0 - P - don\'t touch',
            newContainerName: 'New C' + ' ' + randomNo,
            moveNote: "note" + ' ' + randomNo
        }
    return newStorageLocation;
};

D.getTagsData = function (type) {
    D.getNewTagsData(type)
    D.getEditedTagsData(type)
}

D.getNewTaskTemplateData = function () {

    D.newTaskTemplate = {
        type: 'Error Correction',
        subtype: 'Packaging and Labeling',
        template: 'Error Correction - Packaging and Labeling',
        title: D.randomNo + '_title',
        message: D.randomNo + '_message',
        taskActions: ['Must be Rendered Safe', 'Package Must be Sealed'],
        dueDateDays: 5
    }

    return D.newTaskTemplate;
};

D.getNewTagsData = function (type = 'Org') {
    let randomNo = helper.setNewRandomString(3,  'mmdd');
    D.newTag = {
        type: type,
        name : `Auto_ ${type}_` + randomNo,
        color: "#4b9",
    }

    D.newTagGroup = {
        name: "_TagGroup_" + randomNo,
        users: [S.userAccounts.orgAdmin],
        userNames: [S.userAccounts.orgAdmin.name],
        userGroups: [S.selectedEnvironment.admin_userGroup],
        userGroupNames: [S.selectedEnvironment.admin_userGroup.name],
        groupTag1: "Auto_GroupTag_" + randomNo,
        groupTag2: "Auto_GroupTag_" + randomNo,
        color: "#4b9",
    }
    return D.newTag;
};

D.getEditedTagsData = function (type = 'Org') {
    let randomNo = helper.setNewRandomString(3,  'mmdd');
    D.editedTag = {
        type: type,
        name : `AutoEdit_ ${type}_` + randomNo,
        color: "#1069bd"
    }

    D.editedTagGroup = {
        name: "Edited TagGroup_" + randomNo,
        users: [S.userAccounts.powerUser],
        userNames: [S.userAccounts.powerUser.name],
        userGroups: [S.selectedEnvironment.readOnly_userGroup],
        userGroupNames: [S.selectedEnvironment.readOnly_userGroup.name],
    }
    return D.editedTag;
};

D.getEditedTaskTemplateData = function (templateId, typeId, subtypeId, taskActionId) {
    templateId = templateId || S.selectedEnvironment.taskTemplates.errorCorrection.templateId
    typeId = typeId || S.selectedEnvironment.taskTemplates.errorCorrection.typeId
    subtypeId = subtypeId || S.selectedEnvironment.taskTemplates.errorCorrection.subtypeId
    taskActionId = taskActionId || S.selectedEnvironment.taskTemplates.errorCorrection.taskActionId

    D.editedTaskTemplate = {
        templateId: templateId,
        typeId: typeId,
        subtypeId: subtypeId,
        taskActionId: taskActionId,
        type: 'Error Correction',
        subtype: 'Packaging and Labeling',
        template: 'Error Correction - Packaging and Labeling',
        title: D.randomNo + '_title',
        message: D.randomNo + '_message',
        taskActions: ['Must be Rendered Safe'],
        dueDateDays: 5,
        isDispositionActionAllowed: false,
        isActionAllowedForType: true,
        tasActionsProperties: [{
            id: taskActionId,
            name: S.selectedEnvironment.taskTemplates.errorCorrection.taskAction,
            organizationId: S.selectedEnvironment.orgSettings.id,
            route: "taskActions",
            reqParams: null,
            restangularized: true,
            fromServer: true,
            parentResource: null,
            restangularCollection: false
        }],
    }

    return D.editedTaskTemplate;
};

D.getNewTaskData = function (user_assignee, userGroup_assignee, createdBy = S.userAccounts.orgAdmin, dueDate_daysAfterToday = 14, linkedObjects) {

    const assignedTo =
        user_assignee && userGroup_assignee ? [user_assignee.name, userGroup_assignee.name] :
            user_assignee && !userGroup_assignee ? [user_assignee.name] :
                !user_assignee && userGroup_assignee ? [userGroup_assignee.name]
                    : 'Unassigned';

    D.newTask = {
        template: 'Other',
        status: 'New',
        state: 'Open',
        creationDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        lastActionDate: helper.setDate(C.currentDateTimeFormat.dateOnly),
        closedDate: '',
        title: 'title_' + helper.setNewRandomString(),
        message: 'message_' + helper.setNewRandomString(),
        userEmail: user_assignee ? user_assignee.email : '',
        userName: user_assignee ? user_assignee.name : '',
        userGroupName: userGroup_assignee ? userGroup_assignee.name : '',
        assignees: user_assignee ? user_assignee.name : userGroup_assignee ? userGroup_assignee.name : '',
        assignedTo: assignedTo,
        linkedObjects: linkedObjects || 'There aren\'t any linked objects',
        createdBy: createdBy ? createdBy.name : null,
        dueDate: helper.getDateAfterXDaysInSpecificFormat(
            C.currentDateTimeFormat.dateOnly.mask,
            dueDate_daysAfterToday
        ),
        dueDate_inEmail: helper.getDateAfterXDaysInSpecificFormat(
            C.currentDateTimeFormat.dateOnly.fullYearMask,
            dueDate_daysAfterToday
        ),
        caseReviewDate: 'N/A',
        caseReviewNotes: 'N/A'
    };
    return D.newTask;
};

D.getCaseValuesOnGrid = function (invisibleColumns) {
    let newCase = Object.assign({}, D.newCase);

    invisibleColumns.forEach(invisibleColumn => {
        dataObject.invisibleColumns = null;
    });

}

D.getCustomFormData = function () {
    D.newCustomFormData = {
        custom_textbox: "custom Textbox",
        custom_email: "customEmail@email.com",
        custom_number: "10",
        custom_password: "Test123",
        custom_textarea: "custom Textarea",
        custom_checkbox: false,
        custom_checkboxListOption: 'Option 1',
        custom_checkboxListOption_apiFormat: {"1": true},
        custom_radiobuttonListOption: 'Option 2',
        custom_radiobuttonListOption_apiFormat: 2,
        custom_selectListOption: 'Option 3',
        custom_selectListOption_apiFormat: 3,
        custom_dropdownTypeaheadOption: 'test1',
        custom_dropdownTypeaheadOption_apiFormat: 1,
        custom_date: helper.setDateAndTime(C.currentDateTimeFormat.dateOnly),
        custom_dateISOFormat: helper.setIsoDateAndTime(),
        custom_date_withoutTime: helper.setDateAndTime(C.currentDateTimeFormat.dateOnly),
        custom_user_email: S.userAccounts.basicUser.email,
        custom_user_or_group_names: [S.userAccounts.basicUser.name],
        custom_userGroup: S.selectedEnvironment.admin_userGroup.name,
        custom_userId: S.userAccounts.basicUser.id,
        custom_userGuid: S.userAccounts.basicUser.guid,
        custom_person: S.selectedEnvironment.person.name,
        custom_personEmail: S.selectedEnvironment.person.email,
        custom_personGuid: S.selectedEnvironment.person.guid,
        custom_personId: S.selectedEnvironment.person.id
    }

    D.newCase = Object.assign(D.newCase, D.newCustomFormData)
    D.newItem = Object.assign(D.newItem, D.newCustomFormData)
}

D.defaultCustomFormData = {
    custom_textbox: "",
    custom_email: "",
    custom_number: "",
    custom_password: "",
    custom_textarea: "",
    custom_checkbox: false,
    custom_checkboxListOption: '',
    custom_radiobuttonListOption: '',
    custom_selectListOption: 'Select an option',
    custom_dropdownTypeaheadOption: '',
    custom_date: '',
    custom_dateEditMode: '',
    custom_date_withoutTime: '',
    custom_dropdownTypeahead: '',
    custom_user_email: '',
    custom_user_name: '',
    custom_userId: '',
    custom_person: '',
    custom_personId: '',
    custom_user_or_group_names: [],
}

D.editedCustomFormData = {
    custom_textbox: "edited custom Textbox",
    custom_email: "editedCustomEmail@email.com",
    custom_number: "333",
    custom_password: "Test12345",
    custom_textarea: "edited custom Textarea",
    custom_checkbox: true,
    custom_checkboxListOption: 'Option 2',
    custom_checkboxListOption_apiFormat: {"2": true},
    custom_radiobuttonListOption: 'Option 3',
    custom_radiobuttonListOption_apiFormat: 3,
    custom_selectListOption: 'Option 1',
    custom_selectListOption_apiFormat: 1,
    custom_dropdownTypeaheadOption: 'test2',
    custom_dropdownTypeaheadOption_apiFormat: 2,
    custom_date: helper.setDateAndTime(C.currentDateTimeFormat, 2028, 6, 3, 15, 25),
    custom_dateISOFormat: helper.setIsoDateAndTime(2028, 6, 3, 15, 25),
    custom_dateEditMode: helper.setDateAndTime(C.currentDateTimeFormat.editMode, 2028, 6, 3, 15, 25),
    custom_date_withoutTime: helper.setDateAndTime(C.currentDateTimeFormat.dateOnly, 2028, 6, 3, 15, 25),
    custom_user_email: S.userAccounts.powerUser.email,
    custom_user_or_group_names: [S.userAccounts.powerUser.name],
    custom_user_or_group_email: [S.userAccounts.powerUser.email],
    custom_userId: S.userAccounts.powerUser.id,
    custom_userGuid: S.userAccounts.powerUser.guid,
    custom_userEmail: S.userAccounts.powerUser.email,
    custom_userGroup: S.selectedEnvironment.readOnly_userGroup.name,
    custom_person: S.selectedEnvironment.person_2.name,
    custom_personGuid: S.selectedEnvironment.person_2.guid,
    custom_personId: S.selectedEnvironment.person_2.id,
    custom_personEmail: S.selectedEnvironment.person_2.email
}

D.removeValuesForDisabledCaseFields = function (enabledFields) {

    let dataObjects = [D.newCase, D.editedCase];

    let caseFields = [
        'offenseLocation',
        'offenseDescription',
        'offenseDate',
        'offenseDateEditMode',
        'tags',
        'tagsOnHistory',
    ]

    dataObjects.forEach(caseObject => {
        caseFields.forEach(field => {
            if (fieldIsDisabled(enabledFields, C.caseFields[field])) caseObject[field] = null;
        })
    });
};

let fieldIsDisabled = function (enabledFields, field) {
    return !enabledFields || (enabledFields && !enabledFields.includes(field))
}

D.removeValuesForDisabledItemFields = function (enabledFields) {

    let dataObjects = [D.newItem, D.editedItem];

    let itemFields = [
        'recoveryDate',
        'recoveryDateEditMode',
        'recoveryDate_withoutTime',
        'recoveredBy',
        'recoveryLocation',
        'recoveredByName',
        'recoveredById',
        'custodyReason',
        'custodyReasonId',
        'make',
        'model',
        'serialNumber',
        'barcodes',
        'description',
        'people',
        'peopleIds',
        'itemBelongsTo',
        'tags',
        'tagsOnHistory',
        'additionalBarcodes',
        'custodian',
        'itemBelongsToOnHistory',
        'barcodes',
    ]

    dataObjects.forEach(itemObject => {

        itemFields.forEach(field => {
            if (fieldIsDisabled(enabledFields, C.itemFields[field])) itemObject[field] = null;
        })
        // if (fieldIsDisabled(enabledFields, C.itemFields.tags)) itemObject.tags[0].name = null;
    });
};

D.removeValuesForCheckoutFields = function (enabledFields) {

    let dataObjects = [D.newItem, D.editedItem];

    let itemFields = [
        'recoveryDate',
        'recoveryDateEditMode',
        'recoveredBy',
        'recoveryLocation',
        'recoveredByName',
        'recoveredById',
        'custodyReason',
        'custodyReasonId',
        'make',
        'model',
        'serialNumber',
        'barcodes',
        'description',
        'people',
        'peopleIds',
        'itemBelongsTo',
        'tags',
        'tagsOnHistory',
        'additionalBarcodes',
        'custodian',
        'itemBelongsToOnHistory',
    ]

    dataObjects.forEach(itemObject => {

        itemFields.forEach(field => {
            if (fieldIsDisabled(enabledFields, C.itemFields[field])) itemObject[field] = null;
        })
        // if (fieldIsDisabled(enabledFields, C.itemFields.tags)) itemObject.tags[0].name = null;
    });
};

D.removeValuesForDisabledPersonFields = function (enabledFields) {

    let dataObjects = [D.newPerson, D.editedPerson];

    let personFields = [
        'businessName',
        'middleName',
        'alias',
        'dateOfBirth',
        'driversLicense',
        'race',
        'gender',
        'mobilePhone',
        'otherPhone',
        'deceased',
        'juvenile',
        'email',
        'addresses'
    ]

    dataObjects.forEach(personObject => {

        personFields.forEach(field => {
            if (fieldIsDisabled(enabledFields, C.personFields[field])) personObject[field] = null;
        })
    });
};

D.removeValuesForOptionalUserFields = function () {

    let dataObjects = [D.newUser];

    let optionalUserFields = [
        'middleName',
        'mobilePhone',
        'otherPhone',
        'note',
        'userGroups',
        'division',
        'unit',
        'titleRank',
        'supervisors'
    ]

    dataObjects.forEach(userObject => {

        optionalUserFields.forEach(field => {
            userObject[field] = '';
        })
    });
};

D.getCaseDataWithReducedFields = function (arrayOfEnabledFields) {
    D.getNewCaseData();
    D.getEditedCaseData();
    D.removeValuesForDisabledCaseFields(arrayOfEnabledFields);
    return D.newCase;
};

D.getItemDataWithReducedFields = function (specificCaseObject, arrayOfEnabledFields) {
    D.getNewItemData(specificCaseObject);
    D.getEditedItemData(specificCaseObject);
    D.removeValuesForDisabledItemFields(arrayOfEnabledFields);
};

D.getPersonDataWithReducedFields = function (specificCaseObject, arrayOfEnabledFields) {
    D.getNewPersonData(specificCaseObject);
    D.getEditedPersonData(specificCaseObject);
    D.removeValuesForDisabledPersonFields(arrayOfEnabledFields);
};

D.generateNewDataSet = function (setNullForDisabledFields = false, autoDispoOff = false, forRequiredFieldsOnly = false) {
    D.setNewRandomNo();
    S.getCurrentDate();
    // api.cases.get_most_recent_case();
    api.cases.get_old_case_data(S.selectedEnvironment.oldClosedCase.id);

    //  D.getCustomFormData()

    D.getNewCaseData(null, autoDispoOff);
    D.getEditedCaseData(null, autoDispoOff);

    D.getNewItemData();
    D.getEditedItemData();

    D.getNewPersonData();
    D.getEditedPersonData();

    D.getNewUserData()

    D.getNewTaskData()
    D.newTask = Object.assign(D.newTask, S.selectedEnvironment.taskTemplates.other)

    D.getCustomFormData()

    if (setNullForDisabledFields) {
        D.removeValuesForDisabledCaseFields();
        D.removeValuesForDisabledItemFields();
        D.removeValuesForDisabledPersonFields();
    }

    if (forRequiredFieldsOnly) {
        D.removeValuesForOptionalUserFields();
    }
};

D.setNewRandomNo();
D.getRandomNo();

D.getDataForMultipleCases = function (numberOfCases, startingIndex = 1) {

    for (let i = startingIndex; i < numberOfCases + startingIndex; i++) {
        D['case' + i] = Object.assign({}, D.getNewCaseData());
    }
}

D.currentDateAndRandomNumber = helper.mediumDate + '_' + helper.getRandomNo(3);



module.exports = D;
