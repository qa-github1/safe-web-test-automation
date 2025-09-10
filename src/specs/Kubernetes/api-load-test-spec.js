const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const generic_request = require("../../api-utils/generic-api-requests");
let requestPayloads = require('./request-payloads');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let numberOfRequests = 1

describe('Services', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.cases.add_new_case()
        api.items.add_new_item()

    });

    it.only('REPORT Service', function () {
        api.auth.get_tokens(orgAdmin);

        function checkStatusOfJobs(nameOfReportsInCache, secondsToWait = 30) {
            cy.wait(secondsToWait * 1000)
            nameOfReportsInCache.forEach(reportName => {
                cy.getLocalStorage(reportName).then(reportId => {

                    if (reportId) {
                        generic_request.GET(
                           // '/api/reports/getcompletereport?jobId=' + 707701, // ---> for checking the large report started on Sep 10, for 1,5k items
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

        //start report for case with cca 1k items
            generic_request.POST(
                '/api/reports/buildreport',
                requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
                "REPORT Service",
                'Big_Case_Report'
            )

        //start report for newly created case with 1 item only
        cy.getLocalStorage('newCase').then(newCase => {
            generic_request.POST(
                '/api/reports/buildreport',
                requestPayloads.reporterPayloadFromCaseView([JSON.parse(newCase).id]),
                "REPORT Service",
                'Small_Case_Report'
            )
        });

        //start X reports for 1 item only
        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newItem').then(newItem => {
                generic_request.POST(
                    '/api/reports/buildreport',
                    requestPayloads.reporterPayloadFromItemList(null, [JSON.parse(newItem).id]),
                    "REPORT Service",
                    'Item_Report' + 0
                )
            });
        }
        checkStatusOfJobs(['Big_Case_Report', 'Small_Case_Report', 'Item_Report0']);


    });

    it('EXPORT Service', function () {
        api.auth.get_tokens(orgAdmin);

        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newCase').then(newCase => {
                generic_request.POST(
                    '/api/exports/case-items/' + JSON.parse(newCase).id,
                    {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
                    "EXPORT Service",
                )
            });
        }
    });

    it('LOCATIONS MOVE Service', function () {
        api.auth.get_tokens(orgAdmin);

        api.items.add_new_item(true, D.container1)

        for (let i = 0; i < numberOfRequests; i++) {

            D['container' + i] = D.getStorageLocationData('cont' + i)
            api.locations.add_storage_location(D['container' + i])
            api.locations.update_location(D['container' + i].name, 'isContainer', true)

            cy.getLocalStorage('newItem').then(newItem => {
                generic_request.PUT(
                    '/api/items/massupdateitemsByquery',
                    requestPayloads.actionsByQueryPayload(JSON.parse(newItem).sequentialOrgId),
                    'LOCATIONS MOVE Service'
                )
            });
        }
    });

    it('MASS UPDATE BY QUERY Service', function () {
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


    it('PEOPLE MERGE Service', function () {
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


});
