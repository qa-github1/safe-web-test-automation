const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const E = require("../../fixtures/files/excel-data");
const helper = require("../../support/e2e-helper");
const DF = require("../../support/date-time-formatting");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
describe('Services', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.cases.add_new_case()
        api.items.add_new_item()
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields();
        api.org_settings.enable_all_Person_fields();
        api.users.update_current_user_settings(orgAdmin.id, DF.dateTimeFormats.long)
        api.org_settings.update_org_settings(false, true);
        api.org_settings.update_org_settings_by_specifying_property_and_value('containerAutoDeactivate', true)
        api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
    });

    it('7. Container Moves', function () {

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person();

        D.rootLoc1 = D.getStorageLocationData('rootLoc1')
        D.rootLoc2 = D.getStorageLocationData('rootLoc2')
        D.container1 = D.getStorageLocationData('cont1')

        api.locations.add_storage_location(D.rootLoc1)
        api.locations.add_storage_location(D.rootLoc2)
        api.locations.add_storage_location(D.container1, D.rootLoc1.name)
        api.locations.update_location(D.container1.name, 'isContainer', true)
        api.items.add_new_item(true, D.container1, 'item1InContainer')
        api.items.add_new_item(true, D.container1, 'item2InContainer')

        ui.menu.click_Scan()
        ui.scan.close_Item_In_Scan_List_alert()

        cy.getLocalStorage(D.container1.name).then(cont1 => {
            cy.getLocalStorage(D.rootLoc2.name).then(loc2 => {
                cy.getLocalStorage('item1InContainer').then(item_1 => {
                    cy.getLocalStorage('item2InContainer').then(item_2 => {
                        const item1 = JSON.parse(item_1)
                        const item2 = JSON.parse(item_2)
                        D.container1 = JSON.parse(cont1)
                        D.rootLoc2 = JSON.parse(loc2)

                        ui.scan.scan_barcode(D.container1.barcode)
                            .select_tab('Containers')
                            .verify_content_of_first_row_in_results_table_on_active_tab(D.container1.name)
                            .select_checkbox_on_first_table_row(true)
                            .click_Actions(true)
                            .click_option_on_expanded_menu('Move Container')
                            .select_Storage_location(D.rootLoc2.name)
                            .click_button_on_modal('Save')
                            .verify_toast_message('Processing')
                            .verify_text_is_present_on_main_container('Container Move Jobs')
                            .verify_content_of_first_row_in_results_table([D.container1.name, D.rootLoc2.name, 'Complete'])
                        ui.menu.click_Scan()
                        ui.scan.close_Item_In_Scan_List_alert(false)
                            .scan_barcode(item1.barcode)
                            .click_button(C.buttons.view)
                            .verify_text_is_present_on_main_container('Basic Info')
                            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(D.rootLoc2.name, 2, 5, true)
                        ui.itemView.select_tab(C.tabs.chainOfCustody)
                            .verify_data_on_Chain_of_Custody([
                                [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Notes', `${D.container1.name} moved to ${D.rootLoc2.name}`]],
                                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                            ])
                            .open_item_url(item2.id)
                            .verify_text_is_present_on_main_container('Basic Info')
                            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(D.rootLoc2.name, 2, 5, true)
                        ui.itemView.select_tab(C.tabs.chainOfCustody)
                            .verify_data_on_Chain_of_Custody([
                                [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Notes', `${D.container1.name} moved to ${D.rootLoc2.name}`]],
                                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                            ])
                    })
                })
            })
        })
    })

    it('8. Container Auto Deactivate', function () {

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.org_settings.enable_all_Item_fields(C.itemFields.dispositionStatus)
        api.cases.add_new_case(D.newCase.caseNumber);
        api.people.add_new_person();

        D.box1 = D.getStorageLocationData('BOX_1')
        D.containerA = D.getStorageLocationData('Container_A')

        api.locations.add_storage_location(D.box1)
        api.locations.add_storage_location(D.containerA, D.box1.name)
        api.locations.update_location(D.containerA.name, 'isContainer', true)

        api.items.add_new_item(true, D.containerA)
        ui.app.open_newly_created_item_via_direct_link()
            .click_Actions()
            .perform_Item_Disposal_transaction(orgAdmin, C.disposalMethods.auctioned, 'testContainerAutoDeactivate' + D.randomNo, true)

        ui.menu.click_Search__Container_AutoDeactivate_Jobs()
        ui.app.verify_content_of_first_row_in_results_table([
            D.currentDateAndRandomNumber + '_BOX_1' + '/' + D.currentDateAndRandomNumber + '_Container_A',
            'Complete'])

    });

    it('9. Task/Case Reassignment', function () {

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.users.add_new_user()

        cy.getLocalStorage('newUser').then(user => {
            const newUser = JSON.parse(user)
            D.newTask.assignedUserIds = D.newCase.caseOfficerIds = [newUser.id]
            api.cases.add_new_case();
            api.tasks.add_new_task()

            ui.menu.click_Settings__User_Admin()
            ui.userAdmin.search_for_user(newUser.email)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu('Deactivate Users')
                .enter_values_on_reassign_modal([orgAdmin.fullName])
                .click_Ok()
                .verify_toast_message('Processing...')
                .verify_text_is_present_on_main_container('Reassign Tasks and Cases After Deactivating the User(s)')
                .verify_content_of_first_row_in_results_table([newUser.email, 'Complete'])
                .open_newly_created_case_via_direct_link()
                .click_Edit()
            D.newCase.caseOfficers = [D.newUser.firstLastName, orgAdmin.name]
            ui.caseView.verify_values_on_Edit_form(D.newCase)
        })
    });

    it('10. People Merge', function () {

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.cases.add_new_case()
        const person1 = Object.assign({}, D.newPerson)
        person1.businessName = D.randomNo + '_Person1'
        person1.firstName = D.randomNo + '_Person1'
        person1.driversLicense = D.randomNo + '_Person1'
        const person2 = Object.assign({}, D.newPerson)
        person2.businessName = D.randomNo + '_Person2'
        person2.firstName = D.randomNo + '_Person2'
        person2.driversLicense = D.randomNo + '_Person2'

        api.people.add_new_person(true, D.newCase, person1, 'person1')
        api.people.add_new_person(true, D.newCase, person2, 'person2')

        cy.getLocalStorage('person1').then(person_1 => {
            cy.getLocalStorage('person2').then(person_2 => {
                const person1 = JSON.parse(person_1)
                const person2 = JSON.parse(person_2)

                ui.menu.click_Search__People()
                ui.searchPeople.run_search_by_Business_Name(person1.businessName)
                    .select_checkbox_on_first_table_row()
                    .click_Actions()
                    .click_option_on_expanded_menu('Merge Into')
                    .select_Person_on_Merge_modal(person2.businessName)
                    .click_button('Merge')
                    .verify_messages_on_sweet_alert([
                        'The selected people will be removed after the merge. Are you sure? Person(s) to be merged:',
                        person1.firstName])
                    .click_button_on_sweet_alert('OK')
                    .verify_text_is_present_on_main_container('People Merge Jobs')
                    .sort_by_descending_order('Start Date')
                    .verify_content_of_first_row_in_results_table(['Complete', person2.firstName])
                    .pause(1)
                    .click_link(person2.firstName)
                    .select_tab('Merge History')
                    .verify_content_of_first_row_in_results_table_on_active_tab(person1.businessName)
            })
        })
    });

    xit('11. Auto Disposition', function () {

        let minDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2027, 11, 15);
        let maxDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2027, 11, 15);
        let redistributeNote = 'Redistributing Case Review dates from ' + minDate + ' to ' + maxDate;
        let daysToFollowUp = 33

        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.update_dispo_config_for_offense_types(true, true, daysToFollowUp)
        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
        ui.autoDispo.verify_Redistribute_Case_Review_Date_labels(true)

         D.generateNewDataSet()
         D.getDataForMultipleCases(3)
         let fileName = 'Case_pastDueReview';
        D.case1.reviewDate = '';
        D.case2.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.long.mask, '01/08/2019');
        D.case3.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.long.mask, '01/08/2030');

        // import 3 cases (NO Review Date, Review Date past due and Upcoming Review Date )
        E.generateDataFor_CASES_Importer([D.case1, D.case2, D.case3]);
        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        ui.menu.click_Tools__Data_Import()
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases, null, 1, 1,
            ['Some Review Dates are blank. They will be auto-applied. Select Import to proceed.']
        )
            .verify_toast_message([
                C.toastMsgs.importComplete,
                3 + C.toastMsgs.recordsImported])

        // redistribute dates and verify Review Date and notes again
        D.case2.reviewDate = minDate;
        D.case2.reviewDateNotes = redistributeNote;

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
        ui.autoDispo.verify_Redistribute_Case_Review_Date_labels(false, 1, 2)
        ui.autoDispo.click_button(C.buttons.redestributeCaseReviewDates)
            .verify_modal_content(C.labels.autoDisposition.updateCases)
            .click_button(C.tabs.pastDue)
            .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
            .click_button(C.buttons.updateCases)
            .verify_toast_message(C.toastMsgs.saved)
            .verify_Redistribute_Case_Review_Date_labels(true, 0, 3)
        D.case2.reviewDate = helper.getSpecificDateInSpecificFormat(
            DF.dateTimeFormats.long.mask,
            '11/15/2027 12:00 AM'
        );

        // verify change IS applied for Case with 'Past Due Date'
        ui.app.quick_search_for_case(D.case2.caseNumber)
            .click_button(C.buttons.edit);
        ui.caseView.verify_values_on_Edit_form(D.case2);

        // verify change is not applied for Case with 'No Review Date'
        D.case1.reviewDate = helper.getDateAfterXDaysFromSpecificDate(DF.dateTimeFormats.long.mask, S.currentDate, daysToFollowUp);
        ui.app.quick_search_for_case(D.case1.caseNumber)
            .click_button(C.buttons.edit);
        ui.caseView.verify_values_on_Edit_form(D.case1);

        // verify change is not applied for Case with 'Upcoming Review Date'
        ui.app.quick_search_for_case(D.case3.caseNumber)
            .click_button(C.buttons.edit);
        ui.caseView.verify_values_on_Edit_form(D.case3);
    });

    it('12. Media Mass Download', function () {

        api.auth.get_tokens(orgAdmin);
        api.items.add_new_item()
        ui.itemView.open_newly_created_item_via_direct_link()
            .select_tab(C.tabs.media)
            .click_button(C.buttons.add)
            .verify_element_is_visible('Drag And Drop your files here')
            .upload_file_and_verify_toast_msg('image.png')
            .select_checkbox_on_first_table_row_on_active_tab(1)
            .click_Actions(true)
            .click_option_on_expanded_menu('Mass Download')
            .verify_text_is_present_on_main_container('Download Jobs')
            .sort_by_descending_order('Start Date')
            .verify_content_of_first_row_in_results_table(['Done', 'Download'])
    })

    it('13. (Trans)Actions on Search Results', function () {

        api.auth.get_tokens(orgAdmin);
        D.getNewItemData()
        api.items.add_new_item(true, null, 'newItem1')
        api.items.add_new_item(true, null, 'newItem1')

        ui.menu.click_Search__Item()
        ui.searchItem
            .select_Status('Checked In')
            .select_Office(S.selectedEnvironment.office_1.name)
            .enter_Description('contains', D.newItem.description)
            .click_Search()
            .click_Actions_On_Search_Results()
            .perform_Item_Check_Out_transaction(powerUser, C.checkoutReasons.lab, 'Check Out from Actions on Search Results', null, true, true)
            .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
            .sort_by_descending_order('Start Date')
            .verify_content_of_first_row_in_results_table('Completed')

        cy.getLocalStorage('newItem1').then(item => {
            ui.app.open_item_url(JSON.parse(item).id)
            ui.itemView.select_tab(C.tabs.chainOfCustody)
                .verify_data_on_Chain_of_Custody([
                    [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Notes', 'Check Out from Actions on Search Results']],
                    [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                ])
        })
    })

})

