const generic_request = require('../../generic-api-requests');
const body = require('./payload');
const helper = require('../../../support/e2e-helper');
const D = require('../../../fixtures/data');
const S = require('../../../fixtures/settings');

exports.get_locations_by_name = function (fullLocationName) {
    generic_request.GET(
        '/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=' + fullLocationName,
        'Getting Storage location data from typeahead via API ',
        'locs_' + fullLocationName,
        'locations',
    )
    cy.getLocalStorage('locs_' + fullLocationName,).then(matchingLocationsArray => {
        let locs = JSON.parse(matchingLocationsArray)
        cy.setLocalStorage(fullLocationName, JSON.stringify(locs[0]))
        D[fullLocationName] = locs[0]
    })
};

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

function isObject(variable) {
    return Object.prototype.toString.call(variable) === '[object Object]'
}

exports.add_storage_location = function (locationObjectOrName, parentLocationName) {

    let newLocation = {}

    if (isObject(locationObjectOrName)) {
        newLocation = Object.assign({}, locationObjectOrName)
   } else {
      newLocation = Object.assign({},
           {
          "name": locationObjectOrName,
          "active": true,
          "parentId": 0,
          "canStoreHere": true
      })
    }
    return cy.getLocalStorage(parentLocationName).then(parentLoc => {

        newLocation.parentId = parentLoc? JSON.parse(parentLoc).id : 0
        generic_request.POST(
            '/api/locations',
            [newLocation],
            'Adding location via API ' + newLocation.name,
        )
        // Retrieve the specific location and store in local storage by fullLocationName
        this.get_locations_by_name(newLocation.name);
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
    exports.get_locations_by_name(locationName);
    cy.getLocalStorage(locationName).then(specificLocation => {
        let loc ={
            "id": JSON.parse(specificLocation).id,
            "name": JSON.parse(specificLocation).name,
            "active": JSON.parse(specificLocation).active,
         //   "parentId": JSON.parse(specificLocation).parentId,
         //   "parentLocationId": JSON.parse(specificLocation).parentId,
            "canStoreHere": JSON.parse(specificLocation).canStore? JSON.parse(specificLocation).canStore: true
        }

           // JSON.parse(specificLocation)
        loc[propertyName] = propertyValue
        generic_request.PUT(
            '/api/locations/' + loc.id,
            loc,
            log
        )
    })
};

exports.move_location = function (locationName, newParentlocationName) {
    let log;
    exports.get_storage_locations();
    cy.getLocalStorage(newParentlocationName).then(parentLoc => {
        cy.getLocalStorage('locations').then(locationsArray => {
            JSON.parse(locationsArray).forEach(loc => {
                if (loc.name.includes(locationName)) {

                    if (newParentlocationName) {
                        loc.parentId = JSON.parse(parentLoc).id;
                        log = `Moving location (${loc.name}) via API to the new parent location (${JSON.parse(parentLoc).name})`
                    }
                    generic_request.PUT(
                        '/api/locations/' + loc.id,
                        loc,
                        log
                    )
                }
            })
        })
    })
};
//
// exports.get_and_save_new_location_data_to_local_storage = function (locationName, parentLocName) {
//    // const newLocation = { ...D.buildStorageLocationData(locationName)[0] };
//
//     exports.get_locations_by_name(locationName);
//     return cy.getLocalStorage(locationName).then(loc => {
//         // const matchingLoc = JSON.parse(locationsArray).find(loc =>
//         //     loc.name.includes(newLocation.name)
//         // );
//
//        // if (matchingLoc) {
//        //      S.selectedEnvironment[locationName] = matchingLoc;
//        //      S[locationName] = matchingLoc;
//             cy.setLocalStorage(locationName,  loc);
//      //   }
//     });
// };

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


