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

E.generateDataFor_CASES_Importer = function (arrayOfDataObjects, customFormName, importingCaseUpdates) {
    // Set headers for Excel file
    let allFieldsHeaders = [
        "Active",
        "CaseNumber",
        "CreatorId",
        "CaseOfficerIds",
        "OfficeID",
        "OffenseType",
        "OffenseDescription",
        "OffenseDate",
        "OffenseLocation",
        "Tags",
        "createdDate",
        "ReviewDate",
        "ReviewDateNotes"
    ]
    let minimumFieldsHeaders = [
        "Active",
        "CaseNumber",
        "CreatorId",
        "CaseOfficerIds",
        "OfficeID",
        "OffenseType",
        "CreatedDate"
    ];

    let customFieldsHeaders = E.generateCustomFormHeaders(customFormName)
    let customFieldsValues = E.generateCustomValues()

    if (customFormName) {
        allFieldsHeaders = allFieldsHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.caseImportDataWithAllFields = [
        allFieldsHeaders,
    ];
    E.caseImportDataWithMinimumFields = [
        minimumFieldsHeaders,
    ];

    // Set values for Excel file
    for (let i = 0; i < arrayOfDataObjects.length; i++) {

        let caseObject = arrayOfDataObjects[i]
        if (!importingCaseUpdates) caseObject.caseNumber = 'imported_' + caseObject.caseNumber + '_' + i
        let tags = caseObject.tags ? caseObject.tags[0] : ''
        let reviewDate = caseObject.reviewDate || ''
        let reviewDateNotes = caseObject.reviewDateNotes || ''

        E.caseImportDataWithAllFields[i + 1] = [
            caseObject.active,
            caseObject.caseNumber,
            caseObject.userGuid,
            caseObject.userGuid,
            caseObject.officeGuid,
            caseObject.offenseType,
            caseObject.offenseDescription,
            caseObject.offenseDate,
            caseObject.offenseLocation,
            tags,
            caseObject.createdDate,
            reviewDate,
            reviewDateNotes,
        ]

        E.caseImportDataWithMinimumFields[i + 1] = [
            caseObject.active,
            caseObject.caseNumber,
            caseObject.userGuid,
            caseObject.userGuid,
            caseObject.officeGuid,
            caseObject.offenseType,
            caseObject.createdDate
        ]

        if (customFormName) {
            E.caseImportDataWithAllFields[i + 1] = E.caseImportDataWithAllFields[i + 1].concat(customFieldsValues);
            E.caseImportDataWithMinimumFields[i + 1] = E.caseImportDataWithMinimumFields[i + 1].concat(customFieldsValues);
        }
    }
}

E.generateDataFor_ITEMS_Importer = function (arrayOfDataObjects, customFormName) {
    // Set headers for Excel file
    let allFieldsHeaders = [
        "CaseNumber",
        "Active",
        "Category",
        "Description",
        "SerialNumber",
        "RecoveredById",
        "Location",
        "CustodyReason",
        "RecoveryLocation",
        "RecoveryDate",
        "Make",
        "Model",
        "Status",
        "CustodianId",
        "CurrentOfficeId",
        "SubmittedById",
        "ItemBelongsTo",
        "DateCreated",
        "ReturnedById",
        "Tags",
        "AdditionalBarcodes",
    ]
    let minimumFieldsHeaders = [
        "CaseNumber",
        "Active",
        "Category",
        "Description",
        "Location",
        "Status",
        "CurrentOfficeId",
        "SubmittedById",
        "DateCreated",
    ];

    let customFieldsHeaders = E.generateCustomFormHeaders(customFormName)
    let customFieldsValues = E.generateCustomValues()

    if (customFormName) {
        allFieldsHeaders = allFieldsHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.itemImportDataWithAllFields = [
        allFieldsHeaders,
    ];
    E.itemImportDataWithMinimumFields = [
        minimumFieldsHeaders,
    ];

    // Set values for Excel file
    for (let i = 0; i < arrayOfDataObjects.length; i++) {
        let itemObject = arrayOfDataObjects[i]
        let description = itemObject.description ? (i + 1) + itemObject.description + '__imported on ' + S.currentDate : ''
        itemObject.description = description
        let serialNumber = itemObject.serialNumber ? (i + 1) + itemObject.serialNumber + 'serial_' + S.currentDate : ''
        let additionalBarcode = itemObject.additionalBarcodes ? itemObject.additionalBarcodes[0] : ''
        let tags = itemObject.tags ? itemObject.tags[0] : ''

        E.itemImportDataWithAllFields[i + 1] = [
            itemObject.caseNumber,
            itemObject.active,
            itemObject.category,
            description,
            serialNumber,
            itemObject.recoveredByGuid,
            itemObject.locationGuid,
            itemObject.custodyReason,
            itemObject.recoveryLocation,
            itemObject.recoveryDate,
            itemObject.make,
            itemObject.model,
            itemObject.status,
            itemObject.custodianGuid,
            itemObject.officeGuid,
            itemObject.submittedByGuid,
            itemObject.itemBelongsToGuid,
            itemObject.createdDate,
            S.selectedEnvironment.person_2.guid,
            tags,
            additionalBarcode
        ]

        E.itemImportDataWithMinimumFields[i + 1] = [
            itemObject.caseNumber,
            itemObject.active,
            itemObject.category,
            description,
            itemObject.locationGuid,
            itemObject.status,
            itemObject.officeGuid,
            itemObject.submittedByGuid,
            itemObject.createdDate,
        ]

        if (itemObject.barcode) {
            allFieldsHeaders.push('ItemBarcode')
            minimumFieldsHeaders.push('ItemBarcode')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.barcode)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.barcode)
        }

        if (itemObject.status === 'Disposed') {
            allFieldsHeaders.push('DisposedMethod')
            minimumFieldsHeaders.push('DisposedMethod')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposalMethod)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposalMethod)

            allFieldsHeaders.push('DisposedById')
            minimumFieldsHeaders.push('DisposedById')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.submittedByGuid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.submittedByGuid)

            allFieldsHeaders.push('DisposedDate')
            minimumFieldsHeaders.push('DisposedDate')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposedDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposedDate)

            allFieldsHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.disposalNotes)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.disposalNotes)
        }

        if (itemObject.status === 'Checked Out') {
            allFieldsHeaders.push( "CheckOutReason")
            minimumFieldsHeaders.push( "CheckOutReason")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkoutReason)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkoutReason)

            allFieldsHeaders.push( "CheckedOutById")
            minimumFieldsHeaders.push( "CheckedOutById")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutBy_guid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutBy_guid)

            allFieldsHeaders.push( "CheckedOutToId")
            minimumFieldsHeaders.push( "CheckedOutToId")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutTo_guid)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutTo_guid)

            allFieldsHeaders.push( "CheckedOutDate")
            minimumFieldsHeaders.push( "CheckedOutDate")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkoutDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkoutDate)

            allFieldsHeaders.push( "ExpectedReturnDate")
            minimumFieldsHeaders.push( "ExpectedReturnDate")
            E.itemImportDataWithAllFields[i + 1].push(itemObject.expectedReturnDate)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.expectedReturnDate)

            allFieldsHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')
            E.itemImportDataWithAllFields[i + 1].push(itemObject.checkedOutNotes)
            E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkedOutNotes)
        }

        if (itemObject.movedBy_name || itemObject.returnedByName_name) {
            allFieldsHeaders.push('TransactionNotes')
            minimumFieldsHeaders.push('TransactionNotes')

            if (itemObject.movedBy_name) {
                E.itemImportDataWithAllFields[i + 1].push(itemObject.moveNotes)
                E.itemImportDataWithMinimumFields[i + 1].push(itemObject.moveNotes)
            }
            else{
                E.itemImportDataWithAllFields[i + 1].push(itemObject.checkInNotes)
                E.itemImportDataWithMinimumFields[i + 1].push(itemObject.checkInNotes)
            }
        }

        if (customFormName) {
            E.itemImportDataWithAllFields[i + 1] = E.itemImportDataWithAllFields[i + 1].concat(customFieldsValues);
            E.itemImportDataWithMinimumFields[i + 1] = E.itemImportDataWithMinimumFields[i + 1].concat(customFieldsValues);
        }
    }
}

E.generateDataFor_PEOPLE_Importer = function (arrayOfDataObjects, customFormName) {
    // Set headers for Excel file
    let allFieldsHeaders = [
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
        allFieldsHeaders = allFieldsHeaders.concat(customFieldsHeaders);
        minimumFieldsHeaders = minimumFieldsHeaders.concat(customFieldsHeaders);
    }

    E.peopleImportDataWithAllFields = [
        allFieldsHeaders,
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
            allFieldsHeaders.push('Guid')
            minimumFieldsHeaders.push('Guid')
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
    "Id",
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
                '',
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

    let allFieldsHeaders = [
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
        allFieldsHeaders
    ]

    // Set values for Excel file
    for (let i = 0; i < arrayOfDataObjects.length; i++) {

        let userObject = arrayOfDataObjects[i]
        userObject.email =  'imported_' + userObject.email + '_' + i
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

    E.allFieldsHeaders = [
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
            E.allFieldsHeaders
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
