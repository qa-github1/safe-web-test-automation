const D = require('../../fixtures/data.js');
const C = require('../../fixtures/constants.js');
const S = require('../../fixtures/settings.js');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let admin_permissionGroup = S.selectedEnvironment.admin_permissionGroup;
let blocked_permissionGroup = S.selectedEnvironment.blocked_permissionGroup;
let readOnly_permissionGroup = S.selectedEnvironment.readOnly_permissionGroup;
let admin_userGroup = S.selectedEnvironment.admin_userGroup;
let blocked_userGroup = S.selectedEnvironment.blocked_userGroup;
let readOnly_userGroup = S.selectedEnvironment.readOnly_userGroup;

let systemAdmin = S.getUserData(S.userAccounts.systemAdmin);
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let clpUser = S.getUserData(S.userAccounts.clpUser);
let basicUser = S.getUserData(S.userAccounts.basicUser);

let office_1 = S.selectedEnvironment.office_1;

xdescribe('1. Case Level Permissions', function () {
    xit('Set CLP for 5k cases', function () {

            api.auth.get_tokens(orgAdmin);
            D.getNewCaseData()

        for (let i =2429; i<5000; i++){
            cy.log('Setting CLP for Case ' + i);
            let caseNumber = 'Henderson CLP_' + i  +''
            api.cases.add_new_case(caseNumber)
                .assign_Case_Level_Permissions(readOnly_permissionGroup, null, readOnly_userGroup, admin_permissionGroup);
        }
    });
});

xdescribe('1. Case Level Permissions', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        api.locations.get_storage_locations();
        api.org_settings.update_org_settings(true, true)
            .set_Case_Level_Permissions_on_Org_Settings(true)
            .enable_all_Case_fields()
            .enable_all_Item_fields([C.itemFields.expectedReturnDate, C.itemFields.actualDisposedDate])
            .enable_all_Person_fields()

        // api.permissions
        //     .update_ALL_permissions_for_an_existing_Permission_group
        //     (admin_permissionGroup, true, true, true, true)
        //
        //     .update_ALL_permissions_for_an_existing_Permission_group
        //     (blocked_permissionGroup, false, false, false, false)
        //
        //     .update_ALL_permissions_for_an_existing_Permission_group
        //     (readOnly_permissionGroup, false, true, false, false)
    });

    context('1. System Admin', function () {

        // before(function () {
        //     api.auth.get_tokens(orgAdmin);
        //     D.generateNewDataSet();
        //     api.org_settings.set_Case_Level_Permissions_on_Org_Settings(true);
        // });

        // beforeEach(function () {
        //     cy.restoreLocalStorage();
        // });
        //
        // it('TC_1.1 verify Permissions tab is available for System Admin', function () {
        //     ui.app.log_title(this);
        //     api.auth.get_tokens(systemAdmin);
        //
        //     let caseNumber = D.getRandomNo() + '_TC_1.1';
        //     api.cases.add_new_case(caseNumber);
        //
        //     ui.app.open_newly_created_case_via_direct_link();
        //     ui.caseView.select_tab(C.tabs.permissions)
        //         .verify_text_is_present_on_main_container(C.CLP.access_allowed_based_on_office_permissions)
        // });
//
//         it('TC_1.2 verify System Admin account will automatically have access to all data - even if assigned to restricted CLP group', function () {
//             ui.app.log_title(this);
//             let caseNumber = D.setNewRandomNo() + '_TC_2.1';
//             api.auth.get_tokens(orgAdmin);
//
//             api.cases.add_new_case(caseNumber);
//             ui.app.open_newly_created_case_via_direct_link();
//             ui.caseView.turn_on_Permissions_on_case(blocked_permissionGroup, systemAdmin);
//
//             // Case with CLP remains available for System Admin
//             api.auth.get_tokens(systemAdmin);
//             ui.searchCase.quick_search_for_case(caseNumber);
//             ui.caseView.verify_Case_View_page_is_open(caseNumber);
//         });
//
//         it('TC_1.3 verify that turning on Permissions but setting no Users or Groups will grant access to Org Admins only', function () {
//             ui.app.log_title(this);
//             let caseNumber = D.setNewRandomNo() + '_TC_2.2';
//             api.auth.get_tokens(orgAdmin);
//
//             api.cases.add_new_case(caseNumber);
//             ui.app.open_newly_created_case_via_direct_link();
//             ui.caseView.turn_on_Permissions_on_case();
//             ui.app.wait_all_GET_requests()
//
//             // Case with CLP remains available for System Admin
//             api.auth.get_tokens(systemAdmin);
//             ui.searchCase.quick_search_for_case(caseNumber);
//             ui.caseView.verify_Case_View_page_is_open(caseNumber);
//
//             // Case with CLP is not available to non-admin users
//             api.auth.get_tokens(powerUser);
//             ui.searchCase.run_search_by_Case_Number(caseNumber)
//                 .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP)
//         });
     });
