const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const E = require("../../fixtures/files/excel-data");
const taskView = require("../../pages/ui-spec");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
describe('Dispo Auth', function () {

    xit('Add Dispo Task with 50 items and assign to Power User, ' +
        '--import items instead of adding via API' +
        '--set Approve for Release for all items using Actions menu' +
        '--check statuses and notes upon submission', function () {

        let admin = S.getUserData(S.userAccounts.orgAdmin);

        ui.app.log_title(this);
        api.auth.get_tokens(admin);
        api.org_settings.enable_all_Item_fields();
        api.org_settings.enable_all_Person_fields();

        let user = S.getUserData(S.userAccounts.powerUser);
        api.auth.get_tokens(user);
        let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
        D.getNewTaskData();
        D.generateNewDataSet();
        D.newTask = Object.assign(D.newTask, selectedTemplate);
        D.newTask.creatorId = S.userAccounts.powerUser.id;
        D.newTask.assignedUserIds = [S.userAccounts.powerUser.id];
        api.cases.add_new_case();

        E.generateDataFor_ITEMS_Importer([D.newItem], null, null, 50);
        cy.generate_excel_file('50_items_import_forDispoAuth', E.itemImportDataWithAllFields);
        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing('50_items_import_forDispoAuth', C.importTypes.items)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                50 + C.toastMsgs.recordsImported])

        api.items.get_items_from_specific_case(D.newCase.caseNumber, 1, true)
        api.tasks.add_new_task(D.newTask, 50)

        // Create a person and an address to use for all 100 items
        let person = Object.assign({}, D.getNewPersonData());
        person.firstName = 'Person_Approve_100';
        api.people.add_new_person(false, null, person);
        let address = Object.assign({}, D.getNewPersonAddressData());

        ui.taskView
            .open_newly_created_task_via_direct_link()
            .select_tab('Items')
            .set_Action___Approve_for_Release([...Array(100).keys()], person, address, false, false, true, false)
            .click_Submit_for_Disposition()
            .verify_toast_message('Submitted for Disposition')
            .wait_until_spinner_disappears()
            .verify_Disposition_Statuses_on_the_grid(
                [...Array(100).keys()].map(i => [[i], 'Approved for Release'])
            )
            .select_tab('Basic Info')
            .verify_text_is_present_on_main_container('Closed');

        ui.menu.click__Storage_Locations();
    });


    xit('Add Dispo Task with 11 1DA items and assign to Org Admin, ' +
        '--set different actions for item using all variations' +
        '--using Actions menu and grid, ' +
        '--check statuses and notes upon submission', function () {

        let user = S.getUserData(S.userAccounts.orgAdmin);

        ui.app.log_title(this);
        api.auth.get_tokens(user);
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

        // For "Approve for Release" to New Person, --> proceed to create a duplicate person after warning, and add address
        let person2 = Object.assign({}, person1)
        person2.firstName = 'Person_1'
        let address2 = Object.assign({}, D.getNewPersonAddressData())

        // For "Approve for Release" to New Person, --> add an address
        D.newPerson = D.getNewPersonData()
        let person3 = Object.assign({}, {
            firstName: D.newPerson.firstName,
            lastName: D.newPerson.lastName,
            personType: S.selectedEnvironment.personType.name
        })
        person3.firstName = person3.firstName + '_P_3'
        let address3 = Object.assign({}, D.getNewPersonAddressData())

        // For "Approve for Release" to Existing Person, NOT linked to the case, WITHOUT an address --> add address
        let person4 = Object.assign({}, D.getNewPersonData())
        person4.firstName = person4.firstName + '_P_4'
        D.newPersonAddress = {}
        api.people.add_new_person(false, null, person4)
        let address4 = Object.assign({}, D.getNewPersonAddressData())

        // For "Approve for Release" to Existing Person, already linked to the case, WITH an address
        let person5 = Object.assign({}, D.getNewPersonData())
        person5.firstName = person5.firstName + '_P_5'
        api.people.add_new_person(true, D.newCase, person5)
        let address5 = Object.assign({}, D.getNewPersonAddressData())

        for (let i = 0; i < 13; i++) {
            api.items.add_new_item(true, null, 'item' + i)
        }
        api.tasks.add_new_task(D.newTask, 12)

        // ui.app.open_url_and_wait_all_GET_requests_to_finish('https://dev.trackerproducts.com/#/view-task/634899')

        ui.taskView
            .open_newly_created_task_via_direct_link()
            .select_tab('Items')
            .set_Action___Approve_for_Disposal([1, 2])
            .set_Action___Approve_for_Release([3], person1, {}, false, false, false, false, true, true)
            .set_Action___Approve_for_Release([4], person2, address2, false, false, false, false, true, false)
            .set_Action___Approve_for_Release([5], person3, address3, false, false, false, false, false, false)
            .set_Action___Approve_for_Release([6], person4, address4, true, false, false, false)
            .set_Action___Approve_for_Release([7], person5, address5, true, true, true, false)
            .set_Action___Delayed_Release([8, 9], person4, {}, true, true, false, true)
            .set_Action___Hold([10], 'Case Active', false, 10)
            .set_Action___Hold([11], 'Active Warrant', true)
            .set_Action___Timed_Disposal([12], '3y')
            .click_Submit_for_Disposition()
            .verify_toast_message('Submitted for Disposition')
            .wait_until_spinner_disappears()
            .verify_Disposition_Statuses_on_the_grid
            ([
                [[1, 2], 'Approved for Disposal'],
                [[3, 4, 5, 6, 7], 'Approved for Release'],
                [[8, 9], 'Delayed Release'],
                [10, 'Hold'],
                [11, 'Indefinite Retention'],
                [12, 'Delayed Disposal'],
            ])
            .select_tab('Basic Info')
            .verify_text_is_present_on_main_container('Closed')
    });

    // enable loop if you want to generate 3k Release letters
});

