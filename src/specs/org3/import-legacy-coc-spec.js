const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import Legacy Chain of Custody', function () {

    let user = S.userAccounts.orgAdmin;

    before(function () {
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case();
    });

    it('1 Import Legacy Chain of Custody - Checked In transaction', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_allFields_'+ S.domain;
        api.auth.get_tokens(user);
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_CoC_Importer(D.newItem, JSON.parse(newItem).barcode, 5);
            cy.generate_excel_file(fileName, E.chainOfCustodyWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.legacyCoC)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    5 + C.toastMsgs.recordsImported]);
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.chainOfCustody)
                //.verify_content_of_sequential_rows_in_results_table()
                .verify_text_is_present_on_main_container(E.chainOfCustodyWithAllFields[1][9])
        });
    });

    it('2 Import Legacy Chain of Custody - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_precheckOnly_'+ S.domain;
        api.auth.get_tokens(user);
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_CoC_Importer(D.newItem, JSON.parse(newItem).barcode);
            cy.generate_excel_file(fileName, E.chainOfCustodyWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.legacyCoC)
                .verify_toast_message([
                    C.toastMsgs.precheckComplete,
                    1 + C.toastMsgs.recordsPrechecked]);
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.chainOfCustody)
                .verify_text_is_NOT_present_on_main_container(E.chainOfCustodyWithAllFields[1][9])
        });
    });

    it('3 Validation messages for not mapped fields', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_Validation1_'+ S.domain;
        api.auth.get_tokens(user);
        E.generateDataFor_CoC_Importer(D.newCase);
        cy.generate_excel_file(fileName, [['oneColumn'], ['']]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC, false)
            .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.notMapped)
    });

    it('4 Validation messages for wrongly formatted values', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_Validation2_'+ S.domain;
        api.auth.get_tokens(user);
        E.generateDataFor_CoC_Importer(D.newCase);
        cy.generate_excel_file(fileName, [E.CoCFieldsHeaders, E.wronglyFormattedValues]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
            .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.wronglyFormattedValues)
    });

    it('5 Validation messages for invalid values', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_Validation3_'+ S.domain;
        api.auth.get_tokens(user);
        E.generateDataFor_CoC_Importer(D.newCase);
        cy.generate_excel_file(fileName, E.chainOfCustodyWithInvalidValues);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
            .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.invalidValues)
    });

    it('6 Validation messages for blank values', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_Validation4_'+ S.domain;
        api.auth.get_tokens(user);
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, [E.CoCFieldsHeaders, ['']]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
            .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.blankValues)
    });
});
