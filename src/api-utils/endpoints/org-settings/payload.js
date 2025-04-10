const S = require('../../../fixtures/settings.js');
const C = require('../../../fixtures/constants.js');

function shouldFieldBeEnabled(fieldsToEnable, field) {
    return fieldsToEnable ? fieldsToEnable.includes(field) : false;
}

function shouldFieldBeDisabled(fieldsToDisable, field) {
    return fieldsToDisable ? fieldsToDisable.includes(field) : false;
}

function shouldFieldBeOptional(optionalFields, field) {
    return optionalFields ? optionalFields.includes(field) : false;
}

exports.generate_request_payload_for_disabling_Case_fields = function (fieldsToEnable) {

    let body = [];

    if (!shouldFieldBeEnabled(fieldsToEnable, C.caseFields.offenseLocation)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
                "entityType": 0,
                "name": "CASE_OFFENSE_LOCATION",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
                "entityType": 0,
                "name": "CASE_OFFENSE_LOCATION",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.caseFields.offenseDescription)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDescription,
            "entityType": 0,
            "name": "CASE_OFFENSE_DESCRIPTION",
            "recordType": 1
        })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.caseFields.tags)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.tags,
                "entityType": 0,
                "name": "GENERAL.TAGS",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.caseFields.offenseDate)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDate,
                "entityType": 0,
                "name": "CASE_OFFENSE_DATE",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDate,
                "entityType": 0,
                "name": "CASE_OFFENSE_DATE",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.caseFields.linkedCases)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.case.linkedCases,
                "entityType": 0,
                "name": "GENERAL.LINKED_CASES",
                "recordType": 1
            },
            )
    }

    return body;
}

exports.generate_request_payload_for_setting_Case_fields_as_not_required = function () {
    let body = [
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
            "entityType": 0,
            "name": "CASE_OFFENSE_LOCATION",
            "recordType": 0
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
            "entityType": 0,
            "name": "CASE_OFFENSE_DATE",
            "recordType": 0
        }
    ];
    return body;
};

// entity types: 0 -Cases,   1-Items
// record types: 0 -NotRequired, 1-NotEnabled

exports.generate_request_payload_for_setting_visible_and_required_Case_fields = function (fieldsToDisable, optionalFields) {
    let body = [];

    if (shouldFieldBeDisabled(fieldsToDisable, C.caseFields.offenseLocation)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
                "entityType": 0,
                "name": "CASE_OFFENSE_LOCATION",
                "recordType": 1
            },
        )
    }
    if (shouldFieldBeOptional(optionalFields, C.caseFields.offenseLocation)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseLocation,
                "entityType": 0,
                "name": "CASE_OFFENSE_LOCATION",
                "recordType": 0
            },
        )
    }
    if (shouldFieldBeDisabled(fieldsToDisable, C.caseFields.offenseDescription)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDescription,
                "entityType": 0,
                "name": "CASE_OFFENSE_DESCRIPTION",
                "recordType": 1
            }
        )
    }
    if (shouldFieldBeDisabled(fieldsToDisable, C.caseFields.tags)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.tags,
                "entityType": 0,
                "name": "GENERAL.TAGS",
                "recordType": 1
            }
        )
    }
    if (shouldFieldBeDisabled(fieldsToDisable, C.caseFields.offenseDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDate,
                "entityType": 0,
                "name": "CASE_OFFENSE_DATE",
                "recordType": 1
            }
        )
    }
    if (shouldFieldBeOptional(optionalFields, C.caseFields.offenseDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.case.offenseDate,
                "entityType": 0,
                "name": "CASE_OFFENSE_DATE",
                "recordType": 0
            }
        )
    }

    return body;
}

