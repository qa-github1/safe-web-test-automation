const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const helper = require('../../../support/e2e-helper');
const D = require('../../../fixtures/data');
const S = require('../../../fixtures/settings');

exports.get_storage_locations = function (parentLocationId = 0) {
    generic_request.GET(
        '/api/locations/childrenOrRoots?parentLocationId=' + parentLocationId,
        'Fetching storage locations via API ',
        'locations',
        'locations',
    )
};

exports.set_Permission_Groups_to_Storage_Location = function (location, groupsArray) {
    generic_request.PUT(
        '/api/locations/' + location.id,
        body.generate_POST_request_payload_for_Adding_Groups_to_Locations(location, groupsArray),
        "Locatio/ Permission Groups updated via API")
    return this
};

exports.get_all_accessible_storage_locations = function () {
    generic_request.GET(
        '/api/locations/typeahead?accessibleOnly=true&hideOverlay=true&search=%2F',
        'Fetching accessible storage locations via API ',
        'locations',
        'locations',
    )
};

exports.add_storage_location = function (locationSuffix, parentLocSuffix) {

    let newLocation = Object.assign({}, D.getStorageLocationData(locationSuffix)[0])

    cy.getLocalStorage(parentLocSuffix).then(parentLoc => {
        newLocation.parentId = (parentLoc && (parentLoc !== 'null')) ? JSON.parse(parentLoc).id : 0;

        generic_request.POST(
            '/api/locations',
            [newLocation],
            'Adding child location via API ' + newLocation.name
        )
        exports.get_and_save_new_location_data_to_local_storage(locationSuffix, newLocation.parentId);
    });
};

exports.delete_empty_storage_locations = function () {

    let locationId = null;

    exports.get_storage_locations();
    cy.getLocalStorage('locations').then(locationsArray => {
        JSON.parse(locationsArray).forEach(loc => {
            if (loc.count === 0) {
                locationId = loc.id

                generic_request.DELETE(
                    '/api/locations/' + locationId,
                    {id: locationId},
                    'Deleting location(s) via API '
                )
            }
        })
    })
};

exports.update_location = function (locationName, propertyName, propertyValue) {
    let log;
    exports.get_storage_locations();
    cy.getLocalStorage(locationName).then(specificLocation => {
        let loc = JSON.parse(specificLocation)
        loc[propertyName] = propertyValue
        generic_request.PUT(
            '/api/locations/' + loc.id,
            loc,
            log
        )
    })
};

exports.move_location = function (locationSuffix, newParentLocationSuffix) {
    let log;
    exports.get_storage_locations();
    cy.getLocalStorage(newParentLocationSuffix).then(parentLoc => {
        cy.getLocalStorage('locations').then(locationsArray => {
            JSON.parse(locationsArray).forEach(loc => {
                if (loc.name.includes(locationSuffix)) {

                    if (newParentLocationSuffix) {
                        loc.parentId = JSON.parse(parentLoc).id;
                        log = `Moving location (${loc.name}) via API to the new parent location (${JSON.parse(parentLoc).name})`
                    }
                }
                generic_request.PUT(
                    '/api/locations/' + loc.id,
                    loc,
                    log
                )
            })
        })
    })
};

exports.get_and_save_new_location_data_to_local_storage = function (locationSuffix, parentLocId) {

    let newLocation = Object.assign({}, D.getStorageLocationData(locationSuffix)[0])

    exports.get_storage_locations(parentLocId);
    cy.getLocalStorage('locations').then(locationsArray => {
        JSON.parse(locationsArray).forEach(loc => {

            if (loc.name.includes(newLocation.name)) {
                D.getStorageLocationData(locationSuffix)[0] = loc
                S.selectedEnvironment[locationSuffix] = loc
                S[locationSuffix] = loc
                cy.setLocalStorage(locationSuffix, JSON.stringify(loc))
            }
        })
    })
};

exports.get_and_save_any_location_data_to_local_storage = function (fullOrPartialLocationName, parentLocId) {

    exports.get_storage_locations(parentLocId);
    cy.getLocalStorage('locations').then(locationsArray => {
        JSON.parse(locationsArray).forEach(loc => {

            if (loc.name.includes(fullOrPartialLocationName)) {
                S.selectedEnvironment[fullOrPartialLocationName] = loc
                cy.setLocalStorage(fullOrPartialLocationName, JSON.stringify(loc))
            }
        })
    })
};


