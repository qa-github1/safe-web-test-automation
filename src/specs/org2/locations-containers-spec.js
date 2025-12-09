const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let person = S.getUserData(S.selectedEnvironment.person);
let startTime;

for (let i = 0; i < 1; i++) {

describe('Locations - Containers', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.getStorageLocation()
        D.generateNewDataSet();
        api.locations.add_storage_location('0 - automation - do not touch')
        startTime = Date.now();
    });

    beforeEach(function () {
       // api.locations.add_storage_location('0 - automation - do not touch')
    });

    after(function () {
        api.locations.delete_storage_location_by_name(D.editedStorageLocation.parentMoveLocation)
        const endTime = Date.now();
        const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
        cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
    });

    it('1. Add, Edit, Search & Delete Location', function () {

            //add storage location
        ui.menu.click_Tools__Storage_Locations()
            .click_button('Add Storage Locations')
        ui.storageLocations.add_storage_location_modal(D.newStorageLocation)
            .click_button('Save')
            .verify_toast_message('1 storage locations successfully added!')
            .verify_location_properties(D.newStorageLocation)
            .search_for_location_on_storage_location_page(D.newStorageLocation.name)

            //edit
            .click_button('Edit Selected Storage Locations')
            .populate_all_fields_and_turn_on_all_toggles_on_edit_storage_location_modal(D.editedStorageLocation)
            .click_button('Save')
            .verify_modal_content(C.modalMsgs.moveLocation)
            .click_button('Proceed')
            .verify_toast_message('Saved!')
            .verify_text_is_present_on_main_container('Location/Container Move Jobs')
            // .sort_by_descending_order('Start Date')
            .verify_content_of_first_row_in_results_table('Complete')
        ui.menu.click_Tools__Storage_Locations()
        ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
            .verify_text_is_present_on_main_container(D.editedStorageLocation.name)

            .click_Checkbox('Hide Containers')
        ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
            .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
            .click_Checkbox('Hide Containers')
         .expand_location(D.editedStorageLocation.parentMoveLocation)
         .search_for_location_on_storage_location_page(D.editedStorageLocation.parentMoveLocation)
         .click_button('Edit Selected Storage Locations')
            .click_active_storage_location_toggle_button()
        .click_button('Save')
        .verify_toast_message('Saved!')
             .select_radiobutton('Inactive')
            .verify_text_is_present_on_main_container(D.editedStorageLocation.parentMoveLocation)
            .select_radiobutton('All')
            .reload_page()

            //here we can add scenario to see if power user group has access to this storage l

             //delete
            .expand_location(D.editedStorageLocation.parentMoveLocation)
            .click_delete_button_in_row_by_location_name(D.editedStorageLocation.name)
            .verify_modal_content(C.modalMsgs.deleteStorageLocation)
            .click_button('Confirm')
            .verify_toast_message('Saved!')
            .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)


    });

});
    }
