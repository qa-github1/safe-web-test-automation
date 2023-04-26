const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Add Notes - Org1', function () {

    let user = S.getUserData(S.userAccounts.orgAdmin);
    let note = D.getRandomNo() + '_note';

    it.only('A.N_1. Add Note to Case', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link();
        ui.caseView.select_tab(C.tabs.notes)
            .enter_note_and_category(note, C.noteCategories.sensitive)
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .select_tab(C.tabs.notes)
            .verify_content_of_results_table(note + 1)
    });

    it('A.N_2. Add Note to Item', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item(true);

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView.select_tab(C.tabs.notes)
            .enter_note_and_category(note, C.noteCategories.sensitive)
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .select_tab(C.tabs.notes)
            .verify_content_of_results_table(note)
    });

    it('A.N_3. Add Note to Person', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.people.add_new_person(D.newPerson.businessName);

        ui.app.open_newly_created_person_via_direct_link();
        ui.personView.select_tab(C.tabs.notes)
            .enter_note_and_category(note, C.noteCategories.sensitive)
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .select_tab(C.tabs.notes)
            .verify_content_of_results_table(note)
    });

    it('A.N_4. Add Note to Task', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.tasks.add_new_task(note);

        ui.app.open_newly_created_task_via_direct_link();
        ui.taskView.enter_and_save_note(note)
            .verify_toast_message(C.toastMsgs.noteSaved)
            .reload_page()
            .verify_text_is_present_on_main_container(note)
    });
});
