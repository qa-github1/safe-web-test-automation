const C = require('../../../fixtures/constants');
const S = require('../../../fixtures/settings');
const D = require('../../../fixtures/data');
const api = require('../../../api-utils/api-spec');
const ui = require('../../../pages/ui-spec');
const {enable_all_Case_fields} = require("../../../api-utils/endpoints/org-settings/collection");
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let startTime;

for (let i = 0; i < 10; i++) {

    describe('Task/Case Reassignment', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Case_fields()
            D.generateNewDataSet();
            startTime = Date.now();
        });

        after(function () {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        // it('1. Reassign Active Cases/Tasks is OFF', function () {
        //
        //     api.users.add_new_user()
        //
        //     cy.getLocalStorage('newUser').then(user => {
        //         const newUser = JSON.parse(user)
        //         D.newTask.assignedUserIds = D.newCase.caseOfficerIds = [newUser.id]
        //         api.cases.add_new_case();
        //         api.tasks.add_new_task()
        //
        //         ui.menu.click_Settings__User_Admin()
        //         ui.userAdmin.search_for_user(newUser.email)
        //             .select_checkbox_on_first_table_row()
        //             .click_Actions()
        //             .click_option_on_expanded_menu('Deactivate Users')
        //             .turn_off_reassign_tasks_and_cases_modal()
        //             .click_Ok()
        //             .verify_toast_message('Saved')
        //             .pause(1)
        //         ui.userAdmin.search_for_user(newUser.email)
        //         ui.app.select_radiobutton(C.filters.inactive)
        //             .verify_content_of_first_row_in_results_table(newUser.email)
        //             .open_newly_created_case_via_direct_link()
        //             .click_Edit()
        //         D.newCase.caseOfficers = newUser.firstLastName
        //         ui.caseView.verify_values_on_Edit_form(D.newCase)
        //             .open_newly_created_task_via_direct_link()
        //         ui.taskView.verify_content_on_assigned_to_field(newUser.name)
        //
        //     })
        // });

        // it('2. Reassign Cases/Tasks to User(s) with "Keep deactivated user(s) shown" selected', function () {
        //
        //     // api.auth.get_tokens(orgAdmin);
        //     // D.generateNewDataSet();
        //     api.users.add_new_user()
        //
        //     cy.getLocalStorage('newUser').then(user => {
        //         const newUser = JSON.parse(user)
        //         D.newTask.assignedUserIds = D.newCase.caseOfficerIds = [newUser.id]
        //         api.cases.add_new_case();
        //         api.tasks.add_new_task()
        //
        //         ui.menu.click_Settings__User_Admin()
        //         ui.userAdmin.search_for_user(newUser.email)
        //             .select_checkbox_on_first_table_row()
        //             .click_Actions()
        //             .click_option_on_expanded_menu('Deactivate Users')
        //             .enter_values_on_reassign_modal([orgAdmin.fullName])
        //         cy.log(" 🟢🟢🟢 \"Keep deactivated user(s) shown\" selected 🟢🟢🟢 ")
        //         ui.app.click_Ok()
        //             .verify_toast_message('Processing...')
        //             .verify_text_is_present_on_main_container('Reassign Tasks and Cases After Deactivating the User(s)')
        //             .verify_content_of_first_row_in_results_table([newUser.email, 'Complete'])
        //             .open_newly_created_case_via_direct_link()
        //             .click_Edit()
        //         D.newCase.caseOfficers = [D.newUser.firstLastName, orgAdmin.name]
        //         ui.caseView.verify_values_on_Edit_form(D.newCase)
        //             .open_newly_created_task_via_direct_link()
        //         ui.taskView.verify_content_on_assigned_to_field(newUser.name)
        //         ui.taskView.verify_content_on_assigned_to_field(orgAdmin.name)
    //.verify_text_is_present_on_main_container("Task was Reassigned.")

        //     })
        // });
        //

        it.only('3. Reassign Cases/Tasks to User(s) with "Keep deactivated user(s) shown" unchecked', function () {

            // api.auth.get_tokens(orgAdmin);
            // D.generateNewDataSet();
            api.users.add_new_user()

            cy.getLocalStorage('newUser').then(user => {
                const newUser = JSON.parse(user)
                D.newTask.assignedUserIds = D.newCase.caseOfficerIds = [newUser.id]
                api.cases.add_new_case();
                api.tasks.add_new_task()

                ui.menu.click_Settings__User_Admin()
                ui.userAdmin.search_for_user(newUser.email)
                    .select_checkbox_on_first_table_row()
                    .click_Actions()
                    .click_option_on_expanded_menu('Deactivate Users')
                    .enter_values_on_reassign_modal([orgAdmin.fullName], false)
                cy.log(" 🟢🟢🟢 \"Keep deactivated user(s) shown\" unselected 🟢🟢🟢 ")
                ui.app.click_Ok()
                    .verify_toast_message('Processing...')
                    .verify_text_is_present_on_main_container('Reassign Tasks and Cases After Deactivating the User(s)')
                    .verify_content_of_first_row_in_results_table([newUser.email, 'Complete'])
                    .open_newly_created_case_via_direct_link()
                    .click_Edit()
                D.newCase.caseOfficers = [orgAdmin.name]
                ui.caseView.verify_values_on_Edit_form(D.newCase)
                    .open_newly_created_task_via_direct_link()
                ui.taskView.verify_content_on_assigned_to_field(orgAdmin.name)
                    .verify_text_is_present_on_main_container("Task was Reassigned.")
            })
        });


    });
}
