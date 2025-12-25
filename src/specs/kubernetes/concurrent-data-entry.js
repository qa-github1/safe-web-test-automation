const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
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
    });

    it('Concurrent Case Entries with AutoAssigned Case Number', function () {
        api.auth.get_tokens_without_page_load(powerUser);

        let currentLocName, currentParentLocName, newParentLocNameOrId

        cy.getLocalStorage('headers').then(headers => {
            numberOfRequests = 3
            let numberOfCases = 300

            currentLocName = 'aaa'
            currentParentLocName = 'aaaa-office1-newloc1'
            api.locations.fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
            for (let j = 0; j < numberOfCases; j++) {
                api.cases.add_new_case(D.newCase.caseNumber, D.newCase, "newCase" + i, true)
            }
        });
    });

    it('Concurrent Item Entries with AutoAssigned NextCaseNumber and OrgNumber', function () {
        api.auth.get_tokens_without_page_load(powerUser);

        let currentLocName, currentParentLocName, newParentLocNameOrId

        cy.getLocalStorage('headers').then(headers => {
            numberOfRequests = 3
            let numberOfItems = 300

            currentLocName = 'aaa'
            currentParentLocName = 'aaaa-office1-newloc1'
            api.locations.fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
            for (let j = 0; j < numberOfItems; j++) {
                api.items.add_new_item(false, currentLocName)
            }
        });
    });

    it('Concurrent Container Creation from Item Entries with AutoAssigned OrgLevel Container Numbers', function () {
        api.auth.get_tokens_without_page_load(powerUser);

        let currentLocName, currentParentLocName, newParentLocNameOrId

        cy.getLocalStorage('headers').then(headers => {
            numberOfRequests = 3
            let numberOfContainers = 300

            currentLocName = 'aabb'
            currentParentLocName = '010101'
            api.locations.fetch_location_IDs(currentLocName, currentParentLocName, newParentLocNameOrId)
            for (let i = 1; i < 4; i++) {
               // D.newItem.containerModel = {parentId: 1163498, name: "", useAutoNumber: true}
                api.items.add_new_item(true, currentLocName, 'newItem' + i)
            }
            for (let j = 0; j < numberOfContainers; j++) {
               // api.items.add_new_item(true, currentLocName)

               // D.newItem.locationId = 1163498
                api.transactions.add_item_to_container(currentLocName, true, 'newItem1')
                api.transactions.add_item_to_container(currentLocName, true, 'newItem2')
                api.transactions.add_item_to_container(currentLocName, true, 'newItem3')
            }
        });
    });

});


