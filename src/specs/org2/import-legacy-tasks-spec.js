const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import Tasks', function () {

    it('I.T_1.1 Import Legacy Tasks for Case', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyTasks_allFields_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case();
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_TASKS_Importer(D.newItem, [JSON.parse(newItem).barcode]);
            cy.generate_excel_file(fileName, E.tasksWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.legacyTasks)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    2 + C.toastMsgs.recordsImported]);
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.tasks)
                .verify_text_is_present_on_main_container(E.tasksWithAllFields[1][2])
        });
    });

    it('I.T_1.2 Import Legacy Tasks for Case - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyTasks_precheckOnly_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_TASKS_Importer(D.newItem, [JSON.parse(newItem).barcode]);
            cy.generate_excel_file(fileName, E.tasksWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.legacyTasks)
                .verify_toast_message([
                    C.toastMsgs.precheckComplete,
                    2 + C.toastMsgs.recordsPrechecked]);
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.tasks)
                .verify_text_is_NOT_present_on_main_container(E.tasksWithAllFields[1][2])
        });
    });

    //enable test when running regression test suite
    xit('I.N_5 Five thousand tasks and verify count on search', function () {
        ui.app.log_title(this);
        let fileName = '5kLegacyTasks_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.items.add_new_item();

       //  // Precondition - import 1k items
       // let itemImportfileName = '1k_Items_'+ S.domain;
       //  E.generateDataFor_ITEMS_Importer(D.newItem, false, 50000);
       //  cy.generate_excel_file(fileName, E.fiveThousandItems);
       //
       //  api.org_settings.enable_all_Item_fields();
       //
       //  ui.menu.click_Tools__Data_Import();
       //  ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.items)
       //      .verify_toast_message([
       //          C.toastMsgs.importComplete,
       //          5000 + C.toastMsgs.recordsImported], false, 50000);
       //
       //  // TODO Store item barcodes to array and use that for attachments when generating Task Import Excel

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_TASKS_Importer(D.newItem, [JSON.parse(newItem).barcode], 5000);
            cy.generate_excel_file(fileName, E.tasksWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.legacyTasks)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    2 + C.toastMsgs.recordsImported]);
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.tasks)
                .verify_text_is_NOT_present_on_main_container(E.tasksWithAllFields[1][2])
        });
    });
});