exports.generate_request_payload_for_setting_visible_and_required_Item_fields = function (fieldsToDisable, optionalFields) {
    let body = [];

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.custodyReason)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.custodyReason,
                "entityType": 1,
                "name": "ITEM_CUSTODY_REASON",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.recoveredBy)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredBy,
                "entityType": 1,
                "name": "ITEM_RECOVERED_BY",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.make)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.make,
                "entityType": 1,
                "name": "ITEM_MAKE",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.model)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.model,
                "entityType": 1,
                "name": "ITEM_MODEL",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.serialNumber)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.serialNumber,
                "entityType": 1,
                "name": "ITEM_SERIAL_NUMBER",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.additionalBarcodes)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.barcodes,
                "entityType": 1,
                "name": "ITEM_BARCODES",
                "recordType": 1
            },
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.tags)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.tags,
                "entityType": 1,
                "name": "GENERAL.TAGS",
                "recordType": 1
            },
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.itemBelongsTo)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.itemBelongsTo,
                "entityType": 1,
                "name": "PEOPLE.ITEM_BELONGS_TO",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.publicFacingDescription)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.publicFacingDescription,
                "entityType": 1,
                "name": "ITEM.PUBLIC_FACING_DESCRIPTION",
                "recordType": 1
            }
        )
    }


    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.releasedTo)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.releasedTo,
                "entityType": 1,
                "name": "ITEMS.DISPOSAL.RELEASED_TO",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.expectedReturnDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.expectedReturnDate,
                "entityType": 1,
                "name": "ITEM.EXPECTED_RETURN_DATE",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.actualDisposedDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.actualDisposedDate,
                "entityType": 1,
                "name": "ITEMS.DISPOSAL.ACTUAL_DISPOSED_DATE",
                "recordType": 1
            }
        )
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.recoveryDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveryDate,
                "entityType": 1,
                "name": "ITEM_RECOVERY_DATE",
                "recordType": 1
            })
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.recoveryLocation)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredAt,
                "entityType": 1,
                "name": "ITEM_RECOVERED_AT",
                "recordType": 1
            })
    }

    if (shouldFieldBeDisabled(fieldsToDisable, C.itemFields.description)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.description,
                "entityType": 1,
                "name": "ITEM_DESCRIPTION",
                "recordType": 1
            })
    }

    // Setting optional fields
    if (shouldFieldBeOptional(optionalFields, C.itemFields.description)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.description,
                "entityType": 1,
                "name": "ITEM_DESCRIPTION",
                "recordType": 0
            })
    }

    if (shouldFieldBeOptional(optionalFields, C.itemFields.recoveryDate)) {
        body.push(
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveryDate,
                "entityType": 1,
                "name": "ITEM_RECOVERY_DATE",
                "recordType": 0
            })
    }

    if (shouldFieldBeOptional(optionalFields, C.itemFields.recoveryLocation)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredAt,
            "entityType": 1,
            "name": "ITEM_RECOVERED_AT",
            "recordType": 0
        })
    }

    if (shouldFieldBeOptional(optionalFields, C.itemFields.itemBelongsTo)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.item.itemBelongsTo,
            "entityType": 1,
            "recordType": 0
        })
    }

    if (shouldFieldBeOptional(optionalFields, C.itemFields.releasedTo)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.item.releasedTo,
            "entityType": 1,
            "recordType": 0
        })
    }

    return body;
};

