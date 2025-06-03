const D = require('../data');
const S = require('../settings');
const C = require('../constants');
const helper = require('../../support/e2e-helper');

const E = exports;

E.generateCustomFormHeaders = function (formName) {
    return [
        formName + " - Textbox",
        formName + " - Email",
        formName + " - Number",
        formName + " - Password",
        formName + " - Textarea",
        formName + " - Checkbox",
        formName + " - Checkbox List",
        formName + " - Radiobutton List",
        formName + " - Select List",
        formName + " - Date",
        formName + " - Dropdown Typeahead",
        formName + " - User/User Group",
        formName + " - Person",
    ]
};

E.generateCustomValues = function () {
    D.getCustomFormData()
    return [
        D.newCustomFormData.custom_textbox,
        D.newCustomFormData.custom_email,
        D.newCustomFormData.custom_number,
        D.newCustomFormData.custom_password,
        D.newCustomFormData.custom_textarea,
        D.newCustomFormData.custom_checkbox.toString(),
        D.newCustomFormData.custom_checkboxListOption,
        D.newCustomFormData.custom_radiobuttonListOption,
        D.newCustomFormData.custom_selectListOption,
        D.newCustomFormData.custom_date,
        D.newCustomFormData.custom_dropdownTypeaheadOption,
        D.newCustomFormData.custom_userGuid,
        D.newCustomFormData.custom_personGuid,
    ]
};

