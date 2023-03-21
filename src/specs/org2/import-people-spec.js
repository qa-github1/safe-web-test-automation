const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let user = S.userAccounts.orgAdmin;

describe('Import People', function () {

    it('1. Import and verify Person with all fields', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleImport_allFields_'+ S.domain;
        api.auth.get_tokens(user);

        D.generateNewDataSet()
        D.getNewPersonData(D.newCase);
        Object.assign(D.newPerson, D.newPersonAddress)
        E.generateDataFor_PEOPLE_Importer([D.newPerson]);
        api.cases.add_new_case();

        cy.generate_excel_file(fileName, E.peopleImportDataWithAllFields);
        api.org_settings.enable_all_Person_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.people)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);

        ui.menu.click_Search__People();
        ui.searchPeople.enter_Business_Name(D.newPerson.businessName)
            .click_button(C.buttons.search)
            .click_link(D.newPerson.firstName, ui.searchPeople.firstRowInResultsTable());
        ui.personView.verify_Person_View_page_is_open()
            .click_button(C.buttons.edit)
            .verify_values_on_Edit_form(D.newPerson)
            .open_last_history_record()
            .verify_all_values_on_history(D.newPerson)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
    });

    it('2. Import and verify Person with minimum fields', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleImport_minimumFields_'+ S.domain;
        api.auth.get_tokens(user);

        D.generateNewDataSet()
        D.getPersonDataWithReducedFields(D.newCase);
        E.generateDataFor_PEOPLE_Importer([D.newPerson]);
        api.cases.add_new_case();
        cy.generate_excel_file(fileName, E.peoplemportDataWithMinimumFields);

        api.org_settings.disable_Person_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing_People(fileName,true,  true)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);

        ui.menu.click_Search__People();
        ui.searchPeople.enter_First_Name(D.newPerson.firstName)
            .click_button(C.buttons.search)
            .click_link(D.newPerson.firstName, ui.searchPeople.firstRowInResultsTable());
        ui.personView.verify_Person_View_page_is_open()
            .click_button(C.buttons.edit)
            .verify_values_on_Edit_form(D.newPerson)
            .open_last_history_record()
            .verify_all_values_on_history(D.newPerson)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
    });

    it('3. Import Person with all fields - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'People_PrecheckOnly_'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);

        D.getNewCaseData();
        D.getNewPersonData(D.newCase);
        E.generateDataFor_PEOPLE_Importer([D.newPerson]);
        api.cases.add_new_case(D.newCase.caseNumber);

        cy.generate_excel_file(fileName, E.peopleImportDataWithAllFields);
        api.org_settings.enable_all_Person_fields();

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_precheck(fileName, C.importTypes.people)
            .verify_toast_message([
                C.toastMsgs.precheckComplete,
                1 + C.toastMsgs.recordsPrechecked]);

        ui.menu.click_Search__People();
        ui.searchPeople.enter_Business_Name(D.newPerson.businessName)
            .click_button(C.buttons.search)
            .wait_until_spinner_disappears()
            .verify_items_count_on_grid(0);
    });


});
