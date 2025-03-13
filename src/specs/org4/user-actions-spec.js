const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let systemAdmin = S.getUserData(S.userAccounts.systemAdmin);

describe('User Actions', function () {

    beforeEach(function () {
        ui.app.clear_gmail_inbox(S.gmailAccount);
    });

    it('U.A_1. Send verification email', function () {
        ui.app.log_title(this);
        D.getNewUserData();

        api.auth.get_tokens(orgAdmin);
        api.users.add_new_user();
        api.permissions.assign_Org_Admin_permissions_to_user('newUser', D.newUser.officeId)
        ui.menu.click_Settings__User_Admin()
        ui.app.clear_gmail_inbox(S.gmailAccount);
        ui.userAdmin.search_for_user(D.newUser.firstName)
            .select_checkbox_on_first_table_row()
            .click_button(C.buttons.actions)
            .click_option_on_expanded_menu(C.dropdowns.userActions.sendVerificationEmail)
            .verify_toast_message(C.toastMsgs.emailsSent(1))
        ui.menu.click_Log_Out()
        ui.userAdmin.verify_email_content_( D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser)
            .open_verification_link_from_email()
            .set_password(D.newUser.password)
            .scroll_and_click(C.buttons.setPassword)
            .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
            .click_button(C.buttons.login);
        ui.login.enter_credentials(D.newUser.email, D.newUser.password)
            .click_Login_button()
            .verify_text_is_present_on_main_container(C.labels.dashboard.title)

        api.auth.get_tokens(orgAdmin)
        api.users.deactivate_previously_created_user();

    });

});