exports.generate_request_payload_for_disabling_Item_fields = function (fieldsToEnable) {
    let body = [
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.make,
            "entityType": 1,
            "name": "ITEM_MAKE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.model,
            "entityType": 1,
            "name": "ITEM_MODEL",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.serialNumber,
            "entityType": 1,
            "name": "ITEM_SERIAL_NUMBER",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.barcodes,
            "entityType": 1,
            "name": "ITEM_BARCODES",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.publicFacingDescription,
            "entityType": 1,
            "name": "ITEM.PUBLIC_FACING_DESCRIPTION",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.latestTransactionNotes,
            "entityType": 1,
            "name": "ITEM.LATEST_TRANSACTION_NOTES",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.checkInNotes,
            "entityType": 1,
            "name": "ITEM.CHECKINNOTES",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.actualDisposedDate,
            "entityType": 1,
            "name": "ITEM.DISPOSAL.ACTUAL_DISPOSED_DATE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.expectedReturnDate,
            "entityType": 1,
            "name": "ITEM.EXPECTED_RETURN_DATE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.custodyReason,
            "entityType": 1,
            "name": "ITEM_CUSTODY_REASON",
            "recordType": 1
        },
    ];

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.tags)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.tags,
                "entityType": 1,
                "name": "PEOPLE.ITEM_BELONGS_TO",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.tags,
                "entityType": 1,
                "name": "PEOPLE.ITEM_BELONGS_TO",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.itemBelongsTo)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.itemBelongsTo,
                "entityType": 1,
                "name": "PEOPLE.ITEM_BELONGS_TO",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.itemBelongsTo,
                "entityType": 1,
                "name": "PEOPLE.ITEM_BELONGS_TO",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.recoveryDate)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveryDate,
                "entityType": 1,
                "name": "ITEM_RECOVERY_DATE",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveryDate,
                "entityType": 1,
                "name": "ITEM_RECOVERY_DATE",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.recoveryLocation)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredAt,
                "entityType": 1,
                "name": "ITEM_RECOVERED_AT",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredAt,
                "entityType": 1,
                "name": "ITEM_RECOVERED_AT",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.description)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.description,
                "entityType": 1,
                "name": "ITEM_DESCRIPTION",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.description,
                "entityType": 1,
                "name": "ITEM_DESCRIPTION",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.releasedTo)) {
        body.push({
                "orgFieldId": S.selectedEnvironment.fieldIds.item.releasedTo,
                "entityType": 1,
                "name": "ITEMS.DISPOSAL.RELEASED_TO",
                "recordType": 0
            },
            {
                "orgFieldId": S.selectedEnvironment.fieldIds.item.releasedTo,
                "entityType": 1,
                "name": "ITEMS.DISPOSAL.RELEASED_TO",
                "recordType": 1
            })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.recoveredBy)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredBy,
            "entityType": 1,
            "name": "ITEM_RECOVERED_BY",
            "recordType": 1
        })
    }


    if (!shouldFieldBeEnabled(fieldsToEnable, C.itemFields.dispositionStatus)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.item.dispositionAuthorizationStatus,
            "entityType": 1,
            "name": "DISPO_AUTH_STATUS",
            "recordType": 1
        })
     }

    return body;
};

exports.generate_request_payload_for_setting_Item_fields_as_not_required = function () {
    let body = [
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.recoveredAt,
            "entityType": 1,
            "name": "ITEM_RECOVERED_AT",
            "recordType": 0
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.item.description,
            "entityType": 1,
            "name": "ITEM_DESCRIPTION",
            "recordType": 0
        },
        {
            "orgFieldId": 37,
            "entityType": 1,
            "name": "ITEM_RECOVERY_DATE",
            "recordType": 0
        }
    ];
    return body;
};

exports.generate_request_payload_for_disabling_Person_fields = function (fieldsToEnable) {
    let body = [
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.middleName,
            "entityType": 2,
            "name": "GENERAL.MIDDLENAME",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.alias,
            "entityType": 2,
            "name": "GENERAL.ALIAS",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.driverLicense,
            "entityType": 2,
            "name": "GENERAL.DRIVERLICENCE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.race,
            "entityType": 2,
            "name": "GENERAL.RACE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.gender,
            "entityType": 2,
            "name": "GENERAL.GENDER",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.mobilePhone,
            "entityType": 2,
            "name": "GENERAL.MOBILE_PHONE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.otherPhone,
            "entityType": 2,
            "name": "GENERAL.OTHER_PHONE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.deceased,
            "entityType": 2,
            "name": "GENERAL.DECEASED",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.juvenile,
            "entityType": 2,
            "name": "GENERAL.JUVENILE",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.email,
            "entityType": 2,
            "name": "GENERAL.EMAIL",
            "recordType": 1
        },
        {
            "orgFieldId": S.selectedEnvironment.fieldIds.person.address,
            "entityType": 2,
            "name": "GENERAL.ADDRESS",
            "recordType": 1
        }];


    if (!shouldFieldBeEnabled(fieldsToEnable, C.personFields.businessName)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.person.businessName,
            "entityType": 2,
            "name": "GENERAL.BUSINESSNAME",
            "recordType": 1
        })
    }

    if (!shouldFieldBeEnabled(fieldsToEnable, C.personFields.dateOfBirth)) {
        body.push({
            "orgFieldId": S.selectedEnvironment.fieldIds.person.dob,
            "entityType": 2,
            "name": "GENERAL.DOB",
            "recordType": 1
        })
    }

    return body;
};

