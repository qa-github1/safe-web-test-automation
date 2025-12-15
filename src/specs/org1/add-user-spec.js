const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const accounts = require('../../fixtures/user-accounts');
const {keep_some_values_in_local_storage} = require("../../api-utils/endpoints/auth");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let systemAdmin = S.getUserData(S.userAccounts.systemAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_officeAdmin = S.selectedEnvironment.admin_permissionGroup;
let startTime;

describe('Add User', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin)
        api.org_settings.set_required_User_forms([])
        startTime = Date.now();

    });

    beforeEach(function () {
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    after(() => {
        const endTime = Date.now();
        const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
        cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
    });

    context('1.1 Org Admin', function () {
        it.only('1.1.1. add user with all fields -- log in with newly created account / activate deactivated User / mass update div & unit / mass update supervisor', function () {

            ui.app.log_title(this);
            D.generateNewDataSet();
            D.newUser.permissionGroups = [S.selectedEnvironment.admin_permissionGroup.name]
            D.getEditedUserData();

            let fieldsLabel =
                C.userSupervisorFieldLabel
            
            let allValues = [
                D.editedUser.supervisors,
                D.editedUser.supervisorGroups
            ]

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

            cy.log(" 🟢🟢🟢 Activate Deactivated User 🟢🟢🟢 ")
            api.auth.get_tokens(orgAdmin);
            api.users.deactivate_previously_created_user();
            ui.menu.click_Settings__User_Admin()
            ui.app.select_radiobutton(C.filters.inactive)
            ui.userAdmin.search_for_user(D.newUser.email)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu('Activate Users')
                .verify_toast_message_('Saved!')
                .pause(1)
            ui.userAdmin.search_for_user(D.newUser.email)
                .verify_content_of_specific_cell_in_first_table_row('Email', D.newUser.email)

            cy.log(" 🟢🟢🟢 Mass Update Div & Unit 🟢🟢🟢 ")
            ui.userAdmin.select_checkbox_on_first_table_row()
            ui.app.click_Actions()
                .click_option_on_expanded_menu('Mass Update User Division and Unit')
            ui.userAdmin.turn_on_and_enter_values_to_mass_update_division_unit_modal(D.editedUser)
                .click_Ok()
            ui.app.verify_toast_message('Saved!')
                .verify_content_of_specific_cell_in_first_table_row('Division', D.editedUser.division)
                .verify_content_of_specific_cell_in_first_table_row('Unit', D.editedUser.unit)
                .click_button('Edit')
                .verify_text_is_present_on_main_container(D.editedUser.division)
                .verify_text_is_present_on_main_container(D.editedUser.unit)
                .click_button('Cancel')

            cy.log(" 🟢🟢🟢 Mass Update Supervisor for Internal User 🟢🟢🟢 ")
            ui.app.click_Actions()
                .verify_content_of_specific_cell_in_first_table_row('Supervisor', D.newUser.supervisors)
                .click_option_on_expanded_menu('Set Supervisors')
            ui.userAdmin.set_supervisors_modal(fieldsLabel, allValues)
            ui.app.click_Ok()
                .verify_messages_on_sweet_alert([C.warning_msgs.overwriteSupervisor])
                .click_button_on_sweet_alert('OK')
            ui.app.verify_toast_message('Saved!')
                .verify_content_of_specific_cell_in_first_table_row('Supervisor', D.editedUser.supervisors)
                .verify_content_of_specific_cell_in_first_table_row('Supervisor', D.editedUser.supervisorGroup)
                .verify_text_is_present_on_main_container(D.editedUser.supervisors)
                .verify_text_is_present_on_main_container(D.editedUser.supervisorGroup)
        });

        it('1.1.2. add user with required fields only', function () {
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

// ToDo: Fix data reference for org2Admin
        if (S.orgNum !== 3) {
            it.only('A.U_3. Verify that External User can be: ' +
                '-- added ' +
                '-- removed ', function () {

                ui.app.log_title(this);
                let org2Admin = S.getUserData(S.userAccounts.org2Admin);
                let externalOffice_id = org2Admin.officeId;

                // Precondition - add user account to OrgB
                D.getNewUserData(externalOffice_id);
                D.newUser.divisionId = null
                D.newUser.unitId = null
                D.newUser.titleRankId = null

                api.auth.get_tokens(org2Admin);
                api.users.add_new_user('user1');
                api.permissions.assign_Org_Admin_permissions_to_user('user1')
                let user = D.newUser;
                // keeping userId so it does not get cleared out from local storage
                cy.getLocalStorage('user1').then((data) => {
                    let userId = JSON.parse(data).id;


                    ui.app.clear_gmail_inbox(S.gmailAccount);

                    // log in as Org Admin in OrgA and add external user
                    api.auth.get_tokens(orgAdmin)
                    ui.menu.click_Settings__User_Admin()
                        .click_button(C.buttons.actions)
                        .click_option_on_expanded_menu(C.dropdowns.userActions.addExternalUsers)
                    ui.userAdmin.enter_emails_for_external_user([user.email])
                        .click_button(C.buttons.addExternal)
                        .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
                        .click_button(C.buttons.save)
                        .verify_toast_message(C.toastMsgs.saved)

                    // Log in with external user (from OrgB) and check that OrgA and OrgB are accessible
                    ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, user)
                        .open_verification_link_from_email()
                        .set_password(D.newUser.password)
                        .scroll_and_click(C.buttons.setPassword)
                        .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
                        .click_button(C.buttons.login)
                    api.auth.get_tokens(user, ['user1'])
                    ui.menu.select_office(S.selectedEnvironment.office_1.orgAndOfficeName)
                        .verify_text_is_present_on_main_container(C.labels.dashboard.title)
                        .select_office(S.selectedEnvironment.org2.orgAndOfficeName)
                        .verify_text_is_present_on_main_container(C.labels.dashboard.title)

                    //remove external user
                    api.auth.get_tokens(orgAdmin)
                    ui.menu.click_Settings__User_Admin()
                    ui.userAdmin.search_for_user(user.email)
                        .remove_external_user()
                        .verify_toast_message(C.toastMsgs.saved)

                    //Post-condition - deactivate previously created user
                    api.auth.get_tokens(org2Admin)
                    api.users.deactivate_users(userId)
                })
            });
        }
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
            //I needed to add this because we have an issue with shared forms and we need to create a CF in every org
            const customFormName = S.customForms[`userFormWithRequiredFields_${S.selectedEnvironment.orgSettings.id}`];


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
            //ui.userAdmin.verify_user_data_on_grid(D.newUser, S.customForms.userFormWithRequiredFields_2, true, 13)
            ui.userAdmin.verify_user_data_on_grid(D.newUser, customFormName, true, 13)

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
