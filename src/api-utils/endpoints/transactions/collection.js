const generic_request = require('../../generic-api-requests');
const item_api = require('../../endpoints/items/collection');
const body = require('./payload');

exports.check_out_item = function (itemId) {
    item_api.get_item_data(itemId)
    cy.getLocalStorage("newItem").then(newItem => {
        cy.getLocalStorage("newPerson").then(newPerson => {
            newItem = (newItem !== 'undefined')? JSON.parse(newItem) : null
            newPerson = (newPerson !== 'undefined')? JSON.parse(newPerson) : null

            generic_request.POST(
                '/api/CheckOuts',
                body.generate_POST_request_payload_for_CheckOut(newItem, newPerson),
                'Checking out item via API '
            )
        });
    });
};

exports.dispose_item = function () {
    cy.getLocalStorage("newItem").then(newItem => {
        newItem = JSON.parse(newItem);

        generic_request.POST(
            '/api/disposals',
            body.generate_POST_request_payload_for_Disposal(newItem),
            'Disposing item via API '
        )
    });
};

exports.undispose_item = function () {
    cy.getLocalStorage("newItem").then(newItem => {
        newItem = JSON.parse(newItem);

        generic_request.POST(
            '/api/Disposals/Undispose',
            body.generate_POST_request_payload_for_Undisposal(newItem),
            'Undisposing item via API '
        )
    });
};

exports.move_item = function () {
    cy.getLocalStorage("newItem").then(newItem => {
        newItem = JSON.parse(newItem);

        generic_request.POST(
            '/api/Moves',
            body.generate_POST_request_payload_for_Move(newItem),
            'Moving item via API '
        )
    });
};
