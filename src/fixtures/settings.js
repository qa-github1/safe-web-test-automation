const S = exports;
const C = require('./constants');
const accounts = require('./user-accounts');
const helper = require('../support/e2e-helper');

S.domain = Cypress.env('domain')
S.base_url = Cypress.env('baseUrl')
S.api_url = Cypress.env('apiUrl')
S.orgNum = Cypress.env('orgNum')

S.currentDateAndTime = helper.getCurrentDateInCurrentFormat(C.currentDateTimeFormat);
S.currentDate = helper.getCurrentDateInCurrentFormat(C.currentDateFormat);
S.tomorrowsDate = helper.tomorrowsDate(C.currentDateTimeFormat);
S.yesterdaysDate = helper.yesterdaysDate(C.currentDateTimeFormat);

S.isOrg1 = function () {
    return Cypress.env('orgNum') === 1
}

S.isOrg2 = function () {
    return Cypress.env('orgNum') === 2
}

S.isOrg3 = function () {
    return Cypress.env('orgNum') === 3
}

S.getCurrentDate = function (mask) {
    S.currentDateAndTime = helper.getCurrentDateInCurrentFormat(C.currentDateTimeFormat);
    S.currentDate = helper.getCurrentDateInCurrentFormat(C.currentDateFormat);
    return helper.getCurrentDateInSpecificFormat(mask)
};

S.getCurrentDate();
S.getYesterdaysDate = function (mask) {
    return helper.getYesterdaysDateInSpecificFormat(mask)
};
S.getDateBeforeXDaysInSpecificFormat = function (mask, daysBeforeTheCurrentDate) {
    return helper.getDateBeforeXDaysInSpecificFormat(mask, daysBeforeTheCurrentDate)
};
S.base_url = Cypress.config('baseUrl')
S.currentUrl = null;
S.selectedOfficeId = 1;
S.selectedorganizationId = 1;
S.passwordPattern = 'mmm/dd/yyyy';
S.userRoles = accounts.userRoles;

S.headers = {
    'Content-Type': 'application/json',
    officeid: '1',
    organizationid: '1',
    authorization: null,
    refreshtoken: null,
};


S.ALL_ENVS = {
    fieldIds: {
        case: {
            offenseLocation: 29,
            offenseDescription: 30,
            tags: 31,
            offenseDate: 34,
            linkedCases: 45
        },
        item: {
            recoveredAt: 20,
            custodyReason: 21,
            recoveredBy: 23,
            make: 24,
            model: 25,
            serialNumber: 26,
            barcodes: 27,
            tags: 28,
            description: 36,
            recoveryDate: 37,
            itemBelongsTo: 38,
            releasedTo: 47,
            expectedReturnDate: 41,
            actualDisposedDate: 42,
            publicFacingDescription: 46,
            dispositionAuthorizationStatus: 44,
            latestTransactionNotes: 48,
            checkInNotes: 43,
        },
        person: {
            businessName: 9,
            middleName: 10,
            alias: 11,
            dob: 12,
            driverLicense: 13,
            race: 14,
            gender: 15,
            mobilePhone: 16,
            otherPhone: 17,
            deceased: 18,
            juvenile: 19,
            email: 39,
            address: 40,
        },
    },
    offenseType: {
        name: C.offenseTypes.burglary,
        id: 4
    },
    offenseType2: {
        name: C.offenseTypes.arson,
        id: 2
    },
    offenseTypelinkedToRequiredForm1: {
        name: C.offenseTypes.vandalism,
        id: 28
    },
    offenseTypelinkedToRequiredForm2: {
        name: C.offenseTypes.accident,
        id: 158
    },
    category: {
        name: C.itemCategories.alcohol,
        id: 31
    },
    categorylinkedToRequiredForm1: {
        name: C.itemCategories.vehicle,
        id: 22
    },
    categorylinkedToRequiredForm2: {
        name: C.itemCategories.ammunition,
        id: 2
    },
    category2: {
        name: C.itemCategories.computer,
        id: 26
    },
    custodyReason: {
        name: C.custodyReason.asset,
        id: 7
    },
    custodyReason2: {
        name: C.custodyReason.investigation,
        id: 10
    },
    checkoutReason: {
        name: C.checkoutReasons.court,
        id: 1
    },
    checkoutReason2: {
        name: C.checkoutReasons.lab,
        id: 11
    },
    disposalMethod: {
        name: C.disposalMethods.auctioned,
        id: 4
    },
    disposalMethod2: {
        name: C.disposalMethods.destroyed,
        id: 2
    },
    personType: {
        name: C.personTypes.suspect,
        id: 1
    },
    personTypelinkedToRequiredForm1: {
        name: C.personTypes.wife,
        id: 813
    },
    personTypelinkedToRequiredForm2: {
        name: C.personTypes.witness,
        id: 3
    },
    personType2: {
        name: C.personTypes.victim,
        id: 2
    },
    titleRank: {
        name: 'Police Officer',
        id: 1
    },
    titleRank2: {
        name: 'Deputy Chief',
        id: 7
    },
    race: {
        name: C.races.asian,
        id: 4
    },
    race2: {
        name: C.races.hispanic,
        id: 7
    },
}

