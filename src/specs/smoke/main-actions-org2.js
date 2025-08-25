const C = require('../../fixtures/constants');
const DF = require('../../support/date-time-formatting');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const helper = require("../../support/e2e-helper");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let approvedForReleaseItem = {}

before(function () {
    api.auth.get_tokens(orgAdmin);
    api.org_settings.enable_all_Case_fields();
    api.org_settings.enable_all_Item_fields();
    api.org_settings.enable_all_Person_fields();
    api.org_settings.update_org_settings(false, true);
    api.users.update_current_user_settings(orgAdmin.id, DF.dateTimeFormats.short, DF.dateFormats.shortDate)
});

describe('Person', function () {

    it(
        '*** Add/Edit/Search Person ' +
        '*** Add/Search Person Note  ' +
        '*** Add/Search Person Media', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.org_settings.update_org_settings(false, true);
            api.org_settings.enable_all_Person_fields();

            // ADD PERSON
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

                // EDIT PERSON
                .edit_all_values(D.editedPerson)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .pause(1)
                .wait_until_spinner_disappears()
                .open_last_history_record(1)
                .verify_all_values_on_history(D.editedPerson, D.newPerson)
                //-- uncomment method in the next line and remove the one below that when bug gets fixed in #13328
                // .verify_red_highlighted_history_records(C.personFields.allEditableFieldsArray)
                .verify_red_highlighted_history_records(ui.app.getArrayWithoutSpecificValue(C.personFields.allEditableFieldsArray, ['Deceased', 'Juvenile']))
                .click_button('Cancel')

            //ADD NOTE
            let note = D.getRandomNo() + '_note';
            ui.personView.select_tab(C.tabs.notes)
                .enter_note_and_category(note, C.noteCategories.sensitive)
                .verify_toast_message(C.toastMsgs.saved)

            //ADD MEDIA
            ui.personView.select_tab(C.tabs.media)
                .click_button_on_active_tab(C.buttons.add)
                .verify_element_is_visible('Drag And Drop your files here')
                .upload_file_and_verify_toast_msg('image.png')
                .edit_Description_on_first_row_on_grid(note)

            //Check values after reloading
            ui.personView.reload_page()
                .verify_edited_and_not_edited_values_on_Person_View_form(C.personFields.allEditableFieldsArray, D.editedPerson, D.newPerson)
                .select_tab(C.tabs.notes)
                .verify_content_of_results_table(note)
                .select_tab(C.tabs.media)
                .verify_content_of_results_table('image.png')

            // SEARCH FOR NOTE
            ui.searchNotes.run_search_by_Text(note)
                .verify_records_count_on_grid(1)

            //SEARCH FOR MEDIA
            ui.searchMedia.run_search_by_Description(note)
                .verify_records_count_on_grid(1)

            // SEARCH FOR PERSON
            ui.searchPeople.run_search_by_Business_Name(D.editedPerson.businessName)
                .verify_content_of_first_row_in_results_table(D.editedPerson.businessName);
        });
});
describe('User', function () {

    it('Add User -- Assign Permissions -- Log in with newly created user', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        D.newUser.permissionGroups = [S.selectedEnvironment.admin_permissionGroup.name]
        api.org_settings.set_required_User_forms([])
        ui.app.clear_gmail_inbox(S.gmailAccount);

        api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
        api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)
        ui.menu.click_Settings__User_Admin()
            .click_button(C.buttons.add)
        ui.userAdmin.enter_all_values(D.newUser)
            .scroll_and_click(C.buttons.ok)
            .verify_toast_message(C.toastMsgs.saved)
            .select_permission_group_per_office(S.selectedEnvironment.admin_permissionGroup.name, D.newUser.office)
            .click_button(C.buttons.save)
            .verify_toast_message(C.toastMsgs.saved)
            .search_for_user(D.newUser.email)
        ui.userAdmin.verify_user_data_on_grid(D.newUser)
        ui.menu.click_Log_Out()

        ui.userAdmin.verify_email_content_(D.newUser.email, C.users.emailTemplates.welcomeToSafe, D.newUser, ' ')
            .open_verification_link_from_email()
            .set_password(D.newUser.password)
            .scroll_and_click(C.buttons.setPassword)
            .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
            .click_button(C.buttons.login);
        ui.login.enter_credentials(D.newUser.email, D.newUser.password)
            .click_Login_button()
            .verify_text_is_present_on_main_container(C.labels.dashboard.title)
        ui.userAdmin.save_current_user_profile_to_local_storage()

        api.auth.get_tokens(orgAdmin);
        api.users.deactivate_previously_created_user();
    });

});
describe('Item Transactions', function () {

    it('Verify all transactions, data changes and enabled/disabled actions based on Item status', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Item_fields(C.itemFields.dispositionStatus);
        D.generateNewDataSet()
        let initialItem = Object.assign({}, D.newItem)
        api.cases.add_new_case()
        api.items.add_new_item();
        D.box2 = D.getStorageLocationData('BOX_2')
        api.locations.add_storage_location(D.box2)

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView
            //CHECK OUT
            .click_Actions()
            .perform_Item_Check_Out_transaction(orgAdmin, C.checkoutReasons.lab, 'test-note1', D.currentDate)
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(
                [
                    'Check Item In',
                    'Transfer Item',
                    'Dispose Item',
                    'Duplicate',
                    'Split',
                    'Manage Cases'],
                [
                    'Check Item Out',
                    'Move Item',
                    'Undispose Item',
                ])


            //TRANSFER
            .perform_Item_Transfer_transaction(powerUser, orgAdmin, 'test-note2')
            .verify_edited_and_not_edited_values('view', ["Custodian"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `test-note2`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(
                [
                    'Check Item In',
                    'Transfer Item',
                    'Dispose Item',
                    'Duplicate',
                    'Split',
                    'Manage Cases'],
                [
                    'Check Item Out',
                    'Move Item',
                    'Undispose Item',
                ])

        //CHECK IN
        ui.searchItem
            .run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .perform_Item_CheckIn_transaction(powerUser, false, D.box2.name, 'test-note3')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(
                [
                    'Check Item Out',
                    'Move Item',
                    'Dispose Item',
                    'Duplicate',
                    'Split',
                    'Manage Cases'],
                [
                    'Check Item In',
                    'Transfer Item',
                    'Undispose Item'
                ])
            .click_Actions()
            .click_View_on_first_table_row()
        ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note3`]],
                [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `test-note2`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)

            //DISPOSAL
            .click_Actions()
            .perform_Item_Disposal_transaction(powerUser, C.disposalMethods.auctioned, 'test-note4')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', `test-note4`]],
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note3`]],
                [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `test-note2`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(
                [
                    'Undispose Item',
                    'Duplicate',
                    'Manage Cases'],
                [
                    'Check Item In',
                    'Check Item Out',
                    'Move Item',
                    'Transfer Item',
                    'Dispose Item',
                    // 'Split' // uncomment this when bugs gets fixed -- card  #14841 /#20
                ])

            //UNDISPOSAL
            .perform_Item_Undisposal_transaction(powerUser, true, D.box2.name, 'test-note5')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note5`]],
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Witness', powerUser.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', `test-note4`]],
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `test-note3`]],
                [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `test-note2`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``], ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown([
                'Check Item Out',
                'Move Item',
                'Dispose Item',
                'Duplicate',
                'Split',
                'Manage Cases'], [
                'Check Item In',
                'Transfer Item',
                'Undispose Item'
            ])

        api.locations.get_and_save_any_location_data_to_local_storage('root')
        api.locations.move_location(D.box2.name, 'root')

    });
});

describe('Person', function () {
    it('1.1.2.' +
        'Add task with all fields' +
        '-- assign to 1 user' +
        '-- attach 1 case, 1 item and 1 person' +
        '-- override template content' +
        '-- search for task on the grid by Assignee name' +
        '--verify values on grid' +
        '-- check email notification with more Task details ', function () {

        // it(
        //     '*** Add/Edit/Search Person ' +
        //     '*** Add/Search Person Note  ' +
        //     '*** Add/Search Person Media', function () {

        ui.app.clear_gmail_inbox(S.gmailAccount);
        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.cases.add_new_case()
        api.items.add_new_item()
        api.people.add_new_person()
        api.org_settings.update_org_settings_by_specifying_property_and_value(
            'tasksSettingsConfiguration',
            {
                moreDetailsInEmails: true,
                sendEmailNotifications: true
            }
        )
        let selectedTemplate = S.selectedEnvironment.taskTemplates.other
        D.getNewTaskData(powerUser, admin_userGroup, S.userAccounts.orgAdmin, 8);

        cy.getLocalStorage('newItem').then(newItem => {
            D.newItem = Object.assign(D.newItem, JSON.parse(newItem))

            D.newTask.title = 'edited template title'
            D.newTask.message = 'edited template message'
            D.newTask.linkedObjects = [
                {type: 'case', caseNumber: D.newCase.caseNumber},
                {type: 'item', caseNumber: D.newCase.caseNumber, orgNumber: D.newItem.sequentialOrgId},
                {type: 'person', personName: D.newPerson.businessName}
            ]

            D.newTask.caseReviewDate = helper.getSpecificDateInSpecificFormat(C.currentDateFormat.mask, D.newCase.reviewDate)
            D.newTask.caseReviewNotes = D.newCase.reviewDateNotes
            ui.menu.click_Tasks();
            ui.addTask.click_button(C.buttons.addTask)
                .populate_all_fields(D.newTask, false, false, selectedTemplate)
                .select_assignees([D.newTask.userGroupName])
                .click_Save_()
                .verify_toast_message(C.toastMsgs.saved)
            ui.taskList.search_for_the_task(powerUser.firstName)
                .sort_by_descending_order('Creation Date')
                .verify_newly_created_task_is_shown_in_first_table_row()
                .search_for_the_newly_created_task()
                .verify_task_data_on_grid(D.newTask, orgAdmin)
            ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name, 2, false)
            ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
        })

    });
});

