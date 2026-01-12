const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const E = require("../../fixtures/files/excel-data");
const taskView = require("../../pages/ui-spec");
const {checkTestDuration} = require("../../fixtures/settings");
const {assign_office_based_permissions_to_user} = require("../../api-utils/endpoints/permissions/collection");
let startTime

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let approvedForReleaseItem3 = {}
let approvedForReleaseItem4 = {}

for (let i = 0; i < 1; i++) {

    describe('Dispo Auth - without session restore', function () {

        before(function () {
            startTime = Date.now();
        });

        after(() => {
            const endTime = Date.now();
            cy.log(`⏱ Total time for suite: ${checkTestDuration(startTime, endTime)}`);
        });

        it('Add Dispo Task with 11 1DA items and assign to Org Admin, ' + '--set different actions for item using all variations' + '--using Actions menu and grid, ' + '--check statuses and notes upon submission', function () {

            let user = S.getUserData(S.userAccounts.orgAdmin);

            ui.app.log_title(this);
            api.auth.get_tokens_without_page_load(user);
            api.org_settings.disable_Item_fields([C.itemFields.description, C.itemFields.dispositionStatus, C.itemFields.releasedTo])
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
                //  api.items.add_new_item(true, null, 'item' + i)

                D['newitem_' + i] = Object.assign({}, D.newItem)
                D['newitem_' + i].description = i + '__ ' + D.newItem.description
                api.items.add_new_item(true, null, 'item' + i, D['newitem_' + i])

                cy.getLocalStorage('item3').then(item => {
                    approvedForReleaseItem3 = JSON.parse(item)
                })
                cy.getLocalStorage('item4').then(item => {
                    approvedForReleaseItem4 = JSON.parse(item)
                })
            }
            api.tasks.add_new_task(D.newTask, 12)

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
                .verify_single_toast_message_if_multiple_shown('Submitted for Disposition')
                .wait_until_spinner_disappears()
                .verify_Disposition_Statuses_on_the_grid([[[1, 2], 'Approved for Disposal'], [[3, 4, 5, 6, 7], 'Approved for Release'], [[8, 9], 'Delayed Release'], [10, 'Hold'], [11, 'Indefinite Retention'], [12, 'Delayed Disposal'],])
                .select_tab('Basic Info')
                .verify_text_is_present_on_main_container('Closed')
        });


        // xit('Add Dispo Task with 100 items and assign to Power User, ' +
        //     '--initiate and complete 2nd and 3rd tier approval' +
        //     '--use Approve and Reject buttons from grid and Actions menu' +
        //     '--with and without Dispo Auth Service' +
        //     '--check statuses and notes upon rejections and approvals', function () {
        //
        //     let officer = S.getUserData(S.userAccounts.basicUser);
        //     let supervisor = S.userAccounts.powerUser
        //     let thirdTierApproverGroup = S.selectedEnvironment.admin_userGroup
        //     let thirdTierApprover = S.userAccounts.orgAdmin
        //     let permissionGroup_officeAdmin = S.selectedEnvironment.regularUser_permissionGroup;
        //     let office_1 = S.selectedEnvironment.office_1;
        //
        //     ui.app.log_title(this);
        //     api.auth.get_tokens_without_page_load(orgAdmin);
        //     api.org_settings.disable_Item_fields([C.itemFields.description, C.itemFields.dispositionStatus, C.itemFields.releasedTo])
        //     api.org_settings.enable_all_Person_fields();
        //     api.org_settings.update_dispo_config_for_item_catagories(thirdTierApproverGroup)
        //     api.org_settings.update_org_settings(false, true)
        //     api.users.set_user_supervisors([officer.id], [supervisor.id])
        //     api.permissions.assign_user_to_User_Group(thirdTierApprover, thirdTierApproverGroup)
        //     api.permissions
        //         .update_ALL_permissions_for_an_existing_Permission_group
        //         (permissionGroup_officeAdmin, true, true, true, true)
        //     api.permissions.assign_office_based_permissions_to_user(
        //         officer.id,
        //         office_1.id, permissionGroup_officeAdmin.id);
        //
        //     api.auth.get_tokens_without_page_load(officer);
        //     let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
        //     D.getNewTaskData();
        //     D.getNewCaseData();
        //     D.getNewItemData(D.newCase)
        //     D.newItem.category = 'Cellular Phone' // 2DA item
        //     D.newTask = Object.assign(D.newTask, selectedTemplate);
        //     D.newTask.creatorId = officer.id;
        //     D.newTask.assignedUserIds = [officer.id];
        //
        //     api.cases.add_new_case();
        //
        //     E.generateDataFor_ITEMS_Importer([D.newItem], null, null, 100);
        //     for (let i = 49; i <= 100; i++) {
        //         if (E.itemImportDataWithAllFields[i]) {
        //             E.itemImportDataWithAllFields[i][5] = 'Drugs'; // set 3DA category for 50 items
        //         }
        //     }
        //     cy.generate_excel_file('100_items_import_forDispoAuth', E.itemImportDataWithAllFields);
        //     ui.importer.import_data('100_items_import_forDispoAuth', C.importTypes.items, false, 1.5)
        //
        //     api.items.get_items_from_specific_case(D.newCase.caseNumber, 1, true)
        //     api.tasks.add_new_task(D.newTask, 100)
        //
        //     let taskId
        //     cy.getLocalStorage("newTaskId").then(newTaskId => {
        //         let url = `${S.base_url}/#/view-task/` + newTaskId;
        //         taskId = newTaskId
        //
        //         // Create a person and an address to use for all 100 items
        //         let person = Object.assign({}, D.getNewPersonData());
        //         person.firstName = 'Disp_Person';
        //         api.people.add_new_person(false, null, person);
        //         let address = Object.assign({}, D.getNewPersonAddressData());
        //
        //         ui.taskView
        //             .open_newly_created_task_via_direct_link()
        //             .select_tab('Items')
        //             .set_page_size(100)
        //             .verify_text_is_present_on_main_container('Showing 1 to 100 of 100 items ')
        //             .wait_certain_number_of_rows_to_be_visible_on_grid(100)
        //             .set_Action___Approve_for_Disposal([1, 52])
        //             .verify_Dispo_Auth_Job_Status('Complete')
        //             .reload_page()
        //             .select_tab('Items')
        //             .set_Action___Hold([53, 62], 'Case Active', false, 10)
        //             .set_Action___Timed_Disposal([63, 72], '3y')
        //             .set_Action___Approve_for_Disposal([73, 82])
        //             .set_Action___Delayed_Release([83, 100], person, {}, true, false, false, true)
        //             .click_Submit_for_Disposition()
        //             .wait_until_spinner_disappears()
        //             .reload_page()
        //             .select_tab('Items')
        //             .verify_Disposition_Statuses_on_the_grid([
        //                 [[1, 100], 'Under Review']])
        //             .select_tab('Basic Info')
        //             .verify_text_is_present_on_main_container('Supervisor(s) added to the task: ' + supervisor.name);
        //
        //         //  let taskId = 727431
        //         api.auth.get_tokens_without_page_load(supervisor)
        //         ui.taskView
        //             .open_task_url(taskId)
        //             .select_tab('Items')
        //             .set_page_size(100)
        //             //approve/reject 2DA items from grid
        //             .click__Approve__from_grid_for_specific_item(1)
        //             .click__Reject__from_grid_for_specific_item(2, 'Rejected By Supervisor')
        //             //approve/reject 3DA items from grid
        //             .click__Approve__from_grid_for_specific_item(59)
        //             .click__Reject__from_grid_for_specific_item(60, 'Rejected By Supervisor')
        //             .verify_toast_message('Saved!')
        //             //approve 2DA items from Actions menu -- no job triggered
        //             .set___Approve__from_Actions_menu([3, 29])
        //             //reject 2DA & 3DA items from Actions menu -- no job triggered
        //             .set___Reject__from_Actions_menu([30, 58], 'test mass rejection')
        //             //approve 3DA items from Actions menu -- no job triggered
        //             .set___Approve__from_Actions_menu([61, 100])
        //             .reload_page()
        //             .select_tab('Items')
        //             .verify_Disposition_Statuses_on_the_grid(
        //                 [[[1], 'Approved for Disposal'], [[2, 52, 30, 60], 'Not Approved for Disposition'],
        //                     [[59, 100], 'Under Review']])
        //             .select_tab('Basic Info')
        //             .verify_text_is_present_on_main_container('Third-tier Approver(s) added to the task: ' + thirdTierApproverGroup.name);
        //
        //         api.auth.get_tokens_without_page_load(thirdTierApprover)
        //         ui.taskView
        //             .open_task_url(taskId)
        //             .select_tab('Items')
        //             .set_page_size(100)
        //             .click__Approve__from_grid_for_specific_item(59)
        //             .set___Approve__from_Actions_menu([61, 67])
        //             .click__Reject__from_grid_for_specific_item(68, 'Rejected By ThirdTierApprover')
        //             .set___Reject__from_Actions_menu([69, 100], 'Rejected By ThirdTierApprover')
        //
        //
        //         // let taskId = 727801
        //         api.auth.get_tokens_without_page_load(officer)
        //         ui.taskView
        //             .open_task_url(taskId)
        //             .select_tab('Items')
        //             .set_Action___Hold([2], 'Case Active', false, 10)
        //             .set_Action___Hold([30, 58], 'Case Active', false, 10)
        //             .set_Action___Approve_for_Disposal([60])
        //             .set_Action___Approve_for_Disposal([68, 100])
        //             .click_Submit_for_Disposition()
        //
        //         api.auth.get_tokens_without_page_load(supervisor)
        //         ui.taskView
        //             .open_task_url(taskId)
        //             .select_tab('Items')
        //             .set___Approve__from_Actions_menu([2])
        //             .set___Approve__from_Actions_menu([30, 58])
        //             .set___Approve__from_Actions_menu([60])
        //             .set___Approve__from_Actions_menu([68, 100])
        //
        //         api.auth.get_tokens_without_page_load(thirdTierApprover)
        //         ui.taskView
        //             .open_task_url(taskId)
        //             .select_tab('Items')
        //             .set___Approve__from_Actions_menu([49, 58])
        //             .set___Approve__from_Actions_menu([60])
        //             .set___Approve__from_Actions_menu([68, 100])
        //             .select_tab('Basic Info')
        //             .verify_text_is_present_on_main_container('Task was closed')
        //     })
        // })


        //TODO: Sumejja should check further
        xit('Release Letters', function () {

            ui.app.log_title(this);
            api.auth.get_tokens_without_page_load(orgAdmin);

            ui.menu.click_Tools__Auto_Reports()
            ui.app.set_visibility_of_table_column('Public Facing Description', true)
                .sort_by_descending_order('Delivery Time')
                .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(approvedForReleaseItem3.description, 10, 30, true)
        });
    });

