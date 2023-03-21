import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    currentPasswordField = e => cy.get('[name="currentPassword"]'),
    newPasswordField = e => cy.get('[model="pw.newPassword"]')

export default class UserSettingsPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    enter_current_and_new_password(currentPassword, newPassword) {
       currentPasswordField().click().type(currentPassword)
       newPasswordField().click().type(newPassword)
        return this;
    };


}