S.DEV_1 = {
    newUser: {},
    orgSettings: {
        id: 557,
        name: 'Web Test Automation #1',
        license: 'XKvU4HQo2Nupg5mO6mqE3KIKd4KNkb+2uf9k1jbKGMo=',
        guid: '3c3e24c3-a18b-ef11-834d-0254a7906fb1',
        cals: 10
    },
    office_1: {
        id: 11081,
        guid: 'a3d3e24c3-a18b-ef11-834d-0254a7906fb1',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation #1 - Cypress Office 1"
    },
    office_2: {
        id: 11090,
        name: "Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1054,
            guid: '690a16e8-59ba-eb11-aa4f-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automtion #2",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 63324,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 63324,
            guid: '42cf7475-b192-ef11-834f-0254a7906fb1'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 63325,
            guid: '1a62cded-b192-ef11-834f-0254a7906fb1'
        },
        clpUser: {
            id: 40383,
            guid: '7801ce14-fc36-eb11-aa49-062d5b58f56e'
        },
        basicUser: {
            id: 43530,
            guid: '2af70873-db6f-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 54357,
            guid: 'a484b498-75c9-ed11-8334-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 54
        },
        div2: {
            name: 'Investigations',
            id: 55
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 49
        },
        unit2: {
            name: 'UnitB',
            id: 50
        },
        unit3: {
            name: 'UnitC',
            id: 51
        }
    },
    forms: {
        userFormWithRequiredFields: 3425,
        userFormWithOptionalFields: 3426,
        taskFormWithRequiredFields: 2547,
        taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 531860,
            guid: 'c8792633-0a0e-4bc7-a67c-5b8c72175a86',
            name: "CypressLocation1"
        },
        {
            id: 510384,
            guid: '7a706961-0771-42da-9d49-a72dffc9c3f2',
            name: "CypressLocation2"
        }
    ],
    caseForReport: {
        id: 120799,
    },
    itemForReport: {
        id: 1726599,
        description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    },
    personForReport: {
        id: 105156,
    },
    oldClosedCase: {
        id: 7663408,
        caseNumber: 'TestCase1',
        createdDate: '04/27/2022',
        offenseDate: '04/27/2022',
        reviewDate: '10/27/2022',
        closedDate: '10/27/2022',
    },
    oldActiveCase: {
        id: 7733747,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '05/17/2009',
        offenseDate: '05/15/2009',
        reviewDate: '01/18/2023'
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 4524,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
        },
        other: {
            templateId: 4523,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    recentCase: {
        id: 5446732,
        caseNumber: 'TestCase1'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 5076012,
        get organizationId() {
            return S.DEV_1.orgSettings.id
        },
        userId: null,
        guid: '4341bc26-96cd-45a2-a1d6-e88dd4b18a39',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 5076223,
        get organizationId() {
            return S.DEV_1.orgSettings.id
        },
        userId: null,
        guid: 'bd59c56c-65c7-4ace-aa5d-986c258dee2f',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.DEV_1.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4429,
        startingIndexForViewPermissions: 64539,
        get startingIndexForCreatePermissions() {
            return S.DEV_1.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_1.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_1.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4437,
        startingIndexForViewPermissions: 65073,
        get startingIndexForCreatePermissions() {
            return S.DEV_1.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_1.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_1.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // readOnly_permissionGroup: {
    //     name: 'Cypress - ReadOnly',
    //     id: 2053,
    //     startingIndexForViewPermissions: 59816,
    //     get startingIndexForCreatePermissions() {
    //         return S.DEV_1.readOnly_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.DEV_1.readOnly_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.DEV_1.readOnly_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4247
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2539
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 2540
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 2541
    },
    orgTag1: {tagModelId: 6548, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 6714, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16806, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16807, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16812, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.DEV_2 = {
    newUser: {},
    orgSettings: {
        id: 558,
        name: 'Web Test Automation #2',
        license: 'XKvU4HQo2Nupg5mO6mqE3HdHkb0/lmt/9L4A3BRYVmA=',
        guid: 'cc0d2fd8-a18b-ef11-834d-0254a7906fb1',
        cals: 10
    },
    office_1: {
        id: 11082,
        guid: 'cd0d2fd8-a18b-ef11-834d-0254a7906fb1',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation #2 - Cypress Office 1"
    },
    office_2: {
        id: 11091,
        name: "Cypress Office 2",
        orgAndOfficeName: "Web Test Automation #2 - Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 11082,
            guid: 'cc0d2fd8-a18b-ef11-834d-0254a7906fb1',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automation #2 - Cypress Office 1"
        },
        id: 558,
        orgName: "Web Test Automation #2",
        officeId: 11082,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation #2 - Cypress Office 1"
    },
    users: {
        systemAdminId: 40423,
        orgAdminId: 63328,
        systemAdmin: {
            id: 40423,
            guid: 'd9e4cd09-eb9b-ed11-833a-0254a7906fb1'
        },
        orgAdmin: {
            id: 63328,
            guid: 'eb306a6b-2295-ef11-8350-0254a7906fb1'
        },
        org2Admin: {
            id: 40727,
            guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
            organizationId: 546,
            officeId: 1054
        },
        powerUser: {
            id: 63329,
            guid: '29a5a1f6-2295-ef11-8350-0254a7906fb1'
        },
        clpUser: {
            id: 43529,
            guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        },
        basicUser: {
            id: 43529,
            guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 73851,
            guid: '24abf752-0a00-f011-8356-0254a7906fb1'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 54
        },
        div2: {
            name: 'Investigations',
            id: 55
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 49
        },
        unit2: {
            name: 'UnitB',
            id: 50
        },
        unit3: {
            name: 'UnitC',
            id: 51
        }
    },
    forms: {
        userFormWithRequiredFields: 22208,
        userFormWithOptionalFields: 22209,
        taskFormWithRequiredFields: 2547,
        taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 422234,
            guid: 'eff01a7f-552e-4753-826d-3f85f31920ae',
            name: "CypressLocation1"
        },
        {
            id: 422235,
            guid: '0a3b258e-56a8-4fa2-bf59-da5f7a0bdd0b',
            name: "CypressLocation2"
        }
    ],
    caseForReport: {
        id: 120799,
    },
    itemForReport: {
        id: 1726599,
        description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    },
    personForReport: {
        id: 105156,
    },
    oldClosedCase: {
        id: 7663448,
        caseNumber: 'TestCase1',
        createdDate: '10/26/2022',
        offenseDate: '10/26/2022',
        reviewDate: '10/27/2022',
        closedDate: '10/27/2022',
    },
    oldActiveCase: {
        id: 7663616,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '12/17/2022',
        offenseDate: '12/13/2022',
        reviewDate: '12/2022/2022'
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 4527,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
        },
        other: {
            templateId: 4526,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    recentCase: {
        id: 5446732,
        caseNumber: 'TestCase1'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 4953714,
        get organizationId() {
            return S.DEV_2.orgSettings.id
        },
        userId: null,
        guid: '69b0e307-1cbc-4248-9cd9-7559c8c15084',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 4953715,
        get organizationId() {
            return S.DEV_2.orgSettings.id
        },
        userId: null,
        guid: '69947b04-67b5-4b0b-9aa6-e2ab965537ea',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.DEV_2.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 2145,
        startingIndexForViewPermissions: 64088,
        get startingIndexForCreatePermissions() {
            return S.DEV_2.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_2.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_2.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 4420,
        startingIndexForViewPermissions: 64220,
        get startingIndexForCreatePermissions() {
            return S.DEV_2.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_2.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_2.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 2142,
        startingIndexForViewPermissions: 63901,
        get startingIndexForCreatePermissions() {
            return S.DEV_2.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_2.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_2.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4421,
        startingIndexForViewPermissions: 64293,
        get startingIndexForCreatePermissions() {
            return S.DEV_2.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_2.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_2.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4422
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 10561
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 10563
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 10562
    },
    categorylinkedToRequiredForm1: {
        name: C.itemCategories.vehicle,
        id: 0
    },
    categorylinkedToRequiredForm2: {
        name: C.itemCategories.ammunition,
        id: 0
    },
    orgTag1: {tagModelId: 4851, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 4852, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 4855, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 4856, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 4857, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.DEV_3 = {
    newUser: {},
    orgSettings: {
        id: 556,
        name: 'Web Test Automtion #3',
        license: 'CH9byWyGCZWALMV9S5V4BYE9T5DsquRUSa7zh+wF+zc=',
        guid: '51554d99-4630-ed11-832b-021f02b7478f',
        cals: 10
    },
    office_1: {
        id: 1118,
        guid: '52554d99-4630-ed11-832b-021f02b7478f',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
    },
    office_2: {
        id: 1130,
        name: "Web Test Automtion #3 - Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1054,
            guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automation - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automation",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 74201,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 74201,
            guid: '127ca944-0821-f011-8367-0254a7906fb1'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 74212,
            guid: '22205855-d021-f011-8367-0254a7906fb1'
        },
        // clpUser: {
        //     id: 43529,
        //     guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        // },
        basicUser: {
            id: 43684,
            guid: '6729d18f-8e86-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 54357, // needs to be updated
            guid: 'a484b498-75c9-ed11-8334-021f02b7478f' // needs to be updated
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 129
        },
        div2: {
            name: 'Investigations',
            id: 134
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 88
        },
        unit2: {
            name: 'UnitB',
            id: 83
        },
        unit3: {
            name: 'UnitC',
            id: 89
        }
    },
    // forms: {
    //     userFormWithRequiredFields: 2542,
    //     userFormWithOptionalFields: 2546,
    //     taskFormWithRequiredFields: 2547,
    //     taskFormWithOptionalFields: 2548
    // },
    locations: [
        {
            id: 487927,
            guid: '2047e0e8-e536-4b4b-acbd-03300c734617',
            name: "CypressLocation1"
        },
        {
            id: 487928,
            guid: '21e4c916-a184-4189-b139-e2235833540d',
            name: "CypressLocation2"
        }
    ],
    // caseForReport: {
    //     id: 120799,
    // },
    // itemForReport: {
    //     id: 1726599,
    //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // },
    // personForReport: {
    //     id: 105156,
    // },
    oldClosedCase: {
        id: 7743098,
        caseNumber: 'TestCase1',
        createdDate: '12/28/2022',
        offenseDate: '12/21/2022',
        reviewDate: '12/30/2022',
        closedDate: '12/29/2022',
    },
    oldActiveCase: {
        id: 7743099,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '12/28/2022',
        offenseDate: '12/20/2022',
        reviewDate: '01/03/2023'
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 4530,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
        },
        other: {
            templateId: 4529,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    recentCase: {
        id: 7743099,
        caseNumber: 'AutomatedTest-Active Case'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6608222,
        get organizationId() {
            return S.DEV_3.orgSettings.id
        },
        userId: null,
        guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6608223,
        get organizationId() {
            return S.DEV_3.orgSettings.id
        },
        userId: null,
        guid: 'd3cb6e62-e01a-4c49-ae6b-9aca6a9222f1',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.DEV_3.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4449,
        startingIndexForViewPermissions: 65919,
        get startingIndexForCreatePermissions() {
            return S.DEV_3.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_3.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_3.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 4450,
        startingIndexForViewPermissions: 65992,
        get startingIndexForCreatePermissions() {
            return S.DEV_3.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_3.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_3.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4451,
        startingIndexForViewPermissions: 66065,
        get startingIndexForCreatePermissions() {
            return S.DEV_3.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_3.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_3.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // readOnly_permissionGroup: {
    //     name: 'Cypress - ReadOnly',
    //     id: 4421,
    //     startingIndexForViewPermissions: 64293,
    //     get startingIndexForCreatePermissions() {
    //         return S.DEV_3.readOnly_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.DEV_3.readOnly_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.DEV_3.readOnly_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    // permissionGroup_noAutoDispo: {
    //     name: 'All permissions except AutoDispo',
    //     id: 4422
    // },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2903
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 2904
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 2905
    },
    orgTag1: {tagModelId: 16827, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 16828, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16829, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16830, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16831, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.DEV_4 = {
    newUser: {},
    orgSettings: {
        id: 557,
        name: 'Web Test Automtion #4',
        license: 'CH9byWyGCZWALMV9S5V4BVXKXGS/G6hqnPaCKAnFGeE=',
        guid: 'f26bc8a3-4630-ed11-832b-021f02b7478f',
        cals: 10
    },
    office_1: {
        id: 1119,
        guid: 'f36bc8a3-4630-ed11-832b-021f02b7478f',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 1"
    },
    office_2: {
        id: 1138,
        name: "Web Test Automtion #4 - Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1054,
            guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automation - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automation",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 43720,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 43720,
            guid: '00e8a5a3-d98c-ed11-832e-021f02b7478f'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 43721,
            guid: '19330c4f-8c86-ed11-832d-021f02b7478f'
        },
        basicUser: {
            id: 43722,
            guid: '9fbf2a88-de8c-ed11-832e-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 130
        },
        div2: {
            name: 'Investigations',
            id: 135
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 90
        },
        unit2: {
            name: 'UnitB',
            id: 84
        },
        unit3: {
            name: 'UnitC',
            id: 91
        }
    },
    // // forms: {
    // //     userFormWithRequiredFields: 2542,
    // //     userFormWithOptionalFields: 2546,
    // //     taskFormWithRequiredFields: 2547,
    // //     taskFormWithOptionalFields: 2548
    // // },
    locations: [
        {
            id: 487942,
            guid: '92473db1-d9ce-4d43-8962-25b2d484a681',
            name: "CypressLocation1"
        },
        {
            id: 487943,
            guid: '037a10c6-d69b-47b2-ba0f-df7236a740db',
            name: "CypressLocation2"
        }
    ],
    // // caseForReport: {
    // //     id: 120799,
    // // },
    // // itemForReport: {
    // //     id: 1726599,
    // //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // // },
    // // personForReport: {
    // //     id: 105156,
    // // },
    oldClosedCase: {
        id: 7744300,
        caseNumber: 'AutomatedTest-Closed Case',
        createdDate: '01/05/2023',
        offenseDate: '12/21/2022',
        reviewDate: '12/30/2022',
        closedDate: '05/02/2023',
    },
    oldActiveCase: {
        id: 7744372,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '01/05/2023',
        offenseDate: '12/20/2022',
        reviewDate: '11/15/2025'
    },
    // recentCase: {
    //     id: 7744372,
    //     caseNumber: 'AutomatedTest-Active Case'
    // },
    //  existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6608222,
        get organizationId() {
            return S.DEV_3.orgSettings.id
        },
        userId: null,
        guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6609514,
        get organizationId() {
            return S.DEV_4.orgSettings.id
        },
        userId: null,
        guid: 'dcad04c6-23a5-4c8d-81c6-f2ae59abc65d',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.DEV_4.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4476,
        startingIndexForViewPermissions: 66572,
        get startingIndexForCreatePermissions() {
            return S.DEV_4.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_4.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_4.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // blocked_permissionGroup: {
    //     name: 'Cypress - Blocked',
    //     id: 4450,
    //     startingIndexForViewPermissions: 65992,
    //     get startingIndexForCreatePermissions() {
    //         return S.DEV_4.blocked_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.DEV_4.blocked_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.DEV_4.blocked_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4477,
        startingIndexForViewPermissions: 66645,
        get startingIndexForCreatePermissions() {
            return S.DEV_4.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_4.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_4.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4478,
        startingIndexForViewPermissions: 66718,
        get startingIndexForCreatePermissions() {
            return S.DEV_4.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.DEV_4.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.DEV_4.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // // permissionGroup_noAutoDispo: {
    // //     name: 'All permissions except AutoDispo',
    // //     id: 4422
    // // },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2912
    },
    // blocked_userGroup: {
    //     name: 'Cypress Blocked Group',
    //     id: 2904
    // },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 2913
    },
    orgTag1: {tagModelId: 16872, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 16873, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16874, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16875, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16876, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.DEV_1 = {...S.ALL_ENVS, ...S.DEV_1};

S.DEV_2 = {...S.ALL_ENVS, ...S.DEV_2};

S.DEV_3 = {...S.ALL_ENVS, ...S.DEV_3};

S.DEV_4 = {...S.ALL_ENVS, ...S.DEV_4};


S.QA_1 = {
    orgSettings: {
        id: 3,
        name: 'Web Test Automation #1',
        guid: '42cd7f0a-dbd8-eb11-82f2-068f48eb83b1'
    },
    office_1: {
        id: 12,
        guid: '43cd7f0a-dbd8-eb11-82f2-068f48eb83b1',
        name: "Cypress Office 1",
        get orgAndOfficeName() {
            return S.QA_1.orgSettings.name + ' - ' + S.QA_1.office_1.name
        }
    },
    office_2: {},
    org2: {
        office_1: {
            id: 13,
            guid: '4111b114-dbd8-eb11-82f2-068f48eb83b1',
            name: "Cypress Office1",
            orgAndOfficeName: "Web Test Automation #2 - Cypress Office1"
        },
        id: 4,
        orgName: "Web Test Automation #2",
        officeId: 13,
        officeName: " Cypress Office1",
        orgAndOfficeName: "Web Test Automation #2 - Cypress Office1"
    },
    locations: [
        {
            id: 421,
            guid: '82833365-916f-4777-b726-ae6b59d622ec',
            name: "CypressLocation1"
        },
        {
            id: 422,
            guid: 'b4ab4199-f9d6-4490-8e55-afe117d2c49a',
            name: "CypressLocation2"
        }],
    users: {
        systemAdmin: {
            id: 35,
            guid: '477397a0-dbd8-eb11-82f2-068f48eb83b1',
            organizationId: 1,
            officeId: 1
        },
        orgAdmin: {
            id: 1321,
            guid: 'ecb9066b-6090-ed11-833a-0254a7906fb1'
        },
        powerUser: {
            id: 1322,
            guid: 'bcc373aa-d790-ed11-833a-0254a7906fb1'
        },
        // basic user should be corrected for QA1 (it was copied from Pentest just to fill missing reference
        basicUser: {
            id: 43530,
            guid: '2af70873-db6f-ed11-832d-021f02b7478f'
        },
        clpUser: {
            id: 38,
            guid: '77f14214-e5d8-eb11-82f2-068f48eb83b1'
        },
    },
    caseForReport: {
        id: null,
    },
    itemForReport: {
        id: null,
        descrption: ''
    },
    personForReport: {
        id: null,
    },
    oldClosedCase: {
        id: 202566,
        caseNumber: 'TestCase1',
        createdDate: '01/10/2022',
        offenseDate: '01/03/2023',
        reviewDate: '04/20/2023',
        closedDate: '01/11/2023',
    },
    oldActiveCase: {
        id: 202569,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '01/10/2023',
        offenseDate: '01/02/2023',
        reviewDate: '04/20/2023'
    },
    recentCase: {
        id: 76,
        caseNumber: 'Test Case 1'
    },
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 56,
        get organizationId() {
            return S.QA_1.orgSettings.id
        },
        userId: null,
        guid: 'dac05e95-ac87-4480-b332-c137a4b47c43',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 57,
        organizationId: () => S.QA_1.orgSettings.id,
        userId: null,
        guid: '2a709a9a-2ca9-41ff-a6ac-3dafcf8e3808',
        email: 'qa+person_2@trackerproducts.com'
    },
    recoveredById: () => S.QA_1.person.id,
    caseOfficerId: () => S.userAccounts.powerUser.id,
    offenseType: {
        name: C.offenseTypes.burglary,
        id: 77
    },
    offenseType2: {
        name: C.offenseTypes.arson,
        id: 33
    },
    category: {
        name: C.itemCategories.alcohol,
        id: 12
    },
    category2: {
        name: C.itemCategories.computer,
        id: 108
    },
    custodyReason: {
        name: C.custodyReason.asset,
        id: 8
    },
    custodyReason2: {
        name: C.custodyReason.investigation,
        id: 54
    },
    checkoutReason: {
        name: C.checkoutReasons.court,
        id: 13
    },
    checkoutReason2: {
        name: C.checkoutReasons.lab,
        id: 39
    },
    personType: {
        name: C.personTypes.suspect,
        id: 145
    },
    personType2: {
        name: C.personTypes.victim,
        id: 142
    },
    race: {
        name: C.races.asian,
        id: 4
    },
    race2: {
        name: C.races.hispanic,
        id: 7
    },
    caseCustomForm: {
        name: "Cypress Case Form",
        id: 32,
        checkboxListId: "field3231",
        radioButtonListId: "field3233",
        selectListId: "field3235",
        number: "field3223",
        password: "field3225",
        textbox: "field3219",
        email: "field3221",
        textarea: "field3227",
        checkbox: "field3229",
        date: "field3241",
        user: "field3237",
        person: "field3239",
    },
    itemCustomForm: {
        name: "Cypress Item Form",
        id: 33,
        checkboxListId: "field3291",
        radioButtonListId: "field3293",
        selectListId: "field3295",
        number: "field3283",
        password: "field3285",
        textbox: "field3279",
        email: "field3281",
        textarea: "field3287",
        checkbox: "field3289",
        date: "field3301",
        user: "field3297",
        person: "field3299",
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 22,
        startingIndexForViewPermissions: 528,
        get startingIndexForCreatePermissions() {
            return S.QA_1.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_1.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_1.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 23,
        startingIndexForViewPermissions: 573,
        get startingIndexForCreatePermissions() {
            return S.QA_1.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_1.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_1.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 24,
        startingIndexForViewPermissions: 618,
        get startingIndexForCreatePermissions() {
            return S.QA_1.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_1.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_1.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 3
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 4
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 5
    },
};

S.QA_2 = {
    orgSettings: {
        id: 4,
        name: 'Web Test Automation #2',
        guid: '4011b114-dbd8-eb11-82f2-068f48eb83b1'
    },
    office_1: {
        id: 13,
        guid: '4111b114-dbd8-eb11-82f2-068f48eb83b1',
        name: "Cypress Office 1",
        get orgAndOfficeName() {
            return S.QA_2.orgSettings.name + ' - ' + S.QA_2.office_1.name
        }
    },
    office_2: {},
    locations: [
        {
            id: 56,
            guid: '4211b114-dbd8-eb11-82f2-068f48eb83b1',
            name: "root"
        },
        {
            id: 61,
            guid: 'f461f227-e3d8-eb11-82f2-068f48eb83b1',
            name: "CypressLocation1"
        }],
    users: {
        systemAdmin: {
            id: 35,
            guid: '477397a0-dbd8-eb11-82f2-068f48eb83b1',
            organizationId: 1,
            officeId: 1
        },
        orgAdmin: {
            id: 39,
            guid: '54f39f56-03d9-eb11-82f2-068f48eb83b1'
        },
        powerUser: {
            id: 40,
            guid: 'aab75165-03d9-eb11-82f2-068f48eb83b1'
        },
        clpUser: {
            id: 41,
            guid: 'e8fbe19b-03d9-eb11-82f2-068f48eb83b1'
        },
    },
    caseForReport: {
        id: null,
    },
    itemForReport: {
        id: null,
        descrption: ''
    },
    personForReport: {
        id: null,
    },
    oldClosedCase: {
        id: 78,
        caseNumber: 'Test Case 1'
    },
    recentCase: {
        id: 78,
        caseNumber: 'Test Case 1'
    },
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 62,
        get organizationId() {
            return S.QA_2.orgSettings.id
        },
        userId: null,
        guid: 'd2f64702-feea-4688-9cb1-9acc0686be41',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 63,
        organizationId: () => S.QA_2.orgSettings.id,
        userId: null,
        guid: '941a1ff1-8147-4023-9ab8-9e5a175acb15',
        email: 'qa+person_2@trackerproducts.com'
    },
    recoveredById: () => S.QA_2.person.id,
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 25,
        startingIndexForViewPermissions: 663,
        get startingIndexForCreatePermissions() {
            return S.QA_2.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_2.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_2.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 26,
        startingIndexForViewPermissions: 708,
        get startingIndexForCreatePermissions() {
            return S.QA_2.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_2.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_2.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 27,
        startingIndexForViewPermissions: 753,
        get startingIndexForCreatePermissions() {
            return S.QA_2.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_2.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_2.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 6
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 7
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 8
    },
};

S.QA_3 = {
    orgSettings: {
        id: 5,
        name: 'Web Test Automation #3',
        guid: 'd1fe3d1e-dbd8-eb11-82f2-068f48eb83b1'
    },
    office_1: {
        id: 14,
        guid: 'd2fe3d1e-dbd8-eb11-82f2-068f48eb83b1',
        name: "Cypress Office 1",
        get orgAndOfficeName() {
            return S.QA_3.orgSettings.name + ' - ' + S.QA_3.office_1.name
        }
    },
    office_2: {},
    locations: [
        {
            id: 57,
            guid: 'd3fe3d1e-dbd8-eb11-82f2-068f48eb83b1',
            name: "root"
        },
        {
            id: 64,
            guid: 'd3fe3d1e-dbd8-eb11-82f2-068f48eb83b1',
            name: "CypressLocation1"
        }],
    users: {
        systemAdmin: {
            id: 35,
            guid: '477397a0-dbd8-eb11-82f2-068f48eb83b1',
            organizationId: 1,
            officeId: 1
        },
        orgAdmin: {
            id: 42,
            guid: 'c85f9542-8fd9-eb11-82f2-068f48eb83b1'
        },
        powerUser: {
            id: 43,
            guid: 'b56d5062-8fd9-eb11-82f2-068f48eb83b1'
        },
        clpUser: {
            id: 44,
            guid: '9d5a5476-8fd9-eb11-82f2-068f48eb83b1'
        },
    },
    caseForReport: {
        id: null,
    },
    itemForReport: {
        id: null,
        descrption: ''
    },
    personForReport: {
        id: null,
    },
    oldClosedCase: {
        id: 87,
        caseNumber: 'Test Case 1'
    },
    recentCase: {
        id: 87,
        caseNumber: 'Test Case 1'
    },
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 67,
        get organizationId() {
            return S.QA_3.orgSettings.id
        },
        userId: null,
        guid: '40afa8bd-bb87-49e0-8717-48768ad3a1fb',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 68,
        organizationId: () => S.QA_3.orgSettings.id,
        userId: null,
        guid: '266f1941-3c19-4e9b-a4a8-50a2d78258ce',
        email: 'qa+person_2@trackerproducts.com'
    },
    recoveredById: () => S.QA_3.person.id,
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 28,
        startingIndexForViewPermissions: 798,
        get startingIndexForCreatePermissions() {
            return S.QA_3.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_3.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_3.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 29,
        startingIndexForViewPermissions: 843,
        get startingIndexForCreatePermissions() {
            return S.QA_3.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_3.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_3.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 30,
        startingIndexForViewPermissions: 888,
        get startingIndexForCreatePermissions() {
            return S.QA_3.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_3.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_3.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 9
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 10
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 11
    },
};

S.QA_4 = {
    orgSettings: {
        id: 6,
        name: 'Web Test Automation #4',
        guid: 'c557d528-dbd8-eb11-82f2-068f48eb83b1'
    },
    office_1: {
        id: 15,
        guid: 'c657d528-dbd8-eb11-82f2-068f48eb83b1',
        name: "Cypress Office 1",
        get orgAndOfficeName() {
            return S.QA_4.orgSettings.name + ' - ' + S.QA_4.office_1.name
        }
    },
    office_2: {},
    locations: [
        {
            id: 58,
            guid: 'c757d528-dbd8-eb11-82f2-068f48eb83b1',
            name: "root"
        },
        {
            id: 65,
            guid: 'c757d528-dbd8-eb11-82f2-068f48eb83b1',
            name: "CypressLocation1"
        }],
    users: {
        systemAdmin: {
            id: 35,
            guid: '477397a0-dbd8-eb11-82f2-068f48eb83b1',
            organizationId: 1,
            officeId: 1
        },
        orgAdmin: {
            id: 45,
            guid: 'd5c869fd-d3d9-eb11-82f2-068f48eb83b1'
        },
        powerUser: {
            id: 46,
            guid: '9088b321-d4d9-eb11-82f2-068f48eb83b1'
        },
        clpUser: {
            id: 47,
            guid: '09cfdf33-d4d9-eb11-82f2-068f48eb83b1'
        },
        basicUser: {
            id: 43530,
            guid: '2af70873-db6f-ed11-832d-021f02b7478f'
        },
    },
    caseForReport: {
        id: null,
    },
    itemForReport: {
        id: null,
        descrption: ''
    },
    personForReport: {
        id: null,
    },
    oldClosedCase: {
        id: 104,
        caseNumber: 'Test Case 1'
    },
    recentCase: {
        id: 104,
        caseNumber: 'Test Case 1'
    },
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 77,
        get organizationId() {
            return S.QA_4.orgSettings.id
        },
        userId: null,
        guid: 'a57225e6-5e5c-4222-a61d-760f2a068fe5',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 78,
        organizationId: () => S.QA_4.orgSettings.id,
        userId: null,
        guid: '4a699c9d-6b9e-414e-a611-57e4e8ab32f6',
        email: 'qa+person_2@trackerproducts.com'
    },
    recoveredById: () => S.QA_3.person.id,
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 31,
        startingIndexForViewPermissions: 933,
        get startingIndexForCreatePermissions() {
            return S.QA_4.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_4.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_4.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 32,
        startingIndexForViewPermissions: 978,
        get startingIndexForCreatePermissions() {
            return S.QA_4.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_4.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_4.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 33,
        startingIndexForViewPermissions: 1023,
        get startingIndexForCreatePermissions() {
            return S.QA_4.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.QA_4.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.QA_4.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 12
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 13
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 14
    },
};

S.QA_1 = {...S.ALL_ENVS, ...S.QA_1};

S.QA_2 = {...S.ALL_ENVS, ...S.QA_2};

S.QA_3 = {...S.ALL_ENVS, ...S.QA_3};

S.QA_4 = {...S.ALL_ENVS, ...S.QA_4};


S.PENTEST_1 = {
    newUser: {},
    orgSettings: {
        id: 541,
        name: 'Web Test Automation',
        license: '/XKvU4HQo2Nupg5mO6mqE3F9Yzdw/IN13DomjvcyC1yA=',
        guid: 'a8e131e6-3d36-eb11-aa49-062d5b58f56e',
        cals: 10
    },
    office_1: {
        id: 1027,
        guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation - Cypress Office 1"
    },
    office_2: {
        id: 137,
        name: "Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1054,
            guid: '690a16e8-59ba-eb11-aa4f-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automtion #2",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 43275,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 43275,
            guid: 'f3c2c442-0855-ed11-832b-021f02b7478f'
        },
        org2Admin: {
            id: 40727,
            guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
            organizationId: 546,
            officeId: 1054
        },
        powerUser: {
            id: 43356,
            guid: '7801ce14-fc36-eb11-aa49-062d5b58f56e'
        },
        clpUser: {
            id: 40383,
            guid: '7801ce14-fc36-eb11-aa49-062d5b58f56e'
        },
        basicUser: {
            id: 43530,
            guid: '2af70873-db6f-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 54357,
            guid: 'a484b498-75c9-ed11-8334-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 11
        },
        div2: {
            name: 'Investigations',
            id: 132
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 63
        },
        unit2: {
            name: 'UnitB',
            id: 64
        },
        unit3: {
            name: 'UnitC',
            id: 85
        }
    },
    forms: {
        userFormWithRequiredFields: 3425,
        userFormWithOptionalFields: 3426,
        taskFormWithRequiredFields: 2547,
        taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 476096,
            guid: '67d3a4e4-8c55-4ee4-ab66-e225b114dc35',
            name: "CypressLocation1"
        },
        {
            id: 510384,
            guid: '7a706961-0771-42da-9d49-a72dffc9c3f2',
            name: "CypressLocation2"
        }
    ],
    caseForReport: {
        id: 120799,
    },
    itemForReport: {
        id: 1726599,
        description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    },
    personForReport: {
        id: 105156,
    },
    oldClosedCase: {
        id: 7199043,
        caseNumber: 'TestCase1',
        createdDate: '04/27/2022',
        offenseDate: '04/27/2022',
        reviewDate: '10/27/2022',
        closedDate: '10/27/2022',
    },
    oldActiveCase: {
        id: 7733747,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '05/17/2009',
        offenseDate: '05/15/2009',
        reviewDate: '01/18/2023'
    },
    recentCase: {
        id: 5446732,
        caseNumber: 'TestCase1'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6606993,
        get organizationId() {
            return S.PENTEST_1.orgSettings.id
        },
        userId: null,
        guid: '6e2e9db2-48ab-4769-9eca-d678e6d77351',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6606994,
        get organizationId() {
            return S.PENTEST_1.orgSettings.id
        },
        userId: null,
        guid: 'bd59c56c-65c7-4ace-aa5d-986c258dee2f',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.PENTEST_1.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4429,
        startingIndexForViewPermissions: 64539,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_1.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_1.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_1.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4437,
        startingIndexForViewPermissions: 65073,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_1.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_1.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_1.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // readOnly_permissionGroup: {
    //     name: 'Cypress - ReadOnly',
    //     id: 2053,
    //     startingIndexForViewPermissions: 59816,
    //     get startingIndexForCreatePermissions() {
    //         return S.PENTEST_1.readOnly_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.PENTEST_1.readOnly_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.PENTEST_1.readOnly_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4247
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2539
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 2540
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 2541
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 3747,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
            message: 'Message-forAutomatedTests'
        },
        other: {
            templateId: 3381,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    orgTag1: {tagModelId: 6548, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 6714, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16806, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16807, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16812, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.PENTEST_2 = {
    newUser: {},
    orgSettings: {
        id: 555,
        name: 'Web Test Automtion #2',
        license: '/XKvU4HQo2Nupg5mO6mqE3F9Yzdw/IN13DomjvcyC1yA=',
        guid: 'a8e131e6-3d36-eb11-aa49-062d5b58f56e',
        cals: 10
    },
    office_1: {
        id: 1117,
        guid: '951fef8c-4630-ed11-832b-021f02b7478f',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
    },
    office_2: {
        id: 1123,
        name: "Cypress Office 2",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1118,
            guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
        },
        id: 556,
        orgName: "Web Test Automation #3",
        officeId: 1118,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 43276,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 43276,
            guid: 'a87ad8b6-0855-ed11-832b-021f02b7478f'
        },
        org2Admin: {
            id: 40727,
            guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
            organizationId: 546,
            officeId: 1054
        },
        powerUser: {
            id: 43277,
            guid: 'a9e64052-0d55-ed11-832b-021f02b7478f',
            email: 'qa+org2_poweruser@trackerproducts.com',
            name: 'Power User'
        },
        clpUser: {
            id: 43529,
            guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        },
        basicUser: {
            id: 43529,
            guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 97113,
            guid: '9d1bed96-e9ea-ef11-835c-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 127
        },
        div2: {
            name: 'Investigations',
            id: 133
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 86
        },
        unit2: {
            name: 'UnitB',
            id: 81
        },
        unit3: {
            name: 'UnitC',
            id: 87
        }
    },
    forms: {
        userFormWithRequiredFields: 24198,
        userFormWithOptionalFields: 24199,
        taskFormWithRequiredFields: 2547,
        taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 477682,
            guid: '8c229a7e-53a7-4cd4-8dc2-87b18a86abf3',
            name: "CypressLocation1"
        },
        {
            id: 477683,
            guid: 'da3370fa-08c2-485f-a9db-acf9ac259528',
            name: "CypressLocation2"
        }
    ],
    caseForReport: {
        id: 120799,
    },
    itemForReport: {
        id: 1726599,
        description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    },
    personForReport: {
        id: 105156,
    },
    oldClosedCase: {
        id: 7736934,
        caseNumber: 'TestCase1',
        createdDate: '10/26/2022',
        offenseDate: '10/26/2022',
        reviewDate: '11/15/2025',
        closedDate: '02/17/2025',
    },
    oldActiveCase: {
        id: 7742584,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '12/17/2022',
        offenseDate: '12/13/2022',
        reviewDate: '11/15/2025'
    },
    recentCase: {
        id: 5446732,
        caseNumber: 'TestCase1'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6606995,
        get organizationId() {
            return S.PENTEST_2.orgSettings.id
        },
        userId: null,
        guid: '535530de-c2e1-40bd-ad7d-4189dbbeb6af',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6606996,
        get organizationId() {
            return S.PENTEST_2.orgSettings.id
        },
        userId: null,
        guid: '8fbb5deb-86ef-4e7e-b427-5eae07c65b33',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.PENTEST_2.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4584,
        startingIndexForViewPermissions: 81778,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_2.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_2.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_2.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 4420,
        startingIndexForViewPermissions: 64220,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_2.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_2.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_2.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4583,
        startingIndexForViewPermissions: 81703,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_2.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_2.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_2.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4421,
        startingIndexForViewPermissions: 64293,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_2.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_2.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_2.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4422
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2897
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 2540
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 2898
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 3511,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
            message: 'Message-forAutomatedTests'
        },
        other: {
            templateId: 3381,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    orgTag1: {tagModelId: 6751, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 6752, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16809, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16810, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16811, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},

};

S.PENTEST_3 = {
    newUser: {},
    orgSettings: {
        id: 556,
        name: 'Web Test Automtion #3',
        license: 'CH9byWyGCZWALMV9S5V4BYE9T5DsquRUSa7zh+wF+zc=',
        guid: '51554d99-4630-ed11-832b-021f02b7478f',
        cals: 10
    },
    office_1: {
        id: 1118,
        guid: '52554d99-4630-ed11-832b-021f02b7478f',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
    },
    office_2: {
        id: 1130,
        guid: '3d054095-8b86-ed11-832d-021f02b7478f',
        name: "Cypress Office 2",
        orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 1119,
            guid: 'f36bc8a3-4630-ed11-832b-021f02b7478f',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automation",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation - Cypress Office 1"
    },

    users: {
        systemAdminId: 40357,
        orgAdminId: 43666,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 43666,
            guid: 'f58daaef-7880-ed11-832d-021f02b7478f'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 43683,
            guid: '19330c4f-8c86-ed11-832d-021f02b7478f'
        },
        // clpUser: {
        //     id: 43529,
        //     guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
        // },
        basicUser: {
            id: 43684,
            guid: '6729d18f-8e86-ed11-832d-021f02b7478f'
        },
        blockedUser: {
            id: 97282,
            guid: '3b61822f-9f1a-f011-8371-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 129
        },
        div2: {
            name: 'Investigations',
            id: 134
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 88
        },
        unit2: {
            name: 'UnitB',
            id: 83
        },
        unit3: {
            name: 'UnitC',
            id: 89
        }
    },
    forms: {
        userFormWithRequiredFields: 24206,
        userFormWithOptionalFields: 24207,
        taskFormWithRequiredFields: 2547,
        taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 487927,
            guid: '2047e0e8-e536-4b4b-acbd-03300c734617',
            name: "CypressLocation1"
        },
        {
            id: 487928,
            guid: '21e4c916-a184-4189-b139-e2235833540d',
            name: "CypressLocation2"
        }
    ],
    // caseForReport: {
    //     id: 120799,
    // },
    // itemForReport: {
    //     id: 1726599,
    //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // },
    // personForReport: {
    //     id: 105156,
    // },
    oldClosedCase: {
        id: 7743123,
        caseNumber: 'Closed Case-AutomatedTest',
        createdDate: '12/28/2022',
        offenseDate: '12/21/2022',
        reviewDate: '12/30/2022',
        closedDate: '12/28/2022',
    },
    oldActiveCase: {
        id: 7743205,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '12/28/2022',
        offenseDate: '12/20/2022',
        reviewDate: '12/30/2022',
        caseReviewNotes: 'reviewNotes_122822788007',
    },
    recentCase: {
        id: 7743099,
        caseNumber: 'AutomatedTest-Active Case'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6608222,
        get organizationId() {
            return S.PENTEST_3.orgSettings.id
        },
        userId: null,
        guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6608223,
        get organizationId() {
            return S.PENTEST_3.orgSettings.id
        },
        userId: null,
        guid: 'd3cb6e62-e01a-4c49-ae6b-9aca6a9222f1',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.PENTEST_3.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4587,
        startingIndexForViewPermissions: 81974,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_3.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_3.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_3.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 4588,
        startingIndexForViewPermissions: 82049,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_3.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_3.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_3.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4589,
        startingIndexForViewPermissions: 82124,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_3.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_3.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_3.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // readOnly_permissionGroup: {
    //     name: 'Cypress - ReadOnly',
    //     id: 4421,
    //     startingIndexForViewPermissions: 64293,
    //     get startingIndexForCreatePermissions() {
    //         return S.PENTEST_3.readOnly_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.PENTEST_3.readOnly_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.PENTEST_3.readOnly_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    // permissionGroup_noAutoDispo: {
    //     name: 'All permissions except AutoDispo',
    //     id: 4422
    // },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 3138
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 3139
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 3140
    },
    orgTag1: {tagModelId: 16827, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 16828, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16829, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16830, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16831, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
    taskTemplates: {
        dispoAuth: {
            templateId: 4308,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
        },
        other: {
            templateId: 3382,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
},

S.PENTEST_4 = {
    newUser: {},
    orgSettings: {
        id: 557,
        name: 'Web Test Automtion #4',
        license: 'CH9byWyGCZWALMV9S5V4BVXKXGS/G6hqnPaCKAnFGeE=',
        guid: 'f26bc8a3-4630-ed11-832b-021f02b7478f',
        cals: 10
    },
    office_1: {
        id: 1119,
        guid: 'f36bc8a3-4630-ed11-832b-021f02b7478f',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 1"
    },
    office_2: {
        id: 1138,
        name: "Web Test Automtion #4 - Cypress Office 2",
        orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 2"

    },
    org2: {
        office_1: {
            id: 1118,
            guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
            name: "Cypress Office 1",
            orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
        },
        id: 546,
        orgName: "Web Test Automation",
        officeId: 1054,
        officeName: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation - Cypress Office 1"
    },
    users: {
        systemAdminId: 40357,
        orgAdminId: 43720,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 43720,
            guid: '00e8a5a3-d98c-ed11-832e-021f02b7478f'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 43721,
            guid: '19330c4f-8c86-ed11-832d-021f02b7478f'
        },
        basicUser: {
            id: 43722,
            guid: '9fbf2a88-de8c-ed11-832e-021f02b7478',
        },
        blockedUser: {
            id: 97339,
            guid: 'db569414-481c-f011-8371-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 130
        },
        div2: {
            name: 'Investigations',
            id: 135
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 90
        },
        unit2: {
            name: 'UnitB',
            id: 84
        },
        unit3: {
            name: 'UnitC',
            id: 91
        }
    },
    // // forms: {
    // //     userFormWithRequiredFields: 2542,
    // //     userFormWithOptionalFields: 2546,
    // //     taskFormWithRequiredFields: 2547,
    // //     taskFormWithOptionalFields: 2548
    // // },
    locations: [
        {
            id: 487942,
            guid: '92473db1-d9ce-4d43-8962-25b2d484a681',
            name: "CypressLocation1"
        },
        {
            id: 487943,
            guid: '037a10c6-d69b-47b2-ba0f-df7236a740db',
            name: "CypressLocation2"
        }
    ],
    // // caseForReport: {
    // //     id: 120799,
    // // },
    // // itemForReport: {
    // //     id: 1726599,
    // //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // // },
    // // personForReport: {
    // //     id: 105156,
    // // },
    oldClosedCase: {
        id: 7744300,
        caseNumber: 'AutomatedTest-Closed Case',
        createdDate: '01/05/2023',
        offenseDate: '12/21/2022',
        reviewDate: '12/30/2022',
        closedDate: '05/02/2023',
    },
    oldActiveCase: {
        id: 7744372,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '01/05/2023',
        offenseDate: '12/20/2022',
        reviewDate: '11/15/2025'
    },
    // recentCase: {
    //     id: 7744372,
    //     caseNumber: 'AutomatedTest-Active Case'
    // },
    //  existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 6608222,
        get organizationId() {
            return S.PENTEST_3.orgSettings.id
        },
        userId: null,
        guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 6609514,
        get organizationId() {
            return S.PENTEST_4.orgSettings.id
        },
        userId: null,
        guid: 'dcad04c6-23a5-4c8d-81c6-f2ae59abc65d',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.PENTEST_4.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4476,
        startingIndexForViewPermissions: 66572,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_4.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_4.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_4.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // blocked_permissionGroup: {
    //     name: 'Cypress - Blocked',
    //     id: 4450,
    //     startingIndexForViewPermissions: 65992,
    //     get startingIndexForCreatePermissions() {
    //         return S.PENTEST_4.blocked_permissionGroup.startingIndexForViewPermissions + 22
    //     },
    //     get startingIndexForUpdatePermissions() {
    //         return S.PENTEST_4.blocked_permissionGroup.startingIndexForViewPermissions + 45
    //     },
    //     get startingIndexForDeletePermissions() {
    //         return S.PENTEST_4.blocked_permissionGroup.startingIndexForViewPermissions + 67
    //     }
    // },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4596,
        startingIndexForViewPermissions: 92329,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_4.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_4.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_4.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },

    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4478,
        startingIndexForViewPermissions: 66718,
        get startingIndexForCreatePermissions() {
            return S.PENTEST_4.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.PENTEST_4.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.PENTEST_4.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    // // permissionGroup_noAutoDispo: {
    // //     name: 'All permissions except AutoDispo',
    // //     id: 4422
    // // },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 2912
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 2904
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 3146
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 4308,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
        },
        other: {
            templateId: 3390,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        }
    },
    orgTag1: {tagModelId: 16872, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 16873, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16874, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16875, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16876, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.PENTEST_1 = {...S.ALL_ENVS, ...S.PENTEST_1};

S.PENTEST_2 = {...S.ALL_ENVS, ...S.PENTEST_2};

S.PENTEST_3 = {...S.ALL_ENVS, ...S.PENTEST_3};

S.PENTEST_4 = {...S.ALL_ENVS, ...S.PENTEST_4};


S.SECURE_1 = {
    newUser: {},
    orgSettings: {
        id: 1028,
        name: 'Web Test Automation #1',
        license: 'XKvU4HQo2Nupg5mO6mqE3KIKd4KNkb+2uf9k1jbKGMo=',
        guid: 'a1b68f8b-b929-f011-ad1f-0e9868aeff83',
        cals: 10
    },
    office_1: {
        id: 2216,
        guid: 'a2b68f8b-b929-f011-ad1f-0e9868aeff83',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automation #1 - Cypress Office 1"
    },
    office_2: {
        id: 2222,
        name: "Cypress Office 2"
    },
    org2: {
        office_1: {
            id: 2217,
            guid: '570fbb9a-b929-f011-ad1f-0e9868aeff83',
            name: "Default Office",
            orgAndOfficeName: "Web Test Automation #2 - Default Office"
        },
        id: 1029,
        orgName: "Web Test Automation #2",
        officeId: 1054,
        officeName: "Default Office",
        orgAndOfficeName: "Web Test Automation #2 - Default Office"
    },
    users: {
      //  systemAdminId: 40357,  //we don't have sys adm on Secure
        orgAdminId: 118001,
        systemAdmin: {
            id: 40357,
            guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        },
        orgAdmin: {
            id: 118001,
            guid: '5cc413f7-6f2a-f011-ad1f-0e9868aeff83'
        },
        // org2Admin: { //need to change password
        //     id: 66515,
        //     guid: 'b9bd4818-d6e3-eb11-aaaa-0686e4578f20',
        //     organizationId: 1028,
        //     officeId: 2216
        // },
        powerUser: {
            id: 118005,
            guid: 'd1270088-782a-f011-ad1f-0e9868aeff83'
        },
    //     clpUser: {
    //         id: 40383,
    //         guid: '7801ce14-fc36-eb11-aa49-062d5b58f56e'
    //     },
        basicUser: {
            id: 118006,
            guid: '44312f6c-7d2a-f011-ad1f-0e9868aeff83'
        },
    //     blockedUser: {
    //         id: 54357,
    //         guid: 'a484b498-75c9-ed11-8334-021f02b7478f'
    //     },
     },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 178
        },
        div2: {
            name: 'Investigations',
            id: 179
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 1762
        },
        unit2: {
            name: 'UnitB',
            id: 1763
        },
        unit3: {
            name: 'UnitC',
            id: 1764
        }
    },
    forms: {
        userFormWithRequiredFields: 5575,
        userFormWithOptionalFields: 5576,
        taskFormWithRequiredFields: 5577,
        taskFormWithOptionalFields: 5578
    },
    locations: [
        {
            id: 825260,
            guid: '4445c2ee-4d60-49d5-b66f-8e3fee1fb345',
            name: "CypressLocation1"
        },
        {
            id: 825261,
            guid: '06e31508-e23f-4786-ada5-4385d0db9a3e',
            name: "CypressLocation2"
        }
    ],
    //  caseForReport: {
    //      id: 120799,
    //  },
    // itemForReport: {
    //     id: 1726599,
    //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // },
    // personForReport: {
    //     id: 105156,
    // },
    oldClosedCase: {
        id: 110933057,
        caseNumber: 'TestCase1',
        createdDate: '04/27/2022',
        offenseDate: '04/27/2022',
        reviewDate: '10/27/2022',
        closedDate: '10/27/2022',
    },
    oldActiveCase: {
        id: 110933080,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '05/17/2009',
        offenseDate: '05/15/2009',
        reviewDate: '01/18/2023'
    },

    taskTemplate: {
        taskTypeId: {
            errorCorrection: 6438,

        },
        taskSubTypeId: {
            packagingAndLabeling: 6982,

        },
        taskActionId: {
            packageMustBeSealed: 3207,
            mustBeRenderedSafe: 3205,

        },
        otherTaskTemplateId: 6442,
    },
    recentCase: {
        id: 110933057,
        caseNumber: 'TestCase1'
    },
    // existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 57333753,
        get organizationId() {
            return S.SECURE_1.orgSettings.id
        },
        userId: null,
        guid: 'de7bbabc-73a1-43e3-9a2b-ee14e47186dd',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 57333760,
        get organizationId() {
            return S.SECURE_1.orgSettings.id
        },
        userId: null,
        guid: 'b557cc43-69c4-4520-827e-0d3826ed6288',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.SECURE_1.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4387,
        startingIndexForViewPermissions: 115963,
        get startingIndexForCreatePermissions() {
            return S.SECURE_1.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_1.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_1.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4388,
        startingIndexForViewPermissions: 116038,
        get startingIndexForCreatePermissions() {
            return S.SECURE_1.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_1.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_1.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4389,
        startingIndexForViewPermissions: 116113,
        get startingIndexForCreatePermissions() {
            return S.SECURE_1.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_1.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_1.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4390
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 16402
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 16403
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 16404
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 8145,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
            message: 'Message-forAutomatedTests'
        },
        other: {
            templateId: 8144,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    orgTag1: {tagModelId: 6548, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 6714, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 16806, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 16807, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 16812, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
};

S.SECURE_2 = {
    newUser: {},
    orgSettings: {
        id: 1029,
        name: 'Web Test Automation #2',
        license: 'XKvU4HQo2Nupg5mO6mqE3HdHkb0/lmt/9L4A3BRYVmA=',
        guid: '560fbb9a-b929-f011-ad1f-0e9868aeff83',
        cals: 10
    },
    office_1: {
        id: 2217,
        guid: '570fbb9a-b929-f011-ad1f-0e9868aeff83',
        name: "Cypress Office 1",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 1"
    },
    office_2: {
        id: 2223,
        name: "Cypress Office 2",
        orgAndOfficeName: "Web Test Automtion #2 - Cypress Office 2"
    },
    // org2: {
    //     office_1: {
    //         id: 1118,
    //         guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
    //         name: "Cypress Office 1",
    //         orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
    //     },
    //     id: 556,
    //     orgName: "Web Test Automation #3",
    //     officeId: 1118,
    //     officeName: "Cypress Office 1",
    //     orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
    // },
    users: {
       // systemAdminId: 40357,
        orgAdminId: 118002,
        // systemAdmin: {
        //     id: 40357,
        //     guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
        // },
        orgAdmin: {
            id: 118002,
            guid: '95a3522e-702a-f011-ad1f-0e9868aeff83'
        },
        // org2Admin: {
        //     id: 40727,
        //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
        //     organizationId: 546,
        //     officeId: 1054
        // },
        powerUser: {
            id: 118003,
            guid: '14c490f9-712a-f011-ad1f-0e9868aeff83'
        },
        // clpUser: {
        //     id: 40383,
        //     guid: '7801ce14-fc36-eb11-aa49-062d5b58f56e'
        // },
        basicUser: {
            id: 118004,
            guid: 'e44a930d-742a-f011-ad1f-0e9868aeff83'
        },
        blockedUser: {
            id: 118015,
            guid: 'a484b498-75c9-ed11-8334-021f02b7478f'
        },
    },
    divisions: {
        div1: {
            name: 'Patrol',
            id: 176
        },
        div2: {
            name: 'Investigations',
            id: 177
        }
    },
    units: {
        unit1: {
            name: 'UnitA',
            id: 1759
        },
        unit2: {
            name: 'UnitB',
            id: 1760
        },
        unit3: {
            name: 'UnitC',
            id: 1761
        }
    },
    forms: {
        userFormWithRequiredFields: 5572,
        userFormWithOptionalFields: 5573,
        // taskFormWithRequiredFields: 2547,
        // taskFormWithOptionalFields: 2548
    },
    locations: [
        {
            id: 825255,
            guid: '320e6d18-f5f2-4bfe-a56b-891f545e782e',
            name: "CypressLocation1"
        },
        {
            id: 825256,
            guid: 'e44f2199-0f3a-4680-aff1-15d152c2b5b1',
            name: "CypressLocation2"
        }
    ],
    // caseForReport: {
    //     id: 120799,
    // },
    // itemForReport: {
    //     id: 1726599,
    //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
    // },
    // personForReport: {
    //     id: 105156,
    // },
    oldClosedCase: {
        id: 110932895,
        caseNumber: 'TestCase1',
        createdDate: '05/06/2025',
        offenseDate: '10/26/2025',
        reviewDate: '10/26/2026',
        closedDate: '05/06/25',
    },
    oldActiveCase: {
        id: 110932963,
        caseNumber: 'AutomatedTest-Active Case',
        createdDate: '05/06/2025',
        offenseDate: '12/13/2022',
        reviewDate: '11/15/2026'
    },
    recentCase: {
        id: 110932895,
        caseNumber: 'TestCase1'
    },
    existingItems_1kBarcodes: [],
    person: {
        name: 'Person_1',
        fullName: 'Cypress Person_1',
        id: 57334951,
        get organizationId() {
            return S.SECURE_2.orgSettings.id
        },
        userId: null,
        guid: 'a2547995-09ea-4943-b4ad-1a56f11b7600',
        email: 'qa+person_1@trackerproducts.com'
    },
    person_2: {
        name: 'Person_2',
        fullName: 'Cypress Person_2',
        id: 57334952,
        get organizationId() {
            return S.SECURE_2.orgSettings.id
        },
        userId: null,
        guid: '0ff73b4e-181e-4520-a8a0-296e345a9c6b',
        email: 'qa+person_2@trackerproducts.com'
    },
    get recoveredById() {
        return S.SECURE_2.person.id
    },
    admin_permissionGroup: {
        name: 'Cypress - ADMIN',
        id: 4392,
        startingIndexForViewPermissions: 116190,
        get startingIndexForCreatePermissions() {
            return S.SECURE_2.admin_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_2.admin_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_2.admin_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    blocked_permissionGroup: {
        name: 'Cypress - Blocked',
        id: 4393,
        startingIndexForViewPermissions: 116265,
        get startingIndexForCreatePermissions() {
            return S.SECURE_2.blocked_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_2.blocked_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_2.blocked_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    regularUser_permissionGroup: {
        name: 'Cypress - Regular User',
        id: 4394,
        startingIndexForViewPermissions: 116340,
        get startingIndexForCreatePermissions() {
            return S.SECURE_2.regularUser_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_2.regularUser_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_2.regularUser_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    readOnly_permissionGroup: {
        name: 'Cypress - ReadOnly',
        id: 4395,
        startingIndexForViewPermissions: 116415,
        get startingIndexForCreatePermissions() {
            return S.SECURE_2.readOnly_permissionGroup.startingIndexForViewPermissions + 22
        },
        get startingIndexForUpdatePermissions() {
            return S.SECURE_2.readOnly_permissionGroup.startingIndexForViewPermissions + 45
        },
        get startingIndexForDeletePermissions() {
            return S.SECURE_2.readOnly_permissionGroup.startingIndexForViewPermissions + 67
        }
    },
    permissionGroup_noAutoDispo: {
        name: 'All permissions except AutoDispo',
        id: 4396
    },
    admin_userGroup: {
        name: 'Cypress Admin Group',
        id: 16406
    },
    blocked_userGroup: {
        name: 'Cypress Blocked Group',
        id: 16407
    },
    readOnly_userGroup: {
        name: 'Cypress ReadOnly Group',
        id: 16408
    },
    taskTemplates: {
        dispoAuth: {
            templateId: 8148,
            type: 'Disposition Authorization',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 5,
            useDispositionAuthorizationActions: true,
            title: 'Disposition Authorization',
            message: 'Message-forAutomatedTests'
        },
        other: {
            templateId: 8147,
            type: 'Other',
            subtype: '',
            active: true,
            emailUser: true,
            taskEscalation: true,
            dueDays: 10,
            useDispositionAuthorizationActions: true,
            title: 'Title--forAutomatedTests',
            message: 'Message-forAutomatedTests'
        },
    },
    orgTag1: {tagModelId: 17554, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
    orgTag2: {tagModelId: 17555, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
    tagA: {tagModelId: 17556, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
    tagB: {tagModelId: 17557, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
    tagC: {tagModelId: 17558, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},

};
//
// S.SECURE_3 = {
//     newUser: {},
//     orgSettings: {
//         id: 556,
//         name: 'Web Test Automtion #3',
//         license: 'CH9byWyGCZWALMV9S5V4BYE9T5DsquRUSa7zh+wF+zc=',
//         guid: '51554d99-4630-ed11-832b-021f02b7478f',
//         cals: 10
//     },
//     office_1: {
//         id: 1118,
//         guid: '52554d99-4630-ed11-832b-021f02b7478f',
//         name: "Cypress Office 1",
//         orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
//     },
//     office_2: {
//         id: 1130,
//         guid: '3d054095-8b86-ed11-832d-021f02b7478f',
//         name: "Cypress Office 2",
//         orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 2"
//     },
//     org2: {
//         office_1: {
//             id: 1119,
//             guid: 'f36bc8a3-4630-ed11-832b-021f02b7478f',
//             name: "Cypress Office 1",
//             orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 1"
//         },
//         id: 546,
//         orgName: "Web Test Automation",
//         officeId: 1054,
//         officeName: "Cypress Office 1",
//         orgAndOfficeName: "Web Test Automation - Cypress Office 1"
//     },
//
//     users: {
//         systemAdminId: 40357,
//         orgAdminId: 43666,
//         systemAdmin: {
//             id: 40357,
//             guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
//         },
//         orgAdmin: {
//             id: 43666,
//             guid: 'f58daaef-7880-ed11-832d-021f02b7478f'
//         },
//         // org2Admin: {
//         //     id: 40727,
//         //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
//         //     organizationId: 546,
//         //     officeId: 1054
//         // },
//         powerUser: {
//             id: 43683,
//             guid: '19330c4f-8c86-ed11-832d-021f02b7478f'
//         },
//         // clpUser: {
//         //     id: 43529,
//         //     guid: '99aa4fce-da6f-ed11-832d-021f02b7478f'
//         // },
//         basicUser: {
//             id: 43684,
//             guid: '6729d18f-8e86-ed11-832d-021f02b7478f'
//         },
//         blockedUser: {
//             id: 97282,
//             guid: '3b61822f-9f1a-f011-8371-021f02b7478f'
//         },
//     },
//     divisions: {
//         div1: {
//             name: 'Patrol',
//             id: 129
//         },
//         div2: {
//             name: 'Investigations',
//             id: 134
//         }
//     },
//     units: {
//         unit1: {
//             name: 'UnitA',
//             id: 88
//         },
//         unit2: {
//             name: 'UnitB',
//             id: 83
//         },
//         unit3: {
//             name: 'UnitC',
//             id: 89
//         }
//     },
//     forms: {
//         userFormWithRequiredFields: 24206,
//         userFormWithOptionalFields: 24207,
//         taskFormWithRequiredFields: 2547,
//         taskFormWithOptionalFields: 2548
//     },
//     locations: [
//         {
//             id: 487927,
//             guid: '2047e0e8-e536-4b4b-acbd-03300c734617',
//             name: "CypressLocation1"
//         },
//         {
//             id: 487928,
//             guid: '21e4c916-a184-4189-b139-e2235833540d',
//             name: "CypressLocation2"
//         }
//     ],
//     // caseForReport: {
//     //     id: 120799,
//     // },
//     // itemForReport: {
//     //     id: 1726599,
//     //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
//     // },
//     // personForReport: {
//     //     id: 105156,
//     // },
//     oldClosedCase: {
//         id: 7743123,
//         caseNumber: 'Closed Case-AutomatedTest',
//         createdDate: '12/28/2022',
//         offenseDate: '12/21/2022',
//         reviewDate: '12/30/2022',
//         closedDate: '12/28/2022',
//     },
//     oldActiveCase: {
//         id: 7743205,
//         caseNumber: 'AutomatedTest-Active Case',
//         createdDate: '12/28/2022',
//         offenseDate: '12/20/2022',
//         reviewDate: '12/30/2022',
//         caseReviewNotes: 'reviewNotes_122822788007',
//     },
//     recentCase: {
//         id: 7743099,
//         caseNumber: 'AutomatedTest-Active Case'
//     },
//     existingItems_1kBarcodes: [],
//     person: {
//         name: 'Person_1',
//         fullName: 'Cypress Person_1',
//         id: 6608222,
//         get organizationId() {
//             return S.SECURE_3.orgSettings.id
//         },
//         userId: null,
//         guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
//         email: 'qa+person_1@trackerproducts.com'
//     },
//     person_2: {
//         name: 'Person_2',
//         fullName: 'Cypress Person_2',
//         id: 6608223,
//         get organizationId() {
//             return S.SECURE_3.orgSettings.id
//         },
//         userId: null,
//         guid: 'd3cb6e62-e01a-4c49-ae6b-9aca6a9222f1',
//         email: 'qa+person_2@trackerproducts.com'
//     },
//     get recoveredById() {
//         return S.SECURE_3.person.id
//     },
//     admin_permissionGroup: {
//         name: 'Cypress - ADMIN',
//         id: 4587,
//         startingIndexForViewPermissions: 81974,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_3.admin_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_3.admin_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_3.admin_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//     blocked_permissionGroup: {
//         name: 'Cypress - Blocked',
//         id: 4588,
//         startingIndexForViewPermissions: 82049,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_3.blocked_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_3.blocked_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_3.blocked_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//     regularUser_permissionGroup: {
//         name: 'Cypress - Regular User',
//         id: 4589,
//         startingIndexForViewPermissions: 82124,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_3.regularUser_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_3.regularUser_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_3.regularUser_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//     // readOnly_permissionGroup: {
//     //     name: 'Cypress - ReadOnly',
//     //     id: 4421,
//     //     startingIndexForViewPermissions: 64293,
//     //     get startingIndexForCreatePermissions() {
//     //         return S.SECURE_3.readOnly_permissionGroup.startingIndexForViewPermissions + 22
//     //     },
//     //     get startingIndexForUpdatePermissions() {
//     //         return S.SECURE_3.readOnly_permissionGroup.startingIndexForViewPermissions + 45
//     //     },
//     //     get startingIndexForDeletePermissions() {
//     //         return S.SECURE_3.readOnly_permissionGroup.startingIndexForViewPermissions + 67
//     //     }
//     // },
//     // permissionGroup_noAutoDispo: {
//     //     name: 'All permissions except AutoDispo',
//     //     id: 4422
//     // },
//     admin_userGroup: {
//         name: 'Cypress Admin Group',
//         id: 3138
//     },
//     blocked_userGroup: {
//         name: 'Cypress Blocked Group',
//         id: 3139
//     },
//     readOnly_userGroup: {
//         name: 'Cypress ReadOnly Group',
//         id: 3140
//     },
//     orgTag1: {tagModelId: 16827, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
//     orgTag2: {tagModelId: 16828, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
//     tagA: {tagModelId: 16829, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
//     tagB: {tagModelId: 16830, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
//     tagC: {tagModelId: 16831, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
//     taskTemplates: {
//         dispoAuth: {
//             templateId: 4308,
//             type: 'Disposition Authorization',
//             subtype: '',
//             active: true,
//             emailUser: true,
//             taskEscalation: true,
//             dueDays: 5,
//             useDispositionAuthorizationActions: true,
//             title: 'Disposition Authorization',
//         },
//         other: {
//             templateId: 3382,
//             type: 'Other',
//             subtype: '',
//             active: true,
//             emailUser: true,
//             taskEscalation: true,
//             dueDays: 10,
//             useDispositionAuthorizationActions: true,
//             title: 'Title--forAutomatedTests',
//             message: 'Message-forAutomatedTests'
//         },
//     },
// },
//
// S.SECURE_4 = {
//     newUser: {},
//     orgSettings: {
//         id: 557,
//         name: 'Web Test Automtion #4',
//         license: 'CH9byWyGCZWALMV9S5V4BVXKXGS/G6hqnPaCKAnFGeE=',
//         guid: 'f26bc8a3-4630-ed11-832b-021f02b7478f',
//         cals: 10
//     },
//     office_1: {
//         id: 1119,
//         guid: 'f36bc8a3-4630-ed11-832b-021f02b7478f',
//         name: "Cypress Office 1",
//         orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 1"
//     },
//     office_2: {
//         id: 1138,
//         name: "Web Test Automtion #4 - Cypress Office 2",
//         orgAndOfficeName: "Web Test Automtion #4 - Cypress Office 2"
//
//     },
//     org2: {
//         office_1: {
//             id: 1118,
//             guid: 'a9e131e6-3d36-eb11-aa49-062d5b58f56e',
//             name: "Cypress Office 1",
//             orgAndOfficeName: "Web Test Automtion #3 - Cypress Office 1"
//         },
//         id: 546,
//         orgName: "Web Test Automation",
//         officeId: 1054,
//         officeName: "Cypress Office 1",
//         orgAndOfficeName: "Web Test Automation - Cypress Office 1"
//     },
//     users: {
//         systemAdminId: 40357,
//         orgAdminId: 43720,
//         systemAdmin: {
//             id: 40357,
//             guid: '0cfa7c01-2f2e-ea11-aa3a-062d5b58f56e'
//         },
//         orgAdmin: {
//             id: 43720,
//             guid: '00e8a5a3-d98c-ed11-832e-021f02b7478f'
//         },
//         // org2Admin: {
//         //     id: 40727,
//         //     guid: '10589878-e7bb-eb11-aa4f-062d5b58f56e',
//         //     organizationId: 546,
//         //     officeId: 1054
//         // },
//         powerUser: {
//             id: 43721,
//             guid: '19330c4f-8c86-ed11-832d-021f02b7478f'
//         },
//         basicUser: {
//             id: 43722,
//             guid: '9fbf2a88-de8c-ed11-832e-021f02b7478',
//         },
//         blockedUser: {
//             id: 97339,
//             guid: 'db569414-481c-f011-8371-021f02b7478f'
//         },
//     },
//     divisions: {
//         div1: {
//             name: 'Patrol',
//             id: 130
//         },
//         div2: {
//             name: 'Investigations',
//             id: 135
//         }
//     },
//     units: {
//         unit1: {
//             name: 'UnitA',
//             id: 90
//         },
//         unit2: {
//             name: 'UnitB',
//             id: 84
//         },
//         unit3: {
//             name: 'UnitC',
//             id: 91
//         }
//     },
//     // // forms: {
//     // //     userFormWithRequiredFields: 2542,
//     // //     userFormWithOptionalFields: 2546,
//     // //     taskFormWithRequiredFields: 2547,
//     // //     taskFormWithOptionalFields: 2548
//     // // },
//     locations: [
//         {
//             id: 487942,
//             guid: '92473db1-d9ce-4d43-8962-25b2d484a681',
//             name: "CypressLocation1"
//         },
//         {
//             id: 487943,
//             guid: '037a10c6-d69b-47b2-ba0f-df7236a740db',
//             name: "CypressLocation2"
//         }
//     ],
//     // // caseForReport: {
//     // //     id: 120799,
//     // // },
//     // // itemForReport: {
//     // //     id: 1726599,
//     // //     description: 'Item for Automated Tests - DON\'T CHANGE ANYTHING'
//     // // },
//     // // personForReport: {
//     // //     id: 105156,
//     // // },
//     oldClosedCase: {
//         id: 7744300,
//         caseNumber: 'AutomatedTest-Closed Case',
//         createdDate: '01/05/2023',
//         offenseDate: '12/21/2022',
//         reviewDate: '12/30/2022',
//         closedDate: '05/02/2023',
//     },
//     oldActiveCase: {
//         id: 7744372,
//         caseNumber: 'AutomatedTest-Active Case',
//         createdDate: '01/05/2023',
//         offenseDate: '12/20/2022',
//         reviewDate: '11/15/2025'
//     },
//     // recentCase: {
//     //     id: 7744372,
//     //     caseNumber: 'AutomatedTest-Active Case'
//     // },
//     //  existingItems_1kBarcodes: [],
//     person: {
//         name: 'Person_1',
//         fullName: 'Cypress Person_1',
//         id: 6608222,
//         get organizationId() {
//             return S.SECURE_3.orgSettings.id
//         },
//         userId: null,
//         guid: '5c11a259-d0fc-43c9-a42f-28b500ae5e6b',
//         email: 'qa+person_1@trackerproducts.com'
//     },
//     person_2: {
//         name: 'Person_2',
//         fullName: 'Cypress Person_2',
//         id: 6609514,
//         get organizationId() {
//             return S.SECURE_4.orgSettings.id
//         },
//         userId: null,
//         guid: 'dcad04c6-23a5-4c8d-81c6-f2ae59abc65d',
//         email: 'qa+person_2@trackerproducts.com'
//     },
//     get recoveredById() {
//         return S.SECURE_4.person.id
//     },
//     admin_permissionGroup: {
//         name: 'Cypress - ADMIN',
//         id: 4476,
//         startingIndexForViewPermissions: 66572,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_4.admin_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_4.admin_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_4.admin_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//     // blocked_permissionGroup: {
//     //     name: 'Cypress - Blocked',
//     //     id: 4450,
//     //     startingIndexForViewPermissions: 65992,
//     //     get startingIndexForCreatePermissions() {
//     //         return S.SECURE_4.blocked_permissionGroup.startingIndexForViewPermissions + 22
//     //     },
//     //     get startingIndexForUpdatePermissions() {
//     //         return S.SECURE_4.blocked_permissionGroup.startingIndexForViewPermissions + 45
//     //     },
//     //     get startingIndexForDeletePermissions() {
//     //         return S.SECURE_4.blocked_permissionGroup.startingIndexForViewPermissions + 67
//     //     }
//     // },
//     regularUser_permissionGroup: {
//         name: 'Cypress - Regular User',
//         id: 4596,
//         startingIndexForViewPermissions: 92329,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_4.regularUser_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_4.regularUser_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_4.regularUser_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//
//     readOnly_permissionGroup: {
//         name: 'Cypress - ReadOnly',
//         id: 4478,
//         startingIndexForViewPermissions: 66718,
//         get startingIndexForCreatePermissions() {
//             return S.SECURE_4.readOnly_permissionGroup.startingIndexForViewPermissions + 22
//         },
//         get startingIndexForUpdatePermissions() {
//             return S.SECURE_4.readOnly_permissionGroup.startingIndexForViewPermissions + 45
//         },
//         get startingIndexForDeletePermissions() {
//             return S.SECURE_4.readOnly_permissionGroup.startingIndexForViewPermissions + 67
//         }
//     },
//     // // permissionGroup_noAutoDispo: {
//     // //     name: 'All permissions except AutoDispo',
//     // //     id: 4422
//     // // },
//     admin_userGroup: {
//         name: 'Cypress Admin Group',
//         id: 2912
//     },
//     blocked_userGroup: {
//         name: 'Cypress Blocked Group',
//         id: 2904
//     },
//     readOnly_userGroup: {
//         name: 'Cypress ReadOnly Group',
//         id: 3146
//     },
//     taskTemplates: {
//         dispoAuth: {
//             templateId: 4308,
//             type: 'Disposition Authorization',
//             subtype: '',
//             active: true,
//             emailUser: true,
//             taskEscalation: true,
//             dueDays: 5,
//             useDispositionAuthorizationActions: true,
//             title: 'Disposition Authorization',
//         },
//         other: {
//             templateId: 3390,
//             type: 'Other',
//             subtype: '',
//             active: true,
//             emailUser: true,
//             taskEscalation: true,
//             dueDays: 10,
//             useDispositionAuthorizationActions: true,
//             title: 'Title--forAutomatedTests',
//             message: 'Message-forAutomatedTests'
//         }
//     },
//     orgTag1: {tagModelId: 16872, name: 'sensitive information', color: "#ad2355", tagUsedBy: 1},
//     orgTag2: {tagModelId: 16873, name: 'eligible for disposal', color: "#4b9b62", tagUsedBy: 1},
//     tagA: {tagModelId: 16874, name: 'Tag_A__', color: "#4b9b62", tagUsedBy: 1},
//     tagB: {tagModelId: 16875, name: 'Tag_B__', color: "#4b9b62", tagUsedBy: 1},
//     tagC: {tagModelId: 16876, name: 'Tag_C__', color: "#4b9b62", tagUsedBy: 1},
// };

S.SECURE_1 = {...S.ALL_ENVS, ...S.SECURE_1};

S.SECURE_2 = {...S.ALL_ENVS, ...S.SECURE_2};

S.SECURE_3 = {...S.ALL_ENVS, ...S.SECURE_3};

S.SECURE_4 = {...S.ALL_ENVS, ...S.SECURE_4};


S.setEnvironmentProperties = function (orgNum) {
    let orgNumber = orgNum || Cypress.env('orgNum') || 1

    S.selectedEnvironment = S[`${S.domain}_${orgNumber}`]
    console.log('Org Number: ' + orgNumber)
    console.log('Selected environment: ' + JSON.stringify(S.selectedEnvironment))
    return S.selectedEnvironment;
}

S.setEnvironmentProperties();

S.chainOfCustody = {
    SAFE: {
        newItemEntry: {
            type: 'in',
            date: helper.getCurrentDateInCurrentFormat(C.currentDateTimeFormat.dateOnly),
            issuedTo: 'New Item Entry',
            organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
            storageLocation: S.selectedEnvironment.locations[0].name,
            Notes: 'Item entered into system.',
        },
        checkin: (itemObject) => {
            return {
                type: 'In',
                date: itemObject.checkInDate,
                issuedFrom: itemObject.returnedByName_name,
                issuedTo: itemObject.returnedByName_name,
                organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
                storageLocation: itemObject.location,
                Notes: itemObject.checkInNotes,
            }
        },
        move: (itemObject) => {
            return {
                type: 'Move',
                date: itemObject.moveDate,
                issuedFrom: itemObject.movedBy_name,
                issuedTo: itemObject.movedBy_name,
                organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
                storageLocation: itemObject.location,
                Notes: itemObject.moveNotes,
            }
        },
        checkout: (itemObject) => {
            return {
                type: 'Out',
                date: itemObject.checkoutDate,
                issuedFrom: itemObject.checkedOutBy_name,
                issuedTo: itemObject.checkedOutTo_name,
                organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
                storageLocation: '',
                checkoutReason: itemObject.checkoutReason,
                Notes: itemObject.checkedOutNotes,
            }
        },
        disposal: (itemObject) => {
            return {
                type: 'Disposals',
                date: itemObject.disposedDate,
                issuedFrom: itemObject.disposedByName,
                issuedTo: itemObject.disposedByName,
                organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
                storageLocation: '',
                disposalMethod: itemObject.disposalMethod,
                Notes: itemObject.disposalNotes,
            }
        },
    },
    legacy: {
        checkedIn: {
            type: 'in',
            date: helper.getCurrentDateInCurrentFormat(C.currentDateTimeFormat.dateOnly),
            issuedTo: 'New Item Entry',
            organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
            storageLocation: S.selectedEnvironment.locations[0].name,
            Notes: 'Item entered into system.',
        },
        checkedOut: {
            type: 'out',
            date: helper.getCurrentDateInCurrentFormat(C.currentDateTimeFormat.dateOnly),
            checkoutReason: S.selectedEnvironment.checkoutReason.name,
            notes: helper.getRandomNo(),
            expectedReturnDate: helper.tomorrowsDate(C.currentDateTimeFormat.dateOnly),
            issuedTo: S.selectedEnvironment.person.name,
            organization: S.selectedEnvironment.orgSettings.name + ', ' + S.selectedEnvironment.office_1.name,
        }
    }
};

S.newCaseId = null;
S.oldClosedCase = S.selectedEnvironment.oldClosedCase;
S.recentCase = S.selectedEnvironment.recentCase;

S.colors = {
    redBorder: "rgb(231,24,45)"
};

S.gmailAccount = {
    email: 'qa@trackerproducts.com',
    password: 'prya dorm gqbm ygrf'
};

S.userAccounts = accounts.getTestAccounts(S.selectedEnvironment, S.orgNum);
S.selectedEnvironment.clpUser = S.userAccounts.clpUser;
S.selectedUser = {};

S.getUserData = function (userAcc) {
    return Object.assign({}, userAcc)
};

S.getCurrentUrl = function () {
    return S.currentUrl;
};

S.isDispoStatusEnabled  = function () {
    return S.selectedEnvironment.dispoStatusEnabled
}


module.exports = S;
