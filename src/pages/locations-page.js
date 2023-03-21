import login from "./ui-spec";

let C = require('../fixtures/constants')
let S = require('../fixtures/settings')
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    locationPlusIcon = (locName) => cy.contains(locName).parent('td').find('.fa-plus'),
    locationName = (locName) => cy.contains(locName).parent('td'),
    locationCheckbox = (locName) => locationName(locName).parent('tr').find('td').eq(0).find('input'),
    locationItems = (locName) => locationName(locName).parent('tr').find('td').eq(2),
    legacyBarcode = (locName) => locationName(locName).parent('tr').find('td').eq(4),
    isActive = (locName) => locationName(locName).parent('tr').find('td').eq(5),
    isStorage = (locName) => locationName(locName).parent('tr').find('td').eq(6),
    isContainer = (locName) => locationName(locName).parent('tr').find('td').eq(7),
    locationGroups = (locName) => locationName(locName).parent('tr').find('td').eq(8).find('[ng-if="col.field !== \'count\'"]')

export default class StorageLocationsPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    expand_Location(name) {
        locationPlusIcon(name).click()
        return this;
    };

    verify_location_properties(locationObject) {
        const locName = locationObject.name;

        locationItems(locName).should('contain', locationObject.items);
        legacyBarcode(locName).should('contain', locationObject.legacyBarcode);
        isActive(locName).should('contain', locationObject.isActive);
        isStorage(locName).should('contain', locationObject.isStorage);
        isContainer(locName).should('contain', locationObject.isContainer);
        locationGroups(locName).should('contain', locationObject.groups);
        return this;
    };


}
