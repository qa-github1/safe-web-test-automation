const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let systemAdmin = S.getUserData(S.userAccounts.systemAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_officeAdmin = S.selectedEnvironment.admin_permissionGroup;

describe('Add User', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin)
        api.org_settings.set_required_User_forms([])
    });

    beforeEach(function () {
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    context('1.1 Org Admin', function () {
        it('1.1.1. add user with all fields -- log in with newly created account', function () {
            ui.app.log_title(this);
            D.generateNewDataSet();
            D.newUser.permissionGroups = [S.selectedEnvironment.admin_permissionGroup.name]

            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)
            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
                .search_for_user(D.newUser.email)
            ui.userAdmin.verify_user_data_on_grid(D.newUser)
            ui.menu.click_Log_Out()

            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser, ' ')
                .open_verification_link_from_email()
                .set_password(D.newUser.password)
                .scroll_and_click(C.buttons.setPassword)
                .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
                .click_button(C.buttons.login);
            ui.login.enter_credentials(D.newUser.email, D.newUser.password)
                .click_Login_button()
                .verify_text_is_present_on_main_container(C.labels.dashboard.title)
            ui.userAdmin.save_current_user_profile_to_local_storage()

            api.auth.get_tokens(orgAdmin);
            api.users.deactivate_previously_created_user();
        });

        it.only('1.1.2. add user with required fields only', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', false)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', false)
            D.generateNewDataSet(false, false, true);
            D.newUser.division = null
            D.newUser.unit = null
            D.newUser.supervisors = null
            C.pages.userAdmin.numberOfStandardColumns = 21

            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message_(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
                .search_for_user(D.newUser.email)
                .verify_user_data_on_grid(D.newUser)
            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser)

            api.auth.get_tokens(orgAdmin);
            api.users.deactivate_previously_created_user();
        });

        it('1.1.3 validation message for missing permissions', function () {
            ui.app.log_title(this);
            D.getNewUserData();

            api.auth.get_tokens(orgAdmin);
            api.users.add_new_user();

            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser, ' ')
                .open_verification_link_from_email()
                .set_password(D.newUser.password)
                .scroll_and_click(C.buttons.setPassword)
                .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
                .click_button(C.buttons.login);
            ui.login.enter_credentials(D.newUser.email, D.newUser.password)
                .click_Login_button()
                .verify_inline_validation_message(C.login.messages.permissionsNotSet)

            api.auth.get_tokens(orgAdmin);
            api.users.deactivate_previously_created_user();
        });

        it('1.1.4 validation message for inactive user account', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true, null, true);
            D.newUser.active = false

            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message_(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
            ui.menu.click_Log_Out()

            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser)
                .open_verification_link_from_email()
                .set_password(D.newUser.password)
                .scroll_and_click(C.buttons.setPassword)
                .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
                .click_button(C.buttons.login);
            ui.login.enter_credentials(D.newUser.email, D.newUser.password)
                .click_Login_button()
                .verify_inline_validation_message(C.login.messages.inactiveUser)

            api.auth.get_tokens(orgAdmin);
            api.users.deactivate_previously_created_user();
        });

        //if (S.orgNum !== 2) {
        xit('A.U_3. Add External User', function () {
            ui.app.log_title(this);
            let org2Admin = S.getUserData(S.userAccounts.org2Admin);
            let externalOffice_id = org2Admin.officeId;

            // Precondition - add user account to Org2
            D.getNewUserData(externalOffice_id);
            api.auth.get_tokens(org2Admin);
            api.users.add_new_user('user1');
            api.permissions.assign_Org_Admin_permissions_to_user('user1')
            let user1 = D.newUser;

            ui.app.clear_gmail_inbox(S.gmailAccount);

            // Log in as admin in Org1 and add external user
            api.auth.get_tokens(orgAdmin);
            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.userActions.addExternalUsers)
            ui.userAdmin.enter_emails_for_external_user([user1.email])
                .click_button(C.buttons.addExternal)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)

            // Log in with external user (from Org2) and check that Org1 and Org2 are accessible
            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, user1)
                .open_verification_link_from_email()
                .set_password(D.newUser.password)
                .scroll_and_click(C.buttons.setPassword)
                .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
                .click_button(C.buttons.login);

            api.auth.get_tokens(user1, ['user1'])
            ui.menu.select_office(S.selectedEnvironment.office_1.orgAndOfficeName)
                .verify_text_is_present_on_main_container(C.labels.dashboard.title)
                .select_office(S.selectedEnvironment.org2.orgAndOfficeName)
                .verify_text_is_present_on_main_container(C.labels.dashboard.title)

            //post-test cleanup
            api.auth.get_tokens(orgAdmin, ['user1', 'user2']);
            api.users.remove_external_users(['user1', 'user2'])

            api.auth.get_tokens(org2Admin, ['user1', 'user2']);
            api.users.deactivate_users(['user1', 'user2'])
        });
        //  }
    });

    context('1.2 Power User -- all permissions in Office', function () {
        it('1.2.1. Office Admin can create a new user account', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)
            D.generateNewDataSet();
            api.permissions
                .update_ALL_permissions_for_an_existing_Permission_group
                (permissionGroup_officeAdmin, true, true, true, true)

            api.permissions.assign_office_based_permissions_to_user(
                powerUser.id,
                office_1.id, permissionGroup_officeAdmin.id);

            api.auth.get_tokens(powerUser);
            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message_(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
                .search_for_user(D.newUser.email)
                .verify_user_data_on_grid(D.newUser)

            ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser, ' ')
            api.users.deactivate_previously_created_user();
        });
    });

    context('1.3 --- with Custom Forms', function () {

        it('1.3.1 --- with required Custom Form filled out, all required fields on Form', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin)
            D.generateNewDataSet(false, false, true);
            api.org_settings.set_required_User_forms([S.selectedEnvironment.forms.userFormWithRequiredFields])
            D.newUser = Object.assign(D.newUser, D.newCustomFormData)

            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .populate_all_fields_on_Custom_Form(D.newCustomFormData)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message_(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
                .search_for_user(D.newUser.email)
                 ui.userAdmin.verify_user_data_on_grid(D.newUser, C.customForms.usersFormWithRequiredFields_2)

             ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser)
             api.users.deactivate_previously_created_user();
        });

        it('1.3.2 --- with required Custom Form but not filled out, all optional fields on Form', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin)
            D.generateNewDataSet(false, false, true);
            api.org_settings.set_required_User_forms([S.selectedEnvironment.forms.userFormWithOptionalFields])
            D.newUser = Object.assign(D.newUser, D.defaultCustomFormData)

            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message_(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                .click_button(C.buttons.save)
                .verify_toast_message(C.toastMsgs.saved)
                .search_for_user(D.newUser.email)

            api.users.deactivate_previously_created_user();

        });
    });
});
