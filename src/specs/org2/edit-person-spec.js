const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Edit Person', function () {

    let user = S.getUserData(S.userAccounts.orgAdmin);

    before(function () {
        api.auth.get_tokens(user);
        api.users.update_current_user_settings(user.id)
    });

    it('1. Edit and verify all values on Person View page', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(user);
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
            .open_last_history_record()
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

        api.auth.get_tokens(user);
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
            .open_last_history_record()
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

        api.auth.get_tokens(user);
        D.generateNewDataSet(true);
        D.newPerson.firstName =  D.newPerson.lastName = ''
        D.editedPerson.firstName = D.editedPerson.lastName = null
        D.newPerson.businessName = D.getRandomNo()
        D.editedPerson.businessName = D.getRandomNo() + '_ed'

        api.auth.get_tokens(user);
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
            .open_last_history_record()
            .verify_all_values_on_history(D.editedPerson, D.newPerson)
            .verify_red_highlighted_history_records(editedFields, fieldsOnHistory)
    });

    it('4. Add a Person with disabled fields & check if those are shown up on Person Edit page after enabling all of the rest of the fields and editing Business Name / First Name / Last Name', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
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
});