exports.generate_request_payload_for_editing_Org = function (
    orgSettings,
    useCLP = true,
    itemBelongsToShowsAllPeople = true,
    touchScreenSignature = false,
    personFormattingString = "~person.firstName~ ~person.lastName~"
) {
    let body = Object.assign({}, orgSettings)

    let defaultSignatureDevice = touchScreenSignature ? 0 : 2;
    let noSignature = !touchScreenSignature;

    body.useCaseLevelPermissions = useCLP;
    body.itemBelongsToShowsAllPeople = itemBelongsToShowsAllPeople;

    body.signatureConfiguration.defaultSignatureDevice = defaultSignatureDevice;
    body.signatureConfiguration.noSignatureDeviceSelected = noSignature;
    body.signatureConfiguration.topazSignatureDeviceSelected = false;
    body.signatureConfiguration.touchScreenSignatureDeviceSelected = touchScreenSignature? touchScreenSignature : false;
    body.personViewConfiguration.formattingString = personFormattingString;

    return body
};

exports.generate_request_payload_for_setting_Case_Number_Formatting = function (
    orgSettings,
    isFormattingRequired,
    isDefaultCaseNumberPrefix,
    isAutoIncrementCaseNumberOn,
    formattingPattern,
    defaultPrefix,
    nextCaseNumber,
    formattingValidationMessageAtOrgLevel
) {
    let body = Object.assign({}, orgSettings)

    body.caseNumberConfiguration.isFormattingRequired = isFormattingRequired;
    body.caseNumberConfiguration.formattingPattern = formattingPattern || ''
    body.caseNumberConfiguration.formattingValidationMessage = formattingValidationMessageAtOrgLevel || ''

    body.caseNumberConfiguration.isDefaultCaseNumberPrefix = isDefaultCaseNumberPrefix;
    body.caseNumberConfiguration.defaultCaseNumberPrefix = defaultPrefix || ''

    body.isAutoIncrementCaseNumberOn = isAutoIncrementCaseNumberOn;
    body.nextCaseNumber = nextCaseNumber || orgSettings.nextCaseNumber

    return body
};

exports.generate_request_payload_for_setting_Case_Number_Formatting_for_Offices = function (
    orgSettings,
    officeId1,
    formattingPattern1,
    defaultPrefix1,
    formattingValidationMessageAtOrgLevel
) {
    let body = Object.assign({}, orgSettings)

    body.caseNumberOfficeConfigurations[0] = {};
    body.caseNumberOfficeConfigurations[0].id = 0;
    body.caseNumberOfficeConfigurations[0].officeId = officeId1;
    body.caseNumberOfficeConfigurations[0].formattingPattern = formattingPattern1 || ''
    body.caseNumberOfficeConfigurations[0].defaultCaseNumberPrefix = defaultPrefix1 || ''
    body.caseNumberOfficeConfigurations[0].formattingValidationMessage = formattingValidationMessageAtOrgLevel || ''

    return body
};


exports.generate_request_payload_for_disabling_Case_Number_Formatting_for_Offices = function () {
    let body = Object.assign({}, orgSettings)

    body.caseNumberOfficeConfigurations = undefined;

    return body
};
