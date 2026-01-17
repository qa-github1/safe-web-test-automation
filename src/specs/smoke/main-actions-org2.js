const C = require('../../fixtures/constants');
const DF = require('../../support/date-time-formatting');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const helper = require("../../support/e2e-helper");
import {enableSessionContinuation} from '../../support/continue-session';

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let admin_userGroup = S.selectedEnvironment.admin_userGroup;

for (let i = 0; i < 1; i++) {
    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();
        api.org_settings.enable_all_Person_fields();
        api.org_settings.update_org_settings(false, true);
        api.users.update_current_user_settings(orgAdmin.id, DF.dateTimeFormats.short, DF.dateFormats.shortDate)
    });

    describe('Person', function () {
        before(() => {
            cy.session('app-session', () => {
                api.auth.get_tokens_without_page_load(orgAdmin);
                D.generateNewDataSet()
            })
        })
        enableSessionContinuation();
        let currentCaseOfficer, currentTag, note

        it('*** Add & Edit Person', function () {
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
            ui.app.store_last_url()
        });

        it('*** Add Person Note and search for it', function () {
            note = D.getRandomNo() + '_note';
            ui.personView.visit_last_url()
                .select_tab(C.tabs.notes)
                .enter_note_and_category(note, C.noteCategories.sensitive)
                .verify_toast_message(C.toastMsgs.saved)

            // SEARCH FOR NOTE
            ui.searchNotes.run_search_by_Text(note)
                .verify_records_count_on_grid(1)
        });

        it('*** Add Person Media and search for it', function () {
            ui.personView.visit_last_url()
                .select_tab(C.tabs.media)
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

            //SEARCH FOR MEDIA
            ui.searchMedia.run_search_by_Description(note)
                .verify_records_count_on_grid(1)
        });

        it('*** Search for Person', function () {
            ui.searchPeople.open_direct_url_for_page()
                .enter_Business_Name(D.editedPerson.businessName)
                .click_Search()
                .verify_content_of_first_row_in_results_table(D.editedPerson.businessName);
        });
    })

    describe('User', function () {

        it('Add User -- Assign Permissions -- Log in with newly created user', function () {
            ui.app.log_title(this);

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet();
            D.newUser.permissionGroups = [S.selectedEnvironment.regularUser_permissionGroup.name]
            api.org_settings.set_required_User_forms([])
            ui.app.clear_gmail_inbox(S.gmailAccount);

            api.org_settings.update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.org_settings.update_org_settings_by_specifying_property_and_value('isDivisionsAndUnitsEnabled', true)
            ui.menu.click_Settings__User_Admin()
                .click_button(C.buttons.add)
            ui.userAdmin.enter_all_values(D.newUser)
                .scroll_and_click(C.buttons.ok)
                .verify_toast_message(C.toastMsgs.saved)
                .select_permission_group_per_office(S.selectedEnvironment.regularUser_permissionGroup.name, D.newUser.office)
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

    describe('Task', function () {
        it('Add task with all fields' +
            '-- assign to 1 user' +
            '-- attach 1 case, 1 item and 1 person' +
            '-- override template content' +
            '-- search for task on the grid by Assignee name' +
            '--verify values on grid' +
            '-- check email notification with more Task details ', function () {

            ui.app.clear_gmail_inbox(S.gmailAccount);
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);

            let powerUser2 = S.userAccounts.basicUser;
            api.permissions.assign_multiple_users_to_User_Group([powerUser.id, powerUser2.id], admin_userGroup)
            api.auto_disposition.edit(true)
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
                    .verify_newly_created_task_is_shown_in_first_table_row(D.newTask.title)
                    .search_for_the_task(D.newTask.title)
                    .verify_task_data_on_grid(D.newTask, orgAdmin)
                ui.addTask.verify_email_content_(powerUser.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name, 2, false)
                ui.addTask.verify_email_content_(powerUser2.email, C.tasks.emailTemplates.taskCreated, D.newTask, powerUser.name + ', ' + admin_userGroup.name)
            })

        });
    });

    describe('Inventory Report', function () {

        let barcodes = [];

        let
            loc1 = D.currentDateAndRandomNumber + '_' + 'Loc1',
            container1 = D.currentDateAndRandomNumber + '_' + 'Container1',
            emptyContainer1 = D.currentDateAndRandomNumber + '_' + 'EmptyContainer1',
            inactiveContainer1 = D.currentDateAndRandomNumber + '_' + 'InactiveContainer1',
            sublocation1 = D.currentDateAndRandomNumber + '_' + 'Sublocation1',
            subcontainer1 = D.currentDateAndRandomNumber + '_' + 'Subcontainer1',
            loc2 = D.currentDateAndRandomNumber + '_' + 'Loc2',
            container2 = D.currentDateAndRandomNumber + '_' + 'Container2',
            emptyContainer2 = D.currentDateAndRandomNumber + '_' + 'EmptyContainer2',
            sublocation2 = D.currentDateAndRandomNumber + '_' + 'Sublocation2'

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.org_settings.disable_Item_fields()
            D.generateNewDataSet();
            api.cases.add_new_case(D.newCase.caseNumber);
            api.people.add_new_person();


            api.locations.add_storage_location(loc1)
            api.locations.add_storage_location(container1, loc1)
            api.locations.update_location(container1, 'isContainer', true)
            api.locations.add_storage_location(emptyContainer1, loc1)
            api.locations.update_location(emptyContainer1, 'isContainer', true)
            api.locations.add_storage_location(inactiveContainer1, loc1)
            api.locations.update_location(inactiveContainer1, 'active', false)
            api.locations.add_storage_location(sublocation1, loc1)
            api.locations.add_storage_location(subcontainer1, sublocation1)
            api.locations.update_location(subcontainer1, 'isContainer', true)

            api.locations.add_storage_location(loc2)
            api.locations.add_storage_location(container2, loc2)
            api.locations.update_location(container2, 'isContainer', true)
            api.locations.add_storage_location(emptyContainer2, loc2)
            api.locations.update_location(emptyContainer2, 'isContainer', true)
            api.locations.add_storage_location(sublocation2, loc2)


            api.items.add_new_item(true, loc1, 'item0')
            api.items.add_new_item(true, loc1, 'item1')
            api.items.add_new_item(true, container1, 'item2')
            api.items.add_new_item(true, sublocation1, 'item3')
            api.items.add_new_item(true, subcontainer1, 'item4')
            api.items.add_new_item(true, loc2, 'item5')
            api.items.add_new_item(true, container2, 'item6')

            for (let i = 0; i < 7; i++) {
                cy.getLocalStorage('item' + i).then(item => {
                    barcodes.push(JSON.parse(item).barcode)
                })
            }
        })

        it('2.1. Create and run DR for 2 storage locations that have: ' +
            'container with item, empty container, sub-location, empty sub-container and sub-container with item - No Discrepancies Found', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[loc1].barcode)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[1])
                .enter_barcode(D[container1].barcode, false)
                .enter_barcode(D[sublocation1].barcode, true)
                .enter_barcode(D[subcontainer1].barcode, false)
                .enter_barcode(barcodes[3])
                .enter_barcode(D[loc2].barcode, true)
                .enter_barcode(D[container2].barcode, false)
                .enter_barcode(barcodes[5])
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.noDiscrepanciesFound)
                .verify_summary_table(4, 3, 4, 3, 0)
        })

        it('2.2. Scanning some barcodes multiple times and checking all types of discrepancies in one Report: ' +
            '"Barcode valid but not found in the system"' +
            '"Items Not Scanned", ' +
            '"Wrong Storage Location",' +
            '"Container Not Scanned",' +
            '"Containers in Wrong Location"', function () {

            let reportName = D.getCurrentDateAndRandomNumber(4);

            api.auth.get_tokens(orgAdmin);

            ui.menu.click_Tools__Inventory_Reports()
                .click_button(C.buttons.newReport)
            ui.inventoryReports.start_report(reportName, D[loc1].barcode)
                .enter_barcode('test3232')
                .enter_barcode('test3232', false, true)
                .enter_barcode(barcodes[0])
                .enter_barcode(barcodes[0], false, true)
                .enter_barcode(barcodes[0], false, true)
                .enter_barcode(D[container2].barcode, false)
                .enter_barcode(D[container2].barcode, false, true)
                .enter_barcode(barcodes[2])
                .enter_barcode(barcodes[2])
                .enter_barcode(barcodes[5])
                .enter_barcode(D[loc2].barcode, true)
                .click_button(C.buttons.runReport)
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.barcodeValidButNotFoundInSystem(1))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.wrongStorageLocation(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.itemsNotScanned(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.containersNotScanned(2))
                .verify_text_is_present_on_main_container(C.labels.InventoryReports.containersInWrongLocation(1))
                .verify_summary_table(4, 1, 4, 1, 8)
        })
    });
}

