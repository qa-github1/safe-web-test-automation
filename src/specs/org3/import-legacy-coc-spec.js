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

    it('1 Import Legacy Chain of Custody', function () {
        ui.app.log_title(this);
        let fileName = 'LegacyChainOfCustody_allFields_' + S.domain;
        api.auth.get_tokens(user);
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_CoC_Importer(D.newItem, JSON.parse(newItem).barcode, 5);
            cy.generate_excel_file(fileName, E.chainOfCustodyWithAllFields);

            ui.importer.precheck_import_data(fileName, C.importTypes.legacyCoC)
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.chainOfCustody)
                .verify_text_is_NOT_present_on_main_container(E.chainOfCustodyWithAllFields[1][9])

            ui.importer.import_data(fileName, C.importTypes.legacyCoC)
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.chainOfCustody)
                .verify_text_is_present_on_main_container(E.chainOfCustodyWithAllFields[1][9])
        });
    });

    if (S.isFullRegression()) {

        it('2 Validation messages', function () {
            ui.app.log_title(this);
            let fileName = 'LegacyChainOfCustody_Validation1_' + S.domain;
            api.auth.get_tokens(user);
            E.generateDataFor_CoC_Importer(D.newCase);
            //not mapped fields
            cy.generate_excel_file(fileName, [['oneColumn'], ['']]);
            ui.importer.open_direct_url_for_page()
                .upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC, false)
                .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.notMapped)


            //wrongly formatted values
            fileName = 'LegacyChainOfCustody_Validation2_' + S.domain;
            cy.generate_excel_file(fileName, [E.CoCFieldsHeaders, E.wronglyFormattedValues]);
            ui.importer.reload_page()
                .upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
                .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.wronglyFormattedValues)

            //invalid values
            fileName = 'LegacyChainOfCustody_Validation3_' + S.domain;
            cy.generate_excel_file(fileName, E.chainOfCustodyWithInvalidValues);
            ui.importer.reload_page()
                .upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
                .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.invalidValues)

            //blank values
            fileName = 'LegacyChainOfCustody_Validation4_' + S.domain;
            cy.generate_excel_file(fileName, [E.CoCFieldsHeaders, ['']]);
            ui.importer.reload_page()
                .upload_file_and_go_to_import_preview(fileName, C.importTypes.legacyCoC)
                .verify_importer_validation_messages(C.labels.importer.legacyCoC.validationMsgs.blankValues)

        });

    }
});