// enable this block if you want to generate 3k Release letters
    describe('Generating large number of release letters ', function () {
        for (let i = 0; i < 1; i++) {
            let caseData
            let itemData

            xit('Add Dispo Task with 200 items to trigger Dispo Auth Service and generation of letters for all', function () {

                cy.clearLocalStorage()
                ui.app.log_title(this);
                api.auth.get_tokens_without_page_load(orgAdmin);
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
                ui.importer.import_data('Items_forTestingDispoActionsService' + i, C.importTypes.items)

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

    describe('Add Dispo Task with 11 1DA items and assign to Org Admin, ' + '--set different actions for item using all variations' + '--using Actions menu and grid, ' + '--check statuses and notes upon submission', function () {

        let hasFailed = false
        let persisted = {}

        before(() => {
            cy.session('app-session', () => {
                api.auth.get_tokens_without_page_load(orgAdmin);
                D.generateNewDataSet()
            })
        })

        beforeEach(function () {
            Object.keys(persisted).forEach(k => {
                localStorage.setItem(k, persisted[k])
            })
            if (hasFailed) {
                this.skip()
            }
        })

        afterEach(function () {
            persisted = {}
            Object.keys(localStorage).forEach(k => {
                persisted[k] = localStorage.getItem(k)
            })
            if (this.currentTest && this.currentTest.state === 'failed') {
                hasFailed = true
            }
        })

        let user, person1, person2, person3, person4, person5, address1, address2, address3, address4, address5

        it('1.', function () {
            user = S.getUserData(S.userAccounts.orgAdmin);

            ui.app.log_title(this);
            api.auth.get_tokens_without_page_load(user);
            api.org_settings.disable_Item_fields([C.itemFields.description, C.itemFields.dispositionStatus, C.itemFields.releasedTo])
            api.org_settings.enable_all_Person_fields()

            let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth
            D.getNewTaskData()
            D.generateNewDataSet()
            D.newTask = Object.assign(D.newTask, selectedTemplate)
            D.newTask.creatorId = S.userAccounts.orgAdmin.id
            D.newTask.assignedUserIds = [S.userAccounts.orgAdmin.id]
            api.cases.add_new_case()

            // For "Approve for Release" to New Person --> use detected duplicate person, keep address blank
            person1 = Object.assign({}, D.getNewPersonData())
            person1.firstName = 'Person_1'
            api.people.add_new_person(false, null, person1)
            address1 = {}

            // For "Approve for Release" to New Person, --> proceed to create a duplicate person after warning, and add address
            person2 = Object.assign({}, person1)
            person2.firstName = 'Person_1'
            address2 = Object.assign({}, D.getNewPersonAddressData())

            // For "Approve for Release" to New Person, --> add an address
            D.newPerson = D.getNewPersonData()
            person3 = Object.assign({}, {
                firstName: D.newPerson.firstName,
                lastName: D.newPerson.lastName,
                personType: S.selectedEnvironment.personType.name
            })
            person3.firstName = person3.firstName + '_P_3'
            address3 = Object.assign({}, D.getNewPersonAddressData())

            // For "Approve for Release" to Existing Person, NOT linked to the case, WITHOUT an address --> add address
            person4 = Object.assign({}, D.getNewPersonData())
            person4.firstName = person4.firstName + '_P_4'
            D.newPersonAddress = {}
            api.people.add_new_person(false, null, person4)
            address4 = Object.assign({}, D.getNewPersonAddressData())

            // For "Approve for Release" to Existing Person, already linked to the case, WITH an address
            person5 = Object.assign({}, D.getNewPersonData())
            person5.firstName = person5.firstName + '_P_5'
            api.people.add_new_person(true, D.newCase, person5)
            address5 = Object.assign({}, D.getNewPersonAddressData())

            for (let i = 0; i < 13; i++) {
                //  api.items.add_new_item(true, null, 'item' + i)

                D['newitem_' + i] = Object.assign({}, D.newItem)
                D['newitem_' + i].description = i + '__ ' + D.newItem.description
                api.items.add_new_item(true, null, 'item' + i, D['newitem_' + i])

                cy.getLocalStorage('item3').then(item => {
                    approvedForReleaseItem3 = JSON.parse(item)
                })
                cy.getLocalStorage('item4').then(item => {
                    approvedForReleaseItem4 = JSON.parse(item)
                })
            }
            api.tasks.add_new_task(D.newTask, 12)
        })

        it('2.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Approve_for_Disposal([1, 2])
                .set_Action___Approve_for_Release([3], person1, {}, false, false, false, false, true, true)
                .set_Action___Approve_for_Release([4], person2, address2, false, false, false, false, true, false)
        })

        it('3.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Approve_for_Release([5], person3, address3, false, false, false, false, false, false)
                .set_Action___Approve_for_Release([6], person4, address4, true, false, false, false)
                .set_Action___Approve_for_Release([7], person5, address5, true, true, true, false)
                .set_Action___Delayed_Release([8, 9], person4, {}, true, true, false, true)
        })

        it('4.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Hold([10], 'Case Active', false, 10)
                .set_Action___Hold([11], 'Active Warrant', true)
        })

        it('5.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Timed_Disposal([12], '3y')
                .click_Submit_for_Disposition()
                .verify_single_toast_message_if_multiple_shown('Submitted for Disposition')
                .wait_until_spinner_disappears()
                .verify_Disposition_Statuses_on_the_grid([[[1, 2], 'Approved for Disposal'], [[3, 4, 5, 6, 7], 'Approved for Release'], [[8, 9], 'Delayed Release'], [10, 'Hold'], [11, 'Indefinite Retention'], [12, 'Delayed Disposal'],])
                .select_tab('Basic Info')
                .verify_text_is_present_on_main_container('Closed')
        })
    })


    describe('Add Dispo Task with 100 items and assign to Power User, ' + '--initiate and complete 2nd and 3rd tier approval' + '--use Approve and Reject buttons from grid and Actions menu' + '--with and without Dispo Auth Service' + '--check statuses and notes upon rejections and approvals', function () {
        let hasFailed = false
        let persisted = {}

        before(() => {
            cy.session('app-session', () => {
                api.auth.get_tokens_without_page_load(orgAdmin);
                D.generateNewDataSet()
            })
        })

        beforeEach(function () {
            Object.keys(persisted).forEach(k => {
                localStorage.setItem(k, persisted[k])
            })
            if (hasFailed) {
                this.skip()
            }
        })

        afterEach(function () {
            persisted = {}
            Object.keys(localStorage).forEach(k => {
                persisted[k] = localStorage.getItem(k)
            })
            if (this.currentTest && this.currentTest.state === 'failed') {
                hasFailed = true
            }
        })

        let officer, person, supervisor, thirdTierApproverGroup, thirdTierApprover, permissionGroup_officeAdmin,
            office_1

        it('1.', function () {
            ui.app.log_title(this);

            officer = S.getUserData(S.userAccounts.basicUser);
            supervisor = S.userAccounts.powerUser
            thirdTierApproverGroup = S.selectedEnvironment.admin_userGroup
            thirdTierApprover = S.userAccounts.orgAdmin
            permissionGroup_officeAdmin = S.selectedEnvironment.regularUser_permissionGroup;
            office_1 = S.selectedEnvironment.office_1;

            ui.app.log_title(this);
            api.auth.get_tokens_without_page_load(orgAdmin);
            api.org_settings.disable_Item_fields([C.itemFields.description, C.itemFields.dispositionStatus, C.itemFields.releasedTo])
                .enable_all_Person_fields()
                .update_dispo_config_for_item_catagories(thirdTierApproverGroup)
                .update_org_settings(false, true)
                .update_org_settings_by_specifying_property_and_value('addUserSupervisor', true)
            api.users.set_user_supervisors([officer.id], [supervisor.id])
            api.permissions.assign_user_to_User_Group(thirdTierApprover, thirdTierApproverGroup)
                .update_ALL_permissions_for_an_existing_Permission_group(permissionGroup_officeAdmin, true, true, true, true)
                .assign_office_based_permissions_to_user(officer.id, office_1.id, permissionGroup_officeAdmin.id)
                .assign_office_based_permissions_to_user(supervisor.id, office_1.id, permissionGroup_officeAdmin.id);


            api.auth.get_tokens_without_page_load(officer);
            let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
            D.getNewTaskData();
            D.getNewCaseData();
            D.getNewItemData(D.newCase)
            D.newItem.category = 'Cellular Phone' // 2DA item
            D.newTask = Object.assign(D.newTask, selectedTemplate);
            D.newTask.creatorId = officer.id;
            D.newTask.assignedUserIds = [officer.id];

            api.cases.add_new_case();
        })

        it('2.', function () {
            let executed = false

            cy.then(() => {
                executed = true
            })
            E.generateDataFor_ITEMS_Importer([D.newItem], null, null, 100);
            for (let i = 49; i <= 100; i++) {
                if (E.itemImportDataWithAllFields[i]) {
                    E.itemImportDataWithAllFields[i][5] = 'Drugs'; // set 3DA category for 50 items
                }
            }
            cy.generate_excel_file('100_items_import_forDispoAuth', E.itemImportDataWithAllFields);
            ui.importer.import_data('100_items_import_forDispoAuth', C.importTypes.items, false, 1.5)

            api.items.get_items_from_specific_case(D.newCase.caseNumber, 1, true)
            api.tasks.add_new_task(D.newTask, 100)

            // Create a person and an address to use for all 100 items
            person = Object.assign({}, D.getNewPersonData());
            person.firstName = 'Disp_Person';
            api.people.add_new_person(false, null, person);

            cy.then(() => {
                expect(executed, 'step executed').to.be.true
            })
        });

        it('3.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_page_size(100)
                .verify_text_is_present_on_main_container('Showing 1 to 100 of 100 items ')
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .wait_certain_number_of_rows_to_be_visible_on_grid(100)
                .set_Action___Approve_for_Disposal([1, 52])
                .verify_Dispo_Auth_Job_Status('Complete')
        });

        it('4.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Hold([53, 62], 'Case Active', false, 10)
                .set_Action___Timed_Disposal([63, 72], '3y')
                .set_Action___Approve_for_Disposal([73, 82])
                .set_Action___Delayed_Release([83, 100], person, {}, true, false, false, true)
                .click_Submit_for_Disposition()
                .wait_until_spinner_disappears()
        });

        it('5.', function () {
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .verify_Disposition_Statuses_on_the_grid([[[1, 100], 'Under Review']])
                .select_tab('Basic Info')
                .verify_text_is_present_on_main_container('Supervisor(s) added to the task: ' + supervisor.name);
        });

        it('6.', function () {
            api.auth.get_tokens_without_page_load(supervisor)
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_page_size(100)
                .verify_text_is_present_on_main_container('Showing 1 to 100 of 100 items ')
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                //approve/reject 2DA items from grid
                .click__Approve__from_grid_for_specific_item(1)
                .click__Reject__from_grid_for_specific_item(2, 'Rejected By Supervisor')
                //approve/reject 3DA items from grid
                .click__Approve__from_grid_for_specific_item(59)
                .click__Reject__from_grid_for_specific_item(60, 'Rejected By Supervisor')
                .verify_toast_message('Saved!')
                //approve 2DA items from Actions menu -- no job triggered
                .set___Approve__from_Actions_menu([3, 29])
                //reject 2DA & 3DA items from Actions menu -- no job triggered
                .set___Reject__from_Actions_menu([30, 58], 'test mass rejection')
                //approve 3DA items from Actions menu -- no job triggered
                .set___Approve__from_Actions_menu([61, 100])
                .reload_page()
                .select_tab('Items')
                .verify_Disposition_Statuses_on_the_grid([[[1], 'Approved for Disposal'], [[2, 52, 30, 60], 'Not Approved for Disposition'], [[59, 100], 'Under Review']])
                .select_tab('Basic Info')
                .verify_text_is_present_on_main_container('Third-tier Approver(s) added to the task: ' + thirdTierApproverGroup.name);

        });

        it('7.', function () {
            api.auth.get_tokens_without_page_load(thirdTierApprover)
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_page_size(100)
                .verify_text_is_present_on_main_container('Showing 1 to 100 of 100 items ')
                .reload_page()
                .select_tab('Items')
                .click__Approve__from_grid_for_specific_item(59)
                .set___Approve__from_Actions_menu([61, 67])
                .click__Reject__from_grid_for_specific_item(68, 'Rejected By ThirdTierApprover')
                .set___Reject__from_Actions_menu([69, 100], 'Rejected By ThirdTierApprover')

        });

        it('8.', function () {
            api.auth.get_tokens_without_page_load(officer)
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set_Action___Hold([2], 'Case Active', false, 10)
                .set_Action___Hold([30, 58], 'Case Active', false, 10)
                .set_Action___Approve_for_Disposal([60])
                .set_Action___Approve_for_Disposal([68, 100])
                .click_Submit_for_Disposition()

        });

        it('9.', function () {
            api.auth.get_tokens_without_page_load(supervisor)
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set___Approve__from_Actions_menu([2])
                .set___Approve__from_Actions_menu([30, 58])
                .set___Approve__from_Actions_menu([60])
                .set___Approve__from_Actions_menu([68, 100])
        });

        it('10.', function () {
            api.auth.get_tokens_without_page_load(thirdTierApprover)
            ui.taskView
                .open_newly_created_task_via_direct_link()
                .select_tab('Items')
                .set___Approve__from_Actions_menu([49, 58])
                .set___Approve__from_Actions_menu([60])
                .set___Approve__from_Actions_menu([68, 100])
                .select_tab('Basic Info')
                .verify_text_is_present_on_main_container('Task was closed')
        });
    });

    //TODO: Sumejja should check further
    xdescribe('Resetting Dispo fields when item is added to a new Dispo task', function () {
        it('', function () {

            api.auth.get_tokens(orgAdmin)
            api.org_settings.update_dispo_config_for_item_catagories()
            D.generateNewDataSet()
            let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth;
            D.newItem.category = 'Accessory' // 1DA item
            D.newItem.categoryId = 138 // 1DA item
            D.newTask = Object.assign(D.newTask, selectedTemplate);
            D.newTask.assignedUserIds = [orgAdmin.id];
            api.cases.add_new_case()
            api.items.add_new_item(true)
            api.tasks.add_new_task(D.newTask, 1)


            // Rule 1.1 ---> item just added to Active Dispo task - NO Dispo Action selected for the item  --> adding item to new Dispo Task
            ui.menu.click_Search__Item()
            ui.searchItem.run_search_by_Item_Description(D.newItem.description)
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu('Add To Task')
                .click_button('Create')
            ui.addTask.select_template('Disposition Authorization')
                .verify_text_is_present_on_main_container('Items described below cannot be added to the Disposition Authorization task so the system will auto-exclude them upon saving:\n' + '----> Items that are currently linked to another active Disposition Authorization task')
                .click_Save_()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_content_of_first_row_in_results_table('There aren\'t any linked objects')

            // check Item Dispose action is NOT available for the user
            api.org_settings.set_override_disposal_release_authorization([], [])
            ui.app.open_newly_created_task_via_direct_link()
            ui.taskView.select_tab('Items')
                .select_checkbox_on_first_table_row_on_active_tab()
                .click_Actions()
                .verify_enabled_and_disabled_options_under_Actions_dropdown(['Disposition Authorization Action'], ['Dispose Item'])

            // check Item Dispose action IS available for the user
            api.org_settings.set_override_disposal_release_authorization([orgAdmin.id], [S.selectedEnvironment.admin_userGroup.id])
            ui.taskView.reload_page()
                .select_tab('Items')
                .select_checkbox_on_first_table_row_on_active_tab()
                .click_Actions()
                .perform_Item_Disposal_transaction(orgAdmin, C.disposalMethods.auctioned, 'test', false, false, false, false)
                .select_tab('Basic Info')
                .click_button('Close task')
                .click_button_on_sweet_alert('Yes') //TODO This should be reported as bug, since we don't need this alert here
                .click_button_on_sweet_alert('Yes') // this is second alert that we should have as confirmation for closing the task
                .verify_text_is_present_on_main_container('Filter Tasks By:')
                .select_filter_by_Closed_status()
                .verify_content_of_first_row_in_results_table(D.newItem.description)

            //Rule 1.2 ----> item added to Active Dispo task and DISPOSED- NO Dispo Action selected for the item  --> adding item to new Dispo Task
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab('Items')
                .select_checkbox_on_first_table_row()
                .click_Actions()
                .click_option_on_expanded_menu('Add To Task')
                .click_button('Create')
            ui.addTask.select_template('Disposition Authorization')
                .verify_text_is_present_on_main_container('Items described below cannot be added to the Disposition Authorization task so the system will auto-exclude them upon saving:----> Items in \'Disposed\' Status')
                .click_Save_()
                .verify_toast_message(C.toastMsgs.saved)
                .verify_content_of_first_row_in_results_table('There aren\'t any linked objects')


            // item just added to Active Dispo task - Dispo Action selected for the item  --> adding item to new Dispo Task
            // ui.app.open_newly_created_task_via_direct_link()
            // ui.taskView.select_tab('Items')
            //     .set_Action___Approve_for_Disposal_from_grid(1)
            //     .open_newly_created_case_via_direct_link()
            //     .select_tab('Items')
            //     .select_checkbox_on_first_table_row()
            //     .click_Actions()
            //     .click_option_on_expanded_menu('Add To Task')
            //     .click_button('Create')
            // ui.addTask.select_template('Disposition Authorization')
            //     .verify_text_is_present_on_main_container('Items described below cannot be added to the Disposition Authorization task so the system will auto-exclude them upon saving:\n' +
            //         '----> Items that are currently linked to another active Disposition Authorization task')
            //     .click_Save_()
            //     .click_button_on_sweet_alert('Yes') //TODO This should be reported as bug, since we don't need this alert here
            //     .verify_toast_message(C.toastMsgs.saved)


            // item already added to Active Dispo task without 'Dispo Action' selected --> adding that to new Dispo Task
        })
    })
}
