const S = require('../../fixtures/settings')

exports.reporterPayloadFromCaseView = function (caseIdsArray) {
    return {
            "reportId": 7833,
            "mediaIds": null,
            "itemIds": null,
            "caseIds": caseIdsArray,
            "peopleIds": null,
            "savedSearchId": 0,
            "timezoneOffset": 120,
            "iANAZone": "Europe/Berlin",
            "orderByCol": "Id",
            "orderByAsc": false,
            "basedOnEntity": 1,
            "casePeopleReport": false
        }
}

exports.reporterPayloadFromItemList= function (itemIdsArray) {
    return {
        "reportId": 7833,
        "mediaIds": null,
        "itemIds": itemIdsArray,
        "caseIds": null,
        "peopleIds": null,
        "locationIds": null,
        "savedSearchId": 0,
        "timezoneOffset": 120,
        "iANAZone": "Europe/Berlin",
        "orderByCol": "SequentialOrgId",
        "orderByAsc": false,
        "thenOrderByCol": "",
        "thenOrderByAsc": false,
        "casePeopleReport": false
    }
}

exports.actionsByQueryPayload = function (itemOrgNum) {
    return {
        "query": {
            "caseOfficers": [],
            "tags": [],
            "IsSearchingInSublocations": false,
            "DynamicFields": [],
            "StaticFields": [{
                "name": "ITEMS.PRIMARY_CASE_OFFICERS",
                "typeId": 5,
                "fieldName": "PrimaryCaseOfficers",
                "searchCriteriasType": 7,
                "typeAheadTemplate": "<tp-multi-users-and-groups-typeahead field=\"field\" name=\"usersAndGroups\" selected-items=\"field.model\" search-inactive=\"true\"></tp-multi-users-and-groups-typeahead>",
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
                    "id": 26,
                    "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
                }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
                "searchCriteria": 0,
                "model": {"items": []}
            }, {
                "name": "ITEM_SEQUENTIAL_ORG_ID",
                "fieldName": "SequentialOrgId",
                "typeId": 8,
                "searchCriteriasType": 4,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}, {
                    "id": 1,
                    "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"
                }, {"id": 14, "name": "TP_SEARCH.SEARCH_CRITERIA.LESS_THAN"}, {
                    "id": 15,
                    "name": "TP_SEARCH.SEARCH_CRITERIA.GREATER_THAN"
                }, {"id": 16, "name": "TP_SEARCH.SEARCH_CRITERIA.LESS_THAN_OR_EQUAL_TO"}, {
                    "id": 17,
                    "name": "TP_SEARCH.SEARCH_CRITERIA.GREATER_THAN_OR_EQUAL_TO"
                }, {"id": 8, "name": "TP_SEARCH.SEARCH_CRITERIA.BETWEEN"}],
                "searchCriteria": 0,
                "model": itemOrgNum
            }, {
                "name": "NAV.TAGS",
                "typeId": 5,
                "fieldName": "Tags",
                "searchCriteriasType": 7,
                "typeAheadTemplate": "<tp-multi-tag-typeahead field=\"field\" tp-model=\"field.model\"></tp-multi-tag-typeahead>",
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.OR"}, {
                    "id": 26,
                    "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS.AND"
                }, {"id": 1, "name": "TP_SEARCH.SEARCH_CRITERIA.NOT_EQUALS"}],
                "searchCriteria": 0,
                "tags": [],
                "model": "tags"
            }, {
                "name": "SEARCH.OFFICE_SELECTION",
                "typeId": 7,
                "fieldName": "OfficeSelection",
                "placeholder": "Select an office...",
                "searchCriteriasType": 5,
                "titleInfoTooltip": "SEARCH.VISIBILITY_OF_ITEMS_MOVED_TO_OTHER_OFFICES.TOOLTIP",
                "showToolTip": false,
                "dropdownEntities": {"entity": "offices"},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "selectedElements": [{
                    "id": S.selectedEnvironment.office_1.id,
                    "name": "Web Test Automtion #2 - Cypress Office 1",
                    "selected": true
                }],
                "model": [{
                    "id": S.selectedEnvironment.office_1.id,
                    "name": "Web Test Automtion #2 - Cypress Office 1",
                    "selected": true
                }, {"id": 1123, "name": "Web Test Automtion #2 - Cypress Office 2", "selected": true}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.ITEM_SHARING_WITH_ORGANIZATIONS",
                "typeId": 7,
                "fieldName": "CustodyOrgSelection",
                "placeholder": "Select an organization...",
                "useCondition": true,
                "isDisplayed": true,
                "cssStyle": "light-blue",
                "checkboxTitle": "SEARCH.ITEM_SHARING_WITH_ORGANIZATIONS_CHECKBOX",
                "checkboxInfoTooltip": "TOOLTIP.SHARED_ITEMS.SEARCH.CLICK_HERE_TO_SEARCH_IN_SHARED_ITEMS",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "organizations"},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "selectedElements": [{"id": 556, "name": "Web Test Automtion #3", "selected": true}, {
                    "id": 541,
                    "name": "Web Test Automation",
                    "selected": true
                }],
                "model": [{"id": 556, "name": "Web Test Automtion #3", "selected": true}, {
                    "id": 541,
                    "name": "Web Test Automation",
                    "selected": true
                }],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.ITEM_SHARING_FROM_ORGANIZATIONS",
                "typeId": 7,
                "fieldName": "FromOrgSelection",
                "placeholder": "Select an organization...",
                "useCondition": true,
                "isDisplayed": true,
                "cssStyle": "light-blue",
                "checkboxTitle": "SEARCH.ITEM_SHARING_FROM_ORGANIZATIONS_CHECKBOX",
                "checkboxInfoTooltip": "TOOLTIP.SHARED_ITEMS.SEARCH.CLICK_HERE_TO_SEARCH_IN_SHARED_ITEMS",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "organizations"},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "selectedElements": [{"id": 556, "name": "Web Test Automtion #3", "selected": true}, {
                    "id": 541,
                    "name": "Web Test Automation",
                    "selected": true
                }],
                "model": [{"id": 556, "name": "Web Test Automtion #3", "selected": true}, {
                    "id": 541,
                    "name": "Web Test Automation",
                    "selected": true
                }],
                "searchCriteria": 0
            }],
            "officeIds": [S.selectedEnvironment.office_1.id],
            "custodyOrgIds": [556, 541],
            "fromOrgIds": [556, 541],
            "orderBy": "Status",
            "orderByAsc": false,
            "thenOrderBy": "",
            "thenOrderByAsc": false,
            "PageSize": 100,
            "peopleIds": [],
            "PageNumber": 1,
            "clientDate": "2025-09-09T10:55:33.808Z",
            "clientTz": "Europe/Berlin",
            "timezoneOffset": -120,
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
            }, {
                "name": "SEARCH.SAVED_SEARCH.PEOPLE",
                "typeId": 3,
                "fieldName": "SavedSearchId_people",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "people"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.DISPOSALS",
                "typeId": 3,
                "fieldName": "SavedSearchId_disposals",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "disposals"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}, {
                    "id": 98484,
                    "name": "all disposals",
                    "version": 1,
                    "isVersionTwoWithOnlyAnd": false
                }],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.CHECKINS",
                "typeId": 3,
                "fieldName": "SavedSearchId_checkins",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkins"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.CHECKOUTS",
                "typeId": 3,
                "fieldName": "SavedSearchId_checkouts",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "checkouts"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.MOVES",
                "typeId": 3,
                "fieldName": "SavedSearchId_moves",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "moves"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.TRANSFERS",
                "typeId": 3,
                "fieldName": "SavedSearchId_transfers",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "transfers"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }, {
                "name": "SEARCH.SAVED_SEARCH.TASK",
                "typeId": 3,
                "fieldName": "SavedSearchId_task",
                "searchCriteriasType": 5,
                "dropdownEntities": {"entity": "SavedSearches", "options": {"model": "tasks"}},
                "isV2": false,
                "searchCriterias": [{"id": 0, "name": "TP_SEARCH.SEARCH_CRITERIA.EQUALS"}],
                "dropdownValues": [{"id": null, "name": "Select all"}],
                "searchCriteria": 0
            }],
            "version": 1
        },
        "queryAmount": 1,
        "itemMassUpdateActions": {
            "descriptionSelected": true,
            "description": "aaa",
            "recoveryLocationSelected": false,
            "recoveryLocation": "",
            "recoveredBySelected": false,
            "recoveredById": 0,
            "submittedBySelected": false,
            "submittedById": 0,
            "categorySelected": false,
            "custodyReasonSelected": false,
            "recoveryDateSelected": false,
            "recoveryDate": "2025-09-09T10:55:41.340Z",
            "modelSelected": false,
            "model": "",
            "makeSelected": false,
            "make": "",
            "peopleSelected": false,
            "peopleIds": [],
            "peopleNames": [],
            "tagsSelected": false,
            "tagsAction": 0,
            "tags": []
        }
    }

};