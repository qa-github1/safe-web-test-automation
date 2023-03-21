const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import Users', function () {

    it('I.U_1 Import and verify User with all fields', function () {
        ui.app.log_title(this);
        let fileName = 'UserImport_allFields_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);

        D.getNewUserData()
        // the next line should be uncommented when we add Supervisor field to Importer -- #14429
        D.newUser.supervisors = null
        E.generateDataFor_USERS_Importer([D.newUser]);
        cy.generate_excel_file(fileName, E.userImportDataWithAllFields);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.users)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);

        ui.menu.click_Settings__User_Admin();
        ui.userAdmin.select_All_Users()
            .search_for_user(D.newUser.email)
            .verify_user_data_on_grid(D.newUser)
    });

    it('I.U_1 Import User with all fields - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'User_PrecheckOnly_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);

        E.generateDataFor_USERS_Importer([D.newUser]);
        cy.generate_excel_file(fileName, E.userImportDataWithAllFields);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.users)
            .verify_toast_message([
                C.toastMsgs.precheckComplete,
                1 + C.toastMsgs.recordsPrechecked]);
    });

});
