const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const generic_request = require("../../api-utils/generic-api-requests");
let requestPayloads = require('./request-payloads');
let office1 = S.selectedEnvironment.office_1
let office2 = S.selectedEnvironment.office_2
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let numberOfRequests = 10

describe('Services', function () {

    // before(function () {
    //     api.auth.get_tokens_without_page_load(orgAdmin);
    //     D.getCaseDataWithReducedFields()
    //     D.getItemDataWithReducedFields()
    //     api.org_settings.disable_Case_fields()
    //     api.org_settings.disable_Item_fields()
    //     api.cases.add_new_case()
    //     api.items.add_new_item()
    // });

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

        generic_request.POST(
            '/api/exports/case-items/' + S.selectedEnvironment.oldActiveCase.id,
            {"orderBy": "SequentialOrgId", "orderByAsc": false, "thenOrderBy": "", "thenOrderByAsc": false},
            "EXPORT Service",
        )

        for (let i = 0; i < numberOfRequests; i++) {
            D.getNewCaseData()
            api.cases.add_new_case(null, null, 'newCase' + i)
            cy.wait(3000)
        }

        for (let i = 0; i < numberOfRequests; i++) {
            cy.getLocalStorage('newCase' + i).then(newCase => {
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
        api.auth.get_tokens_without_page_load(orgAdmin);

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


        // create root level location with X number of items
        let numberOfBigLocs = 3
        //  let numberOfItemsInBigLocs = 300
        //  for (let i = 0; i < numberOfBigLocs; i++) {
        //      D['bigLoc' + i] = D.getStorageLocationData('bigLoc' + i)
        //      D['bigLoc' + i].name = 'bigLoc' + i
        //    //  api.locations.add_storage_location(D['bigLoc' + i])
        //     api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
        //      api.locations.get_and_save_any_location_data_to_local_storage( 'bigLoc' + i, null, '268_parentLoc')
        // //     api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
        //      for (let j = 0; j < numberOfItemsInBigLocs; j++) {
        //          api.items.add_new_item(true, 'bigLoc' + i)
        //      }
        //  }

        numberOfRequests = 4

        // D['parentLoc'] = D.getStorageLocationData('parentLoc')
        // api.locations.add_storage_location(D['parentLoc'])

        for (let i = 0; i < numberOfRequests; i++) {
            cy.log('Moving location  ' + i)

            // -------- moving locations to newly created parent location ---> with Locations Update endpoint - PUT request
            //  api.locations.get_and_save_any_location_data_to_local_storage(D['parentLoc'].name)
            //  api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
            //  api.locations.move_location('bigLoc' + i, D['parentLoc'].name, true)


            //  -------- moving locations to specific parent location ---> with Locations Update endpoint - PUT request
            //   api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
            //   api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
            //   api.locations.move_location('bigLoc' + i, '268_parentLoc', true)


            //  -------- moving locations to specific parent location within the same office---> with Locations Move endpoint - POST request
            // api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
            // api.locations.get_and_save_any_location_data_to_local_storage('057_parentLoc')
            // api.locations.get_and_save_any_location_data_to_local_storage('bigLoc-edited' + i, null, '057_parentLoc')
            // //  api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
            // api.locations.move_location_with_request_from_scan_page('bigLoc-edited' + i, '268_parentLoc', office1, orgAdmin)

            //  -------- moving locations to specific parent location in another office---> with Locations Move endpoint - POST request
            // api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
            // api.locations.get_and_save_any_location_data_to_local_storage('057_parentLoc')
            // api.locations.get_and_save_any_location_data_to_local_storage('bigLoc-edited' + i, null, '268_parentLoc')
            // //  api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
            // api.locations.move_location_with_request_from_scan_page('bigLoc-edited' + i, 542708, office2, orgAdmin)

        }

        //  ---------moving items back to the root level
        //     for (let i = 0; i < numberOfRequests; i++) {
        //         api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
        //         api.locations.get_and_save_any_location_data_to_local_storage( 'bigLoc' + i, null, '268_parentLoc')
        //         api.locations.move_location_to_root_level('bigLoc' + i)
        //     }


        // ************ Validate Items CoC ************

        function fetch_item_last_CoC_record_and_validate_note_about_location_move(itemId, currentLocName, newParentLocName) {
            api.items.get_item_CoC(itemId)
            cy.getLocalStorage("itemCoC").then(cocResponse => {
                if (newParentLocName){
                    expect(JSON.parse(cocResponse)['coC'][0].notes).to.equal(currentLocName + ' moved to ' + newParentLocName)
                }
                else{
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

        cy.getLocalStorage('headers').then(headers => {
            let updatedHeaders = JSON.parse(headers);
            updatedHeaders.officeid = office2.id // need this line only when location is already in office 2
            cy.setLocalStorage('headers', JSON.stringify(updatedHeaders))

            for (let i = 0; i < numberOfRequests; i++) {

                let currentLocName = 'bigLoc-edited' + i
                let currentParentLocName = 'Containers'
                    // currentParentLocNameOrId = null // if location is at root level

               // validate_CoC_of_all_items_in_specific_location(currentLocName, currentParentLocName)
                validate_CoC_of_few_items_in_specific_location(currentLocName, currentParentLocName)
            }
        })


        /*  for (let i = 0; i < numberOfRequests; i++) {
              // ************ Editing Location Name ************
              api.locations.get_and_save_any_location_data_to_local_storage('268_parentLoc')
              api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i, null, '268_parentLoc')
              api.locations.get_and_save_any_location_data_to_local_storage('bigLoc' + i)
              api.locations.update_location('bigLoc' + i, 'Name', 'bigLoc-edited' + i)
          }*/

        // checkStatusOfJobs(10)
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


