const C = require('../fixtures/constants');
const S = require('../fixtures/settings');
const D = require('../fixtures/data');
const api = require('../api-utils/api-spec');
const ui = require('../pages/ui-spec');
const E = require("../fixtures/files/excel-data");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let approvedForReleaseItem = {}

before(function () {
    api.auth.get_tokens(orgAdmin);
    api.org_settings.enable_all_Case_fields();
    api.org_settings.enable_all_Item_fields();
    api.org_settings.enable_all_Person_fields();
    api.org_settings.update_org_settings(false, true);
});

describe('Dispo Auth', function () {

    it('All Dispo Actions for 8 items -- no service involved', function () {

        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Item_fields()
        api.org_settings.enable_all_Person_fields()

        let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth
        D.getNewTaskData()
        D.generateNewDataSet()
        D.newTask = Object.assign(D.newTask, selectedTemplate)
        D.newTask.creatorId = S.userAccounts.orgAdmin.id
        D.newTask.assignedUserIds = [S.userAccounts.orgAdmin.id]
        api.cases.add_new_case()

        // For "Approve for Release" to New Person --> use detected duplicate person, keep address blank
        let person1 = Object.assign({}, D.getNewPersonData())
        person1.firstName = 'Person_1'
        api.people.add_new_person(false, null, person1)
        let address1 = {}

        // For "Approve for Release" to New Person, --> add an address
        D.newPerson = D.getNewPersonData()
        let person2 = Object.assign({}, {
            firstName: D.newPerson.firstName,
            lastName: D.newPerson.lastName,
            personType: S.selectedEnvironment.personType.name
        })
        person2.firstName = person2.firstName + '_P_2'
        let address2 = Object.assign({}, D.getNewPersonAddressData())

        // For "Approve for Release" to Existing Person, already linked to the case, WITH an address
        let person3 = Object.assign({}, D.getNewPersonData())
        person3.firstName = person3.firstName + '_P_3'
        api.people.add_new_person(true, D.newCase, person3)
        let address3 = Object.assign({}, D.getNewPersonAddressData())

        for (let i = 0; i < 8; i++) {
            D['newitem_' + i] = Object.assign({}, D.newItem)
            D['newitem_' + i].description = i + '__ ' + D.newItem.description
            api.items.add_new_item(true, null, 'item' + i, D['newitem_' + i])
            cy.getLocalStorage('item2').then(item => {
                approvedForReleaseItem = JSON.parse(item)
            })
        }

        api.tasks.add_new_task(D.newTask, 8)

        ui.taskView
            .open_newly_created_task_via_direct_link()
            .select_tab('Items')
            .set_Action___Approve_for_Disposal([1])
            .set_Action___Approve_for_Release([2], person1, {}, false, false, false, false, true, true)
            .set_Action___Approve_for_Release([3], person2, address2, false, false, false, false, false, false)
            .set_Action___Approve_for_Release([4], person3, address3, true, true, true, false)
            .set_Action___Delayed_Release([5], person3, address3, true, true, true, true)
            .set_Action___Hold([6], 'Case Active', false, 10)
            .set_Action___Hold([7], 'Active Warrant', true)
            .set_Action___Timed_Disposal([8], '3y')
            .click_Submit_for_Disposition()
            .verify_toast_message('Submitted for Disposition')
            .wait_until_spinner_disappears()
            .reload_page()
            .verify_text_is_present_on_main_container('Closed')
            .select_tab('Items')
            .verify_Disposition_Statuses_on_the_grid
            ([
                [[1], 'Approved for Disposal'],
                [[2, 3, 4], 'Approved for Release'],
                [[5], 'Delayed Release'],
                [6, 'Hold'],
                [7, 'Indefinite Retention'],
                [8, 'Delayed Disposal']])
            .select_tab('Basic Info')

    });
});
describe('Case', function () {

    it(
        '*** Add/Edit/Search/MassUpdate Case ' +
        '*** Add/Search Case Note  ' +
        '*** Add/Search Case Media', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            const currentCaseOfficer = D.newCase.caseOfficerName
            const currentTag = D.newCase.tags[0]
            api.org_settings.enable_all_Case_fields();
            api.auto_disposition.edit(true);
            api.org_settings.set_Org_Level_Case_Number_formatting(false, false, false)


            //ADD Case
            ui.menu.click_Add__Case();
            ui.addCase.verify_Add_Case_page_is_open()
                .populate_all_fields_on_both_forms(D.newCase)
                .select_post_save_action(C.postSaveActions.viewAddedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);

            // EDIT CASE
            ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newCase)
                .remove_specific_values_on_multi_select_fields([currentCaseOfficer, currentTag])
                .edit_all_values(D.editedCase)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedCase, D.newCase, null)
                .verify_red_highlighted_history_records(C.caseFields.allEditableFieldsArray)
                .click_button('Cancel')

            //ADD NOTE
            let note = D.getRandomNo() + '_note';
            ui.caseView.select_tab(C.tabs.notes)
                .enter_note_and_category(note, C.noteCategories.sensitive)
                .verify_toast_message(C.toastMsgs.saved)

            //ADD MEDIA
            ui.caseView.select_tab(C.tabs.media)
                .click_button(C.buttons.add)
                .verify_element_is_visible('Drag And Drop your files here')
                .upload_file_and_verify_toast_msg('image.png')
                .edit_Description_on_first_row_on_grid(note)

            //Check values after reloading
            ui.caseView.reload_page()
                .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true)
                .select_tab(C.tabs.notes)
                .verify_content_of_results_table(note)
                .select_tab(C.tabs.media)
                .verify_content_of_results_table('image.png')

            //SEARCH FOR NOTE
            ui.searchNotes.run_search_by_Text(note)
                .verify_records_count_on_grid(1)

            //SEARCH FOR MEDIA
            ui.searchMedia.run_search_by_Description(note)
                .verify_records_count_on_grid(1)

            //SEARCH FOR CASE
            ui.searchCase.run_search_by_Case_Number(C.searchCriteria.inputFields.equals, D.editedCase.caseNumber)
                .verify_records_count_on_grid(1)
                .verify_data_on_the_grid(D.editedCase)


            //MASS UPDATE CASES
            D.generateNewDataSet();

            let allValues = [
                D.editedCase.offenseType,
                D.editedCase.caseOfficerName,
                D.editedCase.offenseLocation,
                D.editedCase.offenseDescription,
                D.editedCase.offenseDate,
                D.editedCase.tags[0],
                D.editedCase.status,
                D.editedCase.reviewDate,
                D.editedCase.reviewDateNotes
            ]
            api.cases.add_new_case(D.newCase.caseNumber + ' _1')
            api.cases.add_new_case(D.newCase.caseNumber + ' _2')

            ui.searchCase.expand_search_criteria()
                .enter_Case_Number(C.searchCriteria.inputFields.textSearch, D.newCase.caseNumber)
                .click_Search()
                .verify_records_count_on_grid(2)
                .select_checkbox_on_specific_table_row(1)
                .select_checkbox_on_specific_table_row(2)
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.caseActions.massUpdate)
                .turn_on_and_enter_values_to_all_fields_on_modal(C.caseFields.massUpdateModal, allValues)
                //.verify_text_above_modal_footer('\n        Mass updating\n         2 \n        \n        cases\n    ')
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)
                .quick_search_for_case(D.newCase.caseNumber + ' _1')
                .click_Edit()
            ui.caseView.verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.massUpdateModal, D.editedCase, D.newCase)
                .quick_search_for_case(D.newCase.caseNumber + ' _2')
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.massUpdateModal, D.editedCase, D.newCase)
        });

});
describe('Item', function () {

    it(
        '*** Add/Edit/Search/MassUpdate Item ' +
        '*** Add/Search Item Note  ' +
        '*** Add/Search Item Media', function () {
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            const itemBelongsToCurrently = D.newItem.itemBelongsTo[0]
            const currentTag = D.newItem.tags[0]
            D.editedItem.caseNumber = D.newItem.caseNumber = D.newCase.caseNumber
            api.cases.add_new_case(D.newCase.caseNumber);
            api.org_settings.update_org_settings(false, true);
            api.org_settings.enable_all_Item_fields();

            // ADD ITEM
            ui.app.open_newly_created_case_via_direct_link()
            ui.menu.click_Add__Item()
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
                .populate_all_fields_on_both_forms(D.newItem, false, false)
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase);
            ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newItem)

            // EDIT ITEM
            ui.itemView.remove_specific_values_on_multi_select_fields([itemBelongsToCurrently, currentTag])
                .edit_all_values(D.editedItem)
                .click_Save()
                .verify_toast_message(C.toastMsgs.saved)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedItem, D.newItem)
                .verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)
                .click_button('Cancel')

            //ADD NOTE
            let note = D.getRandomNo() + '_note';
            ui.itemView.select_tab(C.tabs.notes)
                .enter_note_and_category(note, C.noteCategories.sensitive)
                .verify_toast_message(C.toastMsgs.saved)

            //ADD MEDIA
            ui.itemView.select_tab(C.tabs.media)
                .click_button(C.buttons.add)
                .verify_element_is_visible('Drag And Drop your files here')
                .upload_file_and_verify_toast_msg('image.png')
                .edit_Description_on_first_row_on_grid(note)

            //Check values after reloading
            ui.itemView.reload_page()
                .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, true)
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

            // SEARCH FOR ITEM
            ui.searchItem.run_search_by_Item_Description(D.editedItem.description)
                .verify_content_of_first_row_in_results_table(D.editedItem.description);

            //MASS UPDATE ITEMS
            D.generateNewDataSet();

            let allValues = [
                D.editedItem.description,
                D.editedItem.recoveryLocation,
                D.editedItem.recoveredByName,
                D.editedItem.submittedBy,
                D.editedItem.category,
                D.editedItem.custodyReason,
                D.editedItem.recoveryDate,
                D.editedItem.make,
                D.editedItem.model,
                D.editedItem.itemBelongsTo[0],
                D.editedItem.tags[0]
            ]

            let allUpdatedFieldsOnHistory = [
                'Description',
                'Recovered At',
                'Recovered By',
                'Category',
                'Custody Reason',
                'Recovery Date',
                'Make',
                'Model',
                'Item Belongs to',
                'Tags',
            ]
            D.editedItem.serialNumber = D.newItem.serialNumber

            D.newItem1 = Object.assign({}, D.newItem)
            D.newItem1.description = '1__ ' + D.newItem.description
            D.newItem2 = Object.assign({}, D.newItem)
            D.newItem2.description = '2__ ' + D.newItem.description

            api.items.add_new_item(true, null, 'item_1', D.newItem1)
            api.items.add_new_item(true, null, 'item_2', D.newItem2)

            ui.searchItem
                .expand_search_criteria()
                .enter_Description(C.searchCriteria.inputFields.textSearch, D.newItem.description)
                .click_Search()
                .verify_records_count_on_grid(2)
                .select_checkbox_on_specific_table_row(1)
                .select_checkbox_on_specific_table_row(2)
                .click_Actions()
                .click_option_on_expanded_menu(C.dropdowns.caseActions.massUpdate)
                .turn_on_and_enter_values_to_all_fields_on_modal(C.itemFields.massUpdateModal, allValues)
                // .verify_text_above_modal_footer('\n        Mass updating\n         2 \n        \n        cases\n    ')
                .click_Ok()
                .verify_toast_message(C.toastMsgs.saved)

            cy.getLocalStorage('item_1').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem1, true)
                    .open_last_history_record(0)
                    .verify_all_values_on_history(D.editedItem, D.newItem1)
                    .verify_red_highlighted_history_records(allUpdatedFieldsOnHistory)
            })

            cy.getLocalStorage('item_2').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem2, true)
                    .open_last_history_record(0)
                    .verify_all_values_on_history(D.editedItem, D.newItem2)
                    .verify_red_highlighted_history_records(allUpdatedFieldsOnHistory)
            })
        });
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
        api.cases.add_new_case()
        api.items.add_new_item();
        api.locations.add_storage_location('Box_2')

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView
            //CHECK OUT
            .click_Actions()
            .perform_Item_Check_Out_transaction(orgAdmin, C.checkoutReasons.lab, 'test-note', D.currentDate)
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
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
            .perform_Item_Transfer_transaction(powerUser, orgAdmin, 'test-note')
            .verify_edited_and_not_edited_values('view', ["Custodian"], D.editedItem, D.newItem)
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
            .perform_Item_CheckIn_transaction(powerUser, false, D['newLocationBox_2'][0].name, 'test-note')
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

            //DISPOSAL
            .click_Actions()
            .perform_Item_Disposal_transaction(powerUser, C.disposalMethods.auctioned, 'test-note')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
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
            .perform_Item_Undisposal_transaction(powerUser, true, D['newLocationBox_2'][0].name, 'test-note')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
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
        api.locations.move_location('Box_2', 'root')

    });
});

