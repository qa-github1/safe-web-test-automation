const C = require('../fixtures/constants');
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//
let
    selectedOffice = e => cy.get('.nav-office-text'),
    sideMenu = e => cy.get('#side-menu'),
    selectOfficeInput = e => cy.get('input[placeholder="Select Office"]'),
    officeNameOnTypeaheadDropdown = officeName => cy.get('.nav-office-dropdown').contains(officeName),
    add = e => sideMenu().find('[translate="NAV.ADD.TITLE"]'),
    case_ = e => sideMenu().find('[translate="NAV.ADD.CASE"]'),
    item = e => sideMenu().find('[translate="NAV.ADD.ITEM"]'),
    addItemHeader = e => cy.get('[translate="ITEMS.ADD.MODAL_HEADING"]'),
    addCaseHeader = e => cy.get('[translate="CASES.ADD.MODAL_HEADING"]'),
    addPersonHeader = e => cy.get('[translate="PEOPLE.HEADING_ADD"]'),
    person = e => sideMenu().find('[translate="NAV.ADD.PERSON"]'),
    search = e => sideMenu().find('[translate="NAV.ADVANCED_SEARCH"]'),
    cases = e => sideMenu().find('[translate="NAV.CASES"]'),
    items = e => sideMenu().find('[translate="NAV.ITEMS"]'),
    people = e => sideMenu().find('[translate="NAV.PEOPLE"]'),
    disposals = e => sideMenu().find('[translate="NAV.DISPOSALS"]'),
    checkins = e => sideMenu().find('[translate="NAV.CHECKINS"]'),
    checkouts = e => sideMenu().find('[translate="NAV.CHECKOUTS"]'),
    moves = e => sideMenu().find('[translate="NAV.MOVES"]'),
    transfers = e => sideMenu().find('[translate="NAV.TRANSFERS"]'),
    notes = e => sideMenu().find('[translate="NAV.NOTES"]'),
    media = e => sideMenu().find('[translate="GENERAL.MEDIA"]'),
    tasks = e => sideMenu().find('[translate="NAV.TASKS"]'),
    exportedSearches = e => sideMenu().find('[translate="NAV.EXPORTED_SEARCHES"]'),
    scan = e => sideMenu().find('[tooltip="Scan"]'),
    tasksList = e => sideMenu().find('.badge'),
    taskSettings = e => sideMenu().find('[translate="NAV.TSK_SETTINGS"]'),
    massImportButton = e => cy.get('[translate="ITEMS.SCAN.MASS_IMPORT_LIST"]'),
    tools = e => cy.get('[translate="NAV.TOOLS"]').parents('li'),
    storageLocations = e => cy.get('[translate="NAV.LOCATIONS"]'),
    InventoryReport = e => cy.get('[translate="GENERAL.DISCREPANCY_REPORTS"]').first(),
    autoReports = e => cy.get('[translate="AUTO_REPORT.AUTO_REPORTS"]'),
    settings = e => cy.get('[translate="NAV.SETTINGS"]'),
    organization = e => cy.get('[translate="NAV.ORGANIZATION"]'),
    offices = e => cy.get('[translate="NAV.OFFICES"]'),
    permissionGroups = e => cy.get('[translate="PERMISSIONS.GROUPS"]'),
    userGroups = e => cy.get('[translate="GENERAL.USER_GROUPS"]'),
    userAdmin = e => cy.get('[translate="USER.USER_ADMIN"]'),
    sessions = e => cy.get('[translate="USER_SESSIONS.SESSIONS"]'),
    licenseAllocation = e => cy.get('[translate="LICENSE_ALLOCATION.LICENSE_ALLOCATIONS"]'),
    workflows = e => cy.get('[translate="WORKFLOW.WORKFLOWS"]'),
    userSettings = e => cy.get('[translate="NAV.USER_SETTINGS"]'),
    systemServices = e => cy.get('[translate="NAV.SYSTEM_SERVICES"]'),
    logOut = e => cy.get('[tooltip="Logout"]').first(),
    dataImport = e => cy.get('[ui-sref="flat-import.view"]'),
    dragAndDropBox = e => cy.get('[flow-file-success="uploadSuccess($file, $message)"]')


