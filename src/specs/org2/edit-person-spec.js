const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let startTime;

for (let i = 0; i < 1; i++) {

    describe('Edit Person', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.users.update_current_user_settings(orgAdmin.id)
            startTime = Date.now();
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Edit and verify all values on Person View page', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.org_settings.enable_all_Person_fields();
            api.people.add_new_person(D.getRandomNo());
            ui.app.open_newly_created_person_via_direct_link()
                .click_Edit();
            ui.personView.verify_values_on_Edit_form(D.newPerson)
                .edit_all_values(D.editedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_edited_and_not_edited_values_on_Person_View_form(C.personFields.allEditableFieldsArray, D.editedPerson, D.newPerson)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Person_Edit_form(C.personFields.allEditableFieldsArray, D.editedPerson, D.newPerson)
                .open_last_history_record(1)
                .verify_all_values_on_history(D.editedPerson, D.newPerson)
            //-- uncomment method in the next line and remove the one below that when bug gets fixed in #13328
            // .verify_red_highlighted_history_records(C.personFields.allEditableFieldsArray)
            ui.personView.verify_red_highlighted_history_records(ui.app.getArrayWithoutSpecificValue(C.personFields.allEditableFieldsArray, ['Deceased', 'Juvenile']))
        });

        it('2. Edit and verify reduced number of values on Person View page - First & Last Name', function () {
            ui.app.log_title(this);

            let editedFields = [
                'First Name',
                'Last Name']

            let fieldsOnHistory = [
                'Update Made By',
                'Update Date',
                'First Name',
                'Last Name']

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true);
            api.org_settings.disable_Person_fields();
            api.people.add_new_person(D.getRandomNo());

            ui.app.open_newly_created_person_via_direct_link()
                .click_Edit();
            ui.personView.edit_all_values(D.editedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_edited_and_not_edited_values_on_Person_View_form(editedFields, D.editedPerson, D.newPerson)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Person_Edit_form(editedFields, D.editedPerson, D.newPerson)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedPerson, D.newPerson)
                //-- uncomment method in the next line and remove the one below that when bug gets fixed in #13328
                // .verify_red_highlighted_history_records(C.personFields.allEditableFieldsArray)
                .verify_red_highlighted_history_records(editedFields, fieldsOnHistory)
        });

        it('3. Edit and verify reduced number of values on Person View page - Business Name', function () {
            ui.app.log_title(this);

            let editedFields = ['Business Name']

            let fieldsOnHistory = [
                'Update Made By',
                'Update Date',
                'Business Name']

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true);
            D.newPerson.firstName = D.newPerson.lastName = ''
            D.editedPerson.firstName = D.editedPerson.lastName = null
            D.newPerson.businessName = D.getRandomNo()
            D.editedPerson.businessName = D.getRandomNo() + '_ed'

            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Person_fields(['Business Name']);
            api.people.add_new_person();

            ui.app.open_newly_created_person_via_direct_link()
                .click_Edit();
            ui.personView.edit_all_values(D.editedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .reload_page()
                .verify_edited_and_not_edited_values_on_Person_View_form(editedFields, D.editedPerson, D.newPerson)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Person_Edit_form(editedFields, D.editedPerson, D.newPerson)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedPerson, D.newPerson)
                .verify_red_highlighted_history_records(editedFields, fieldsOnHistory)
        });

        it('4. Add a Person with disabled fields & check if those are shown up on Person Edit page after enabling all of the rest of the fields and editing Business Name / First Name / Last Name', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true);
            api.org_settings.disable_Person_fields();
            api.people.add_new_person(D.getRandomNo());
            api.org_settings.enable_all_Person_fields();

            ui.app.open_newly_created_person_via_direct_link();
            ui.personView.click_Edit()
                .verify_non_required_fields([
                    "businessName",
                    "personfirstname",
                    "middleName",
                    "personlastname",
                    "alias",
                    "driverLicence",
                    "race",
                    "gender",
                    "dob",
                    "mobilePhone",
                    "otherPhone",
                    "email"
                ])
                .edit_all_values({
                    businessName: ' ',
                    firstName: ' ',
                    lastName: ' '
                })
                .verify_required_fields([
                    "personfirstname",
                    "personlastname"
                ])
                .verify_Save_isDisabled()
                .edit_all_values({
                    businessName: D.getRandomNo()
                })
                .verify_non_required_fields([
                    "personfirstname",
                    "personlastname"
                ])
                .verify_Save_isEnabled()
                .edit_all_values({
                    businessName: ' ',
                    firstName: D.getRandomNo()
                })
                .verify_required_fields([
                    "personlastname"
                ]);
        });

        const expungedValues = {
            Address: 'n/a',
            'Business Name': 'Expunged',
            Email: 'expunged@​expunged.​invalid',
            Race: 'Unknown',
            Gender: 'Unknown',
            'First Name': 'Expunged',
            'Last Name': 'Expunged',
            'Middle Name': 'Expunged',
            'Case Notes': 'Expunged',
            Deceased: 'No',
            Juvenile: 'No',
        };

        it('5. Expunge Person from the Case', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true)
            api.org_settings.disable_Case_fields()
                .enable_all_Person_fields()
            api.cases.add_new_case(D.newCase.caseNumber)
            api.people.add_new_person(true, D.newCase);
            ui.personView.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.people)
                .enable_all_standard_columns_on_the_grid(C.pages.peopleSearch)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu(C.buttons.expungeFromCase)
                .verify_modal_content(D.newCase.caseNumber)
                .verify_modal_content(C.validation_information_or_warning_msgs.expungePersonFromCase(D.newPerson.firstName, D.newPerson.lastName))
                .populate_expunge_person_modal(D.expungePerson)
                .click_Ok()
                .verify_sweet_alert_header(C.validation_information_or_warning_msgs.expungePersonSweetAlert)
                .click_Ok(true)
                .verify_toast_message('Saved!')
                .verify_content_of_first_table_row_by_provided_column_titles_and_values_in_Object(expungedValues)
                .click_button('View')
                .verify_edited_and_not_edited_values_on_Person_View_form(C.personFields.allEditableFieldsArray, D.expungePerson, D.newPerson)
                .verify_values_on_expunge_person_section(D.expungePerson)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Person_Edit_form(C.personFields.allEditableFieldsArray, D.expungePerson, D.newPerson)
                .verify_values_on_expunge_person_section(D.expungePerson)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.expungedPersonHistory)
                .verify_values_on_expunge_person_section(D.expungePerson)
        })

        it('6. Expunge Person from the System', function () {
            //TODO: Add later expunge from the system using person view page
            //TODO: Edit values on expunged modal

            expungedValues.Race = expungedValues.Gender = "Expunged"
            delete expungedValues["Case Notes"]

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet(true)
            D.getNewPersonData()
            api.org_settings.disable_Case_fields()
                .enable_all_Person_fields()
            api.cases.add_new_case(D.newCase.caseNumber)
            api.people.add_new_person(true, D.newCase);
            ui.menu.click_Search__People()
            ui.searchPeople
                .enter_Business_Name(D.newPerson.businessName)
                .click_Search()
                .enable_all_standard_columns_on_the_grid(C.pages.peopleSearch)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu(C.buttons.expunge)
                .verify_modal_content(C.validation_information_or_warning_msgs.expungePersonFromSystem)
                .populate_expunge_person_modal(D.expungePerson)
                .click_Ok()
                .verify_sweet_alert_header(C.validation_information_or_warning_msgs.expungePersonSweetAlert)
                .click_Ok(true)
                .verify_toast_message('Saved!')
                .verify_content_of_first_table_row_by_provided_column_titles_and_values_in_Object(expungedValues)
                .click_button('View')
            ui.personView.verify_edited_and_not_edited_values_on_Person_View_form(C.personFields.allEditableFieldsArray, D.expungePerson, D.newPerson)
                .verify_values_on_expunge_person_section(D.expungePerson)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Person_Edit_form(C.personFields.allEditableFieldsArray, D.expungePerson, D.newPerson)
                .verify_values_on_expunge_person_section(D.expungePerson)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.expungedPersonHistory, D.expungedPersonHistory)
                .verify_values_on_expunge_person_section(D.expungePerson)
        })
    });
}


