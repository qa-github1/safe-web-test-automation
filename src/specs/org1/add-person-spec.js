const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_officeAdmin = S.selectedEnvironment.admin_permissionGroup;

function set_preconditions_for_adding_Person_with_all_fields(testContext) {
    ui.app.log_title(testContext);

    cy.restoreLocalStorage();
    api.auth.get_tokens(orgAdmin);
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
    D.generateNewDataSet(false);
    api.org_settings.enable_all_Person_fields();
}

function set_preconditions_for_adding_Person_with_reduced_number_of_fields(testContext, fieldsToKeepEnabled) {
    ui.app.log_title(testContext);

    cy.restoreLocalStorage();
    api.auth.get_tokens(orgAdmin);
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
    D.generateNewDataSet(true);
    api.org_settings.disable_Person_fields(fieldsToKeepEnabled);
    api.org_settings.disable_Case_fields();
}

describe('Add Person', function () {

    context('1. Org Admin', function () {

        it('1.1. All fields enabled -- redirect to View Added Person', function () {
            set_preconditions_for_adding_Person_with_all_fields(this);

            ui.open_base_url();
            ui.menu.click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .select_post_save_action(C.postSaveActions.viewAddedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved);
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson)
        });

        it('1.2. Optional fields disabled -- First & Last Name populated -- redirect to Add Person page again', function () {
            set_preconditions_for_adding_Person_with_reduced_number_of_fields(this);

            api.cases.add_new_case(D.newCase.caseNumber);
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.people)
                .click_element_on_active_tab(C.buttons.addPerson);
            ui.addPerson.verify_Add_Person_page_is_open()
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newCase.caseNumber)
                .populate_all_fields(D.newPerson)
                .select_post_save_action(C.postSaveActions.addPerson)
                .click_Save()
                .verify_toast_message_(C.toastMsgs.saved)
                .verify_text_is_present_on_main_container(C.labels.addPerson.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newCase.caseNumber)
                .open_newly_created_person_via_direct_link()
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson)
        })

        it('1.3. Business Name populated only -- redirect to Add Item page', function () {
            set_preconditions_for_adding_Person_with_reduced_number_of_fields(this,
                [C.personFields.businessName]);
            api.cases.get_most_recent_case();
            D.newPerson.firstName = null
            D.newPerson.lastName = null
            D.newPerson.businessName = D.randomNo

            ui.open_base_url();
            ui.menu.click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .select_post_save_action(C.postSaveActions.addItem)
                .click_Save()
                .verify_toast_message_(C.toastMsgs.saved);
            ui.addItem.verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field()
                .open_newly_created_person_via_direct_link()
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson)
        })

        it('1.4. redirect to Case View page', function () {
            set_preconditions_for_adding_Person_with_reduced_number_of_fields(this);
            api.cases.get_most_recent_case();

            ui.open_base_url();
            ui.menu.click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .select_post_save_action(C.postSaveActions.viewCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved);
            ui.caseView.verify_Case_View_page_is_open(D.newPerson.caseNumber)
        })
    })

    context('2. Power User -- all permissions in Office', function () {

        it('2.1. verify that user can add all values', function () {

            api.auth.get_tokens(orgAdmin);
            api.permissions
                .update_ALL_permissions_for_an_existing_Permission_group
                (permissionGroup_officeAdmin, true, true, true, true)

            api.permissions.assign_office_based_permissions_to_user(
                powerUser.id,
                office_1.id, permissionGroup_officeAdmin.id);

            set_preconditions_for_adding_Person_with_all_fields(this);

            api.auth.get_tokens(powerUser);
            api.users.update_current_user_settings(powerUser.id, C.currentDateTimeFormat, C.currentDateFormat)

            ui.menu.reload_page()
                .click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .select_post_save_action(C.postSaveActions.viewAddedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved);
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson)
        })
    })

    context('3. Add Person with Custom Form', function () {
        it('3.1. --- with required Custom Form filled out, all required fields on Form', function () {
            set_preconditions_for_adding_Person_with_reduced_number_of_fields(this);
            api.cases.get_most_recent_case();
            D.newPerson.personType = D.newPerson.personTypelinkedToRequiredForm1
            D.newPerson.personTypeId = D.newPerson.personTypeIdlinkedToRequiredForm1
            D.newPerson = Object.assign(D.newPerson, D.newCustomFormData)

            ui.open_base_url();
            ui.menu.click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .verify_number_of_required_fields_marked_with_asterisk(12)
                .verify_Save_button_is_disabled()
                .populate_all_fields_on_Custom_Form(D.newCustomFormData)
                .select_post_save_action(C.postSaveActions.viewAddedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved);
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson, true)
        })

        it('3.2. --- with required Custom Form but not filled out, all optional fields on Form', function () {
            set_preconditions_for_adding_Person_with_reduced_number_of_fields(this);
            api.cases.get_most_recent_case();
            D.newPerson.personType = D.newPerson.personTypelinkedToRequiredForm2
            D.newPerson.personTypeId = D.newPerson.personTypeIdlinkedToRequiredForm2
            D.newPerson = Object.assign(D.newPerson, D.defaultCustomFormData)

            ui.open_base_url();
            ui.menu.click_Add__Person();
            ui.addPerson.populate_all_fields(D.newPerson)
                .verify_number_of_required_fields_marked_with_asterisk(0)
                .select_post_save_action(C.postSaveActions.viewAddedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved);
            ui.personView.verify_Person_View_page_is_open()
                .click_button(C.buttons.edit)
                .verify_values_on_Edit_form(D.newPerson, true)
        });
    })
})
