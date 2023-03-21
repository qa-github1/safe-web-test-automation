const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Login page', function () {

    context('1. Validation messages when having', function () {

        it('1.1 Missing credentials', function () {
            ui.app.log_title(this);
            ui.open_base_url();
            ui.app.click(C.buttons.login)
                .verify_toast_title(C.validation_msgs.authenticationError)
                .verify_toast_message(C.validation_msgs.incorrectCredentials);
            ui.login.verify_Username_field_has_red_border()
        });

        it('1.2 Wrong credentials', function () {
            ui.app.log_title(this);

            ui.open_base_url();
            ui.login.enter_credentials('test', 'test');
            ui.app.click(C.buttons.login)
                .verify_toast_title(C.validation_msgs.authenticationError)
                .verify_toast_message(C.validation_msgs.incorrectCredentials);
        });

        context('1.3 Correct username but wrong password', function () {

            function set_preconditions(testContext) {
                ui.app.log_title(testContext);
                // login and logout in order to clean state - in case user has entered wrong password previously
                api.auth.login_and_logout(S.userAccounts.orgAdmin);
                ui.open_base_url();
            };


            it('1.3.1 Wrong password_ 1st attempt', function () {
                set_preconditions(this);

                ui.login.enter_credentials(S.userAccounts.orgAdmin.email, 'wrongPass');
                ui.app.click(C.buttons.login)
                    .verify_toast_title(C.validation_msgs.authenticationError);
                ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_1st_attempt);
            });

            it('1.3.2 Wrong password_ 4th attempt', function () {
                set_preconditions(this);

                ui.login.enter_credentials(S.userAccounts.orgAdmin.email, 'wrongPass');
                for (let i = 0; i < 4; i++) {
                    ui.app.click(C.buttons.login);
                }
                ui.app.verify_toast_title(C.validation_msgs.authenticationError);
                ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_4th_attempt);
            });

            it('1.3.3 Wrong password_ 5th attempt- verify user gets locked', function () {
                set_preconditions(this);

                ui.login.enter_credentials(S.userAccounts.orgAdmin.email, 'wrongPass');
                for (let i = 0; i < 5; i++) {
                    ui.app.click(C.buttons.login);
                }
                ui.app.verify_toast_title(C.validation_msgs.authenticationError);
                ui.login.verify_inline_validation_message(C.validation_msgs.wrongPassword_5th_attempt);
            });
        });
    });

    context('2. Warning that user is logged in on other browser or device', function () {

        function set_preconditions(testContext) {
            ui.app.log_title(testContext);
            api.auth.get_tokens(S.userAccounts.systemAdmin);
        };

        it('2.1 Cancelling warning keeps user logged in on other machine', function () {
            set_preconditions(this);
            cy.clearLocalStorage();
            ui.open_base_url();

            ui.login.enter_credentials(S.userAccounts.systemAdmin.email, S.userAccounts.systemAdmin.password);
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

            ui.login.enter_credentials(S.userAccounts.systemAdmin.email, S.userAccounts.systemAdmin.password)
                .click_button(C.buttons.login)
                .verify_messages_on_sweet_alert([
                    C.validation_msgs.areYouSure,
                    C.validation_msgs.userLoggedInOnOtherMachine])
                .click_button(C.buttons.yes)
                .verify_text_is_present_on_main_container(C.labels.dashboard.title);
            api.auth.log_out(S.userAccounts.systemAdmin);
        });
    });
});

