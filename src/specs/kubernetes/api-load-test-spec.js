const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const generic_request = require("../../api-utils/generic-api-requests");
let requestPayloads = require('./request-payloads');
let office1 = S.selectedEnvironment.office_1
let office2 = S.selectedEnvironment.office_2
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let numberOfRequests = 2

describe('Services', function () {

    before(function () {
        api.auth.get_tokens_without_page_load(orgAdmin);
        D.getCaseDataWithReducedFields()
        D.getItemDataWithReducedFields()
        api.org_settings.disable_Case_fields()
        api.org_settings.disable_Item_fields()
        api.cases.add_new_case()
        api.items.add_new_item()
    });

    it.only('REPORT Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        function checkStatusOfJobs(nameOfReportsInCache, secondsToWait = 30) {
            cy.wait(secondsToWait * 1000)
            nameOfReportsInCache.forEach(reportName => {
                cy.getLocalStorage(reportName).then(reportId => {

                    if (reportId) {
                        generic_request.GET(
                            '/api/reports/getcompletereport?jobId=' + reportId,
                            'response')

                        cy.getLocalStorage('apiResponse').then(apiResponse => {
                            if (JSON.parse(apiResponse).complete) {
                                cy.log(` ✅ ${reportName} FINISHED SUCCESSFULLY`)
                            } else {
                                cy.log(` ❌ ${reportName} NOT FINISHED YET, AFTER ${secondsToWait} seconds`)
                            }
                        })
                    }
                })
            });
        }

       // start report for case with cca 1k items
         generic_request.POST(
             '/api/reports/buildreport',
             requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
             "REPORT Service",
             'Big_Case_Report'
         )

       // start report for case with cca 1k items
         generic_request.POST(
             '/api/reports/buildreport',
             requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
             "REPORT Service",
             'Big_Case_Report'
         )

       // start report for case with cca 1k items
         generic_request.POST(
             '/api/reports/buildreport',
             requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
             "REPORT Service",
             'Big_Case_Report'
         )

       // start report for case with cca 1k items
         generic_request.POST(
             '/api/reports/buildreport',
             requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
             "REPORT Service",
             'Big_Case_Report'
         )

        // //  start X big reports
        // for (let i = 0; i < numberOfRequests; i++) {
        //     generic_request.POST(
        //         '/api/reports/buildreport',
        //         //  requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
        //         requestPayloads.reporterPayloadFromCaseView([7663616]),
        //         // 7663616 -- case on DEV - in Org#2 with 1500 items
        //         // 9090618 -- case on DEV - in Org#2 with 1 item1
        //         "REPORT Service",
        //         'Big_Case_Report_' + i
        //     )
        // }

        //fetch status for specific job with ID
        // let reportId = 730114
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730111,
        //     'response')
        //
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730112,
        //     'response')
        //
        // generic_request.GET(
        //     '/api/reports/getcompletereport?jobId=' + 730113,
        //     'response')
        //
        // cy.getLocalStorage('apiResponse').then(apiResponse => {
        //     cy.log(JSON.stringify(apiResponse));
        // })

        //start X reports for 1 item only
        // for (let i = 0; i < numberOfRequests; i++) {
        //     cy.getLocalStorage('newItem').then(newItem => {
        //         generic_request.POST(
        //             '/api/reports/buildreport',
        //             requestPayloads.reporterPayloadFromItemList(null, [JSON.parse(newItem).id]),
        //             "REPORT Service",
        //             'Item_Report' + i
        //         )
        //     });
        // }

        const reports = ['Big_Case_Report'];

        for (let i = 0; i < 100; i++) {
            reports.push(`Item_Report${i}`);
        }

        for (let i = 0; i < 100; i++) {
            reports.push(`Big_Case_Report_${i}`);
        }

        checkStatusOfJobs(reports);

    });

    it('EXPORT Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        function checkStatusOfJobs(secondsToWait = 15) {
            cy.wait(secondsToWait * 1000)
            generic_request.GET(
                '/api/exports',
                'response')

            cy.getLocalStorage('apiResponse').then(apiResponse => {
                function printStatuses(apiResponse) {
                    JSON.parse(apiResponse).forEach(item => { // Only first 101 elements
                        if (item.status === 'Complete') {
                            cy.log(`✅ Export FINISHED SUCCESSFULLY`);
                            cy.log(`***************** File link: *****************`);
                            cy.log(`${item["s3FileLink"]}`);
                            cy.log(`***********************************************`);
                        } else {
                            cy.log(`❌ Export NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${item.status}`);
                        }
                    });
                }

                printStatuses(apiResponse);
            })
        }

        // Requests below are for Dev -- Org #2
        // //  Export from Case View -- Items tab
        // generic_request.POST(
        //     //  '/api/exports/case-items/'+ S.selectedEnvironment.oldActiveCase.id+'?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     '/api/exports/case-items/' + 7663616 + '?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     // 7663616 -- case on DEV - in Org#2 with 1500 items
        //     {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //     "EXPORT Service",
        // )
        //
        // // Export from Item View -- Cases tab
        // generic_request.POST(
        //     //  '/api/exports/case-items/'+ S.selectedEnvironment.oldActiveCase.id+'?exportTime=2025-12-12T13:16:30.616Z&fileType=0&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     '/api/exports/item-cases/' + 24653163 + '?exportTime=2025-12-12T14:09:17.175Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     //24653163 -- item on DEV - Org2
        //     {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //     "EXPORT Service",
        // )
        //
        // //  Export from Search Cases page
        // generic_request.POST(
        //     '/api/exports/cases?exportTime=2025-12-12T10:34:03.124Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "CASE_NUMBER",
        //             "typeId": 0,
        //             "fieldName": "CaseNumber",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}, {
        //                 "id": 1,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
        //             }, {"id": 2, "name": "TP_SEARCH.SEARCH_CRITERIA.STARTS_WITH"}, {
        //                 "id": 4,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CONTAINS"
        //             }, {"id": 25, "name": "TP_SEARCH.SEARCH_CRITERIA.TEXT_SEARCH"}],
        //             "searchCriteria": 4,
        //             "model": "test"
        //         }, {
        //             "name": "CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "CaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "isCurrentUserSelected": false,
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Active",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T10:33:53.550Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.ITEMS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_items",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "items"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        // //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )
        //
        // //  Export from Search Items page (88k items)
        // generic_request.POST(
        //     '/api/exports/items?exportTime=2025-12-12T19:19:20.182Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.PRIMARY_CASE_OFFICERS",
        //             "typeId": 5,
        //             "fieldName": "PrimaryCaseOfficers",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "NAV.TAGS",
        //             "typeId": 5,
        //             "fieldName": "Tags",
        //             "searchCriteriasType": 7,
        //             "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 26,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
        //             }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
        //             "searchCriteria": 0,
        //             "tags": [],
        //             "model": "tags"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [556, 541],
        //         "fromOrgIds": [556, 541],
        //         "orderBy": "SequentialCaseId",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 100,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T19:19:09.275Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [{
        //             "name": "SEARCH.SAVED_SEARCH.CASES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_cases",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.PEOPLE",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_people",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_disposals",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98484,
        //                 "name": "all disposals",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKINS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkins",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_checkouts",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}, {
        //                 "id": 98786,
        //                 "name": "checkouts - Nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {
        //                 "id": 98787,
        //                 "name": "checkout on nov 26",
        //                 "version": 1,
        //                 "isVersionTwoWithOnlyAnd": false
        //             }, {"id": 98870, "name": "Checkout Pallet222", "version": 1, "isVersionTwoWithOnlyAnd": false}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.MOVES",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_moves",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_transfers",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }, {
        //             "name": "SEARCH.SAVED_SEARCH.TASK",
        //             "typeId": 3,
        //             "fieldName": "SavedSearchId_task",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "dropdownValues": [{"id": null, "name": "Select all"}],
        //             "searchCriteria": 0
        //         }],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //  Export from Search People page --> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        //  Export from Search People page--> cca 2,5k records (Dev - Org#2)
        generic_request.POST(
            '/api/exports/people?exportTime=2025-12-12T15:44:45.491Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=6',
            {
                "caseOfficers": [],
                "tags": [],
                "IsSearchingInSublocations": false,
                "DynamicFields": [],
                "StaticFields": [],
                "officeIds": [],
                "custodyOrgIds": [],
                "fromOrgIds": [],
                "orderBy": "Active",
                "orderByAsc": false,
                "thenOrderBy": "",
                "thenOrderByAsc": false,
                "PageSize": 25,
                "peopleIds": [],
                "PageNumber": 1,
                "clientDate": "2025-12-12T18:53:12.583Z",
                "clientTz": "Europe/Berlin",
                "timezoneOffset": -60,
                "SavedSearchEntities": [{
                    "name": "SEARCH.SAVED_SEARCH.CASES",
                    "typeId": 3,
                    "fieldName": "SavedSearchId_cases",
                    "searchCriteriasType": 5,
                    "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "cases"}},
                    "isV2": false,
                    "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                    "dropdownValues": [{"id": null, "name": "Select all"}],
                    "searchCriteria": 0
                }],
                "version": 1
            },
            "EXPORT Service",
        )

        // //  Export from Search Tasks page
        // generic_request.POST(
        //     '/api/exports/tasks?exportTime=2025-12-12T14:38:03.949Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "TASKS.CREATION_DATE",
        //             "typeId": 2,
        //             "fieldName": "DateCreated",
        //             "searchCriteriasType": 2,
        //             "searchCriteria": 8,
        //             "model": "2024-12-31T23:00:00.000Z",
        //             "toDate": "2025-05-06T22:00:00.000Z",
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}]
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "DateCreated",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T15:37:31.718Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )
        //
        // // Export from Search Notes page
        // generic_request.POST(
        //     '/api/exports/notes?exportTime=2025-12-12T14:43:04.678Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "GENERAL.CREATED_DATE",
        //             "typeId": 2,
        //             "fieldName": "Date",
        //             "searchCriteriasType": 2,
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}],
        //             "searchCriteria": 23,
        //             "model": null,
        //             "toDate": null
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Date",
        //         "orderByAsc": true,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T15:39:38.332Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        //
        // //  Export from Search Disposal page --> Dev Org#2 286 records
        // generic_request.POST(
        //     '/api/exports/disposals?exportTime=2025-12-12T14:20:52.987Z&fileType=1&iANAZone=Europe%2FBerlin&timeZoneOffset=60',
        //     {
        //         "caseOfficers": [],
        //         "tags": [],
        //         "IsSearchingInSublocations": false,
        //         "DynamicFields": [],
        //         "StaticFields": [{
        //             "name": "ITEMS.DISPOSAL.DISPOSED_BY",
        //             "typeId": 5,
        //             "fieldName": "DisposedById",
        //             "searchCriteriasType": 8,
        //             "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
        //                 "id": 1,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
        //             }],
        //             "isCurrentUserSelected": false,
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "ITEMS.DISPOSAL.DISPOSED_BY.DIVISIONS_UNITS",
        //             "typeId": 5,
        //             "fieldName": "DisposedByDivisionsUnits",
        //             "searchCriteriasType": 5,
        //             "typeAheadTemplate": "<tp-multi-divisions-units-typeahead field=\"field\"name=\"divisionsUnits\" selected-items=\"field.model\"></tp-multi-divisions-units-typeahead>",
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "searchCriteria": 0,
        //             "model": {"items": []}
        //         }, {
        //             "name": "DISPOSAL.DISPOSE_DATE",
        //             "typeId": 2,
        //             "fieldName": "Date",
        //             "searchCriteriasType": 2,
        //             "searchCriterias": [{"id": 6, "name": "TP_SEARCH.SEARCH_CRITERIA.BEFORE"}, {
        //                 "id": 7,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.AFTER"
        //             }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}, {
        //                 "id": 13,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.EXACTLY"
        //             }, {"id": 12, "name": "TP_SEARCH.SEARCH_CRITERIA.NEWER_THAN_X"}, {
        //                 "id": 11,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.OLDER_THAN_X"
        //             }, {"id": 18, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN_X_AND_Y"}, {
        //                 "id": 19,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.CURRENT_WEEK"
        //             }, {"id": 20, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_WEEK"}, {
        //                 "id": 21,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.MONTH_TO_DATE"
        //             }, {"id": 22, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_MONTH"}, {
        //                 "id": 23,
        //                 "name": "TP_SEARCH.SEARCH_CRITERIA.YEAR_TO_DATE"
        //             }, {"id": 24, "name": "TP_SEARCH.SEARCH_CRITERIA.LAST_YEAR"}],
        //             "searchCriteria": 8,
        //             "toDate": "2025-12-11T23:00:00.000Z",
        //             "model": "2024-12-31T23:00:00.000Z"
        //         }, {
        //             "name": "SEARCH.OFFICE_SELECTION",
        //             "typeId": 7,
        //             "fieldName": "OfficeSelection",
        //             "placeholder": "Select an office...",
        //             "searchCriteriasType": 5,
        //             "dropdownEntities": {"entity": "offices"},
        //             "isV2": false,
        //             "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
        //             "selectedElements": [
        //                 {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
        //                     "id": 1130,
        //                     "name": "Web Test Automtion #3 - Cypress Office 2",
        //                     "selected": true
        //                 }],
        //             "searchCriteria": 0
        //         }],
        //         "officeIds": [office1.id],
        //         "custodyOrgIds": [],
        //         "fromOrgIds": [],
        //         "orderBy": "Date",
        //         "orderByAsc": false,
        //         "thenOrderBy": "",
        //         "thenOrderByAsc": false,
        //         "PageSize": 25,
        //         "peopleIds": [],
        //         "PageNumber": 1,
        //         "clientDate": "2025-12-12T14:20:47.315Z",
        //         "clientTz": "Europe/Berlin",
        //         "timezoneOffset": -60,
        //         "SavedSearchEntities": [],
        //         "version": 1
        //     },
        //     "EXPORT Service",
        // )

        // code below is needed like this for each export request from search pages
        /*      , {
            "name": "SEARCH.OFFICE_SELECTION",
            "typeId": 7,
            "fieldName": "OfficeSelection",
            "placeholder": "Select an office...",
            "searchCriteriasType": 5,
            "dropdownEntities": {"entity": "offices"},
            "isV2": false,
            "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
            "selectedElements": [
                {"id": office1.id, "name": "Web Test Automtion #3 - Cypress Office 1", "selected": true}, {
                    "id": 1130,
                    "name": "Web Test Automtion #3 - Cypress Office 2",
                    "selected": true
                }],
            "searchCriteria": 0
        }],
        "officeIds": [office1.id],*/

        // for (let i = 0; i < numberOfRequests; i++) {
        //     D.getNewCaseData()
        //     api.cases.add_new_case(null, null, 'newCase' + i)
        //     cy.wait(3000)
        // }

        // for (let i = 0; i < numberOfRequests; i++) {
        //     cy.getLocalStorage('newCase' + i).then(newCase => {
        //         generic_request.POST(
        //             '/api/exports/case-items/' + 7663616, // case in Org#2 with 8 items
        //             {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
        //             "EXPORT Service",
        //         )
        //     });
        // }

        checkStatusOfJobs()
    });

    it('LOCATIONS MOVE Service', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);

        let currentLocName, currentParentLocName, newParentLocNameOrId
        let destinationOffice = office1

        function checkStatusOfJobs(secondsToWait = 5) {
            cy.wait(secondsToWait * 1000)
            generic_request.GET(
                '/api/locations/moveJobs',
                'response')

            cy.getLocalStorage('apiResponse').then(apiResponse => {
                function printStatuses(apiResponse) {
                    JSON.parse(apiResponse).forEach(item => {
                        if (item.status === 'Complete') {
                            cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                        } else {
                            cy.log(`❌ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${item.status}`);
                        }
                    });
                }

                printStatuses(apiResponse);
            })
        }

        cy.getLocalStorage('headers').then(headers => {

            let updatedHeaders = JSON.parse(headers);
         //   updatedHeaders.officeid = office2.id
            cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))

            function fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }

                api.locations.get_and_save_any_location_data_to_local_storage(newParentLocNameOrId)
            }

            numberOfRequests = 26
            let numberOfItemsInBigLocs = 100

         //   add X number of items to specific locations on root level
            currentParentLocName = null
              for (let i = 1; i < (numberOfRequests+1); i++) {
                  currentParentLocName = '__AAA_Loc1'
                  currentLocName = '____CONT_' + i
                  fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                  for (let j = 0; j < numberOfItemsInBigLocs; j++) {
                      api.items.add_new_item(true, currentLocName)
                  }
              }

            // MOVE X locations
            for (let i = 1; i < numberOfRequests; i++) {

                currentLocName = '____SMJ_BIG_CONT_' + i
                cy.log('Moving location  ' + i)
                // //  -------- moving locations to specific parent location ---> with Locations Update endpoint - PUT request
                // currentParentLocName = null
                // newParentLocNameOrId = '268_parentLoc' // root-level loc in Org#3- Office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location(currentLocName, newParentLocNameOrId, true)


                ////  -------- moving locations to specific parent location within the same office---> with Locations Move endpoint - POST request
                // currentParentLocName = 'BBBB'
                // newParentLocNameOrId = 'AAAA' // root-level loc in Org#3- Office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)

                //// -------- moving locations to specific parent location in office_2---> with Locations Move endpoint - POST request
                 //  newParentLocNameOrId = 542708 // Containers in Dev Org#3- Office2
                 //    newParentLocNameOrId = 1166445 // ___NEW_OFF_2 in Pentest Org#3- Office2
                 //    currentParentLocName = '___AAAA'
                 //    destinationOffice = office2
                 //    fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                 //    api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)
                //
                //
                // cy.getLocalStorage('apiResponse').then(apiResponse => {
                //     let response = JSON.parse(apiResponse)
                //     if (response[0].status === 'Complete') {
                ////  -------- moving locations BACK to specific parent location in office_1---> with Locations Move endpoint - POST request
                // updatedHeaders.officeid = office2.id // need this line only when location is already in office 2, and we need to make API actions from that office
                // cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))
                // currentParentLocName = '___NEW_OFF_2'
                // newParentLocNameOrId = 1162711 // '___AAAA' in Org#3- Office1
                // destinationOffice = office1
                // fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
                // api.locations.move_location_with_request_from_scan_page(currentLocName, newParentLocNameOrId, destinationOffice, orgAdmin)
                //    waitAndCheckStatusOfLastJob()
                //     }
                // })


                //  ---------moving items back to the root level
                // updatedHeaders.officeid = office1.id
                // cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))
                // currentParentLocName = '268_parentLoc'
                // fetch_location_IDs(currentLocName, currentParentLocName)
                // api.locations.move_location_to_root_level(currentLocName)
                //
            }


            function waitAndCheckStatusOfLastJob(secondsToWait = 20) {
                cy.wait(secondsToWait * 1000)
                generic_request.GET(
                    '/api/locations/moveJobs',
                    'response')
                cy.getLocalStorage('apiResponse').then(apiResponse => {
                    let response = JSON.parse(apiResponse)
                    if (response[0].status === 'Complete') {
                        cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                    } else if (response[0].status === 'In Progress') {
                        cy.log(`⚠️ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${response[0].status}`);
                        cy.wait(secondsToWait * 1000)
                        generic_request.GET(
                            '/api/locations/moveJobs',
                            'response')
                        cy.getLocalStorage('apiResponse').then(apiResponse => {
                            let response = JSON.parse(apiResponse)
                            if (response[0].status === 'Complete') {
                                cy.log(`✅ Location Move Job FINISHED SUCCESSFULLY`);
                            } else if (response[0].status === 'In Progress') {
                                cy.log(`⚠️ Location Move Job NOT FINISHED YET, AFTER ${secondsToWait * 2} seconds. Status is: ${response[0].status}`);
                                cy.wait(secondsToWait * 1000)
                            } else {
                                cy.log(`❌ Location Move has status ${response[0].status}. Error Message is: ${response[0].error}`);
                            }
                        })
                    }

                })
            }

            //waitAndCheckStatusOfLastJob()

            // cy.wait(40000)
            // for (let i = 0; i < numberOfRequests; i++) {
            //     validate_CoC_of_few_items_in_specific_location(currentLocName, newParentLocNameOrId)
            // }

            // ************ Validate Items CoC ************

            function fetch_item_last_CoC_record_and_validate_note_about_location_move(itemId, currentLocName, currentParentLocName) {
                api.items.get_item_CoC(itemId)
                cy.getLocalStorage("itemCoC").then(cocResponse => {
                    if (currentParentLocName) {
                        expect(JSON.parse(cocResponse)['coC'][0].notes).to.equal(currentLocName + ' moved to ' + currentParentLocName)
                    } else {
                        expect(JSON.parse(cocResponse)['coC'][0].notes).to.equal(currentLocName + ' moved to root level')
                    }
                })
            }

            function validate_CoC_of_all_items_in_specific_location(currentLocName, currentParentLocName) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }
                api.items.get_items_stored_in_location(currentLocName)

                cy.getLocalStorage("itemIds").then(ids => {
                    JSON.parse(ids).forEach(id => {
                        fetch_item_last_CoC_record_and_validate_note_about_location_move(id, currentLocName, currentParentLocName)
                    })
                })
            }

            function validate_CoC_of_few_items_in_specific_location(currentLocName, currentParentLocName) {
                if (currentParentLocName) {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentParentLocName)
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName, null, currentParentLocName)
                } else {
                    api.locations.get_and_save_any_location_data_to_local_storage(currentLocName)
                }
                api.items.get_items_stored_in_location(currentLocName)

                cy.getLocalStorage("itemIds").then(ids => {
                    fetch_item_last_CoC_record_and_validate_note_about_location_move(JSON.parse(ids)[0], currentLocName, currentParentLocName)

                    fetch_item_last_CoC_record_and_validate_note_about_location_move(JSON.parse(ids)[299], currentLocName, currentParentLocName)
                })
            }


            // for (let i = 0; i < numberOfRequests; i++) {
            //
            //     let currentLocName = 'bigLoc' + i
            //     let currentParentLocName = 'Dec 10, 2025_057_parentLoc'
            //         // currentParentLocName = null // if location is at root level
            //
            //    // validate_CoC_of_all_items_in_specific_location(currentLocName, currentParentLocName)
            //     validate_CoC_of_few_items_in_specific_location(currentLocName, currentParentLocName)
            // }

            //
            // for (let i = 0; i < numberOfRequests; i++) {
            //     // ************ Editing Location Name ************
            //     currentLocName = 'bigLoc-edited' + i
            //    let  newLocName = 'bigLoc' + i
            //     currentParentLocName = 'AAAA'
            //     fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
            //     api.locations.update_location(currentLocName, 'Name', newLocName)
            // }


            // // editing location names of all sublocations --> setting Name = LegacyBarcode
            // for (let i = 0; i < numberOfRequests; i++) {
            //     let parentLocName = '0000001'
            //     api.locations.get_and_save_any_location_data_to_local_storage(parentLocName)
            //     cy.getLocalStorage(parentLocName).then(parentLoc => {
            //         api.locations.get_storage_locations(JSON.parse(parentLoc).id)
            //         cy.getLocalStorage("locations").then(locs => {
            //             JSON.parse(locs).forEach(loc => {
            //                  api.locations.update_location_by_full_loc_object(loc, 'Name', loc.legacyBarcode)
            //             })
            //         })
            //     })
            // }

            // checkStatusOfJobs(10)
        });
    });

    xit('MASS UPDATE BY QUERY Service', function () {
        api.auth.get_tokens(orgAdmin);

        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newItem').then(newItem => {
                generic_request.PUT(
                    '/api/items/massupdateitemsByquery',
                    requestPayloads.actionsByQueryPayload(JSON.parse(newItem).sequentialOrgId),
                    'MASS UPDATE BY QUERY Service'
                )
            });
        }
    });

    xit('PEOPLE MERGE Service', function () {
        api.auth.get_tokens(orgAdmin);

        for (let i = 0; i < numberOfRequests; i++) {
            let person_1, person_2, person_3
            api.people.add_new_person(null, null, D.newPerson, 'person1')
            D.getNewPersonData()
            api.people.add_new_person(null, null, D.newPerson, 'person2')
            D.getNewPersonData()
            api.people.add_new_person(null, null, D.newPerson, 'person3')

            cy.getLocalStorage('person1').then(person1 => {
                cy.getLocalStorage('person2').then(person2 => {
                    cy.getLocalStorage('person3').then(person3 => {
                        person_1 = JSON.parse(person1)
                        person_2 = JSON.parse(person2)
                        person_3 = JSON.parse(person3)

                        generic_request.POST(
                            '/api/people/mergePeople/' + person_1.id,
                            [person_2.id, person_3.id],
                            "PEOPLE MERGE Service",
                        )
                    })
                })
            });
        }
    });

    it('Disposal transactions (start this test after starting some action that causes a CPU spike and heavy load on SQL Server,' +
        'e.g. moving 100+ locations)', function () {
        api.auth.get_tokens_without_page_load(orgAdmin);
        for (let i = 0; i < 10; i++) {
            api.items.add_new_item(true, null, 'newItem' + i)
            cy.log('Adding new item __' + (i + 1))

            api.transactions.dispose_item('newItem' + i)
            cy.log('Item Disposed __' + (i + 1))
        }

        // for (let i = 0; i < 10; i++) {
        //     api.transactions.dispose_item('newItem' + i)
        //     cy.log('Item Disposed __' + (i + 1))
        // }
    })


});


