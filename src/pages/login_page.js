const S = require('../fixtures/settings');
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    username = e => cy.get('[ng-model="credentials.username"]'),
    password = e => cy.get('[ng-model="credentials.password"]'),
    loginButton = e => cy.get('button[type="submit"]'),
    yesButton = e => cy.get('.sa-confirm-button-container'),
    inlineValidationMsg = e => cy.get('.text-danger')

export default class LoginPage extends BasePage {
    constructor() {
        super();
        this.username = username;
    }

//************************************ ACTIONS ***************************************//
    click_Login_button() {
        loginButton().click();
        return this;
    }

    click_Yes() {
        yesButton().should('be.visible');
        yesButton().click('bottom');
        return this;
    }

    enter_credentials (email, pass) {
        cy.url().then(function (currentUrl) {
            if(currentUrl.includes('logout')){
               //cy.log('Opening Login page again after being redirected to logout page');
                cy.visit(S.base_url);
            }
        });
        username().clear().type(email);
        password().clear().type(pass);
        return this;
    };

    verify_inline_validation_message (msg) {
        inlineValidationMsg().should('be.visible');
        inlineValidationMsg().should('contain', msg);
        return this;
    };

    verify_Username_field_has_red_border () {
        username().should('be.visible');
        username().should('have.borderColor', S.colors.redBorder);
        return this;
    };

    verify_Password_field_has_red_border () {
        password().should('be.visible');
        password().should('have.borderColor', S.colors.redBorder);
        return this;
    };
}

