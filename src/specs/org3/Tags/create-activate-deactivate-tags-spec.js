const C = require('../../../fixtures/constants');
const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');
const api = require('../../../api-utils/api-spec');
const ui = require('../../../pages/ui-spec');


let user = S.getUserData(S.userAccounts.orgAdmin);
let startTime;
let randomNo

for (let i = 0; i < 1; i++) {
    describe('Tags ', function () {

        before(function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet();
            D.getNewTagsData();
            startTime = Date.now();
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });


        it('1. Create Organization Tag, verify that it is active, deactivate it and activate again through Actions Menu', function () {

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
                .populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)


                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.active)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)

        });

        it('2. Create Group Tag with existing Tag Group, verify that it is active, deactivate it and activate again through Actions Menu', function () {
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "Group"
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.groups)
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)


                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.active)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)

        });

        it('3. Create Group Tag with a new Tag Group, verify that it is active, deactivate it and activate again through Actions Menu', function () {
            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "Group"
            D.newTags.tagGroupName = "new group" + " " + D.getRandomNo()
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.groups)
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
            ui.tags.select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.active)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)

        });

        it('4. Create User Tag, verify that it is active, deactivate it and activate again through Actions Menu', function () {

            ui.menu.click_Tags();
            ui.tags.click_add_tag_button()
            D.newTags.tagUsedBy = "User"
            ui.tags.populate_add_tag_modal(D.newTags)
                .click_Save()
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.users)
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.active)
                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.deactivate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.inactive)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_text_is_visible(D.newTags.tagName)
                .verify_selected_tags_radiobutton_based_on_status(C.buttons.inactive)

                .select_checkbox_on_last_row_on_visible_table()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.tagActions.activate)
                .verify_toast_message("Saved!")
                .select_radiobutton(C.buttons.active)
                .set_page_size(10)
                .click_number_on_pagination("Last")
                .verify_content_of_last_row_in_results_table(D.newTags.tagName)

        });



    });
}