E.generateDataFor_CASES_Importer = function (arrayOfDataObjects, customFormName, importingCaseUpdates, numberOfRecords, specificMapping) {
    // Set headers for Excel file
    let allFieldHeaders = specificMapping || C.importMappingsWithOutSquareBrackets.allCaseFields

    let minimumFieldsHeaders = [
        "Active",
        "Case Number",
        "CreatorId",
        "CaseOfficerIds",
        "OfficeID",
        "OffenseType",
        "CreatedDate"
    ];

    numberOfRecords = numberOfRecords || arrayOfDataObjects.length

    let customFieldsHeaders = E.generateCustomFormHeaders(customFormName)
    let customFieldsValues = E.generateCustomValues()

    if (customFormName) {
        allFieldHeaders = allFieldHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.caseImportDataWithAllFields = [
        allFieldHeaders,
    ];
    E.caseImportDataWithMinimumFields = [
        minimumFieldsHeaders,
    ];


    // Set values for Excel file
    for (let i = 0; i < numberOfRecords; i++) {

        // set unique case object accessible like D.case2 with ordinal number as a suffix, based on order of data in array of objects
        let j = i + 1

        let caseObject = arrayOfDataObjects[i] || arrayOfDataObjects[0]
        D['case' + j] = Object.assign({}, caseObject);

        if (!importingCaseUpdates) {
            D['case' + j].caseNumber = 'imported_' + caseObject.caseNumber + '_' + j;
            if (caseObject.offenseDescription) D['case' + j].offenseDescription = 'imported_' + caseObject.caseNumber
        }
        let tags = caseObject.tags ? caseObject.tags[0] : ''
        let reviewDate = caseObject.reviewDate || ''
        let closedDate = caseObject.closedDate || ''
        let reviewDateNotes = caseObject.reviewDateNotes || ''

        E.caseImportDataWithAllFields[i + 1] = [
            caseObject.active,
            D['case' + j].caseNumber,
            caseObject.userGuid,
            caseObject.caseOfficers_importFormat,
            caseObject.officeName,
            caseObject.offenseType,
            D['case' + j].offenseDescription,
            caseObject.offenseDate,
            caseObject.offenseLocation,
            tags,
            caseObject.createdDate,
            reviewDate,
            reviewDateNotes,
            closedDate,
        ]

        E.caseImportDataWithMinimumFields[i + 1] = [
            caseObject.active,
            D['case' + j].caseNumber,
            caseObject.userGuid,
            caseObject.caseOfficers_importFormat,
            caseObject.officeGuid,
            caseObject.offenseType,
            caseObject.createdDate
        ]

        if (customFormName) {
            E.caseImportDataWithAllFields[i + 1] = E.caseImportDataWithAllFields[i + 1].concat(customFieldsValues);
            E.caseImportDataWithMinimumFields[i + 1] = E.caseImportDataWithMinimumFields[i + 1].concat(customFieldsValues);
        }

        if (numberOfRecords === 1 && !importingCaseUpdates) {
            D.newCase = Object.assign({}, D['case' + 1]);
        }
    }
}

E.generateDataFor_ITEMS_Importer = function (arrayOfDataObjects, customFormName, importingItemUpdates, numberOfRecords, specificMapping) {
    // Set headers for Excel file
    //this commented part is switched with the one below because we had an issue with files
    //import always used a file from the previous test and that was a reason for failing

    // let allFieldHeaders = specificMapping || C.importMappingsWithOutSquareBrackets.checkedInItemFields
    // let minimumFieldsHeaders = specificMapping || C.importMappingsWithOutSquareBrackets.minimumItemFields
    let allFieldHeaders = [...(specificMapping || C.importMappingsWithOutSquareBrackets.checkedInItemFields)];
    let minimumFieldsHeaders = [...(specificMapping || C.importMappingsWithOutSquareBrackets.minimumItemFields)];

    numberOfRecords = numberOfRecords || arrayOfDataObjects.length

    let customFieldsHeaders = E.generateCustomFormHeaders(customFormName)
    let customFieldsValues = E.generateCustomValues()

    if (customFormName) {
        allFieldHeaders = allFieldHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.itemImportDataWithAllFields = [
        allFieldHeaders,
    ];
    E.itemImportDataWithMinimumFields = [
        minimumFieldsHeaders,
    ];

    // Set values for Excel file
    for (let i = 0; i < numberOfRecords; i++) {

        // set unique item object accessible like D.item2 with ordinal number as a suffix, based on order of data in array of objects
        let j = i + 1

        let itemObject = arrayOfDataObjects[i] || arrayOfDataObjects[0]
        D['item' + j] = Object.assign({}, itemObject);

        if (!importingItemUpdates) {
            D['item' + j].description = itemObject.description ? j + itemObject.description + '__imported on ' + S.currentDate : ''
        }
        let serialNumber = itemObject.serialNumber ? j + itemObject.serialNumber + 'serial_' + S.currentDate : ''
        let additionalBarcode = itemObject.additionalBarcodes ? j + itemObject.additionalBarcodes[0] + S.currentDate : ''
        let tags = itemObject.tags ? itemObject.tags[0] : ''

        E.itemImportDataWithAllFields[i + 1] = [
            D['item' + j].description,
            itemObject.recoveryDate,
            itemObject.recoveryLocation,
            itemObject.location,
            itemObject.status,
            itemObject.category,
            itemObject.custodyReason,
            itemObject.recoveredBy,
            itemObject.submittedByEmail,
            itemObject.custodianGuid,
            itemObject.officeName,
            itemObject.make,
            itemObject.model,
            serialNumber,
            itemObject.createdDate,
            itemObject.caseNumber,
            additionalBarcode,
            itemObject.itemBelongsToEmail,
            tags

        ]

        E.itemImportDataWithMinimumFields[i + 1] = [
            itemObject.caseNumber,
            itemObject.category,
            D['item' + j].description,
            itemObject.location,
            itemObject.status,
            itemObject.officeGuid,
            itemObject.submittedByGuid,
            itemObject.createdDate

        ]

        if (itemObject.barcode) {
            allFieldHeaders.push('ItemBarcode')
            minimumFieldsHeaders.push('ItemBarcode')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.barcode)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.barcode)
        }

        if (itemObject.status === 'Disposed') {
            allFieldHeaders.push('DisposedMethod')
            minimumFieldsHeaders.push('DisposedMethod')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposalMethod)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposalMethod)

            allFieldHeaders.push('DisposedById')
            minimumFieldsHeaders.push('DisposedById')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.submittedByGuid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.submittedByGuid)

            allFieldHeaders.push('DisposalUserId')
            minimumFieldsHeaders.push('DisposalUserId')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposalUserId)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposalUserId)

            allFieldHeaders.push('DisposedDate')
            minimumFieldsHeaders.push('DisposedDate')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposedDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposedDate)

            allFieldHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposalNotes)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposalNotes)

            allFieldHeaders.push('DispositionStatus')
            minimumFieldsHeaders.push('DispositionStatus')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.dispositionStatus)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.dispositionStatus)
        }

        if (itemObject.status === 'Checked Out') {
            allFieldHeaders.push("CheckOutReason")
            minimumFieldsHeaders.push("CheckOutReason")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkoutReason)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkoutReason)

            allFieldHeaders.push("CheckedOutById")
            minimumFieldsHeaders.push("CheckedOutById")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutBy_guid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutBy_guid)

            allFieldHeaders.push("CheckedOutToId")
            minimumFieldsHeaders.push("CheckedOutToId")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutTo_guid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutTo_guid)

            allFieldHeaders.push("CheckedOutDate")
            minimumFieldsHeaders.push("CheckedOutDate")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkoutDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkoutDate)

            allFieldHeaders.push("ExpectedReturnDate")
            minimumFieldsHeaders.push("ExpectedReturnDate")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.expectedReturnDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.expectedReturnDate)

            allFieldHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutNotes)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutNotes)
        }

        // if (itemObject.status === 'Checked In') {
        //     allFieldHeaders.push('Returned By')
        //     minimumFieldsHeaders.push('Returned By')
        //     E.itemImportDataWithAllFields[i + 1].push(itemObject.returnedById)
        //     E.itemImportDataWithMinimumFields[i + 1].push(itemObject.returnedById)
        // }
        if (itemObject.movedBy_name || itemObject.returnedByName_name) {
            allFieldHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')

            if (itemObject.movedBy_name) {
                E.itemImportDataWithAllFields[i + 1].push(itemObject.moveNotes)
                E.itemImportDataWithMinimumFields[i + 1].push(itemObject.moveNotes)
            } else {
                E.itemImportDataWithAllFields[i + 1].push(itemObject.checkInNotes)
                E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkInNotes)
            }
        }

        if (customFormName) {
            E.itemImportDataWithAllFields[i + 1] = E.itemImportDataWithAllFields[i + 1].concat(customFieldsValues);
            E.itemImportDataWithMinimumFields[i + 1] = E.itemImportDataWithMinimumFields[i + 1].concat(customFieldsValues);
        }

        if (numberOfRecords === 1 && !importingItemUpdates) {
            D.newItem = Object.assign({}, D['item' + 1]);
        }
    }
}

