const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import Notes', function () {

    it('1 Import Notes for Case', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_allFields_'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, E.notesWithAllFields);
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.notes, true)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);
        ui.caseView.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.notes)
            .verify_text_is_present_on_main_container(E.notesWithAllFields[1][6])
    });

    it('2 Import Notes for Item', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForItem_allFields_'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_NOTES_Importer(D.newCase, JSON.parse(newItem).barcode);
            cy.generate_excel_file(fileName, E.notesWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.notes, false)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    1 + C.toastMsgs.recordsImported], false, 1200000);
            ui.itemView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.notes)
                .verify_text_is_present_on_main_container(E.notesWithAllFields[1][6])
        });
    });

    it('3 Import Notes for Case - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_precheckOnly_'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, E.notesWithAllFields);
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.notes, true)
            .verify_toast_message([
                C.toastMsgs.precheckComplete,
                1 + C.toastMsgs.recordsPrechecked]);
        ui.caseView.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.notes)
            .verify_text_is_NOT_present_on_main_container(E.notesWithAllFields[1][6])
    });

    //enable test running regression test suite
    xit('5 Five thousand notes for Item and verify notes count on search', function () {
        ui.app.log_title(this);
        let fileName = '5kNotesForItem_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_NOTES_Importer(D.newItem, JSON.parse(newItem).barcode, 5000);
            cy.generate_excel_file(fileName, E.notesWithAllFields, 20);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.notes, false)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    5000 + C.toastMsgs.recordsImported], false, 15);
            ui.itemView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.notes)
                .verify_text_is_present_on_main_container(E.notesWithAllFields[1][6])
                .verify_title_on_active_tab(5000)
        });

        // ui.menu.click_Search__Case();
        // ui.searchCase.enter_Offense_Description(D.newCase.offenseDescription)
        //     .enter_Created_Date(D.newCase.createdDate)
        //     .click_button(C.buttons.search)
        //     .verify_toast_message(C.toastMsgs.resultsLimitExceeded)
        //     .verify_toast_message('5,000')
    });

    //enable test when running regression test suite
    xit('5 Five thousand notes for Case and verify notes count on search', function () {
        ui.app.log_title(this);
        let fileName = '5kNotesForCase_' + S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase, null, 5000);
        cy.generate_excel_file(fileName, E.notesWithAllFields);
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.notes, true)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                5000 + C.toastMsgs.recordsImported], false, 2);
        // ui.caseView.open_newly_created_case_via_direct_link()
        //     .select_tab(C.tabs.notes)
        //     .verify_text_is_present_on_main_container(E.notesWithAllFields[1][6])
    });

    it('6 Validation messages for not mapped fields', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_Validation1'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, [['oneColumn'], ['']]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.notes, false)
            .verify_importer_validation_messages(C.labels.importer.notes.validationMsgs.notMapped)
    });

    it('7 Validation messages for wrongly formatted values', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_Validation2'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, [E.notesFieldsHeaders, E.wronglyFormattedValues]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.notes)
            .verify_importer_validation_messages(C.labels.importer.notes.validationMsgs.wronglyFormattedValues)
    });

    it('8 Validation messages for invalid values', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_Validation3'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, E.notesWithInvalidValues);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.notes)
            .verify_importer_validation_messages(C.labels.importer.notes.validationMsgs.invalidValues)
    });

    it('9 Validation messages for blank values', function () {
        ui.app.log_title(this);
        let fileName = 'NotesForCase_Validation4'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        E.generateDataFor_NOTES_Importer(D.newCase);
        cy.generate_excel_file(fileName, [E.notesFieldsHeaders, ['']]);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_file_and_go_to_import_preview(fileName, C.importTypes.notes)
            .verify_importer_validation_messages(C.labels.importer.notes.validationMsgs.blankValues)
    });
});