export default class Menu extends BasePage {

    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    click_Add__Case () {
        this.pause(0.3)
        add().click();
        case_().click();
        addCaseHeader().should('contain', C.labels.addCase.title);
        this.pause(1)
        return this;
    };

    click_Case () {
        case_().click();
        addCaseHeader().should('contain', C.labels.addCase.title);
        this.pause(0.3)
        return this;
    };

    click_Add__Item () {
        add().click();
        item().click();
        addItemHeader().should('contain', C.labels.addItem.title);
        return this;
    };

    click_Item () {
        item().click();
        addItemHeader().should('contain', C.labels.addItem.title);
        return this;
    };

    click_Add__Person () {
        add().click();
        person().click();
        addPersonHeader().should('contain', C.labels.addPerson.title);
        return this;
    };

    click_Search__Case () {
        search().click();
        cases().click();
        this.wait_search_criteria_to_be_visible();
        this.wait_until_spinner_disappears();
        return this;
    };

    click_Search__Item () {
        search().click();
        items().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__People () {
        search().click();
        people().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Disposals () {
        search().click();
        disposals().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Checkins () {
        search().click();
        checkins().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Checkouts () {
        search().click();
        checkouts().should('be.visible').and('not.be.disabled').click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Moves () {
        search().click();
        moves().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Transfers () {
        search().click();
        transfers().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Notes () {
        search().click();
        notes().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Media () {
        search().click();
        media().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Search__Tasks () {
        search().click();
        tasks().click();
        this.wait_search_criteria_to_be_visible();
        return this;
    };

    click_Scan () {
        scan().click();
        massImportButton().should('be.visible');
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_Tasks () {
        tasksList().click();
        this.verify_text_is_present_on_main_container(C.labels.tasksPage.title);
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_Settings__Task_Settings () {
        settings().click()
        taskSettings().click();
        this.verify_url_contains_some_value('tasks/settings');
        return this;
    };

    click_Tools__Data_Import () {
        tools().click();
        dataImport().click();
        dragAndDropBox().should('be.visible');
        return this;
    };

    click_Tools__Storage_Locations () {
        this.define_API_request_to_be_awaited('GET', '/api/**', 'all_GET_Requests')
        tools().click();
        storageLocations().click();
        this.verify_Error_toast_message_is_NOT_visible()
        this.verify_text_is_present_on_main_container(C.buttons.addStorageLocations);
        return this;
    };

    click__Storage_Locations () {
        storageLocations().click();
        this.verify_Error_toast_message_is_NOT_visible()
        this.verify_text_is_present_on_main_container(C.buttons.addStorageLocations);
        return this;
    };

    click_Tools__Inventory_Reports () {
        tools().click();
        this.pause(0.3)
        InventoryReport().click();
        this.verify_text_is_present_on_main_container(C.labels.InventoryReports.title);
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_Tools__Auto_Reports () {
        tools().click();
        autoReports().click();
        this.verify_text_is_present_on_main_container(C.labels.InventoryReports.title);
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_Settings__Organization () {
        settings().click();
        organization().click();
        this.verify_text_is_present_on_main_container(C.labels.organization.title);
        return this;
    };

    click_Settings__User_Admin () {
        settings().click();
        userAdmin().click();
        this.verify_text_is_present_on_main_container(C.labels.userAdmin.title);
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_Settings__Workflows () {
        settings().click();
        workflows().click();
        this.verify_text_is_present_on_main_container(C.labels.workflows.title);
        this.verify_Error_toast_message_is_NOT_visible()
        return this;
    };

    click_User_Settings () {
        userSettings().click()
        this.verify_text_is_present_on_main_container(C.labels.userSettings.title);
        return this;
    };

    click_Settings__System_Services() {
        settings().click();
        systemServices().click();
        this.verify_text_is_present_on_main_container(C.labels.systemServices.title);
        this.verify_Error_toast_message_is_NOT_visible();
    }

    click_Log_Out() {
        logOut().scrollIntoView();
        logOut().should('be.visible');
        logOut().click();
        return this;
    }

    select_office(officeName) {
        selectedOffice().click();
        selectOfficeInput().type(officeName);
        officeNameOnTypeaheadDropdown(officeName).click();
        return this;
    }

}
