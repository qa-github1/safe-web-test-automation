const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let office_1 = S.selectedEnvironment.office_1;
let regularUser_permissionGroup = S.selectedEnvironment.regularUser_permissionGroup;
let admin = S.getUserData(S.userAccounts.orgAdmin);
let regularUser = S.getUserData(S.userAccounts.powerUser);
let startTime;

for (let i = 0; i < 1; i++) {
    describe('Tags ', function () {

        before(function () {
            startTime = Date.now();

            /* SQL CLEANUP COMMAND
             delete from TagModels
            where Name like '%Auto%'
             */

            cy.log(" 🟠 🟠 🟠 Preconditions 🟠 🟠 🟠 ")

            api.auth.get_tokens(admin);
            D.generateNewDataSet()
            D.getCaseDataWithReducedFields([C.caseFields.tags])
            D.getItemDataWithReducedFields(D.newCase, [C.itemFields.tags])
            api.org_settings.disable_Item_fields(C.itemFields.tags)
            api.org_settings.disable_Case_fields(C.caseFields.tags)
            api.cases.add_new_case()
            api.items.add_new_item()
            api.permissions.enable_all_permissions(regularUser_permissionGroup)
            api.permissions.enable_just_Case_and_Item_permissions(regularUser_permissionGroup)
            api.permissions.assign_office_based_permissions_to_user(
                regularUser.id,
                office_1.id,
                regularUser_permissionGroup.id
            );
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. ORGANIZATION Tag -- create, edit, attach to Case, detach, deactivate/reactivate', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('Org');

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
                .populate_add_tag_modal(D.newTag)
                .click_Save()
                .verify_toast_message("Saved!")
                .search(D.newTag.name)
                .verify_content_of_last_row_in_results_table(D.newTag.name)
            ui.app.open_case_url(S.selectedEnvironment.oldActiveCase.id)
                .click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.newTag.name, true)

            //edit tag
            ui.menu.click_Tags();
            ui.tags.search(D.newTag.name)
                .click_element_by_text(D.newTag.name)
                .populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")

            ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
                .verify_text_within_container(S.selectedEnvironment.oldClosedCase.caseNumber)
            ui.caseView.click_Edit()
                .add_Tags([D.editedTag.name])
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)

            //deactivate tag
            ui.menu.click_Tags();
            ui.tags.search(D.editedTag.name)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")

            // verify that deactivated tag is still visible and detach it
            ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
                .click_Edit()
                .verify_text_within_container(D.editedTag.name)
            ui.caseView.remove_specific_values_on_multi_select_fields([D.editedTag.name])
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.editedTag.name, false, true)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_text_is_NOT_present_on_main_container(D.editedTag.name)

            //activate tag
            ui.menu.click_Tags();
            ui.tags.search(D.editedTag.name)
                .select_radiobutton(C.filters.inactive)
                .select_checkbox_on_first_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
            ui.app.open_case_url(S.selectedEnvironment.oldActiveCase.id)
                .click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.editedTag.name, true, true)
        });

        it('2. GROUP Tag with Existing Tag GROUP-- create, edit, attach to Item, detach, deactivate/reactivate', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('Group');

            cy.log(" 🟢🟢🟢 2.1. Create Group TAG with Existing Tag GROUP 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            ui.tags.populate_add_tag_modal(D.newTag, true)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.filters.groups)
                .search(D.newTag.name)
                .verify_content_of_last_row_in_results_table(D.newTag.name)
                .verify_selected_tags_radiobutton_based_on_status(C.filters.active)

            cy.log(" 🟢🟢🟢 2.2. Edit Group Tag 🟢🟢🟢 ")
            ui.tags.click_element_by_text(D.newTag.name)
                .populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .search(D.editedTag.name)
                .verify_content_of_last_row_in_results_table(D.editedTag.name)

            cy.log(" 🟢🟢🟢 2.3. Attach Group Tag to the Item 🟢🟢🟢 ")
            ui.app.open_newly_created_item_via_direct_link()
            ui.itemView.click_Edit()
                .add_Tags([D.editedTag.name])
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)

            cy.log(" 🟢🟢🟢 2.4. Deactivate Group Tag 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.tags.search(D.editedTag.name)
                .select_radiobutton(C.filters.groups)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")

            cy.log(" 🟢🟢🟢 2.6. Verify deactivated tag is still visible and detach it 🟢🟢🟢 ")
            ui.app.open_newly_created_item_via_direct_link()
                .click_Edit()
                .verify_text_within_container(D.editedTag.name)
            ui.itemView.remove_specific_values_on_multi_select_fields([D.editedTag.name])
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.editedTag.name, false)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_text_is_NOT_present_on_main_container(D.editedTag.name)

            cy.log(" 🟢🟢🟢 2.6. Activate Group Tag 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.tags.search(D.editedTag.name)
                .select_radiobutton(C.filters.inactive)
                .select_radiobutton(C.filters.groups)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
            ui.app.open_newly_created_item_via_direct_link()
            ui.itemView.click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.editedTag.name, true)
        });

        it('3. GROUP Tag with New Tag GROUP created at once, edit Tag Group - check availability of tags based on permissions, access to group and item storage location', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('Group');

            cy.log(" 🟢🟢🟢 3.1. Create Group TAG and Tag GROUP 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            ui.tags.populate_add_tag_modal(D.newTag, false, D.newTagGroup)
                .click_Save()
                .verify_toast_message("Saved!")

//******** Regular User with HAS 'Create Group Tag', 'Item Update' permissions and access to Item's Storage Location ********
            //---As Admin, set Permissions and Access to Location
            api.permissions
                .enable_just_Case_and_Item_permissions(regularUser_permissionGroup)
                .set_specific_permission_for_an_existing_Permission_group
                (regularUser_permissionGroup, C.perissionMatrixEntity.tags, C.permissionMatrixAccessType.createGroupTag, true)
                .set_specific_permission_for_an_existing_Permission_group
                (regularUser_permissionGroup, C.perissionMatrixEntity.tags, C.permissionMatrixAccessType.viewOrgTag, true)  // needed until we fix the issue #18531 / 2
            api.locations.update_location(D.newItem.location, 'groups', [regularUser_permissionGroup])

            cy.log(" 🟢🟢🟢  3.2 NON-MEMBER - has permissions and access to location 🟢🟢🟢  ")
            //---As Admin, set Access To Group
            api.permissions.assign_user_to_User_Group(null, D.newTagGroup.userGroups[0])

            //---As Regular User - check access to tag
            api.auth.get_tokens(regularUser);
            ui.app.open_newly_created_item_via_direct_link()
            ui.itemView.click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.newTag.name, false, false)
                .press_ENTER_on_Tags()
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)

            cy.log(" 🟢🟢🟢 3.3. MEMBER (user from Member User Group)- has permissions and access to location  🟢🟢🟢 ")
            //---As Admin, set Access To Group
            api.auth.get_tokens_without_page_load(admin);
            api.permissions.assign_user_to_User_Group(regularUser, D.newTagGroup.userGroups[0])

            //---As Regular User, member of Tag Group through a User Group, check access to tag
            api.auth.get_tokens(regularUser);
            ui.app.open_newly_created_item_via_direct_link()
                .verify_text_is_NOT_present_on_main_container(D.newTag.name)
            ui.itemView.click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.newTag.name, true, false)
                .press_ENTER_on_Tags()
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'Group')

            cy.log(" 🟢🟢🟢 3.4. Admin - Edit Tag Group  🟢🟢🟢 ")
            //---As Admin, set Access To Group and edit Tag GROUP
            api.auth.get_tokens(admin);
            api.permissions.assign_user_to_User_Group(null, D.newTagGroup.userGroups[0])
            ui.menu.click_Tags()
            ui.tags.select_tab(C.tabs.tagGroups)
                .search(D.newTagGroup.name)
                .click_element_by_text(D.newTagGroup.name)
                .populate_edit_tag_group_modal(D.editedTagGroup)
                .click_Ok()
                .verify_toast_message("Saved!")

            cy.log(" 🟢🟢🟢 3.5. MEMBER (user) - has permissions and access to location  🟢🟢🟢 ")
            //---As Regular User, member of Tag Group as individual user, check access to tag
            api.auth.get_tokens(regularUser);
            ui.app.open_newly_created_case_via_direct_link()
            ui.caseView.click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.newTag.name, true, false)
                .press_ENTER_on_Tags()
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'Group')

