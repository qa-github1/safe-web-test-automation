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
    locationGroups = (locName) => locationName(locName).parent('tr').find('td').eq(8).find('[ng-if="col.field !== \'count\'"]'),
    addStorageLocationModal = e => cy.get('[ng-model="locationsToAdd"]'),
    searchLocationField = e => cy.get('[ng-model="model.locationId"]'),
    storageLocationNameField = e => cy.get('[name="locationName"]'),
    storageLocationGroupField = e => cy.get('[ng-model="location.groups"]'),
    storageLocationLegacyBarcodeField = e => cy.get('[ng-model="location.legacyBarcode"]'),
    storageLocationCanStoreHereToggleButton = e => cy.get('[ng-model="location.canStoreHere"]'),
    storageLocationActiveToggleButton = e => cy.get('[ng-model="location.active"]'),
    storageLocationContainerToggleButton = e => cy.get('[ng-model="location.isContainer"]'),
    moveLocationToToggleButton = e => cy.get('[ng-model="toggle.moveLocationTo"]'),
    moveLocationToDropdownOption = e => cy.get('[placeholder="type ‘/‘ or start typing a location name"]').eq(1),
    activeInactiveRadiobuttons = e => cy.get('[class="form-group"]').eq(0)

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

    add_storage_location_modal(data) {
        addStorageLocationModal().type(data.name);
        return this;
    }

    search_for_location_on_storage_location_page(data) {
        searchLocationField().type(data)
        this.pause(2)
        searchLocationField().type('{enter}')
        return this;
    }

    turn_on_and_enter_values_to_all_fields_on_edit_storage_location_modal(labelsArray, valuesArray) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Container'].some(v => label === v)) {
                this.turnOnToggle(label)

            } else if (['Name', 'Legacy Barcode'].some(v => label === v)) {
                this.turnOnToggleAndEnterValueInTextarea(label, value)

                // } else if (['Case Officer(s)'].some(v => label === v)) {
                //     this.turnOnToggleAndSelectTypeaheadOptionsOnMultiSelectField(label, value)

            } else if (['Groups'].some(v => label === v)) {
                this.turnOnToggleAndEnterValueToInputFieldWithLastCharacterReentering(label, value, this.typeaheadSelectorMatchInMatches)
                firstMatchOnTypeahead().click()

                // }
                // else if (['Item Belongs to'].some(v => label === v)) {
                //     this.turnOnToggleAndEnterValueToInputField(label, value)
                //     firstPersonOnItemBelongsToTypeahead().click()

            } else {
                this.turnOnToggleEnterValueAndPressEnter(label, value)
            }
        }
        return this
    }

    populate_all_fields_and_turn_on_all_toggles_on_edit_storage_location_modal(data) {
        storageLocationNameField().clear().type(data.name);
        storageLocationGroupField().clear().type(data.groups).type('{enter}')
        storageLocationLegacyBarcodeField().clear().type(data.legacyBarcode);
        //storageLocationContainerToggleButton().click()

        storageLocationCanStoreHereToggleButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if ($btn.hasClass('btn-default') && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if ($btn.hasClass('btn-primary')) {
                    cy.log('Toggle is already ON');
                }
            });
        storageLocationContainerToggleButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if ($btn.hasClass('btn-default') && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if ($btn.hasClass('btn-primary')) {
                    cy.log('Toggle is already ON');
                }
            });
        storageLocationActiveToggleButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if ($btn.hasClass('btn-default') && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if ($btn.hasClass('btn-primary')) {
                    cy.log('Toggle is already ON');
                }
            });
        moveLocationToToggleButton()
            .find('.toggle.btn.btn-sm')
            .then(($btn) => {
                if ($btn.hasClass('btn-default') && $btn.hasClass('off')) {
                    cy.wrap($btn).click();
                } else if ($btn.hasClass('btn-primary')) {
                    cy.log('Toggle is already ON');
                }
            });
        moveLocationToDropdownOption().type(data.parentMoveLocation)
        this.pause(1)
        moveLocationToDropdownOption().type('{enter}')
        return this;
    }

    expand_location(text, tableIndex = 0) {
        const regex = new RegExp(`^\\s*${text}\\s*$`);

        cy.get('table')
            .eq(tableIndex)
            .contains('td', regex)
            .within(() => {
                cy.get('[ng-class="location.icon"]').click({ force: true });
            });
        return this;
    }

    click_delete_button_in_row_by_location_name(locationName, tableIndex = 0) {
        const regex = new RegExp(`^\\s*${locationName}\\s*$`);

        cy.get('table')
            .eq(tableIndex)
            .contains('td', regex)
            .parents('tr')
            .within(() => {
                cy.get('[title="Delete Storage Location"]')
                    .click({ force: true });
            });
        return this;
    }

click_active_storage_location_toggle_button(){
        storageLocationActiveToggleButton().click();
        return this;
}

    select_radiobutton(labelText) {
        activeInactiveRadiobuttons().should('exist').within(() => {
            cy.contains('label span', new RegExp(`^\\s*${labelText}\\s*$`, 'i'))
                .closest('label')
                .find('input[type="radio"]')
                .wait(300)
                .check({force: true});
        });
        return this;
    }

}
