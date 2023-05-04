const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Add Media', function () {

    let user = S.getUserData(S.userAccounts.orgAdmin);

    it('A.M_1. Add Media to Case', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link();
        ui.caseView.select_tab(C.tabs.media)
            .click_button(C.buttons.add)
            .verify_element_is_visible('Drag And Drop your files here')
            .upload_file_and_verify_toast_msg('image.png')
            .reload_page()
            .select_tab(C.tabs.media)
            .verify_content_of_results_table('image.png')
    });

    it.only('A.M_2. Add Media to Item', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();

        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person();
        api.items.add_new_item(true);

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView.select_tab(C.tabs.media)
            .click_button(C.buttons.add)
            .verify_element_is_visible('Drag And Drop your files here00000')
            .upload_file_and_verify_toast_msg('image.png')
            .reload_page()
            .select_tab(C.tabs.media)
            .verify_content_of_results_table('image.png')
    });

    it('A.M_3. Add Media to Person', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.people.add_new_person();

        ui.app.open_newly_created_person_via_direct_link();
        ui.personView.select_tab(C.tabs.media)
            .click_button_on_active_tab(C.buttons.add)
            .verify_element_is_visible('Drag And Drop your files here')
            .upload_file_and_verify_toast_msg('image.png')
            .reload_page()
            .select_tab(C.tabs.media)
            .verify_content_of_results_table('image.png')
    });

    it('A.M_4. Add Media to Task', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.tasks.add_new_task(D.getRandomNo());

        ui.app.open_newly_created_task_via_direct_link();
        ui.taskView.select_tab(C.tabs.media)
            .click_button_on_active_tab(C.buttons.add)
            .verify_element_is_visible('Drag And Drop your files here')
            .upload_file_and_verify_toast_msg('image.png')
            .reload_page()
            .select_tab(C.tabs.media)
            .verify_content_of_results_table('image.png')
    });
});