E.generateDataFor_PEOPLE_Importer = function (arrayOfDataObjects, customFormName ) {
    // Set headers for Excel file
    let allFieldHeaders = [
        "Person Type",
        "Case Number",
        "BusinessName",
        "FirstName",
        "MiddleName",
        "LastName",
        "Alias",
        "AddressLine1",
        "AddressLine2",
        "AddressCity",
        "AddressState",
        "AddressZip",
        "AddressCountry",
        "AddressType",
        "MobilePhone",
        "OtherPhone",
        "Email",
        "Juvenile",
        "Deceased",
        "Gender",
        "Race",
        "Dob",
        "CreateDate",
        "DriverLicence",
        "Notes",
        "Active"
    ]

    let minimumFieldsHeaders = [
        "Person Type",
        "Case Number",
        "FirstName",
        "LastName",
        "Active",
        "Notes",
    ];

    let customFieldsHeaders = E.generateCustomFormHeaders(customFormName)
    let customFieldsValues = E.generateCustomValues()

    if (customFormName) {
        allFieldHeaders = allFieldHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.peopleImportDataWithAllFields = [
        allFieldHeaders,
    ];
    E.peoplemportDataWithMinimumFields = [
        minimumFieldsHeaders,
    ];

    // Set values for Excel file
    for (let i = 0; i < arrayOfDataObjects.length; i++) {

        let personObject = arrayOfDataObjects[i]
        personObject.firstName = 'imported_' + personObject.firstName + '_' + i;

        E.peopleImportDataWithAllFields[i + 1] = [
            personObject.personType,
            personObject.caseNumber,
            personObject.businessName,
            personObject.firstName,
            personObject.middleName,
            personObject.lastName,
            personObject.alias,
            personObject.line1,
            personObject.line2,
            personObject.city,
            personObject.state,
            personObject.zip,
            personObject.country,
            personObject.addressType,
            personObject.mobilePhone,
            personObject.otherPhone,
            personObject.email,
            personObject.juvenile,
            personObject.deceased,
            personObject.gender,
            personObject.race,
            personObject.dateOfBirth,
            personObject.createdDate,
            personObject.driversLicense,
            personObject.notes,
            personObject.active
        ]

        E.peoplemportDataWithMinimumFields[i + 1] = [
            personObject.personType,
            personObject.caseNumber,
            personObject.firstName,
            personObject.lastName,
            personObject.active,
            personObject.notes,
        ]

        if (personObject.guid) {
            E.peopleImportDataWithAllFields[i + 1].push(personObject.guid)
            E.peoplemportDataWithMinimumFields[i + 1].push(personObject.guid)

            if (!allFieldHeaders.includes('Guid')) allFieldHeaders.push('Guid');
            if (!minimumFieldsHeaders.includes('Guid')) minimumFieldsHeaders.push('Guid');
        }

        if (customFormName) {
            E.peopleImportDataWithAllFields[i + 1] = E.peopleImportDataWithAllFields[i + 1].concat(customFieldsValues);
            E.peoplemportDataWithMinimumFields[i + 1] = E.peoplemportDataWithMinimumFields[i + 1].concat(customFieldsValues);
        }
    }
}

E.locationFieldsHeaders = [
    "Name",
    "Active",
    "LegacyBarcode",
    "ParentLocationBarcode",
    "IsContainer",
    "CanStoreHere",
    "OfficeGuid",
];

E.locationRequiredFieldsHeaders = [
    "Name",
    "OfficeGuid",
];

E.generateDataFor_LOCATIONS_Importer = function (numberOfLocations = 3) {

    E.locationsImportAllFields = [
        E.locationFieldsHeaders
    ];

    E.locationsImportRequiredFields = [
        E.locationRequiredFieldsHeaders
    ];

    E.locationsImportInvalidValues = [
        E.locationFieldsHeaders
    ];

    let randomNo = D.getCurrentDateAndRandomNumber(3)
    E.parentLocation1 = {
        name: 'parent1' + randomNo,
        items: 0,
        isActive: true,
        legacyBarcode: 'parent1' + randomNo,
        parentLocationBarcode: '',
        isContainer: true,
        isStorage: true,
        groups: '',
    }

    E.childLocation1 = {
        name: 'child1' + randomNo,
        items: 0,
        isActive: false,
        legacyBarcode: 'child1' + randomNo,
        parentLocationBarcode: 'parent1' + randomNo,
        isContainer: false,
        isStorage: true,
        groups: '',
    }

    E.childLocation2 = {
        name: 'child2' + randomNo,
        items: 0,
        isActive: false,
        legacyBarcode: 'child2' + randomNo,
        parentLocationBarcode: S.selectedEnvironment.locations[0].guid,
        isContainer: false,
        isStorage: false,
        groups: '',
    }

    E.setLocationImportStructure = function (numberOfLocations) {

        for (let i = 0; i < numberOfLocations; i++) {

            let locationObject = {};

            switch (i) {
                case 0:
                    locationObject = E.parentLocation1
                    break;
                case 1:
                    locationObject = E.childLocation1
                    break;
                case 2:
                    locationObject = E.childLocation2
                    break;
            }

            E.locationsImportAllFields.push([
                locationObject.name,
                locationObject.isActive,
                locationObject.legacyBarcode,
                locationObject.parentLocationBarcode,
                locationObject.isContainer,
                locationObject.isStorage,
                S.selectedEnvironment.office_1.guid
            ])

            E.locationsImportRequiredFields.push([
                E.parentLocation1.name,
                S.selectedEnvironment.office_1.guid
            ])
        }
    };

    E.setLocationImportStructure(numberOfLocations);
};
E.notesFieldsHeaders = [
    "UserGuid",
    "ItemId",
    "CaseNumber",
    "OfficeGuid",
    "Date",
    "Text",
    "ItemGuid"
];

E.generateDataFor_NOTES_Importer = function (caseOrItemObject, barcode, numberOfNotes = 1) {

    let caseNumber = caseOrItemObject.offenseType ? caseOrItemObject.caseNumber : '';

    E.notesWithAllFields = [
        E.notesFieldsHeaders
    ];

    E.notesWithInvalidValues = [
        E.notesFieldsHeaders
    ];

    E.setNotesWithAllFields = function (numberOfNotes) {
        for (let i = 0; i < numberOfNotes; i++) {

            E.notesWithAllFields.push([
                caseOrItemObject.userGuid,
                '',
                caseNumber,
                caseOrItemObject.officeGuid,
                caseOrItemObject.createdDate,
                'imported note_' + D.randomNo,
                barcode
            ])
        }

        E.notesWithInvalidValues.push([
            '',
            S.selectedEnvironment.person.guid,
            '',
            'non-existing case number>>',
            S.selectedEnvironment.person.guid,
            '02032022',
            'imported note_' + D.randomNo,
            S.selectedEnvironment.person.guid,
        ])
    }

    E.setNotesWithAllFields(numberOfNotes);
};

E.generateDataFor_USERS_Importer = function (arrayOfDataObjects) {

    let allFieldHeaders = [
        "FirstName",
        "MiddleName",
        "LastName",
        "Email",
        "MobileNumber",
        "OtherNumber",
        "CreatedDate",
        "LoginCount",
        "Active",
        "Note",
        "OfficeId",
        "Title",
        "Division",
        "Unit",
        "Supervisors"
    ]

    E.userImportDataWithAllFields = [
        allFieldHeaders
    ]

    // Set values for Excel file
    for (let i = 0; i < arrayOfDataObjects.length; i++) {

        let userObject = arrayOfDataObjects[i]
        userObject.email = 'imported_' + i + '_' + userObject.email
        let supervisor = userObject.supervisors ? userObject.supervisors[0] : ''

        E.userImportDataWithAllFields[i + 1] = [
            userObject.firstName,
            userObject.middleName,
            userObject.lastName,
            userObject.email,
            userObject.mobilePhone,
            userObject.otherPhone,
            userObject.createdDate,
            userObject.loginCount,
            userObject.active,
            userObject.note,
            userObject.officeGuid,
            userObject.titleRank,
            userObject.division,
            userObject.unit,
            supervisor
        ]
    }
};

E.generateDataFor_TASKS_Importer = function (itemObject, barcodesArray, numberOfTasks = 1) {

    E.allFieldHeaders = [
        "User",
        "UserGroup",
        "Title",
        "Message",
        "DateCreated",
        "Status",
        "AssignedUsers",
        "UserGroups",
        "TaskAttachments",
        "OfficeId",
        "Notes",
        "NoteText",
        "NoteDate",
        "NoteUser_id"
    ];

    E.setTasksWithAllFields = function (numberOfTasks) {
        E.tasksWithAllFields = [
            E.allFieldHeaders
        ];

        for (let i = 0; i < numberOfTasks; i++) {

            E.tasksWithAllFields.push([
                itemObject.userGuid,
                '',
                'imported task_' + D.randomNo,
                'message_' + D.randomNo,
                S.currentDate,
                'closed',
                itemObject.userGuid,
                '',
                barcodesArray[i],
                itemObject.officeGuid,
            ]);

            E.tasksWithAllFields.push([
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'note_' + D.randomNo,
                S.currentDate,
                itemObject.userGuid
            ])
        }
    }
    E.setTasksWithAllFields(numberOfTasks);
}

E.CoCFieldsHeaders =
    [
        "ItemId",
        "Type",
        "IssuedFrom",
        "IssuedTo",
        "Location",
        "CustodyId",
        "LogNum",
        "ItemNum",
        "Office",
        "Notes",
        "TransactionDate",
        "TransactionActivityDate",
        "Signature",
        "ItemGuid",
    ]

E.generateDataFor_CoC_Importer = function (itemObject, barcode, numberOfEntries = 1) {

    E.setCoCWithAllFields = function (numberOfEntries) {
        E.chainOfCustodyWithAllFields = [
            E.CoCFieldsHeaders
        ];

        E.chainOfCustodyWithInvalidValues = [
            E.CoCFieldsHeaders
        ];

        let transactionDate = S.currentDate;
        let transactionActivityDate = S.currentDate;
        let dateTimeFormat = C.currentDateTimeFormat

        for (let i = 0; i < numberOfEntries; i++) {

            if (i === 1) {
                itemObject.status = C.itemStatuses.checkedOut
                transactionDate = helper.setDateAndTime(dateTimeFormat, 2014, 5, 14, 10, 4)
                transactionActivityDate = helper.setDateAndTime(dateTimeFormat, 2012, 3, 12, 15, 23)
            }

            if (i === 2) {
                itemObject.status = C.itemStatuses.disposed
                transactionDate = helper.setDateAndTime(dateTimeFormat, 2014, 6, 17, 9, 23)
                transactionActivityDate = helper.setDateAndTime(dateTimeFormat, 2011, 5, 11, 5, 23)
            }

            if (i === 3) {
                itemObject.status = C.itemStatuses.checkedIn
                transactionDate = helper.setDateAndTime(dateTimeFormat, 2016, 9, 16, 4, 34)
                transactionActivityDate = helper.setDateAndTime(dateTimeFormat, 2001, 6, 10, 11, 10)
            }

            if (i === 4) {
                itemObject.status = 'test'
                transactionDate = helper.setDateAndTime(dateTimeFormat, 2017, 9, 16, 12, 2)
                transactionActivityDate = helper.setDateAndTime(dateTimeFormat, 2008, 7, 9)
            }

            E.chainOfCustodyWithAllFields.push(
                [
                    '',
                    itemObject.status,
                    'Legacy RecoveredBy',
                    'Legacy Person',
                    'Legacy Location',
                    12,
                    123,
                    456,
                    'Legacy Office',
                    'Legacy Note',
                    transactionDate,
                    transactionActivityDate,
                    '',
                    barcode
                ])
        }

        E.chainOfCustodyWithInvalidValues.push([
            '',
            '1',
            '1',
            '1',
            '1',
            '1',
            '1',
            '1',
            '1',
            '1',
            '1.3.2022',
            '1.3.2022',
            '1',
            'invalidBarcode'
        ])
    }

    E.setCoCWithAllFields(numberOfEntries);
}

E.generateDataFor_MEDIA_Importer = function (caseOrItemObject, barcode) {
    E.mediaWithAllFields = [
        [
            "MediaId",
            "PresentFileName",
            "OriginalFileName",
            "MediaSize",
            "Hash",
            "UploadUserGuid",
            "UploadDate",
            "Active",
            "isDeleted",
            "CaseNumber",
            "ItemGuid",
            "Thumbnail",
            "isVideo",
            "Description",
            "Category",
            "OfficeId"
        ],
        [
            D.randomNo,
            'importedMedia.png',
            'importedMedia.png',
            75767,
            '1D7EAC25356A389119C36BB3197B2E1D',
            caseOrItemObject.userGuid,
            S.currentDate,
            true,
            false,
            caseOrItemObject.caseNumber,
            barcode,
            '',
            false,
            D.randomNo,
            'Sensitive',
            caseOrItemObject.officeGuid
        ],
    ];
}

E.wronglyFormattedValues = [
    '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$',
];


module.exports = E;