//******** Regular User with HAS 'Create Group Tag', 'Item Update' permissions but NO access to Item's Storage Location ********

            cy.log(" 🟢🟢🟢 3.6. MEMBER (user) - has permissions but NO access to location  🟢🟢🟢 ")
            //---As Admin, remove Access To Location for Regular User
            api.auth.get_tokens_without_page_load(admin);
            api.locations.update_location(D.newItem.location, 'groups', [])
            api.items.add_new_item()

            //---As Regular User, member of Tag Group, check access to tag
            api.auth.get_tokens(regularUser)
            ui.app.pause(3)
                .open_newly_created_item_via_direct_link()
                .click_Edit()
                .type_Tag_value_and_verify_if_option_is_available_on_dropdown(D.newTag.name, true, false)
                .press_ENTER_on_Tags()
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'Group')
        });

        it('4. Create User Tag, verify that it is active, edit tag, deactivate and activate it again', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('User');

            cy.log(" 🟢🟢🟢 4.1. Create User TAG 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            ui.tags.populate_add_tag_modal(D.newTag)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.filters.users)
                .search(D.newTag.name)
                .verify_content_of_last_row_in_results_table(D.newTag.name)

            cy.log(" 🟢🟢🟢 4.2. Edit User TAG 🟢🟢🟢 ")
            ui.app.click_element_by_text(D.newTag.name)
            ui.tags.populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .search(D.editedTag.name)
                .verify_content_of_last_row_in_results_table(D.editedTag.name)

            cy.log(" 🟢🟢🟢 4.3. Deactivate User TAG 🟢🟢🟢 ")
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .search(D.editedTag.name)
                .select_radiobutton(C.filters.inactive)
                .select_radiobutton(C.filters.users)
                .verify_text_is_visible(D.editedTag.name)

            cy.log(" 🟢🟢🟢 4.4. Activate User TAG 🟢🟢🟢 ")
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .search(D.editedTag.name)
                .select_radiobutton(C.filters.active)
                .select_radiobutton(C.filters.users)
                .verify_content_of_last_row_in_results_table(D.editedTag.name)
        });

        it('5. Create TAG GROUP with Tags as Admin- deactivate Tag Group but not Tags', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('Group');

            cy.log(" 🟢🟢🟢 5.1. Create Tag GROUP 🟢🟢🟢 ")
            ui.menu.click_Tags();
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.click_add_tag_group_button()
            ui.tags.populate_add_tag_group_modal(D.newTagGroup)
                .click_Ok()
                .verify_toast_message("Saved!")
                .search(D.newTagGroup.name)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.name)

            cy.log(" 🟢🟢🟢 5.2. Deactivate Tag GROUP but not Tags🟢🟢🟢 ")
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .click_button_on_sweet_alert("No")
                .verify_toast_message("Saved!")
                .select_tab(C.tabs.tags)
                .select_radiobutton(C.filters.active)
                .select_radiobutton(C.filters.groups)
                .search(D.newTagGroup.groupTag1)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.groupTag1)
                .select_tab(C.tabs.tagGroups)
                .select_radiobutton(C.filters.inactive)
                .search(D.newTagGroup.name)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.name)

            cy.log(" 🟢🟢🟢 5.3. Activate Tag GROUP 🟢🟢🟢 ")
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .search(D.newTagGroup.name)
                .select_radiobutton(C.filters.active)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.name)
        });

        it('6. Create Tag Group with Tags as Regular USer - deactivate Tag Group & Tags', function () {
            //---As Admin, set Permissions and Access to Location
            api.auth.get_tokens(admin);
            api.permissions
                .enable_just_Case_and_Item_permissions(regularUser_permissionGroup)
                .set_CRUD_permissions_for_specific_entity_on_existing_Permission_group
                (regularUser_permissionGroup, C.perissionMatrixEntity.tagGroups, true, null, true, true)
                .set_specific_permission_for_an_existing_Permission_group
                (regularUser_permissionGroup, C.perissionMatrixEntity.tags, C.permissionMatrixAccessType.createGroupTag, true)
                .set_specific_permission_for_an_existing_Permission_group
                (regularUser_permissionGroup, C.perissionMatrixEntity.tags, C.permissionMatrixAccessType.viewOrgTag, true)  // needed until we fix the issue #18531 / 2
            D.getTagsData('Group');


            cy.log(" 🟢🟢🟢 6.1. Create Tag GROUP 🟢🟢🟢 ")
            api.auth.get_tokens(regularUser);
            ui.menu.click_Tags();
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.click_add_tag_group_button()
                .populate_add_tag_group_modal(D.newTagGroup)
                .click_Ok()
                .verify_toast_message("Saved!")
                .search(D.newTagGroup.name)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.name)
                .select_tab(C.tabs.tags)
                .search(D.newTagGroup.groupTag1)
                .select_radiobutton(C.filters.active)
                .select_radiobutton(C.filters.groups)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.groupTag1)

            cy.log(" 🟢🟢🟢 6.2. Edit Tag GROUP 🟢🟢🟢 ")
            ui.tags.select_tab(C.tabs.tagGroups)
                .search(D.newTagGroup.name)
                .click_element_by_text(D.newTagGroup.name)
                .populate_edit_tag_group_modal(D.editedTagGroup)
                .click_Ok()
                .verify_toast_message("Saved!")
                .search(D.editedTagGroup.name)
                .verify_content_of_last_row_in_results_table(D.editedTagGroup.name)
                .select_tab(C.tabs.tags)
                .search(D.newTagGroup.groupTag1)
                .select_radiobutton(C.filters.active)
                .select_radiobutton(C.filters.groups)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.groupTag1)

            cy.log(" 🟢🟢🟢 6.3. Deactivate Tag GROUP AND associated Tags 🟢🟢🟢 ")
            ui.tags.select_tab(C.tabs.tagGroups)
                .search(D.editedTagGroup.name)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .click_button_on_sweet_alert("Yes")
                .verify_toast_message("Saved!")
                .search(D.editedTagGroup.name)
                .select_radiobutton(C.filters.inactive)
                .verify_text_is_visible(D.editedTagGroup.name)
                .select_tab(C.tabs.tags)
                .search(D.newTagGroup.groupTag1)
                .select_radiobutton(C.filters.inactive)
                .select_radiobutton(C.filters.groups)
                .verify_content_of_last_row_in_results_table(D.editedTagGroup.name)
                .verify_content_of_last_row_in_results_table(D.newTagGroup.groupTag1)
        });

        it('7. Create USER Tag on Add and Edit Case Page', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('User');
            D.getCaseDataWithReducedFields([C.caseFields.tags])

            ui.menu.click_Add__Case();
            ui.addCase.populate_all_fields_on_both_forms(D.newCase)
                .add_Tags([D.newTag.name])
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber)
                .open_newly_created_case_via_direct_link()
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'User')
            ui.caseView.click_Edit()
                .remove_specific_values_on_multi_select_fields([D.newTag.name])
                .click_Save()
                .click_Edit()
                .add_Tags([D.newTag.name])
                .click_Save()
                .verify_toast_message('Saved')
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'User')
        });

        it('8. Create USER Tag on Add and Edit Item Page', function () {
            api.auth.get_tokens(admin);
            D.getTagsData('User');

            ui.menu.click_Add__Item();
            ui.addItem.populate_all_fields_on_both_forms(D.newItem)
                .add_Tags([D.newTag.name])
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save()
                .verify_toast_message('saved')
                .verify_text_is_present_on_main_container('Item View')
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'User')
            ui.itemView.click_Edit()
                .remove_specific_values_on_multi_select_fields([D.newTag.name])
                .click_Save()
                .click_Edit()
                .add_Tags([D.newTag.name])
                .click_Save()
                .verify_toast_message('Saved')
                .verify_tag_with_specific_type_is_visible(D.newTag.name, 'User')
        });

    });
}