describe('Generating large number of release letters ', function () {
    for (let i = 0; i < 15; i++) {

        let caseData
        let itemData

        xit('Add Dispo Task with 200 items to trigger Dispo Auth Service and generation of letters for all', function () {

            cy.clearLocalStorage()
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            caseData = D.getNewCaseData()
            itemData = D.getNewItemData(caseData)
            var numberOfRecords = 200;
            E.generateDataFor_ITEMS_Importer([itemData], null, null, numberOfRecords);

            api.cases.add_new_case(caseData.caseNumber);
            let person1 = Object.assign({}, D.getNewPersonData(caseData));
            let address1 = {};
            api.people.add_new_person(true, caseData, person1);
            let person2 = Object.assign({}, D.getNewPersonData(caseData));
            person2.firstName = 'EMPTY_ADDRESS'

            api.org_settings.enable_all_Item_fields();
            let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
            D.getNewTaskData();
            D.newTask = Object.assign(D.newTask, selectedTemplate);
            D.newTask.creatorId = S.userAccounts.orgAdmin.id;
            D.newTask.assignedUserIds = [S.userAccounts.orgAdmin.id];

            cy.generate_excel_file('Items_forTestingDispoActionsService' + i, E.itemImportDataWithAllFields);
            ui.importer.import_data('Items_forTestingDispoActionsService'+ i, C.importTypes.items)

            api.items.get_items_from_specific_case('newCase', 1, true);
            api.tasks.add_new_task(D.newTask, numberOfRecords);

            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_page_size(100)
                .set_Action___Approve_for_Release([1, 50], person1, address1, true, true, false, false)
                .set_Action___Approve_for_Release([51, 100], person1, address1, true, true, false, false)
                .click_number_on_pagination(2)
                .set_Action___Approve_for_Release([1, 100], person2, null, false, false)
                // .set_Action___Approve_for_Release([51, 100], person2, null, true, true)
                .click_Submit_for_Disposition()
                .verify_toast_message('Processing...')
                .verify_Dispo_Auth_Job_Status('Complete')
            //     .reload_page()
            //     .verify_text_is_present_on_main_container('Closed')
            //     .select_tab('Items')
            //     .disable_large_view()
            //     .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds('Approved for Release', 2, 5, true, true)
            // ui.taskView.select_tab('Basic Info')
            //     .verify_text_is_present_on_main_container('Closed');
        });
    }
});
