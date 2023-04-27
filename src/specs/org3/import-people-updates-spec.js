const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Import People Updates', function () {

    let user = S.userAccounts.orgAdmin;

    before(function () {
        api.auth.get_tokens(user);
        api.users.update_current_user_settings(user.id, C.currentDateTimeFormat)
    });

    it('1. Import Person with all updated fields', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleUpdatesImport_allFields_'+ S.domain;

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Person_fields();
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person(true, D.newCase);
        Object.assign(D.editedPerson, D.editedPersonAddress)

        cy.getLocalStorage("newPerson").then(newPerson => {
            D.editedPerson.guid = JSON.parse(newPerson).guid
            E.generateDataFor_PEOPLE_Importer([D.editedPerson]);
            cy.generate_excel_file(fileName, E.peopleImportDataWithAllFields);
            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_update_importing(fileName, C.importTypes.people, 'Guid')
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    1 + C.toastMsgs.recordsImported]);
            D.editedPerson.dateOfBirth = null // #11033
            ui.app.open_newly_created_person_via_direct_link();
            ui.personView.click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.editedPerson)
                .open_last_history_record()
                .verify_all_values_on_history(D.editedPerson, D.newPerson, false)
        });
    });

    it('2 Import Person with all updated fields - Precheck Only', function () {
        ui.app.log_title(this);
        let fileName = 'PeopleUpdates_PrecheckOnly_'+ S.domain;

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Person_fields();
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person();
        let editedPerson = Object.assign(D.editedPerson, D.editedPersonAddress)

        cy.getLocalStorage("newPerson").then(newPerson => {
            editedPerson.guid = JSON.parse(newPerson).guid
            E.generateDataFor_PEOPLE_Importer([editedPerson]);
            cy.generate_excel_file(fileName, E.peopleImportDataWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_updates_precheck(fileName, C.importTypes.people, 'Guid')
                .verify_toast_message([
                    C.toastMsgs.precheckComplete,
                    1 + C.toastMsgs.recordsPrechecked]);
            ui.app.open_newly_created_person_via_direct_link()
                .click_button(C.buttons.edit);
            ui.personView.verify_values_on_Edit_form(D.newPerson)
                .verify_values_on_Edit_form(D.newPerson)
                .open_last_history_record()
                .verify_all_values_on_history(D.newPerson)
        });
    });

});
