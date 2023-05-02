const S = require('../../../fixtures/settings.js');
const D = require('../../../fixtures/data.js');
const C = require('../../../fixtures/constants.js');

exports.generate_POST_request_payload_for_CheckOut = function (newItem, newPerson) {
    let person = (newPerson && newPerson.id !== '') ? newPerson : S.selectedEnvironment.person;

    let body = {
        transaction: {
            takenById: person.id,
            reasonId: S.selectedEnvironment.checkoutReason.id,
            notes: 'Note for Checked Out Item',
            items: [newItem],
            expectedReturnDate: null
        },
        sigdata: 'iVBORw0KGgoAAAANSUhEUgAAAIwAAAA3CAYAAADezaKIAAAA/UlEQVR4Xu3SsQ0AAAzCsPL/070hu5mZIu9MgVBg4euqwAEDQSoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAsCkXM7AMJAKAJNyOQPDQCoATMrlDAwDqQAwKZczMAykAg+oDgA4/NjoXAAAAABJRU5ErkJggg==',
        mediumFileData: [],
        containerIds: []
    };
    return body;
};

exports.generate_POST_request_payload_for_CheckIn = function (newItem) {
    let body = {
        transaction: {
            checkedInById: 0,
            returnedById: S.selectedEnvironment.person.id,
            returnedByName: S.selectedEnvironment.person.name,
            locationId: S.selectedEnvironment.locations[0].id,
            location: S.selectedEnvironment.locations[0].name,
            Items: [
                {
                    statusId: 2,
                    status: 'Checked In',
                    id: newItem.id
                }
            ]
        },
        sigdata: 'iVBORw0KGgoAAAANSUhEUgAAAdkAAAA3CAYAAABAfjBEAAAEEklEQVR4Xu3bwU5TQRQG4DMVjUF9EePWDStDqcYXMT6Gj2Hc+RQmtCVxoRu3xrVvoAuMRrFjWiw2pLEkMHTm3o8Ni5a5/3xn4OfSksIHAQIECBAgUEQgFVnVogQIECBAgEAoWYeAAAECBAgUElCyhWAtS4AAAQIElKwzQIAAAQIECgko2UKwliVAgAABAkrWGSBAgAABAoUElGwhWMsSIECAAAEl6wwQIECAAIFCAkq2EKxlCRAgQICAknUGCBAgQIBAIQElWwjWsgQIECBAQMk6AwQIECBAoJCAki0Ea1kCBAgQIKBknQECBAgQIFBIQMkWgrUsAQIECBBQss4AAQIECBAoJKBkC8FalgABAgQIKFlngAABAgQIFBJQsoVgLUuAAAECBJSsM0CAAAECBAoJKNlCsJYlQIAAAQJK1hkgcEGB4Tj/iIhbkWM73zcpcor4nQbxbjxMjy4Y29MIENiiwHZ+WGxxwy5NYJPAcJxnq0Wazn2X5LxphTKPn8+xvMraPCnmKY+/n8Tw/dP0oUwiqxIgsElAyW4S8ngvBPbH+dcgYmdtcZ0W1s/pKN2uBWM0yW9zjr0ccWPdnfW6Qs6xeOan6UF6UMs+5CDQdQEl2/UJ299/BeZ3rSn+/fl3FnFyNEo3u8K29yY/3N2JSY64t7rP+f4WpRvxfDpKr7qyX/sgUJuAkq1tIvIUF9g/zCcpxWBZOvOymY7SoPiFK7nAcJI/Ro77q6XbN4NKRiFGDwSUbA+GbIsR5+9Yl3dyfSrXdedgOM7PIuLl38L9Nhmlu84LAQJXJ6Bkr87SSpUKLAt2freWc8yOHqez114rjXztsQ7G+Tgi7szfRJUiZotfQtLp52mH/nx+7bAu2HsBJdv7I9BtgNWC7ftd66ZJz4s2R+ymvHit9rRk89mbwT6nHK8nT9KLTet4nACBfwJK1mnonMDw8PSfWpbvsPV64+VGPBznL5Hjq5K9nKOv7qeAku3n3Du962XJRurXG5o6PVSbI9CogJJtdHBiEyBAgED9Akq2/hlJSIAAAQKNCijZRgcnNgECBAjUL6Bk65+RhAQIECDQqICSbXRwYhMgQIBA/QJKtv4ZSUiAAAECjQoo2UYHJzYBAgQI1C+gZOufkYQECBAg0KiAkm10cGITIECAQP0CSrb+GUlIgAABAo0KKNlGByc2AQIECNQvoGTrn5GEBAgQINCogJJtdHBiEyBAgED9Akq2/hlJSIAAAQKNCijZRgcnNgECBAjUL6Bk65+RhAQIECDQqICSbXRwYhMgQIBA/QJKtv4ZSUiAAAECjQoo2UYHJzYBAgQI1C+gZOufkYQECBAg0KiAkm10cGITIECAQP0CSrb+GUlIgAABAo0KKNlGByc2AQIECNQv8AcDEoc4rYfmBwAAAABJRU5ErkJggg==',
        mediumFileData: []
    }
    return body;
};

