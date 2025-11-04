const C = require('../../../fixtures/constants');
const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');
const api = require('../../../api-utils/api-spec');
const ui = require('../../../pages/ui-spec');
const {add_new_case} = require("../../../api-utils/endpoints/cases/collection");


let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

function set_preconditions_for_adding_Case_with_reduced_number_of_fields(testContext) {
    ui.app.log_title(testContext);

    cy.restoreLocalStorage();
    api.auth.get_tokens(user);
    api.org_settings.disable_Case_fields([C.caseFields.tags]);
    D.generateNewDataSet(true);
}

for (let i = 0; i < 1; i++) {
    describe('Tags ', function () {

        beforeEach(function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet();
            D.getNewTagsData();
            D.getEditedTagsData();

        });

        before(function () {
            startTime = Date.now();
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });


        it('1. Create Organization Tag, verify that it is active, edit tag and deactivate it', function () {
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
                .populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagName)
            ui.tags.populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

//activate tag -works but currently commented out due to large number of active tags
//                 .select_checkbox_on_last_row_on_visible_table()
//                 .click_button(C.buttons.actions)
//                 .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
//                 .verify_toast_message("Saved!")
//                 .select_radiobutton(C.buttons.active)
//                 .set_page_size(10)
//                 .click_number_on_pagination("Last")
//                 .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)
            api.auth.log_out(user)


        });

        it('2. Create Group Tag with existing Tag Group, verify that it is active, edit tag and deactivate it', function () {

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "Group"
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.groups)
            ui.tags.set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagName)
            ui.tags.populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)

//deactivate tag
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

