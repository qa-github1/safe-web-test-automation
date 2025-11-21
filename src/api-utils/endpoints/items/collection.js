const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');
const generic_request = require('../../generic-api-requests');
const cases = require('../cases/collection');
const body = require('./payload');
const ui = require("../../../pages/ui-spec");

function isObject(variable) {
    return Object.prototype.toString.call(variable) === '[object Object]'
}

exports.add_new_item = function (toNewCase = true, locationObjectOrName = null, propertyToSave = 'newItem', itemObject) {
    let specificLocation

    if (isObject(locationObjectOrName)) {
        specificLocation = Object.assign({}, locationObjectOrName)
    } else {
        specificLocation = Object.assign({},
            {
                "name": locationObjectOrName,
                "active": true,
                "parentId": 0,
                "canStoreHere": true
            })
    }

    cy.getLocalStorage("newCase").then(newCase => {
        cy.getLocalStorage("newPerson").then(newPerson => {
            cy.getLocalStorage(specificLocation.name).then(location => {

                // let caseObject = toNewCase ? JSON.parse(newCase) : null;
                // let locationObject = JSON.parse(location);
                //if (newPerson !== 'undefined') newPerson = JSON.parse(newPerson);

                // we had issue with parse so I changed this commented part
                let caseObject = (toNewCase && newCase && newCase !== "undefined") ? JSON.parse(newCase) : null;

                let locationObject = location && location !== "undefined" ? JSON.parse(location) : null;

                let personObject = (newPerson && newPerson !== "undefined") ? JSON.parse(newPerson) : null;

                generic_request.POST(
                    '/api/items',
                    body.generate_POST_request_payload_for_creating_new_item(itemObject, caseObject, locationObject, newPerson),
                    "New ITEM created via API with ID_______",
                    propertyToSave,
                )
            });
        });
    });
    return this;
};


exports.add_custom_form_data_to_existing_item = function (itemObject) {
    cy.getLocalStorage("newItem").then(newItem => {
        let itemData = Object.assign(JSON.parse(newItem), itemObject);
        itemData.tags = itemObject.tagsForApi
        itemData.barcodes = JSON.parse(newItem).barcodes
        generic_request.PUT(
            '/api/items/' + itemData.id,
            body.generate_PUT_request_payload_for_editing_existing_item(itemData, true),
            'Adding custom form to the existing item via API with ID_______' + itemData.id
        );
    });
    return this;
};

exports.add_custom_form_data_to_existing_item_2 = function (itemObject) {
    cy.getLocalStorage("newItem").then(newItem => {
        let itemData = Object.assign(JSON.parse(newItem), itemObject);
        // TODO:I know that this is the same method as the one above, but
        // I was not able to figure it out why method above passes for workflow
        // and failed if I comment itemData.tags row
        // I will leave like this until Sumejja's review
        itemData.barcodes = JSON.parse(newItem).barcodes
        generic_request.PUT(
            '/api/items/' + itemData.id,
            body.generate_PUT_request_payload_for_editing_existing_item(itemData, true),
            'Adding custom form to the existing item via API with ID_______' + itemData.id
        );
    });
    return this;
};

exports.add_item_to_case = function (existingCaseId) {
    cy.getLocalStorage("newItem").then(newItem => {
        newItem = JSON.parse(newItem);

        generic_request.PUT(
            '/api/items/' + existingCaseId + '/additems/',
            [newItem.id],
            'Added item to the case with id ' + existingCaseId)
    });
};

exports.edit_newly_added_item = function (withCustomFormData = true, randomNo) {
    cy.getLocalStorage("newCase").then(newCase => {
        cy.getLocalStorage("newItem").then(newItem => {
            D.editedItem = D.getEditedItemData(JSON.parse(newCase), null, null, randomNo)
            let itemObject = Object.assign(JSON.parse(newItem), D.editedItem);
            //let itemObject = Object.assign({}, D.editedItem, JSON.parse(newItem));

            itemObject.tags = D.editedItem.tagsForApi

            generic_request.PUT(
                '/api/items/' + itemObject.id,
                body.generate_PUT_request_payload_for_editing_existing_item(itemObject, withCustomFormData),
                'Editing existing item via API with ID_______' + itemObject.id
            );
        });
    });
    return this;
};

exports.get_item_history = function (item) {
    cy.getLocalStorage("headers").then(headers => {
        cy.request({
            url: S.api_url + '/api/items/itemHistory?itemId=' + item.id + '&orderBy=TimeStamp&orderMethodAsc=false&skip=0&top=25',
            method: "GET",
            json: true,
            headers: JSON.parse(headers),
        }).then(response => {
            let seqOrgItemHistoryId = JSON.stringify(response.body.data[0].seqOrgItemHistoryId);
            cy.setLocalStorage("seqOrgItemHistoryId", seqOrgItemHistoryId);
            //cy.log("Item History ID: " + seqOrgItemHistoryId);
        });
    });
};

exports.get_item_data = function (itemId) {
    cy.getLocalStorage("newItem").then(newItem => {
        let id = itemId || JSON.parse(newItem).id
        generic_request.GET(
            '/api/items/' + id + '?count=true&includePeople=true',
            "Fetching the Item Data via API",
            'newItem');
    });
};

exports.get_items_from_specific_case = function (caseNumber, numberOfPagesWith1000Items = 1, storeAllItemsToLocalStorage = false) {
    let barcodes = []

    cy.getLocalStorage("newCase").then(caseData => {
        if (caseNumber === 'newCase') {
            caseNumber = JSON.parse(caseData).caseNumber
        }

        cases.quick_case_search(caseNumber)

        cy.getLocalStorage("currentCase").then(caseData => {
            for (let i = 1; i < numberOfPagesWith1000Items + 1; i++) {

                cy.getLocalStorage("headers").then(headers => {
                    cy.request({
                        url: S.api_url + '/api/cases/' + JSON.parse(caseData).cases[0].id + '/items',
                        method: "POST",
                        json: true,
                        body: {
                            "orderBy": "SequentialCaseId",
                            "orderByAsc": true,
                            "thenOrderBy": "",
                            "thenOrderByAsc": false,
                            "pageSize": 1000,
                            "pageNumber": i
                        },
                        headers: JSON.parse(headers),
                    }).then(response => {
                        let caseItemsObjects = response.body.entities

                        for (let i = 0; i < caseItemsObjects.length; i++) {
                            barcodes.push(caseItemsObjects[i].barcode)
                            if (storeAllItemsToLocalStorage) cy.setLocalStorage("item" + (i + 1), JSON.stringify(caseItemsObjects[i]));
                        }
                    });
                });
            }
            cy.setLocalStorage('barcodes', barcodes)
        })
    })
};

exports.sort_items_in_ASC_order = function (firstSortColumn, secondSortColumn = null) {

    const secondSortOrder = secondSortColumn ? true : null;

    generic_request.POST(
        '/api/customViews/updateOrderBy/19829/' + firstSortColumn + '/true/' + secondSortColumn + '/' + secondSortOrder,
        {},
        'Sorted items in ascending order by ' + firstSortColumn + 'and' + secondSortOrder)
};

