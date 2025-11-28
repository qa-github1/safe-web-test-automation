const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const generic_request = require("../../api-utils/generic-api-requests");
let requestPayloads = require('./request-payloads');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let numberOfRequests = 20

describe('Services', function () {

    before(function () {
        api.auth.get_tokens_without_page_reload(orgAdmin);
        D.generateNewDataSet();
        api.cases.add_new_case()
        api.items.add_new_item()

    });

    it('REPORT Service', function () {
        api.auth.get_tokens(orgAdmin);

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

        //start report for case with cca 1k items
        // generic_request.POST(
        //     '/api/reports/buildreport',
        //     requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
        //     "REPORT Service",
        //     'Big_Case_Report'
        // )

        //start X big reports
        // for (let i = 0; i < numberOfRequests; i++) {
        //     generic_request.POST(
        //         '/api/reports/buildreport',
        //         requestPayloads.reporterPayloadFromCaseView([S.selectedEnvironment.oldActiveCase.id]),
        //         "REPORT Service",
        //         'Big_Case_Report_' + i
        //     )
        // }

        //start X reports for 1 item only
        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newItem').then(newItem => {
                generic_request.POST(
                    '/api/reports/buildreport',
                    requestPayloads.reporterPayloadFromItemList(null, [JSON.parse(newItem).id]),
                    "REPORT Service",
                    'Item_Report' + i
                )
            });
        }

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
        api.auth.get_tokens(powerUser);

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
                        } else {
                            cy.log(`❌ Export NOT FINISHED YET, AFTER ${secondsToWait} seconds. Status is: ${item.status}`);
                        }
                    });
                }
                printStatuses(apiResponse);
            })
        }

        cy.getLocalStorage('newCase').then(newCase => {
            generic_request.POST(
                '/api/exports/case-items/' + S.selectedEnvironment.oldActiveCase.id,
                {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
                "EXPORT Service",
            )
        });


        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newCase').then(newCase => {
                generic_request.POST(
                    '/api/exports/case-items/' + JSON.parse(newCase).id,
                    {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
                    "EXPORT Service",
                )
            });
        }

        checkStatusOfJobs()
    });

    it.only('LOCATIONS MOVE Service', function () {
        api.auth.get_tokens_without_page_reload(orgAdmin);

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


        for (let i = 0; i < numberOfRequests; i++) {
            cy.log ('adding location  and item' + i)
            D['container' + i] = D.getStorageLocationData('cont' + i)
            api.locations.add_storage_location(D['container' + i])
            api.items.add_new_item(true, D['container' + i])
        }

        for (let i = 0; i < numberOfRequests; i++) {
            cy.log ('Moving location  ' + i)
            api.locations.get_and_save_any_location_data_to_local_storage('Containers')
            api.locations.get_and_save_any_location_data_to_local_storage(D['container' + i].name)
            api.locations.move_location(D['container' + i].name, 'Containers', true)
        }

        checkStatusOfJobs(5)
        // }
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


