const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const D = require("../../fixtures/data");

describe('Login page', function () {

    it.only('1.2 Validation messages', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(S.userAccounts.blockedUser);
        cy.clearLocalStorage()

        // wrong username
        ui.open_base_url();
        ui.login.enter_credentials('test@test.com.', 'test');
        // ui.app.click(C.buttons.login)
        //   //  .verify_toast_title('test')
        //     .verify_toast_title(C.validation_msgs.authenticationError)
        //     .verify_toast_message(C.validation_msgs.incorrectCredentials);
        // ui.login.verify_Username_field_has_red_border()
        //
        // // wrong password - 1st attempt
        // ui.login.enter_credentials(S.selectedEnvironment.users.blockedUser.email, 'wrongPass');
        // ui.app.click(C.buttons.login)
        //     .verify_toast_title(C.validation_msgs.authenticationError);
        // ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_1st_attempt);
        //
        // // wrong password - 4th attempt
        // for (let i = 0; i < 3; i++) {
        //     ui.app.click(C.buttons.login);
        //     ui.app.verify_toast_title(C.validation_msgs.authenticationError);
        // }
        // ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_4th_attempt);
        //
        // // wrong password - 5th attempt
        // ui.app.click(C.buttons.login);
        // ui.app.verify_toast_title(C.validation_msgs.authenticationError);
        // ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_5th_attempt);
    });

    context('2. Warning that user is logged in on other browser or device', function () {

        function set_preconditions(testContext) {
            ui.app.log_title(testContext);
            api.auth.get_tokens(S.userAccounts.orgAdmin);
        };

        it('2.1 Cancelling warning keeps user logged in on other machine', function () {
            set_preconditions(this);
            cy.clearLocalStorage();
            ui.open_base_url();

            ui.login.enter_credentials(S.userAccounts.orgAdmin.email, S.userAccounts.orgAdmin.password);
            ui.app.click(C.buttons.login)
                .verify_messages_on_sweet_alert([
                    C.validation_msgs.areYouSure,
                    C.validation_msgs.userLoggedInOnOtherMachine])
                .click_button(C.buttons.cancel)
                .click(C.buttons.login)
                .verify_messages_on_sweet_alert([
                    C.validation_msgs.areYouSure,
                    C.validation_msgs.userLoggedInOnOtherMachine])
        });

        it('2.2 Confirmation on warning modal completes login and logs out user on other machine', function () {
            set_preconditions(this);
            cy.clearLocalStorage();
            ui.open_base_url();

            ui.login.enter_credentials(S.userAccounts.orgAdmin.email, S.userAccounts.orgAdmin.password)
                .click_button(C.buttons.login)
                .verify_messages_on_sweet_alert([
                    C.validation_msgs.areYouSure,
                    C.validation_msgs.userLoggedInOnOtherMachine])
                .pause(1)
                .click_button(C.buttons.yes)
                .verify_text_is_present_on_main_container(C.labels.dashboard.title);
           ui.menu.click_Log_Out()
            ui.menu.click_Login()
            ui.login.enter_credentials(S.userAccounts.orgAdmin.email, S.userAccounts.orgAdmin.password)
                .verify_text_is_present_on_main_container('If you use SAML, please login with your provider')
                .click_button(C.buttons.login)
                .verify_text_is_present_on_main_container(C.labels.dashboard.title);
        });
    });
});

