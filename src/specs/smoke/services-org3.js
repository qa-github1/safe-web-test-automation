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
let approvedForReleaseItem = {}

before(function () {
    api.auth.get_tokens(orgAdmin);
    api.org_settings.enable_all_Case_fields();
    api.org_settings.enable_all_Item_fields();
    api.org_settings.enable_all_Person_fields();
    api.org_settings.update_org_settings(false, true);
    api.org_settings.update_org_settings_by_specifying_property_and_value('containerAutoDeactivate', true)
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
});

describe('Dispo Auth', function () {

    it('All Dispo Actions for 8 items -- no service involved', function () {

        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);

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

        for (let i = 1; i < 9; i++) {
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
            .verify_single_toast_message_if_multiple_shown('Submitted for Disposition')
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

describe('Services', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.cases.add_new_case()
        api.items.add_new_item()
    });

    it('1. Reporter', function () {

        api.auth.get_tokens(S.userAccounts.orgAdmin);
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });
        ui.app.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.items)
            .select_checkbox_for_all_records()
            .click_element_on_active_tab(C.buttons.reports)
            .click_option_on_expanded_menu(C.reports.primaryLabel4x3, false)
            .verify_report_running_toast_message()
            .click_element_on_active_tab(C.buttons.reports)
            .click_option_on_expanded_menu(C.reports.primaryLabel4x3)
        cy.get('@windowOpen').should('have.been.called');
        if (S.domain !== 'PENTEST'){
            cy.get('@windowOpen').should('have.been.calledWithMatch', /Report.*\.pdf/)
        }
    });

    it('2. Exporter', function () {

        api.auth.get_tokens(S.userAccounts.orgAdmin);
        ui.app.open_newly_created_case_via_direct_link()
            .select_tab(C.tabs.items)
            .select_checkbox_for_all_records()
            .click_element_on_active_tab(C.buttons.export)
            .click_option_on_expanded_menu('All - Excel')
        ui.app.verify_url_contains_some_value('export-jobs')
        // .verify_content_of_first_row_in_results_table('Download')
        ui.app.verify_content_of_specific_cell_in_first_table_row('Download Link', 'Download')

    });

    it('3. Importer', function () {
        let fileName = 'CaseImport_allFields_' + S.domain;
        api.auth.get_tokens(S.userAccounts.orgAdmin);

        D.generateNewDataSet();
        D.getNewItemData(D.newCase);
        D.newCase.caseOfficers_importFormat = S.userAccounts.orgAdmin.email + ';' + S.selectedEnvironment.admin_userGroup.name
        D.newCase.caseOfficers = [S.userAccounts.orgAdmin.name, S.selectedEnvironment.admin_userGroup.name]

        E.generateDataFor_CASES_Importer([D.newCase]);

        ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Item_fields([C.itemFields.itemBelongsTo]);
        api.org_settings.update_org_settings(true, true);
        api.auto_disposition.edit(true);

        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            // .verify_toast_message([C.toastMsgs.importComplete, 1 + C.toastMsgs.recordsImported])
            .check_import_status_on_grid('1 records imported')
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
            .populate_all_fields_on_both_forms(D.newItem, false, true)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save(D.newItem)
            .verify_Error_toast_message_is_NOT_visible();
        ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
    })

    it('4. Workflow Service', function () {
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

    it('5. Dispo Auth Service', function () {

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
            .set_page_size(100)
            .set_Action___Approve_for_Disposal([1, 51])
            .click_Submit_for_Disposition()
            .verify_single_toast_message_if_multiple_shown('Processing...')
            .verify_Dispo_Auth_Job_Status('Complete')
            .verify_text_is_present_on_main_container('Approved for Disposal')
        ui.taskView
            .verify_Disposition_Statuses_on_the_grid([
                [[...Array(50).keys()], 'Approved for Disposal']])
            .reload_page()
            .verify_text_is_present_on_main_container('Task was closed')
    });

    it('6. Auto Reports - Release Letters', function () {

        ui.app.log_title(this);
        api.auth.get_tokens(orgAdmin);

        ui.menu.click_Tools__Auto_Reports()
        ui.app.set_visibility_of_table_column('Public Facing Description', true)
            .sort_by_descending_order('Delivery Time')
            .verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(approvedForReleaseItem.description, 10, 30, true)
    });

})