// describe('Task', function () {
//
//     it('Add/Edit/Search Task', function () {
//
//
//     });
//
// });

describe('Services', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.cases.add_new_case()
        api.items.add_new_item()
    });

    it.only('Reporter', function () {

        api.auth.get_tokens(S.userAccounts.orgAdmin);
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });
        ui.app.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.items)
            .select_checkbox_for_all_records()
            .click_element_on_active_tab(C.buttons.reports)
            .click_option_on_expanded_menu(C.reports.primaryLabel4x3)
        cy.get('@windowOpen').should('have.been.called');
        cy.get('@windowOpen').should('have.been.calledWithMatch', /Report.*\.pdf/);
        ui.app.verify_toast_message(C.toastMsgs.popupBlocked);
    });

    it.only('Exporter', function () {

        api.auth.get_tokens(S.userAccounts.orgAdmin);
        ui.app.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.items)
            .select_checkbox_for_all_records()
            .click_element_on_active_tab(C.buttons.export)
            .click_option_on_expanded_menu('All - Excel')
        ui.app.verify_url_contains_some_value('export-jobs')
            .verify_content_of_first_row_in_results_table('Download')
    });

    it('Importer', function () {
        let fileName = 'CaseImport_allFields_' + S.domain;
        api.auth.get_tokens(S.userAccounts.orgAdmin);

        D.generateNewDataSet();
        D.getNewItemData(D.newCase);
        D.newCase.caseOfficers_importFormat =
            S.userAccounts.orgAdmin.email + ';' +
            S.selectedEnvironment.admin_userGroup.name
        D.newCase.caseOfficers = [S.userAccounts.orgAdmin.name, S.selectedEnvironment.admin_userGroup.name]

        E.generateDataFor_CASES_Importer([D.newCase]);

        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();
        api.org_settings.update_org_settings(true, true);
        api.auto_disposition.edit(true);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported])
            .quick_search_for_case(D.newCase.caseNumber);

        ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
            .click_button_on_active_tab(C.buttons.edit)
            .verify_values_on_Edit_form(D.case1)
            .open_last_history_record()
            .verify_all_values_on_history(D.case1)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)

        D.newItem.caseNumber = D.newCase.caseNumber
        ui.menu.click_Add__Item();
        ui.addItem.enter_Case_Number_and_select_on_typeahead(D.newCase.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem, false, false)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save(D.newItem)
            .verify_Error_toast_message_is_NOT_visible();
        ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
    })

    it('Workflow Service', function () {
        api.auth.get_tokens(S.userAccounts.orgAdmin);
        D.generateNewDataSet();
        api.workflows.delete_all_workflows();
        ui.app.clear_gmail_inbox(S.gmailAccount);

        ui.menu.click_Settings__Workflows();
        ui.workflows.click_(C.buttons.add)
            .set_up_workflow(
                'workflow' + D.randomNo,
                C.workflows.types.cases,
                powerUser.name,
                ['Email',
                    //'Create new Task'
                ],
                C.workflows.executeWhen.created)
            .click_Save()

        api.cases.add_new_case();
        // ui.app.open_newly_created_case_via_direct_link()
        //     .select_tab('Tasks')
        //     .get_text_from_grid_and_save_in_local_storage('Task #', 'taskNumber', 'td')
        ui.workflows.verify_email_content_(powerUser.email, C.workflows.emailTemplates.caseCreated, D.newCase, null, 1, false)
    })

    it('Dispo Auth Service', function () {

        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);

        D.getNewCaseData();
        D.getNewItemData(D.newCase);
        api.cases.add_new_case();

        api.org_settings.enable_all_Item_fields();
        var numberOfRecords = 51;
        let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
        D.getNewTaskData();
        D.newTask = Object.assign(D.newTask, selectedTemplate);
        D.newTask.creatorId = S.userAccounts.orgAdmin.id;
        D.newTask.assignedUserIds = [S.userAccounts.orgAdmin.id];

        E.generateDataFor_ITEMS_Importer([D.newItem], null, null, numberOfRecords);
        cy.generate_excel_file('Items_forTestingDispoActionsService', E.itemImportDataWithAllFields);
        ui.importer.import_data('Items_forTestingDispoActionsService', C.importTypes.items)

        api.items.get_items_from_specific_case(D.newCase.caseNumber, 1, true);
        api.tasks.add_new_task(D.newTask, 51);

        ui.taskView
            .open_newly_created_task_via_direct_link()
            .select_tab('Items')
            .set_large_view()
            .set_Action___Approve_for_Disposal([1, 51])
            .click_Submit_for_Disposition()
            .verify_toast_message('Processing...')
            .verify_Dispo_Auth_Job_Status('Complete')
            .reload_page()
            //.verify_text_is_present_on_main_container('Closed')
            .select_tab('Items')
            .disable_large_view()
            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds('Approved for Disposal', 2, 5, true, true)
        ui.taskView.verify_Disposition_Statuses_on_the_grid([
            [[...Array(51).keys()], 'Approved for Disposal']])
    });

    it('Auto Reports - Release Letters', function () {

        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);

        ui.menu.click_Tools__Auto_Reports()
        ui.app.sort_by_descending_order('Delivery Time')
            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(approvedForReleaseItem.description, 10)
    });

    it('Container Moves', function () {

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person();

        api.locations.add_storage_location('LOC_1')
        api.locations.add_storage_location('LOC_2')
        api.locations.add_storage_location('Container_1', 'LOC_1')
        api.locations.update_location('Container_1', 'isContainer', true)

        api.items.add_new_item(true, 'Container_1', 'item1InContainer')
        api.items.add_new_item(true, 'Container_1', 'item2InContainer')

        ui.menu.click_Scan()
        ui.scan.close_Item_In_Scan_List_alert()

        cy.getLocalStorage('item1InContainer').then(item_1 => {
            cy.getLocalStorage('item2InContainer').then(item_2 => {
                cy.getLocalStorage('Container_1').then(container => {
                    cy.getLocalStorage('LOC_2').then(loc2 => {
                        const containerName = JSON.parse(container).name
                        const loc2Name = JSON.parse(loc2).name
                        const containerBarcode = JSON.parse(container).barcode
                        const item1 = JSON.parse(item_1)
                        const item2 = JSON.parse(item_2)

                        ui.scan.scan_barcode(containerBarcode)
                            .select_tab('Containers')
                            .verify_content_of_first_row_in_results_table_on_active_tab(containerName)
                            .select_checkbox_on_first_table_row(true)
                            .click_Actions(true)
                            .click_option_on_expanded_menu('Move Container')
                            .select_Storage_location(loc2Name)
                            .click_button_on_modal('Save')
                            .verify_toast_message('Processing')
                            .verify_text_is_present_on_main_container('Container Move Jobs')
                            .verify_content_of_first_row_in_results_table([containerName, loc2Name, 'Complete'])
                        ui.menu.click_Scan()
                        ui.scan.close_Item_In_Scan_List_alert(false)
                            .scan_barcode(item1.barcode)
                            .click_button(C.buttons.view)
                            .verify_text_is_present_on_main_container('Basic Info')
                            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(loc2Name, 2, 5, true)
                        ui.itemView.select_tab(C.tabs.chainOfCustody)
                            .verify_data_on_Chain_of_Custody([
                                [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Notes', `${containerName} moved to ${loc2Name}`]],
                                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                            ])
                            .open_item_url(item2.id)
                            .verify_text_is_present_on_main_container('Basic Info')
                            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(loc2Name, 2, 5, true)
                        ui.itemView.select_tab(C.tabs.chainOfCustody)
                            .verify_data_on_Chain_of_Custody([
                                [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Notes', `${containerName} moved to ${loc2Name}`]],
                                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                            ])
                    })
                })
            })
        });
    });

})
