const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let office_1 = S.selectedEnvironment.office_1;

describe('Edit Case', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(true);
        api.users.update_current_user_settings(orgAdmin.id)
        api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)
    });

    // ******* Org Admin *******
    it('1. Edit and verify all values on Case View page -- replace the current values in multiselect fields (Case Officers, Tags)', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        const currentCaseOfficer = D.newCase.caseOfficerName
        const currentTag = D.newCase.tags[0]

        api.org_settings.enable_all_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit();
        ui.caseView.remove_specific_values_on_multi_select_fields([currentCaseOfficer, currentTag])
            .edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedCase, D.newCase, null)
            .verify_red_highlighted_history_records(C.caseFields.allEditableFieldsArray)
    });

    it('2. Edit and verify all values on Case View page -- keep the previous values and add new ones in multiselect fields (Case Officers, Tags)', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();

        api.org_settings.enable_all_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit();
        ui.caseView.edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, false)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, false)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedCase, D.newCase, null)
            .verify_red_highlighted_history_records(C.caseFields.allEditableFieldsArray)
    });

    it('3. Edit and verify reduced number of values on Case View page -- enter User Group instead of User as Case Officer', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet(true);
        const currentCaseOfficer = D.newCase.caseOfficerName
        D.editedCase.caseOfficer = S.selectedEnvironment.admin_userGroup.name
        D.editedCase.caseOfficerName = S.selectedEnvironment.admin_userGroup.name

        api.org_settings.disable_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);
        let newCase = Object.assign({}, D.newCase);
        let editedCase = Object.assign({}, D.editedCase);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit();
        ui.caseView.remove_specific_values_on_multi_select_fields([currentCaseOfficer])
            .edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.reducedEditableFieldsArray, editedCase, newCase, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.reducedEditableFieldsArray, editedCase, newCase, true)

        //remove the line below when issue #14697 gets fixed ⁃ Disabled Case/Person fields are displayed on History Details
        D.newCase.tagsOnHistory = D.editedCase.tagsOnHistory = 'No Tags'
        ui.caseView.open_last_history_record()
            .verify_all_values_on_history(D.editedCase, D.newCase, null)
            .verify_red_highlighted_history_records(C.caseFields.reducedEditableFieldsArray)
    });

    it('4.  Case Number Formatting at Org level -- old case that was saved without formatting can be edited without changing Case Number or changing it with proper format', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(false);
        api.org_settings.disable_all_Office_Level_Case_Number_formattings()
        api.org_settings.set_Org_Level_Case_Number_formatting(
            true, false, false,
            "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d")

        D.generateNewDataSet(true, true);
        api.auto_disposition.edit(false);
        api.org_settings.disable_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit()
        D.editedCase.caseNumber = null
        ui.caseView.remove_specific_values_on_multi_select_fields(D.newCase.caseOfficers)
            .edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .click(C.buttons.edit)
            .verify_values_on_Edit_form(D.editedCase)
        ui.caseView.enter_Case_Number('abc')
            .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
            .verify_text_is_present_on_main_container("Format examples: 'orgFormat_")
            .select_Offense_Type(D.newCase.offenseType)
            .verify_Save_button_is_disabled()
    });

    it('5. Case Number Formatting at Office level -- old case that was saved without formatting can be edited without changing Case Number or changing it with proper format', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(false);
        api.org_settings.set_Org_Level_Case_Number_formatting(
            true, false, false,
            "orgFormat_\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d")
        api.org_settings.set_Office_Level_Case_Number_formatting(
            office_1.id,
            "officeFormat_\\w\\w\\w")

        D.generateNewDataSet(true, true);
        api.auto_disposition.edit(false);
        api.org_settings.disable_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit()
        D.editedCase.caseNumber = null
        ui.caseView.edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .click(C.buttons.edit)
            .verify_values_on_Edit_form(D.editedCase)
        ui.caseView.enter_Case_Number('?<>')
            .verify_text_is_present_on_main_container("Please enter a valid character based on guidelines below:")
            .verify_text_is_present_on_main_container("Format examples: 'officeFormat_")
            .select_Offense_Type(D.newCase.offenseType)
            .verify_Save_button_is_disabled()
    });

    it('6. Auto-Assigned Case Number -- Case Number can be edited when Auto-assigning of Case Numbers is enabled for new cases', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(false);
        api.org_settings.disable_all_Office_Level_Case_Number_formattings()
        api.org_settings.disable_Case_fields();
        api.org_settings.set_Org_Level_Case_Number_formatting(
            false, true, true,
            null, D.randomNo, 555)

        D.generateNewDataSet(true, true);
        api.auto_disposition.edit(false);
        api.org_settings.disable_Case_fields();
        api.cases.add_new_case(D.newCase.caseNumber);

        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit()
        ui.caseView.edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .click(C.buttons.edit)
            .verify_values_on_Edit_form(D.editedCase)
    });

    it('7. Remove all optional values & check history records', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        api.auto_disposition.edit(true);
        api.org_settings.enable_all_Case_fields([], [C.caseFields.offenseLocation, C.caseFields.offenseDate]);
        D.generateNewDataSet()

        let allEditedFieldsArray = [
            'Offense Location',
            'Offense Description',
            'Offense Date',
            'Tags',
            'Review Date Notes',
        ]

        let editedCase = Object.assign({}, D.newCase)

        api.cases.add_new_case();
        ui.app.open_newly_created_case_via_direct_link()
            .click_Edit();
        ui.caseView.verify_values_on_Edit_form(D.newCase, false)
            .remove_all_optional_values(editedCase, false)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Case_View_form(allEditedFieldsArray, editedCase, D.newCase, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Case_View_form(allEditedFieldsArray, editedCase, D.newCase, true)
            .open_last_history_record()
            .verify_all_values_on_history(editedCase, D.newCase)
            .verify_red_highlighted_history_records(allEditedFieldsArray)
    });

    it('8. Add a Case with disabled fields & check if required fields are displayed properly on Case Edit page after enabling', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        api.org_settings.disable_Case_fields();

        let c = D.getCaseDataWithReducedFields();
        c['offenseDateIsoFormat'] = '';
        api.cases.add_new_case(D.newCase.caseNumber, c);

        api.org_settings.enable_all_Case_fields([], [C.caseFields.offenseLocation, C.caseFields.offenseDate]);

        ui.app.open_newly_created_case_via_direct_link();

        ui.caseView.click_Edit()
            .verify_non_required_fields([
                "offenseLocation",
                "offenseDate",
                "offenseDescription",
                "tags"
            ])
            .verify_Save_isDisabled();

        api.org_settings.enable_all_Case_fields([], []);
        ui.caseView.reload_page()
            .click_Edit()
            .verify_required_fields([
                "offenseLocation",
                "offenseDate"
            ])
            .verify_non_required_fields([
                "offenseDescription",
                "tags"
            ])
            .verify_Save_isDisabled();
    });
});
