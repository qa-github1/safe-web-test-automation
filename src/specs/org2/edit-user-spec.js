const S = require('../../fixtures/settings');
const C = require('../../fixtures/constants');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);

describe('Edit User', function () {
//TODO: Sumejja should check further
    xit('1 Edit newly added user, change all values, verify on the grid, and check all/active/inactive filters', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getUserData();
            api.users.add_new_user()
            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)


        ui.menu.click_Settings__User_Admin()
            ui.userAdmin.search_for_user(D.newUser.email)
                .verify_user_data_on_grid(D.newUser)
                .scroll_and_click(C.buttons.edit)
                .edit_values(D.editedUser)
                .scroll_and_click(C.buttons.ok)
                .turn_off_reassign_tasks_and_cases_modal()
                .verify_toast_message(C.toastMsgs.saved)
                .select_All_Users()
                .search_for_user(D.editedUser.email)
                .verify_user_data_on_grid(D.editedUser, false, false)
                .select_Active_Users()
                .search_for_user(D.editedUser.email)
                .verify_records_count_on_grid(0)
                .select_Inactive_Users()
                .verify_content_of_first_row_in_results_table(D.editedUser.email)
        });
//TODO: Sumejja should check further

        xit('2.1 Add User to a Group, then add to another Group --> Verify that previous User Group is not overwritten', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewUserData();
            api.users.add_new_user()
            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)

            let userAssignedToGroup = Object.assign({}, D.newUser, {
                userGroups: S.selectedEnvironment.admin_userGroup.name
            });

            ui.menu.click_Settings__User_Admin()
            ui.userAdmin.search_for_user(D.newUser.email)
                .add_user_to_group(S.selectedEnvironment.admin_userGroup.name)
                 .verify_user_data_on_grid(userAssignedToGroup, false, true)
                .reload_page()
                .search_for_user(D.newUser.email)
                .verify_user_data_on_grid(userAssignedToGroup);

            let userAssignedToGroups = Object.assign({}, userAssignedToGroup, {
                userGroups: [
                    S.selectedEnvironment.admin_userGroup.name,
                    S.selectedEnvironment.readOnly_userGroup.name
                ]
            });

            ui.userAdmin.add_user_to_group(S.selectedEnvironment.readOnly_userGroup.name)
                .verify_user_data_on_grid(userAssignedToGroups, false, false);
         });
});
