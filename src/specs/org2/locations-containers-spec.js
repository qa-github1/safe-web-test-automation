const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let startTime;

for (let i = 0; i < 1; i++) {

    describe('Locations - Containers', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            D.getStorageLocation()
            D.generateNewDataSet();
            //  api.locations.add_storage_location('0 - automation - do not touch')
            startTime = Date.now();
        });

        after(function () {
            //  api.locations.delete_storage_location_by_name(D.editedStorageLocation.parentMoveLocation)
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Add, Edit, Search & Delete Location', function () {

            cy.log(" 🟢🟢🟢  1. Add Storage Location 🟢🟢🟢  ")
            api.locations.add_storage_location('0 - automation - do not touch')
            ui.menu.click_Tools__Storage_Locations()
                .click_button('Add Storage Locations')
            ui.storageLocations.add_storage_location_modal(D.newStorageLocation)
                .click_button('Save')
                .verify_toast_message('1 storage locations successfully added!')
                .verify_location_properties(D.newStorageLocation)
                .search_for_location_on_storage_location_page(D.newStorageLocation.name)

            cy.log(" 🟢🟢🟢  2. Edit Storage Location 🟢🟢🟢  ")
            ui.storageLocations.click_button('Edit Selected Storage Locations')
                .populate_all_fields_and_turn_on_all_toggles_on_edit_storage_location_modal(D.editedStorageLocation)
                .click_button('Save')
                .verify_modal_content(C.modalMsgs.moveLocation)
                .click_button('Proceed')
                .verify_toast_message('Saved!')
                .verify_text_is_present_on_main_container('Location/Container Move Jobs')
                .verify_content_of_first_row_in_results_table('Complete')
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
                .verify_text_is_present_on_main_container(D.editedStorageLocation.name)

            cy.log(" 🟢🟢🟢  3. Hide Containers 🟢🟢🟢  ")
            ui.storageLocations.click_Checkbox('Hide Containers')
            ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
                .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
                .click_Checkbox('Hide Containers')
                .expand_location(D.editedStorageLocation.parentMoveLocation)
                .search_for_location_on_storage_location_page(D.editedStorageLocation.parentMoveLocation)
                .click_button('Edit Selected Storage Locations')
                .click_active_storage_location_toggle_button()
                .click_button('Save')
                .verify_toast_message('Saved!')
                .select_radiobutton(C.filters.inactive)
                .verify_text_is_present_on_main_container(D.editedStorageLocation.parentMoveLocation)
                .select_radiobutton('All')
                .reload_page()

            //TODO: here we can add scenario to see if power user group has access to this storage l
            cy.log(" 🟢🟢🟢 4. MEMBER - has permissions and access to location  🟢🟢🟢 ")

            //---As Power User check access to location
            api.auth.get_tokens(powerUser);
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
                .search_for_location_on_storage_location_page(D.editedStorageLocation.name)
                .click_button('Edit Selected Storage Locations')
                .verify_text_is_present_on_main_container('Power User')
                .click_button(C.buttons.cancel)


            cy.log(" 🟢🟢🟢  5. Delete Storage Location 🟢🟢🟢  ")
            api.auth.get_tokens(orgAdmin);
            ui.menu.click_Tools__Storage_Locations()
            ui.storageLocations.expand_location(D.editedStorageLocation.parentMoveLocation)
                .click_delete_button_in_row_by_location_name(D.editedStorageLocation.name)
                .verify_modal_content(C.modalMsgs.deleteStorageLocation)
                .click_button('Confirm')
                .verify_toast_message('Saved!')
                .verify_text_is_NOT_present_on_main_container(D.editedStorageLocation.name)
            api.locations.delete_storage_location_by_name(D.editedStorageLocation.parentMoveLocation)

        });


        it('2. Create New Container (Item grids -- Actions -- Add to Container)', function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings_by_specifying_property_and_value('useContainerAutoNumbering', false)
            api.org_settings.update_org_settings_by_specifying_property_and_value('useCaseLevelContainerAutoNumbering', false)
            api.cases.add_new_case()
            api.items.add_new_item(true)
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.items)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu(C.dropdowns.itemActions.addToContainer)
            ui.addItem.populate_add_item_to_container_modal(D.editedStorageLocation)
                .click_button(C.buttons.ok)
                .verify_toast_message('Saved!')
                .verify_content_of_specific_cell_in_first_table_row('Storage Location', D.editedStorageLocation.parentStorageLocation + '/' + D.editedStorageLocation.newContainerName)
                .open_newly_created_item_via_direct_link()
                .verify_text_is_present_on_main_container(D.editedStorageLocation.parentStorageLocation + '/' + D.editedStorageLocation.newContainerName)

        });

    });
}