//activate tag -works but currently commented out due to large number of active tags
//                 .select_checkbox_on_last_row_on_visible_table()
//                 .click_button(C.buttons.actions)
//                 .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
//                 .verify_toast_message("Saved!")
//                 .select_radiobutton(C.buttons.active)
//                 .set_page_size(10)
//                 .click_number_on_pagination("Last")
//                 .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)
            api.auth.log_out(user)


        });

        it('3. Create Group Tag with a new Tag Group, verify that it is active, edit tag and deactivate it', function () {

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "Group"
            D.newTags.tagGroupName = "new group" + " " + D.getRandomNo()
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.groups)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagName)
            ui.tags.populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)

            //deactivate tag
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

            //activate tag - works but currently commented out due to large number of active tags
            // .select_checkbox_on_last_row_on_visible_table()
            // .click_button(C.buttons.actions)
            // .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
            // .verify_toast_message("Saved!")
            // .select_radiobutton(C.buttons.active)
            // .set_page_size(10)
            // .click_number_on_pagination("Last")
            // .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)
            api.auth.log_out(user)


        });

        it('4. Create User Tag, verify that it is active, edit tag and deactivate it', function () {

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "User"
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.users)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagName)
            ui.tags.populate_edit_tag_modal(D.editedTag)
                .click_save_on_edit_tag_modal()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

            //activate tag - works but currently commented out due to large number of active tags
            // .select_checkbox_on_last_row_on_visible_table()
            // .click_button(C.buttons.actions)
            // .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
            // .verify_toast_message("Saved!")
            // .select_radiobutton(C.buttons.active)
            // .set_page_size(10)
            // .click_number_on_pagination("Last")
            // .verify_content_of_last_row_in_results_table(D.editedTag.editedTagName)
            api.auth.log_out(user)


        });

        it('5. Create Tag Group with Tags, verify that it is active, edit and deactivate Tag Group but not Tags', function () {

            ui.menu.click_Tags();
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.click_add_tag_group_button()
            //  .populate_add_tag_group_modal(D.newTags, 1)
            //  ui.app.verify_text_is_visible("Already exists!")
            D.newTags.tagGroupName = "new group test" + " " + D.getRandomNo()
            ui.tags.populate_add_tag_group_modal(D.newTags)
                .add_tags_on_add_tag_group_modal(D.newTags)
                .click_Ok()
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
                .verify_content_of_last_row_in_results_table(D.newTags.tagGroupName)
            ui.app.verify_content_of_last_row_in_results_table_on_active_tab("1")

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagGroupName)
            ui.tags.populate_edit_tag_group_modal(D.editedTag)
                .click_Ok()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
            ui.app.click_button_on_sweet_alert("No")
                .verify_toast_message("Saved!")
            ui.app.select_tab(C.tabs.tags)
            ui.tags.select_radiobutton(C.buttons.active)
            ui.tags.select_radiobutton(C.buttons.groups)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)
                .verify_content_of_last_row_in_results_table(D.newTags.newTag1)
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagGroupName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

            //activate tag - works but currently commented out due to large number of active tags
            // .select_checkbox_on_last_row_on_visible_table()
            // .click_button(C.buttons.actions)
            // .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
            // .verify_toast_message("Saved!")
            // .select_radiobutton(C.buttons.active)
            // .set_page_size(10)
            // .click_number_on_pagination("Last")
            // .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)
            api.auth.log_out(user)
        });

        it('6. Create Tag Group with Tags, verify that it is active, edit and deactivate Tag Group & Tags', function () {

            ui.menu.click_Tags();
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.click_add_tag_group_button()
            D.newTags.tagGroupName = "new group test" + " " + D.getRandomNo()
            ui.tags.populate_add_tag_group_modal(D.newTags)
                .add_tags_on_add_tag_group_modal(D.newTags)
                .click_Ok()
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagGroupName)
            ui.app.verify_content_of_last_row_in_results_table_on_active_tab("1")

            //edit tag
            ui.app.click_element_by_text(D.newTags.tagGroupName)
            ui.tags.populate_edit_tag_group_modal(D.editedTag)
                .click_Ok()
                .verify_toast_message("Saved!")
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
            ui.app.click_button_on_sweet_alert("Yes")
                .verify_toast_message("Saved!")
            ui.app.select_tab(C.tabs.tags)
            ui.tags.select_radiobutton(C.buttons.inactive)
            ui.tags.select_radiobutton(C.buttons.groups)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)
                .verify_content_of_last_row_in_results_table(D.newTags.newTag1)
            ui.app.select_tab(C.tabs.tagGroups)
            ui.tags.select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.editedTag.editedTagGroupName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

            //activate tag - works but currently commented out due to large number of active tags
            // .select_checkbox_on_last_row_on_visible_table()
            // .click_button(C.buttons.actions)
            // .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
            // .verify_toast_message("Saved!")
            // .select_radiobutton(C.buttons.active)
            // .set_page_size(10)
            // .click_number_on_pagination("Last")
            // .verify_content_of_last_row_in_results_table(D.editedTag.editedTagGroupName)
            api.auth.log_out(user)

        });

        it('7. Create User Tag on Add Case Page', function () {

            api.org_settings.enable_all_Case_fields();
            ui.menu.click_Add__Case();
            ui.addCase.populate_all_fields_on_both_forms(D.newCase)
            ui.caseView.remove_existing_values_on_specific_multi_select_field("Tags")
            ui.tags.add_user_tag_on_edit_modal(D.newTags, 1)
            ui.addCase.select_post_save_action(C.postSaveActions.viewAddedCase)
            ui.app.click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber)
            ui.caseView
                .click_Edit()
                .verify_values_on_Edit_form(D.newTags.tagName)


            //find newly created User Tag
            ui.menu.click_Tags();
            ui.tags.select_radiobutton(C.buttons.users)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)
            api.auth.log_out(user)

        });

        it('8. Create User Tag on Edit Case Page', function () {
            const currentTag = D.newCase.tags[0]

            api.org_settings.enable_all_Case_fields();
            api.cases.add_new_case(D.newCase.caseNumber);

            ui.app.open_newly_created_case_via_direct_link()
            ui.caseView.click_Edit()
                .remove_specific_values_on_multi_select_fields([currentTag])
            ui.tags.add_user_tag_on_edit_modal(D.newTags, 3)
            ui.caseView.click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.tags, D.newTags, true)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.tags, D.newTags, true)
                .open_last_history_record(0)
                .verify_red_highlighted_history_records(C.caseFields.tags)
                .click_cancel_on_history_page()


            //find newly created User Tag
            ui.menu.click_Tags();
            ui.tags.select_radiobutton(C.buttons.users)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)
            api.auth.log_out(user)

        });

        it('9. Create User Tag on Add Item Page', function () {
            D.generateNewDataSet();

            api.org_settings.enable_all_Item_fields();
            ui.menu.click_Add__Item()
            D.newCase.caseNumber = D.newItem.caseNumber
            ui.addItem.populate_all_fields_on_both_forms(D.newItem, false, false)
            ui.caseView.remove_existing_values_on_specific_multi_select_field("Tags")
            ui.tags.add_user_tag_on_edit_modal(D.newTags, 1)
            ui.addCase.select_post_save_action(C.postSaveActions.viewAddedItem)
            ui.app.click_Save()
                .click_Edit()
            ui.caseView.verify_values_on_Edit_form(D.newTags.tagName)


            //find newly created User Tag
            ui.menu.click_Tags();
            ui.tags.select_radiobutton(C.buttons.users)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)
            api.auth.log_out(user)

        });

        it('10. Create User Tag on Edit Item Page', function () {
            const currentTag = D.newCase.tags[0]

            api.org_settings.enable_all_Item_fields()
            api.cases.add_new_case(D.newCase.caseNumber);
            api.items.add_new_item(true);
            ui.app.open_newly_created_item_via_direct_link();
            ui.caseView.click_Edit()
                .remove_specific_values_on_multi_select_fields([currentTag])
            ui.tags.add_user_tag_on_edit_modal(D.newTags, 1)
            ui.itemView.click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.tags, D.newTags, true)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.tags, D.newTags, true)
                .open_last_history_record(0)
                .verify_red_highlighted_history_records(C.itemFields.tags)
                .click_cancel_on_history_page()


            //find newly created User Tag
            ui.menu.click_Tags();
            ui.tags.select_radiobutton(C.buttons.users)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)

                //deactivate tag
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

        });


    });
}

