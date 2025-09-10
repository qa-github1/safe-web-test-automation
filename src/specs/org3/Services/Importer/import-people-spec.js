const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const E = require('../../../../fixtures/files/excel-data');
const api = require('../../../../api-utils/api-spec');
const helper = require('../../../../support/e2e-helper');
const ui = require('../../../../pages/ui-spec');

let user = S.userAccounts.orgAdmin;

describe('Import People', function () {

    it('1. Precheck and Import People with all fields ' +
        '- 1 person linked to 1 case, other person linked to 2 cases', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleImport_allFields_' + S.domain;
        api.auth.get_tokens(user);

        D.generateNewDataSet()
        let case1 = D.newCase.caseNumber
        let case2 = S.selectedEnvironment.oldActiveCase.caseNumber
        let person1 = D.getNewPersonData(D.newCase);
        let person2 = D.getNewPersonData();
        let person2LinkedToCase2 = Object.assign({}, person2)

        person1.guid = helper.generateGUID()
        // assign the same GUID to 2 rows in excel in order to have tha person linked to multiple cases
        person2.guid = person2LinkedToCase2.guid = helper.generateGUID()
        person2.caseNumber =case1
        person2LinkedToCase2.caseNumber = case2

        Object.assign(D.newPerson, D.newPersonAddress)
        E.generateDataFor_PEOPLE_Importer([person1, person2, person2LinkedToCase2]);
        api.cases.add_new_case();

        cy.generate_excel_file(fileName, E.peopleImportDataWithAllFields);
        api.org_settings.enable_all_Person_fields();

        ui.importer.precheck_import_data(fileName, C.importTypes.people)

        ui.menu.click_Search__People();
        ui.searchPeople.enter_Business_Name(D.newPerson.businessName)
            .click_button(C.buttons.search)
            .wait_until_spinner_disappears()
            .verify_records_count_on_grid(0);

        ui.importer.import_data(fileName, C.importTypes.people)

        ui.menu.click_Search__People();
        ui.searchPeople.enter_Business_Name(person1.businessName)
            .click_button(C.buttons.search)
            .click_link(person1.firstName, ui.searchPeople.firstRowInResultsTable());
        ui.personView.verify_Person_View_page_is_open()
            .click_button(C.buttons.edit)
            .verify_values_on_Edit_form(person1)
            .open_last_history_record(1)
            .verify_all_values_on_history(person1)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
            .select_tab(C.tabs.casesInvolved)
            .verify_title_on_active_tab(1)
            .verify_content_of_first_row_in_results_table_on_active_tab(case1)

        ui.menu.reload_page()
            .click_Search__People();
        ui.searchPeople.enter_Business_Name(person2.businessName)
            .click_button(C.buttons.search)
            .click_link(person2.firstName, ui.searchPeople.firstRowInResultsTable());
        ui.personView.verify_Person_View_page_is_open()
            .click_button(C.buttons.edit)
            .verify_values_on_Edit_form(person2)
            .open_last_history_record(1)
            .verify_all_values_on_history(person2)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
            .select_tab(C.tabs.casesInvolved)
            .verify_title_on_active_tab(2)
            .verify_content_of_results_table(case1)
            .verify_content_of_first_row_in_results_table_on_active_tab(case2)
    });

    it('2. Import and verify Person with minimum fields', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleImport_minimumFields_' + S.domain;
        api.auth.get_tokens(user);

        D.generateNewDataSet()
        D.getPersonDataWithReducedFields(D.newCase);
        E.generateDataFor_PEOPLE_Importer([D.newPerson]);
        api.cases.add_new_case();
        cy.generate_excel_file(fileName, E.peoplemportDataWithMinimumFields);

        api.org_settings.disable_Person_fields();
        ui.importer.import_data(fileName, C.importTypes.people)

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


});