exports.generate_POST_request_payload_for_Disposal = function (newItem) {
    let body = {
        transaction: {
            disposedByName: S.userAccounts.orgAdmin.name,
            disposedById: S.userAccounts.orgAdmin.id,
            witnessId: S.userAccounts.powerUser.id,
            methodId: S.selectedEnvironment.disposalMethod.id,
            notes: D.randomNo,
            items: [newItem],
        },
        sigdata: "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",
        mediumFileData: [],
        containerIds: []
    }
    return body;
};

exports.generate_POST_request_payload_for_Undisposal = function (newItem) {
    let body = {
        transaction: {
            checkedInById: 0,
            returnedById: 60907,
            locationId: 1,
            notes: D.randomNo,
            Items: [
                {
                    statusId: 3,
                    status: 'Disposed',
                    id: newItem.id
                }
            ]
        },
        sigdata: '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',
        mediumFileData: []
    }
    return body;
};

exports.generate_POST_request_payload_for_Move = function (newItem) {
    let body = {
        transaction: {
            movedByName: 'Sumejja OrgAdmin',
            movedById: 170,
            locationId: 43081,
            notes: D.randomNo,
            items: [
                {
                    sequentialCaseId: '194',
                    sequentialCaseIdNested: {
                        section: 194,
                        nested: null
                    },
                    barcode: 'd1c5535f-4133-4a9b-b9d1-47ef6ec6f741',
                    description: '578014',
                    recoveryDate: '2020-02-14T16:29:00Z',
                    recoveryLocation: 'Chicago, IL, USA',
                    active: true,
                    locationId: 1,
                    location: 'root',
                    fullLocation: null,
                    lastLocationId: 1,
                    lastLocation: 'root',
                    statusId: 1,
                    status: 'Checked In',
                    categoryId: 31,
                    category: 'Removable Media',
                    custodyReasonId: 0,
                    custodyReason: null,
                    recoveredById: 0,
                    recoveredBy: '',
                    submittedById: 223,
                    submittedBy: 'Cypress OrgAdmin',
                    custodianId: null,
                    custodian: null,
                    currentOfficeId: 130,
                    currentOfficeName: 'Cypress Office1',
                    primaryCaseId: 75802,
                    primaryCaseNumber: 'Automated test SAMPLE CASE',
                    primaryCaseOfficerId: 179,
                    primaryCaseOfficer: 'SMJ_testUser SMJ',
                    primaryCaseOffenseTypeId: 58,
                    primaryCaseOffenseType: 'Adoption',
                    isPrimaryCaseRestricted: false,
                    make: null,
                    model: null,
                    serialNumber: null,
                    creatingorganizationId: 1,
                    dateCreated: '2020-04-06T05:46:04Z',
                    loaningorganizationId: null,
                    incomingorganizationId: null,
                    sequentialorganizationId: 1675015,
                    cases: [
                        75802
                    ],
                    caseModels: [],
                    media: null,
                    mediaAmount: 0,
                    rootMediaFolderId: 49895,
                    formData: null,
                    formDataAmount: 0,
                    notes: [],
                    notesAmount: 0,
                    tags: [],
                    tagsAmount: 0,
                    barcodes: [],
                    barcodesAmount: 0,
                    id: newItem.id,
                    sqlId: 0,
                    people: [],
                    peopleIds: [],
                    peopleNames: null,
                    peopleGuids: null,
                    parentItemId: null,
                    parentItemDescription: null,
                    parentSequentialorganizationId: null,
                    childItems: [],
                    childItemsAmount: 0,
                    tasks: [],
                    tasksAmount: 0,
                    historiesAmount: 4,
                    isForbidden: false,
                    restangularEtag: '"73dfee77-ce0b-4c1f-98f1-2ffbc4e4f266"',
                    route: 'items',
                    reqParams: {
                        includePeople: true,
                        count: true
                    },
                    restangularized: true,
                    fromServer: true,
                    parentResource: null,
                    restangularCollection: false
                }
            ]
        },
        sigdata: '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',
        mediumFileData: []
    }
    return body;
};
