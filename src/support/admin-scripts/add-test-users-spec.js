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

  //   for (let i =0; i<100; i++){

    // before(function () {
    //     api.auth.get_tokens(orgAdmin)
    // });

    // beforeEach(function () {
    //     ui.app.clear_gmail_inbox(S.gmailAccount);
    // });


    it('Add User '  , function () {
        ui.app.log_title(this);
        ui.app.clear_gmail_inbox(S.gmailAccount);
        api.auth.get_tokens(orgAdmin)
        D.generateNewDataSet(false, false, true);

         api.users.add_new_user('newUser', D.newUser)
         api.permissions.assign_Org_Admin_permissions_to_user('newUser')
         ui.userAdmin.complete_verification_and_set_password_for_new_user_account(D.newUser)
         ui.menu.click_Log_Out()
         ui.login.click_Login_button()

    });


    // it('Add Location ' , function () {
    //     ui.app.log_title(this);
    //     ui.app.clear_gmail_inbox(S.gmailAccount);
    //     api.auth.get_tokens(orgAdmin)
    //
    //     for (let i = 0; i < 10000; i++) {
    //         D.generateNewDataSet(false, false, true);
    //
    //         api.locations.add_storage_location('Apr15_' + D.randomNo)
    //     }
    //
    //
    // });


     // }

});