//
    context('2. Org Admin', function () {

        before(function () {
            api.auth.get_tokens(orgAdmin);
            api.permissions.assign_office_based_permissions_to_user(
                clpUser.id,
                office_1.id,
                readOnly_permissionGroup.id
            );
        });

        beforeEach(function () {
            cy.restoreLocalStorage();
        });

        xit('TC_2.1 Permissions tab is available for Org Admin but not for Power-user', function () {
            ui.app.log_title(this);

            let caseNumber = D.getRandomNo() + '_TC_1.1';
            api.cases.add_new_case(caseNumber);

            ui.app.open_newly_created_case_via_direct_link();
            ui.caseView.select_tab(C.tabs.permissions)
                .verify_text_is_present_on_main_container(C.CLP.access_allowed_based_on_office_permissions)

            api.auth.get_tokens(powerUser);
            ui.app.open_newly_created_case_via_direct_link()
                .verify_text_is_NOT_present_on_main_container(C.tabs.permissions)
        });
//
//         it('TC_2.2 Org Admin account will automatically have access to all data - even if assigned to restricted CLP group', function () {
//             ui.app.log_title(this);
//
//             let caseNumber = D.setNewRandomNo() + '_TC_2.1';
//
//             api.auth.get_tokens(orgAdmin);
//             api.cases.add_new_case(caseNumber);
//             ui.app.open_newly_created_case_via_direct_link();
//             ui.caseView.turn_on_Permissions_on_case(blocked_permissionGroup, orgAdmin);
//
//             // Case with CLP remains available for OrgAdmin
//             api.auth.get_tokens(orgAdmin);
//             ui.searchCase.quick_search_for_case(caseNumber);
//             ui.caseView.verify_Case_View_page_is_open(caseNumber);
//         });
//
//         it('TC_2.3 Turning on Permissions but setting no Users or Groups will grant access to Org Admins only', function () {
//             ui.app.log_title(this);
//
//             let caseNumber = D.setNewRandomNo() + '_TC_2.2';
//
//             api.auth.get_tokens(orgAdmin);
//             api.cases.add_new_case(caseNumber);
//             ui.app.open_newly_created_case_via_direct_link();
//             ui.caseView.turn_on_Permissions_on_case();
//
//             // Case with CLP remains available for OrgAdmin
//             ui.app.reload_page();
//             ui.searchCase.quick_search_for_case(caseNumber);
//             ui.caseView.verify_Case_View_page_is_open(caseNumber);
//
//             // Case with CLP is not available to non-admin users
//             // api.auth.get_tokens(clpUser);
//             // ui.searchCase.run_search_by_Case_Number(caseNumber)
//             //     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP)
//         });
//     });
//
//     context('3. CLP overrides Office-based permissions - User with ADMIN access in Office', function () {
//
//         before(function () {
//             api.auth.get_tokens(orgAdmin);
//             api.permissions.assign_office_based_permissions_to_user(
//                 clpUser.id,
//                 office_1.id, admin_permissionGroup.id);
//             cy.saveLocalStorage();
//         });
//
//         context('3.1 Blocked CLP for selected Admin USER', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(blocked_permissionGroup, clpUser);
//
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.1.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                 // direct link
//                 ui.app.open_newly_created_case_via_direct_link()
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             it('TC_3.1.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//             });
//
//             it('TC_3.1.3 --> restricted access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                      .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//                 ui.app.open_newly_created_item_via_direct_link(true)
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//             });
//
//             it('TC_3.1.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//                     .select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//                     .select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.5 --> restricted access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.6 --> restricted access to item from CheckOuts Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.6';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Item CheckOut through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_Out_the_item(clpUser.email, C.checkoutReasons.court, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckOuts search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchCheckOuts.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.7 --> restricted access to item from Transfers Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.7';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item Transfer through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.transfer_the_item(clpUser, D.getRandomNo());
//
//                 // TestUser does not have access to Item from Transfers Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTransfers.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.8 --> restricted access to item from Moves Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.8';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Move through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.move_the_item(S.selectedEnvironment.locations[1], D.getRandomNo());
//
//                 // TestUser does not have access to Item from Moves Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMoves.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.9 --> restricted access to item from Disposals Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.9';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Disposal through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.dispose_the_item(clpUser, C.disposalMethods.destroyed, D.getRandomNo());
//
//                 // TestUser does not have access to Item from Disposals Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchDisposals.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.10 --> restricted access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.11 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.12 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.11';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.1.13 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.13';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.1.14 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.14';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.1.15 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.1.15';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//         });
//
//         context('3.2 Blocked CLP for selected Admin USER GROUP', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(blocked_permissionGroup, null, admin_userGroup);
//
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.2.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                 // direct link
//                 ui.app.open_newly_created_case_via_direct_link()
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             it('TC_3.2.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//             });
//
//             it('TC_3.2.3 --> restricted access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//
//                 ui.app.open_newly_created_item_via_direct_link(true)
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//             });
//
//             it('TC_3.2.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//                     .select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//                     .select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//             });
//
//             // keeping one sceanrio here for covering CLP on User Group level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with CLP set on User level
//             it('TC_3.2.5 --> restricted access to item from CheckOuts Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.6';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Item CheckOut through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_Out_the_item(clpUser.email, C.checkoutReasons.court, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckOuts search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchCheckOuts.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.2.6 --> restricted access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.2.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.2.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.11';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.2.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.13';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.2.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.14';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.2.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.2.15';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//         });
//
//         context('3.3 Blocked CLP for selected Admin PERMISSION GROUP', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(blocked_permissionGroup, null, null, admin_permissionGroup);
//
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.3.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                 // direct link
//                 ui.app.open_newly_created_case_via_direct_link()
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             it('TC_3.3.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//             });
//
//             it('TC_3.3.3 --> restricted access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                      .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//
//                 ui.app.open_newly_created_item_via_direct_link(true)
//                     .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//             });
//
//             it('TC_3.3.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                      .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//
//                     .select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//
//                     .select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//             });
//
//             // keeping one sceanrio here for covering CLP on Persmission Group level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with CLP set on User level
//             it('TC_3.3.5 --> restricted access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.3.6 --> restricted access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.3.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.3.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.11';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.3.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.13';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//             });
//
//             it('TC_3.3.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.14';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//
//             it('TC_3.3.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.3.15';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//             });
//         });
//
//         // bug for users with Read-Only CLP- #9176  #9177
//         context('3.4 Read-Only CLP for selected Admin USER', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(readOnly_permissionGroup, clpUser);
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.4.1 --> read-only access to case from search and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     .click_element_on_grid_container(C.buttons.actions);
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                 ui.app.click_button(C.buttons.view);
//                 ui.caseView.verify_Case_View_page_is_open(caseNumber)
//                     .verify_text_is_not_visible(C.buttons.edit);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             // bug reported - #9176
//             it('TC_3.4.2 --> read-only access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.people.add_person_to_case(true, true);
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab([C.buttons.view, D.newCase.caseNumber])
//                     .select_checkbox_on_first_table_row_on_active_tab()
//                     .click_element_on_active_tab(C.buttons.actions)
//                 // TODO verify Actions are disabled on dropdown after #9176 bug fix is deployed
//             });
//
//             // bug reported - #9177
//             it('TC_3.4.3 --> read-only access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     //.click_element_on_grid_container(C.buttons.actions)
//                     // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                     .click_View_on_first_table_row()
//                     .verify_text_is_not_visible('Edit')
//             });
//
//             // bug reported - #9177
//             it('TC_3.4.4 --> read-only access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//             });
//
//             // keeping one sceanrio here for covering read-only CLP on User level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with blocked CLP set on User level
//             it('TC_3.4.5 --> read-only access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(D.newItem.description)
//             });
//
//             it('TC_3.4.6 --> read-only access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.6';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.4.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.7';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.4.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.8';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.4.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.9';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.4.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.4.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.4.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//         });
//
//         context('3.5 Read-Only CLP for selected Admin USER GROUP', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 api.permissions.assign_user_to_User_Group(clpUser, admin_userGroup)
//                 D.generateNewDataSet();
//                 D.newCase.caseNumber = caseNumber
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(readOnly_permissionGroup, null, admin_userGroup);
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.5.1 --> read-only access to case from search and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     .click_element_on_grid_container(C.buttons.actions);
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                 ui.app.click_button(C.buttons.view);
//                 ui.caseView.verify_Case_View_page_is_open(caseNumber)
//                     .verify_text_is_not_visible(C.buttons.edit);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             // bug reported - #9176
//             xit('TC_3.5.2 --> read-only access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.2';
//                 set_preconditions(caseNumber, true);
//
//                // api.people.add_person_to_case(true, true);
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab([C.buttons.view, D.newCase.caseNumber])
//                     .select_checkbox_on_first_table_row_on_active_tab()
//                     .click_element_on_active_tab(C.buttons.actions)
//                 // TODO verify Actions are disabled on dropdown after #9176 bug fix is deployed
//             });
//
//             // bug reported - #9177
//             xit('TC_3.5.3 --> read-only access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     //.click_element_on_grid_container(C.buttons.actions)
//                     // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                     .click_View_on_first_table_row()
//                     .verify_text_is_not_visible('Edit')
//             });
//
//             // bug reported - #9177
//             xit('TC_3.5.4 --> read-only access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//             });
//
//             // keeping one sceanrio here for covering read-only CLP on User level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with blocked CLP set on User level
//             it('TC_3.5.5 --> read-only access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(D.newItem.description)
//             });
//
//             it('TC_3.5.6 --> read-only access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.6';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.5.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.7';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.5.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.8';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.5.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.9';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.5.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.5.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.5.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//         });
//
//         context('3.6 Read-Only CLP for selected Admin USER PERMISSION GROUP', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(readOnly_permissionGroup, null, admin_userGroup);
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             it('TC_3.6.1 --> read-only access to case from search and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     .click_element_on_grid_container(C.buttons.actions);
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                 ui.app.click_button(C.buttons.view);
//                 ui.caseView.verify_Case_View_page_is_open(caseNumber)
//                     .verify_text_is_not_visible(C.buttons.edit);
//
//                 // Case Number typeahead field on Add Item page
//                 ui.menu.click_Add__Item()
//                     .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                 // Case Number typeahead field on Add Items to Case modal
//                 ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                     .select_tab(C.tabs.items)
//                     .select_checkbox_on_first_table_row();
//                 ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                     .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//             });
//
//             // bug reported - #9176
//             xit('TC_3.6.2 --> read-only access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.people.add_person_to_case(true, true);
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab([C.buttons.view, D.newCase.caseNumber])
//                     .select_checkbox_on_first_table_row_on_active_tab()
//                     .click_element_on_active_tab(C.buttons.actions)
//                 // TODO verify Actions are disabled on dropdown after #9176 bug fix is deployed
//             });
//
//             // bug reported - #9177
//             it('TC_3.6.3 --> read-only access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     //.click_element_on_grid_container(C.buttons.actions)
//                     // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                     .click_View_on_first_table_row()
//                     .verify_text_is_not_visible('Edit')
//             });
//
//             // bug reported - #9177
//             xit('TC_3.6.4 --> read-only access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//             });
//
//             // keeping one sceanrio here for covering read-only CLP on User level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with blocked CLP set on User level
//             it('TC_3.6.5 --> read-only access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(D.newItem.description)
//             });
//
//             it('TC_3.6.6 --> read-only access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.6';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.6.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.7';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.6.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.8';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.6.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.9';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.6.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_3.6.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_3.6.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//         });
//
//     });
//
//     // not finished yet
//     xcontext('4. CLP overrides Office-based permissions - User with READ-ONLY access in Office', function () {
//
//         before(function () {
//             api.auth.get_tokens(orgAdmin);
//             api.permissions.assign_office_based_permissions_to_user(
//                 clpUser.id,
//                 office_1.id, readOnly_permissionGroup.id);
//             api.auth.get_tokens(clpUser);
//             api.locations.get_all_accessible_storage_locations();
//             cy.saveLocalStorage();
//         });
//
//         /*
//         It might not be needed to run those commented scenarios, as we have similar case covered above,
//        where ADMIN user has Blocked CLP, so the behavior should be the same.
//        CLP is fully restrictive in those cases regardless of the office based permissions.
//        */
//
//         /*  context('4.1 Blocked CLP for selected Read-Only USER', function () {
//
//               function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                   api.auth.get_tokens(orgAdmin);
//                   D.generateNewDataSet();
//                   api.cases.add_new_case(caseNumber)
//                       .assign_Case_Level_Permissions(blocked_permissionGroup, clpUser);
//
//                   if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                   if (addItem) api.items.add_new_item(true);
//               }
//
//               beforeEach(function () {
//                   cy.restoreLocalStorage();
//               });
//
//               it('TC_4.1.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.1';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(clpUser);
//
//                   // search
//                   ui.searchCase.run_search_by_Case_Number(caseNumber)
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                   // direct link
//                   ui.app.open_newly_created_case_via_direct_link()
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                   // Case Number typeahead field on Add Item page
//                   ui.menu.click_Add__Item()
//                       .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                   // Case Number typeahead field on Add Items to Case modal
//                   ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                       .select_tab(C.tabs.items)
//                       .select_checkbox_on_first_table_row();
//                   ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                       .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                       .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//               });
//
//               it('TC_4.1.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.2';
//                   set_preconditions(caseNumber, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//                       .select_tab(C.tabs.casesInvolved)
//                       .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.1.3 --> restricted access to item from Items Search and direct link', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.3';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                        .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//
//                   ui.app.open_newly_created_item_via_direct_link(true)
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.1.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.4';
//                   set_preconditions(caseNumber, true, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//
//                       .select_tab(C.tabs.itemsRecoveredBy)
//                        .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//
//                       .select_tab(C.tabs.itemsBelongingTo)
//                       .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//
//                       .select_tab(C.tabs.itemCustodian)
//                       .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//
//               });
//
//               it('TC_4.1.5 --> restricted access to item from CheckIns Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.5';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   // Org Admin performs Item CheckIn through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                   // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.open_base_url();
//                   ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.6 --> restricted access to item from CheckOuts Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.6';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Item CheckOut through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.check_Out_the_item(clpUser.email, C.checkoutReasons.court, D.getRandomNo());
//
//                   // TestUser does not have access to Item from CheckOuts search-pages after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchCheckOuts.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.7 --> restricted access to item from Transfers Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.7';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   // Org Admin performs Item Transfer through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.transfer_the_item(clpUser, D.getRandomNo());
//
//                   // TestUser does not have access to Item from Transfers Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTransfers.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.8 --> restricted access to item from Moves Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.8';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Move through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.move_the_item(S.selectedEnvironment.locations[1], D.getRandomNo());
//
//                   // TestUser does not have access to Item from Moves Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMoves.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.9 --> restricted access to item from Disposals Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.9';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Disposal through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.dispose_the_item(clpUser, C.disposalMethods.destroyed, D.getRandomNo());
//
//                   // TestUser does not have access to Item from Disposals Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchDisposals.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.10 --> restricted access to Case Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.10';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.11 --> restricted access to Item Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.11';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.12 --> restricted access to Case Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.11';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.1.13 --> restricted access to Item Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.13';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.1.14 --> restricted access to Case Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.14';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.1.15 --> restricted access to Item Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.1.15';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//           });
//
//           context('4.2 Blocked CLP for selected Read-Only USER GROUP', function () {
//
//               function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                   api.auth.get_tokens(orgAdmin);
//                   D.generateNewDataSet();
//                   api.cases.add_new_case(caseNumber)
//                       .assign_Case_Level_Permissions(blocked_permissionGroup, null, readOnly_userGroup);
//
//                   if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                   if (addItem) api.items.add_new_item(true);
//               }
//
//               beforeEach(function () {
//                   cy.restoreLocalStorage();
//               });
//
//               it('TC_4.2.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.1';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(clpUser);
//
//                   // search
//                   ui.searchCase.run_search_by_Case_Number(caseNumber)
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                   // direct link
//                   ui.app.open_newly_created_case_via_direct_link()
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                   // Case Number typeahead field on Add Item page
//                   ui.menu.click_Add__Item()
//                       .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                   // Case Number typeahead field on Add Items to Case modal
//                   ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                       .select_tab(C.tabs.items)
//                       .select_checkbox_on_first_table_row();
//                   ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                       .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                       .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//               });
//
//               it('TC_4.2.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.2';
//                   set_preconditions(caseNumber, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//                       .select_tab(C.tabs.casesInvolved)
//                       .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.2.3 --> restricted access to item from Items Search and direct link', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.3';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                       // .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//
//                   ui.app.open_newly_created_item_via_direct_link(true)
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.2.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.4';
//                   set_preconditions(caseNumber, true, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//
//                       .select_tab(C.tabs.itemsRecoveredBy)
//                       // .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//
//                       .select_tab(C.tabs.itemsBelongingTo)
//                       //.verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//
//                       .select_tab(C.tabs.itemCustodian)
//                       //.verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               // keeping one sceanrio here for covering CLP on User Group level for Item transactions,
//               // as restricted access to other transactions is tested in scenario above - with CLP set on User level
//               it('TC_4.2.5 --> restricted access to item from CheckOuts Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.6';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Item CheckOut through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.check_Out_the_item(clpUser.email, C.checkoutReasons.court, D.getRandomNo());
//
//                   // TestUser does not have access to Item from CheckOuts search-pages after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchCheckOuts.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.2.6 --> restricted access to Case Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.10';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.2.7 --> restricted access to Item Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.11';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.2.8 --> restricted access to Case Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.11';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.2.9 --> restricted access to Item Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.13';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.2.10 --> restricted access to Case Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.14';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.2.11 --> restricted access to Item Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.2.15';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//           });
//
//           context('4.3 Blocked CLP for selected Read-Only PERMISSION GROUP', function () {
//
//               function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                   api.auth.get_tokens(orgAdmin);
//                   D.generateNewDataSet();
//                   api.cases.add_new_case(caseNumber)
//                       .assign_Case_Level_Permissions(blocked_permissionGroup, null, null, readOnly_permissionGroup);
//
//                   if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                   if (addItem) api.items.add_new_item(true);
//               }
//
//               beforeEach(function () {
//                   cy.restoreLocalStorage();
//               });
//
//               it('TC_4.3.1 --> restricted access to case from search, direct link and CaseNumber input fields with typeahead', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.1';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(clpUser);
//
//                   // search
//                   ui.searchCase.run_search_by_Case_Number(caseNumber)
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_case_due_to_CLP);
//
//                   // direct link
//                   ui.app.open_newly_created_case_via_direct_link()
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden);
//
//                   // Case Number typeahead field on Add Item page
//                   ui.menu.click_Add__Item()
//                       .verify_text_is_present_on_main_container(C.CLP.noPermissionsToAddItemsToCase);
//
//                   // Case Number typeahead field on Add Items to Case modal
//                   ui.app.open_case_url(S.selectedEnvironment.oldClosedCase.id)
//                       .select_tab(C.tabs.items)
//                       .select_checkbox_on_first_table_row();
//                   ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                       .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                       .trigger_and_verify_Case_Number_validation_message(caseNumber, C.validation_msgs.caseNumberDoesNotExist)
//               });
//
//               it('TC_4.3.2 --> restricted access to Case from People View page / Cases Involved', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.2';
//                   set_preconditions(caseNumber, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//                       .select_tab(C.tabs.casesInvolved)
//                       .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_case_due_to_CLP);
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.3.3 --> restricted access to item from Items Search and direct link', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.3';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(clpUser);
//                   ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                       // .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP);
//
//                   ui.app.open_newly_created_item_via_direct_link(true)
//                       .verify_text_is_present_on_main_container(C.validation_msgs.forbidden)
//               });
//
//               // TODO Uncomment when bug #10152 gets fixed
//               it('TC_4.3.4 --> restricted access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.4';
//                   set_preconditions(caseNumber, true, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   api.auth.get_tokens(clpUser);
//                   ui.app.open_newly_created_person_via_direct_link()
//
//                       .select_tab(C.tabs.itemsRecoveredBy)
//                       // .verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//
//                       .select_tab(C.tabs.itemsBelongingTo)
//                       //.verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//
//                       .select_tab(C.tabs.itemCustodian)
//                       //.verify_content_of_first_row_in_results_table_on_active_tab(C.CLP.cannot_display_item_due_to_CLP)
//                       .verify_content_of_last_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               // keeping one sceanrio here for covering CLP on Persmission Group level for Item transactions,
//               // as restricted access to other transactions is tested in scenario above - with CLP set on User level
//               it('TC_4.3.5 --> restricted access to item from CheckIns Search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.5';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//                   api.transactions.check_out_item();
//
//                   // Org Admin performs Item CheckIn through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                   // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.open_base_url();
//                   ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                       .click_on_Items_count()
//                       .verify_table_content_on_modal(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.3.6 --> restricted access to Case Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.10';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.3.7 --> restricted access to Item Media from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.11';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin performs Media Upload through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.media)
//                       .click_button(C.buttons.add)
//                       .upload_file_and_verify_toast_msg('image.png')
//                       .enter_media_description(D.getRandomNo());
//
//                   // TestUser does not have access to Item from Media Search after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.3.8 --> restricted access to Case Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.11';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.3.9 --> restricted access to Item Task from search and Task-list page', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.13';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin assigns task to TestUser through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.itemView.select_tab(C.tabs.tasks)
//                       .click(C.buttons.addTask);
//                   ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                   // TestUser does not have access to Task after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//
//                   ui.menu.click_Tasks();
//                   ui.searchTasks.verify_content_of_first_row_in_results_table(C.CLP.cannot_display_task_due_to_CLP)
//               });
//
//               it('TC_4.3.10 --> restricted access to Case Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.14';
//                   set_preconditions(caseNumber);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_case_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//
//               it('TC_4.3.11 --> restricted access to Item Notes from search', function () {
//                   ui.app.log_title(this);
//                   let caseNumber = D.setNewRandomNo() + '_TC_4.3.15';
//                   set_preconditions(caseNumber, false, true);
//
//                   api.auth.get_tokens(orgAdmin);
//
//                   // Org Admin adds Note through UI after CLP is set
//                   ui.app.open_newly_created_item_via_direct_link();
//                   ui.caseView.select_tab(C.tabs.notes)
//                       .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                       .verify_toast_message(C.toastMsgs.saved);
//
//                   // TestUser does not have access to Note after CLP is set
//                   api.auth.get_tokens(clpUser);
//                   ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                       .verify_content_of_first_row_in_results_table(C.CLP.cannot_display_item_due_to_CLP)
//               });
//           });*/
//
//         // not finished yet
//         context('4.4 Admin CLP for selected Read-Only USER', function () {
//
//             function set_preconditions(caseNumber, addPerson = false, addItem = false) {
//                 api.auth.get_tokens(orgAdmin);
//                 D.generateNewDataSet();
//                 api.cases.add_new_case(caseNumber)
//                     .assign_Case_Level_Permissions(admin_permissionGroup, clpUser);
//                 if (addPerson) api.people.add_new_person(D.getRandomNo(), D.newCase);
//                 if (addItem) api.items.add_new_item(true);
//             }
//
//             beforeEach(function () {
//                 cy.restoreLocalStorage();
//             });
//
//             // not finished yet
//             it('TC_4.4.1 --> admin access to case from search and CaseNumber input fields with typeahead', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.1';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(clpUser);
//
//                 // search
//                 ui.searchCase.run_search_by_Case_Number(caseNumber)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     .click_element_on_grid_container(C.buttons.actions);
//                 // TODO verify Actions are enabled on dropdown after #9177 bug fix is deployed
//                 ui.app.click_button(C.buttons.view);
//                 ui.caseView.verify_Case_View_page_is_open(caseNumber)
//                     .click_Edit()
//                     .edit_all_values(D.editedCase)
//                     .click_Save()
//                     .verify_toast_message(C.toastMsgs.saved)
//
//                 // Case Number typeahead field on Add Item page
//                 ui.caseView.select_tab(C.tabs.items)
//                     .click_Add_Item_button()
//                 // cannot add tags - bug report #8317
//                 ui.addItem.populate_all_fields_on_both_forms(D.newItem)
//                 //     .select_post_save_action(C.postSaveActions.viewAddedItem)
//                 //     .click_Save()
//                 //     .verify_toast_message_();
//
//
//                 // TODO - finish this part
//                 // Case Number typeahead field on Add Items to Case modal
//                 // ui.app.open_case_url(S.oldClosedCase.id)
//                 //     .select_tab(C.tabs.items)
//                 //     .select_checkbox_on_first_table_row();
//                 // ui.caseView.click_element_on_active_tab(C.buttons.actions)
//                 //     .click_option_on_expanded_menu(C.dropdowns.itemActions.addToCase)
//                 //     .add_item_to_case(caseNumber)
//             });
//
//             // bug reported - #9176
//             it('TC_4.4.2 --> read-only access to Case from People View page / Cases Involved', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.2';
//                 set_preconditions(caseNumber, true);
//
//                 api.people.add_person_to_case(true, true);
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.casesInvolved)
//                     .verify_content_of_first_row_in_results_table_on_active_tab([C.buttons.view, D.newCase.caseNumber])
//                     .select_checkbox_on_first_table_row_on_active_tab()
//                     .click_element_on_active_tab(C.buttons.actions)
//                 // TODO verify Actions are disabled on dropdown after #9176 bug fix is deployed
//             });
//
//             // bug reported - #9177
//             it('TC_4.4.3 --> read-only access to item from Items Search and direct link', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.3';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(clpUser);
//                 ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                     .verify_content_of_first_row_in_results_table(C.buttons.view)
//                     .select_checkbox_on_first_table_row()
//                     //.click_element_on_grid_container(C.buttons.actions)
//                     // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//                     .click_View_on_first_table_row()
//                     .verify_text_is_not_visible('Edit')
//             });
//
//             // bug reported - #9177
//             it('TC_4.4.4 --> read-only access to item from People View page / Items Recovered By, Belonging To, Custodian', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.4';
//                 set_preconditions(caseNumber, true, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 api.auth.get_tokens(clpUser);
//                 ui.app.open_newly_created_person_via_direct_link()
//                     .select_tab(C.tabs.itemsRecoveredBy)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemsBelongingTo)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//
//                 ui.app.select_tab(C.tabs.itemCustodian)
//                     .verify_content_of_first_row_in_results_table_on_active_tab(D.newItem.description)
//                 // TODO verify Actions are disabled on dropdown after #9177 bug fix is deployed
//             });
//
//             // keeping one sceanrio here for covering read-only CLP on User level for Item transactions,
//             // as restricted access to other transactions is tested in scenario above - with blocked CLP set on User level
//             it('TC_4.4.5 --> read-only access to item from CheckIns Search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.5';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//                 api.transactions.check_out_item();
//
//                 // Org Admin performs Item CheckIn through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.check_In_the_item(clpUser, true, D.getRandomNo());
//
//                 // TestUser does not have access to Item from CheckIns search-pages after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.open_base_url();
//                 ui.searchCheckIns.run_search_by_Note(D.getRandomNo())
//                     .click_on_Items_count()
//                     .verify_table_content_on_modal(D.newItem.description)
//             });
//
//             it('TC_4.4.6 --> read-only access to Case Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.6';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_4.4.7 --> restricted access to Item Media from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.7';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin performs Media Upload through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.media)
//                     .click_button(C.buttons.add)
//                     .upload_file_and_verify_toast_msg('image.png')
//                     .enter_media_description(D.getRandomNo());
//
//                 // TestUser does not have access to Item from Media Search after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchMedia.run_search_by_Description(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_4.4.8 --> restricted access to Case Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.8';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_4.4.9 --> restricted access to Item Task from search and Task-list page', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.9';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin assigns task to TestUser through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.itemView.select_tab(C.tabs.tasks)
//                     .click(C.buttons.addTask);
//                 ui.addTask.populate_and_submit_form(D.getRandomNo(), D.getRandomNo(), clpUser);
//
//                 // TestUser does not have access to Task after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchTasks.run_search_by_Message(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//
//                 ui.menu.click_Tasks();
//                 ui.searchTasks.verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_4.4.10 --> restricted access to Case Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.10';
//                 set_preconditions(caseNumber);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_case_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//             it('TC_4.4.11 --> restricted access to Item Notes from search', function () {
//                 ui.app.log_title(this);
//                 let caseNumber = D.setNewRandomNo() + '_TC_4.4.11';
//                 set_preconditions(caseNumber, false, true);
//
//                 api.auth.get_tokens(orgAdmin);
//
//                 // Org Admin adds Note through UI after CLP is set
//                 ui.app.open_newly_created_item_via_direct_link();
//                 ui.caseView.select_tab(C.tabs.notes)
//                     .enter_note_and_category(D.getRandomNo(), C.noteCategories.sensitive)
//                     .verify_toast_message(C.toastMsgs.saved);
//
//                 // TestUser does not have access to Note after CLP is set
//                 api.auth.get_tokens(clpUser);
//                 ui.searchNotes.run_search_by_Text(D.getRandomNo())
//                     .verify_content_of_first_row_in_results_table(D.getRandomNo())
//             });
//
//         });
//
//     });
//
//     context('5. CLP cases/items - restricted actions for all users - including OrgAdmin users', function () {
//
//         it('TC_5.1 CLP cannot be set because item belongs to multiple cases', function () {
//             ui.app.log_title(this);
//             D.generateNewDataSet();
//             let caseNumber = D.setNewRandomNo() + '_TC_5.1';
//
//             api.auth.get_tokens(orgAdmin);
//             api.cases.add_new_case(caseNumber);
//             api.items.add_new_item(true);
//             ui.app.open_newly_created_case_via_direct_link();
//
//             ui.caseView.select_tab(C.tabs.permissions)
//                 .click_Edit()
//                 .set_Access_to_case_is_restricted(true)
//                 .verify_messages_on_sweet_alert(
//                     [
//                         C.CLP.cannot_set_CLP,
//                         C.CLP.items_belong_to_several_cases])
//                 .click_button(C.buttons.ok);
//         });
//
//         it('TC_5.2 Specific Item Actions are limited if item belongs to the restricted case', function () {
//             ui.app.log_title(this);
//             let caseNumber = D.setNewRandomNo() + '_TC_5.1';
//
//             api.auth.get_tokens(orgAdmin);
//             api.cases.add_new_case(caseNumber);
//             api.items.add_new_item(true);
//
//             ui.app.open_newly_created_case_via_direct_link()
//             ui.caseView.turn_on_Permissions_on_case()
//
//                 // From Item View
//             ui.app.open_newly_created_item_via_direct_link();
//             ui.itemView.click_element_on_active_tab(C.buttons.actions)
//                 .verify_Actions_option_is_disabled_and_has_a_tooltip
//                 (C.dropdowns.itemActions.manageCases, C.CLP.managingCasesIsForbidden)
//
//                 // From Item Search
//             ui.searchItem.run_search_by_Item_Description(D.newItem.description)
//                 .select_checkbox_on_first_table_row()
//                 .click_button(C.buttons.actions)
//                 .verify_Actions_option_is_disabled_and_has_a_tooltip
//                 (C.dropdowns.itemActions.addToCase, C.CLP.addingItemIsForbidden)
//                 .verify_Actions_option_is_disabled_and_has_a_tooltip
//                 (C.dropdowns.itemActions.changePrimaryCase, C.CLP.changingPrimaryCaseIsForbidden)
//                 .verify_Actions_option_is_disabled_and_has_a_tooltip
//                 (C.dropdowns.itemActions.manageCases, C.CLP.managingCasesIsForbidden)
//         });
//
//         // not finished
//         xit('TC_5.4 Item from non-restricted case cannot be added to CLP-restricted case', function () {
//             ui.app.log_title(this);
//             let caseNumber = D.setNewRandomNo() + '_TC_5.1';
//
//             api.auth.get_tokens(orgAdmin);
//             D.generateNewDataSet()
//             api.cases.add_new_case(caseNumber);
//             api.items.add_new_item();
//
//             ui.app.open_newly_created_case_via_direct_link()
//             ui.caseView.turn_on_Permissions_on_case()
//
//                 // From Item View
//             ui.app.open_newly_created_item_via_direct_link();
//             ui.itemView.click_element_on_active_tab(C.buttons.actions)
//                 .click_option_on_expanded_menu(C.dropdowns.itemActions.manageCases)
//
//         });
     });
 });
