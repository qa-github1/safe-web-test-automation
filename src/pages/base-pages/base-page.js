import authApi from "../../api-utils/endpoints/auth";
import orgSettingsApi from "../../api-utils/endpoints/org-settings/collection";

let S = require('../../fixtures/settings');
let D = require('../../fixtures/data');
let C = require('../../fixtures/constants');
let helper = require('../../support/e2e-helper');
let casesApi = require('../../api-utils/endpoints/cases/collection')

//************************************ ELEMENTS ***************************************//
let
    bodyContainer = e => cy.get('body'),
    tableBody = e => cy.get('.table-striped').find('tbody'),
    okButton = e => cy.findAllByText('Ok').last(),
    saveButton = e => cy.get('[button-text="\'GENERAL.BUTTON_SAVE\'"]').contains('Save'),
    saveAutoDispoButton = e => cy.get('[id="saveAutoDispo"]').contains('Save'),
    editButton = e => cy.get('[translate="GENERAL.EDIT"]').contains('Edit'),
    deleteButton = e => cy.get('[translate="GENERAL.DELETE"]').parent('li'),
    actionsButton = e => cy.get('[title="Select an item or items for which you would like to perform Action."]'),
    uploadFileInput = e => cy.get('input[type=file]'),
    addItem = e => cy.get('[translate="CASES.LIST.BUTTON_ADD_ITEM"]'),
    active_tab = e => cy.get('[class="tab-pane ng-scope active"]'),
    quickSearch = e => cy.get('[name="navbarSearchField"]'),

    quickSearchCaseTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    quickSearchCaseTypeahead_FirstOption = e => cy.get('[ng-repeat="match in matches track by $index"]').eq(0),
    //quickSearchCaseTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    //quickSearchCaseTypeahead = e => cy.get('[ng-if="!match.model.last && match.model.text && !match.model.first"]'),
    active_tab_title = e => cy.get('[class="ng-scope ng-isolate-scope active"]'),
    gridOptionsDropdown = e => cy.get('[ng-if="optionsToggle.isOpen"]'),
    columnVisibilityIndicatorOnOptionsDropdown = (columnName) => cy.get('[ng-if="optionsToggle.isOpen"]').contains(columnName).find('i'),
    modal = e => cy.get('.modal-content'),
    modal__ = e => cy.get('.modal-content'),
    modalBodySectionAboveFooter = e => cy.get('.modal-body').children('div').last(),
    sweetAlert = e => cy.get('[data-animation="pop"]'),
    typeaheadList = e => cy.get('.ui-select-choices'),
    firstTypeaheadOption = e => cy.get('.ui-select-choices-row').first(),
    //highlightedOptionOnTypeahead = e => cy.get('.ui-select-choices-row-inner').last(),
    highlightedOptionOnTypeahead = e => cy.get('.ui-select-highlight').last(),
    caseOfficersOverwrite = e => cy.get('[ng-model="toggle.caseOfficersOverwrite"]'),
    tagsOverwrite = e => cy.get('[ng-model="toggle.tagsOverwrite"]'),
    tagsTypeaheadList = e => cy.get('[repeat="tagModel in allTagModels | filter: $select.search"]'),
    orgTagIconOnTagsTypeaheadList = e => tagsTypeaheadList().find('[ng-if="model.tagUsedBy==1"]'),
    linkByText = linkText => cy.get('link').contains(linkText),
    linkWrappedInElement = (linkText, parentElementTag) => cy.contains(linkText).parent(parentElementTag),
    parentLinkByInnerText = innerText => cy.get('link').contains(innerText).parent('a'),
    buttonByTitle = buttonTitle => cy.contains('button', buttonTitle),
    elementByTitle = elementTitle => cy.contains(elementTitle),
    inputFieldFoundByLabel = label => cy.contains(label).parent('div').find('input').first(),
    checkboxFieldFoundByLabel = label => cy.contains(label).parent('div').find('[type="checkbox"]').first(),
    buttonOnModal = buttonTitle => modal().children().contains(buttonTitle),
    buttonOnSweetAlert = buttonTitle => sweetAlert().children().contains(buttonTitle),
    buttonsContainerOnModal = e => modal().find('.col-md-offset-8'),
    buttonOnActiveTab = buttonTitle => active_tab().find('button').contains(buttonTitle),
    elementOnActiveTab = elementTitle => active_tab().contains(elementTitle),
    optionsDropdownUnderMenuCustomization = e => cy.get('[is-open="optionsToggle.isOpen"]'),
    pageSizesUnderMenuCustomization = e => cy.get('[ng-if="optionsToggle.isOpen"]'),
    elementOnGridContainer = elementTitle => cy.get('.bs-grid').contains(elementTitle),
    parentContainerFoundByInnerLabel = (innerLabel, parentElementTag = 'div') => cy.contains(innerLabel).parent(parentElementTag),
    parentContainerFoundByInnerLabelOnModal = (innerLabel, parentElementTag = 'div') => modal().contains(innerLabel).parents(parentElementTag),
    navTabs = e => cy.get('.nav-tabs'),
    specificTab = tabTitle => navTabs().children().contains(tabTitle).parent('li'),
    historyTab = e => cy.get('[translate="GENERAL.HISTORY"]').parent('tab-heading').parent('a').parent('li'),
    expandedMenu = e => cy.get('button[aria-expanded="true"]'),
    optionOnExpandedMenu = option => expandedMenu().next().contains(option),
    dropdownOnModal = e => modal().children().get('select'),
    notesOnModal = e => modal().children().find('textarea'),
    noteOnModal = e => modal().children().get('[placeholder="Note"]'),
    tableOnModal = e => modal().find('tbody'),
    asterisks = e => cy.get('[ng-if="form.state[field.name].$error.required"]'),
    optionOnTypeahead = option => cy.get('.dropdown-menu[aria-hidden="false"]').contains(option),
    mainContainer = e => cy.get('.ui-view-main'),
    textOnMainContainer = text => cy.get('.ui-view-main').contains(text),
    toastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout}),
    toastContainer = (timeout = 50000) => cy.get('#toast-container', {timeout: timeout}),
    toastTitle = (timeout = 50000) => cy.get('.toast-title', {timeout: timeout}),
    searchParametersAccordion = e => cy.get('[class="panel-collapse collapse in"]'),
    resultsTable = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('tbody'),
    tableStriped = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex),
    dataGrid = (tableIndex = 0) => cy.get('.table-striped[tp-fixed-table-header-scrollable="scrollable-area"]').eq(tableIndex).find('tbody'),
    resultsEntriesCount = e => cy.get('[translate="BSGRID.DISPLAY_STATS"]'),
    //menuCustomization = e => cy.contains('Menu Customization'),
    menuCustomization = e => cy.get('[translate="BSGRID.BUTTON_MENU_CUSTOMIZATION"]'),
    menuCustomizationFromRoot = e => cy.root().parents('html').contains('Menu Customization'),
    customFormsSectionOnMenuCustomization = e => cy.get('[is-open="customFieldsToggle.isOpen"]'),
    searchCustomFormsOnMenuCustomization = e => cy.get('[ng-model="options.customFormSearchField"]'),
    optionsOnMenuCustomization = e => cy.get('[is-open="optionsToggle.isOpen"]'),
    standardColumnsOnMenuCustomization = e => cy.get('[ng-repeat="col in getStandardFields() | orderBy:\'name | translate\'"]'),
    columnsOnMenuCustomization = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]'),

    //disabledColumnsOsOnMenuCustomization = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),
    // disabledColumnsOsOnMenuCustomization = e => cy.get('[class="glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray"]'),
    //disabledColumnsOsOnMenuCustomization = e => cy.get('[ng-class="col.visible ?\n' +
    //     '                                                            \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\':\n' +
    //    '                                                            \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),

    disabledColumnsOsOnMenuCustomization = e => cy.get('.glyphicon-remove'),
    //disabledColumnsOsOnMenuCustomization_PENTEST = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),

    //disabledColumnsOsOnMenuCustomization_DEV = e => cy.get('[ng-class="col.visible ?\n' +
    //    '                                                            \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\':\n' +
    //    '                                                            \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),
    enabledColumnsOnMenuCustomization = e => cy.get('.glyphicon-ok'),
    pageSizeAndColumnsContianer = e => cy.get('.grid-menu-header').eq(1),
    //  resultsTableHeader = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('thead'),
    resultsTableHeader = (tableIndex = 0) => cy.get('thead'),
    resultsTableHeaderFromRoot = (tableIndex = 0) => cy.root().parents('html').find('.table-striped').eq(tableIndex).find('thead'),
    firstRowInResultsTable = e => resultsTable().children('tr').first(),
    specificRowInResultsTable = index => resultsTable().children('tr').eq(index),
    tableRowFoundByUniqueTextInAnyCell = (text, tableIndex = 0) => resultsTable(tableIndex).contains(text).parent('tr'),
    tableColumnFoundByText = (text, tableIndex = 0) => resultsTableHeader(tableIndex).contains(text),
    lastRowInResultsTable = e => resultsTable().children('tr').last(),
    firstRowInResultsTableOnModal = e => cy.get('.modal-content').find('tbody').children('tr').first(),
    firstRowInResultsTableOnActiveTab = e => active_tab().find('tbody').children('tr').first(),
    checkboxOnFirstRowInResultsTableOnActiveTab = e => active_tab().find('tbody').children('tr').first().find('.bg-grid-checkbox'),
    checkboxOnFirstTableRow = e => resultsTable().find('.bg-grid-checkbox').first(),
    checkboxToSelectAll = e => cy.get('[ng-model="options.selectAllToggle"]').first(),
    locationPin = name => cy.contains(name).parent('div'),
    checkboxOnSpecificTableRow = rowNumber => resultsTable().find('.bg-grid-checkbox', { timeout: 0 }).eq(rowNumber - 1),
    checkboxOnTableRowOnModal = rowNumber => tableOnModal().find('.bg-grid-checkbox').eq(rowNumber - 1),
    checkboxOnTableHeader = e => resultsTableHeader().find('[type="checkbox"]'),
    caseNumberOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    offenseTypeOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    firstLocationOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    locationsOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    lastTagOnTypeahead = e => cy.get('[ng-repeat="tagModel in $select.items"]').last(),
    caseOfficerTypeahead = e => cy.get('[ng-repeat="item in $group.items"]').first(),
    createPersonalTagOnTypeahead = e => cy.get('[ng-repeat="tagModel in $select.items"]').first(),
    addItemHeader = e => cy.get('[translate="ITEMS.ADD.MODAL_HEADING"]'),
    textboxOnCustomForm = e => cy.get('.fg-form-fields').contains('Textbox').parent('div').find('input'),
    emailOnCustomForm = e => cy.get('.fg-form-fields').contains('Email').parent('div').find('input'),
    numberOnCustomForm = e => cy.get('.fg-form-fields').contains('Number').parent('div').find('input'),
    passwordOnCustomForm = e => cy.get('.fg-form-fields').contains('Password').parent('div').find('input'),
    textareaOnCustomForm = e => cy.get('.fg-form-fields').contains('Textarea').parent('div').find('textarea'),
    checkboxOnCustomForm = e => cy.get('.fg-form-fields').contains('Checkbox').parent('div').find('input'),
    selectListOnCustomForm = e => cy.get('.fg-form-fields').contains('Select List').parent('div').find('select'),
    dropdownTypeaheadOnCustomForm = e => cy.get('.fg-form-fields').contains('Dropdown Typeahead').parent('div').find('input'),
    personOnCustomForm = e => cy.get('.fg-form-fields').contains('Person').parent('div').find('input'),
    user_userGroup_OnCustomForm = e => cy.get('.fg-form-fields').contains('User/User Group').parent('div').find('input'),
    dateOnCustomForm = e => cy.get('.fg-form-fields').contains('Date').parent('div').find('[ng-model="ngModel"]'),
    dropdownTypeaheadOption = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    userAndUserGroupTypeaheadOption = e => cy.get('[ng-repeat="item in $group.items"]').first(),
    firstOptionOnCheckboxListOnCustomForm = e => cy.get('.fg-form-fields').contains('Checkbox List').parent('div').children().find('input').first(),
    secondOptionOnRadiobuttonListOnCustomForm = e => cy.get('.fg-form-fields').contains('Radiobutton List').parent('div').children().find('input').eq(1),
    itemsCountOnSearchGrid = e => resultsTable().children('tr').first().find('[ng-click="callbackFunction(item.id)"]'),
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    tagsField = e => active_form().contains('Tags').parent('div'),
    //tagsField = e => cy.contains('Tags').parent('div').find('ng-transclude'),
    tagsInput = e => active_form().contains('Tags').parent('div').find('input'),
    actionsContainer = e => cy.get('[translate="GENERAL.ACTIONS"]').parent('div'),
    case__ = e => cy.contains('Case').parent('div').find('ng-transclude'),
    status__ = e => cy.contains('Status').parent('div').find('ng-transclude'),
    recoveredAt__ = e => cy.contains('Recovered At').parent('div').find('ng-transclude'),
    recoveryDate__ = e => cy.contains('Recovery Date').parent('div').find('ng-transclude'),
    recoveredBy__ = e => cy.contains('Recovered By').parent('div').find('ng-transclude'),
    storageLocation__ = e => cy.contains('Storage Location').parent('div').find('ng-transclude'),
    submittedBy__ = e => cy.contains('Submitted By').parent('div').find('ng-transclude'),
    category__ = e => cy.contains('Category').parent('div').find('ng-transclude'),
    custodyReason__ = e => cy.contains('Custody Reason').parent('div').find('ng-transclude'),
    make__ = e => cy.contains('Make').parent('div').find('ng-transclude'),
    model__ = e => cy.contains('Model').parent('div').find('ng-transclude'),
    serialNumber__ = e => cy.contains('Serial Number').parent('div').find('ng-transclude'),
    barcode__ = e => cy.contains('Barcode').parent('div').find('ng-transclude'),
    additionalBarcodes__ = e => cy.contains('Additional Barcodes').parent('div').find('ng-transclude'),
    description__ = e => cy.contains('Description').parent('div').find('ng-transclude'),
    itemBelongsTo__ = e => cy.contains('Item Belongs to').parent('div').find('ng-transclude'),
    custodian__ = e => cy.contains('Custodian').parent('div').find('ng-transclude'),
    tags__ = e => cy.contains('Tags').parent('div').find('ng-transclude'),
    firstNameInput__ = e => cy.contains('First Name').parent('div').find('input'),
    lastNameInput__ = e => cy.contains('Last Name').parent('div').find('input'),
    middleNameInput__ = e => cy.contains('Middle Name').parent('div').find('input'),
    businessNameInput__ = e => cy.contains('Business Name').parent('div').find('input'),
    aliasInput__ = e => cy.contains('Alias').parent('div').find('input'),
    driversLicenseInput__ = e => cy.contains('Driver\'s License').parent('div').find('input'),
    mobilePhoneInput__ = e => cy.contains('Mobile Phone').parent('div').find('input'),
    otherPhoneInput__ = e => cy.contains('Other Phone').parent('div').find('input'),
    additionalBarcodesInput__ = e => cy.contains('Additional Barcodes').parent('div').find('input').last(),
    emailInput__ = e => cy.contains('Email').parent('div').find('input'),
    race__ = e => cy.contains('Race').parent('div').find('ng-transclude'),
    gender__ = e => cy.contains('Gender').parent('div').find('ng-transclude'),
    dateOfBirth__ = e => cy.contains('Date of Birth').parent('div').find('ng-transclude'),
    systemService = e => cy.get('[ng-repeat="systemService in systemServices"]'),
    systemServiceName = e => cy.get('[ng-repeat="systemService in systemServices"] .ng-binding'),
    systemServiceStatus = e => cy.get('[ng-repeat="systemService in systemServices"] span'),
    searchBar_history = e => cy.get('[ng-model="options.searchFilter"]'),
    typeaheadInputField = fieldLabel => cy.contains(fieldLabel).parent().find('input').first(),
    dropdownField = fieldLabel => cy.findByLabelText(fieldLabel).parent().find('select').eq(0),
    inputField = fieldLabel => cy.findByLabelText(fieldLabel).parent().find('input').eq(0),
    textareaField = fieldLabel => cy.contains('span', fieldLabel).parents('label').parent('div').find('textarea').eq(0),
    typeaheadOption = fieldLabel => cy.contains(fieldLabel).parent().find('ul').find('li').eq(0)

let dashboardGetRequests = [
    '/api/users/currentuser?groups=true',
    '/api/users/currentuser?groups=false',
    '/api/dashboards',
    '/api/templatewidgets',
    '/api/charts/GetMyDataWidgets',
    '/api/access/offices'
]

export default class BasePage {

    constructor() {
        this.searchParametersAccordion = searchParametersAccordion;
        this.itemsCountOnSearchGrid = itemsCountOnSearchGrid;
        this.caseNumberOnTypeahead = caseNumberOnTypeahead;
        this.offenseTypeOnTypeahead = offenseTypeOnTypeahead;
        this.firstLocationOnTypeahead = firstLocationOnTypeahead;
        this.locationsOnTypeahead = locationsOnTypeahead;
        this.dropdownTypeaheadOption = dropdownTypeaheadOption;
        this.lastTagOnTypeahead = lastTagOnTypeahead;
        this.caseOfficerTypeahead = caseOfficerTypeahead;
        this.createPersonalTagOnTypeahead = createPersonalTagOnTypeahead;
        this.userAndUserGroupTypeaheadOption = userAndUserGroupTypeaheadOption;
        this.toastMessage = toastMessage;
        this.resultsTable = resultsTable;
        this.firstRowInResultsTable = firstRowInResultsTable;
        this.firstTypeaheadOption = firstTypeaheadOption;
        this.checkboxToSelectAll = checkboxToSelectAll;
        this.mainContainer = mainContainer;
        this.tagsField = tagsField;
        this.tagsInput = tagsInput;
        this.case__ = case__;
        this.status__ = status__;
        this.recoveredAt__ = recoveredAt__;
        this.recoveryDate__ = recoveryDate__;
        this.recoveredBy__ = recoveredBy__;
        this.storageLocation__ = storageLocation__;
        this.submittedBy__ = submittedBy__;
        this.category__ = category__;
        this.custodyReason__ = custodyReason__;
        this.make__ = make__;
        this.model__ = model__;
        this.modal__ = modal__;
        this.serialNumber__ = serialNumber__;
        this.barcode__ = barcode__;
        this.additionalBarcodes__ = additionalBarcodes__;
        this.additionalBarcodesInput__ = additionalBarcodesInput__
        this.description__ = description__;
        this.itemBelongsTo__ = itemBelongsTo__;
        this.custodian__ = custodian__;
        this.tags__ = tags__;
        this.firstNameInput__ = firstNameInput__
        this.lastNameInput__ = lastNameInput__
        this.middleNameInput__ = middleNameInput__
        this.businessNameInput__ = businessNameInput__
        this.aliasInput__ = aliasInput__
        this.driversLicenseInput__ = driversLicenseInput__
        this.mobilePhoneInput__ = mobilePhoneInput__
        this.otherPhoneInput__ = otherPhoneInput__
        this.emailInput__ = emailInput__
        this.race__ = race__
        this.gender__ = gender__
        this.dateOfBirth__ = dateOfBirth__
    }

//************************************ ACTIONS ***************************************//


    select_dropdown_option(fieldLabel, option) {
        dropdownField(fieldLabel).select(option)
        return this;
    };

    enter_and_select_value_in_typeahead_field(fieldLabel, value) {
        typeaheadInputField(fieldLabel).type(value);
        this.pause(0.3)
        typeaheadOption(fieldLabel).click();
        return this;
    };

    enter_value_to_textarea_field(fieldLabel, value) {
        textareaField(fieldLabel).type(value)
        textareaField(fieldLabel).should('have.value', value);
        return this;
    };

    enter_value_to_input_field(fieldLabel, value, clearExistingValue) {
        if (clearExistingValue) inputField(fieldLabel).clear()
        inputField(fieldLabel).type(value)
        inputField(fieldLabel).should('have.value', value);
        return this;
    };

    verify_value_in_input_field(fieldLabel, value) {
        inputField(fieldLabel).should('have.value', value);
        return this;
    };

    verify_value_in_textarea_field(fieldLabel, value) {
        textareaField(fieldLabel).should('have.value', value);
        return this;
    };

    verify_selected_option_on_dropdown(fieldLabel, selectedOptionLabel) {
        dropdownField(fieldLabel).should('have.value', selectedOptionLabel);
        return this;
    };

    getCurrentDate() {
        return helper.currentDate;
    };

    find_field_by_exactly_matching_text(parentContainer, text) {
        const regex = new RegExp(`^${text}$`);
        return parentContainer().contains(regex)
    };

    search_history(value) {
        searchBar_history().clear().type(value).type('{enter}');

        return this;
    }

    verify_value_on_input_field(label, value) {
        inputFieldFoundByLabel(label).invoke('val').should('contain', value)
        return this;
    };

    click_Add_Item_button() {
        addItem().click();
        addItemHeader().should('be.visible');
        return this;
    };

    verify_text_is_present_on_main_container(text) {
        this.toastMessage().should('not.exist');
        this.verify_text(mainContainer, text)
        return this;
    };

    verify_url_contains_some_value(partOfUrl) {
        cy.url().should('include', partOfUrl)
        return this;
    };

    verify_text_is_present_on_the_grid(text) {
        this.wait_until_spinner_disappears()
        this.verify_text(dataGrid, text)
        return this;
    };

    verify_text_is_NOT_present_on_main_container(text) {
        this.toastMessage().should('not.exist');
        mainContainer().find(':visible').should('not.contain', text);
        return this;
    };

    verify_items_count_on_grid(firstPageTotal, totalCount = firstPageTotal) {
        if (firstPageTotal === 0) {
            cy.contains(`Showing 0 to 0 of 0 items`).should('be.visible');
        } else {
            cy.contains(`Showing 1 to ${firstPageTotal} of ${totalCount} items`).should('be.visible');
        }
        return this;
    };

    quick_search_for_case(caseNumber, shouldFind = true) {
        let request = 'typeahead?allOffices=true&hideOverlay=true&search=' + caseNumber.replace(/\s+/g, '%20');
        this.define_API_request_to_be_awaited('GET', request)
        this.enterValue(quickSearch, caseNumber)
        // quickSearch().clear().type(caseNumber).trigger('input');
        this.wait_response_from_API_call(request, 200);

        if (shouldFind) {
            quickSearchCaseTypeahead_FirstOption().click();
            this.wait_until_spinner_disappears();
        } else {
            this.verify_element_has_class(quickSearch, 'ng-invalid-empty-data-error')
        }
        this.verify_text_is_present_on_main_container(caseNumber)
        return this;
    };

    verify_Error_toast_message_is_NOT_visible() {
        this.wait_until_spinner_disappears()
        this.wait_all_GET_requests()
        this.verify_element_does_NOT_contain_text(toastContainer, 'Error')
    }

    verify_specific_toast_message_is_NOT_visible(text) {
        this.wait_until_spinner_disappears()
        this.wait_all_GET_requests()
        this.verify_element_does_NOT_contain_text(toastContainer, text)
    }

    verify_toast_message(text, includesRecentCaseNumber = false, timeoutInMinutes = 1) {

        let timeoutInMiliseconds = timeoutInMinutes * 60000;

        cy.getLocalStorage("recentCase").then(recentCase => {
            toastMessage(timeoutInMiliseconds).should('be.visible');
            toastMessage(timeoutInMiliseconds).invoke('text').then(function (toastMsg) {
                toastMessage().click({multiple: true})
                toastMessage().should('not.exist');
                if (text instanceof Array) {
                    text.forEach(element =>
                        expect(toastMsg).to.contain(element)
                    );
                } else {
                    expect(toastMsg).to.contain(text);
                }

                if (includesRecentCaseNumber) expect(toastMsg).to.contain(JSON.parse(recentCase).caseNumber)
            });
        });
        return this;
    };


    verify_toast_title(title) {
        toastTitle().should('be.visible');
        toastTitle().should('contain', title);
        return this;
    };

    verify_toast_title_and_message(title, message) {
        toastTitle().should('be.visible').should('contain', title);
        toastMessage().should('contain', message);
        return this;
    };

    set_page_size(pageSize = 25) {
        cy.contains('Menu Customization').click()
        optionsDropdownUnderMenuCustomization().click()
        pageSizesUnderMenuCustomization().contains(pageSize).click()
        return this;
    }

    click_Search() {
        cy.intercept('POST', '**/search').as('search')
        this.click(C.buttons.search, mainContainer());
        cy.wait('@search')
        this.wait_until_spinner_disappears()
        return this;
    };

    click_button_on_modal(buttonTitle) {
        buttonsContainerOnModal().scrollIntoView();
        buttonOnModal(buttonTitle).should('be.visible');
        buttonOnModal(buttonTitle).click();
        return this;
    };

    click_button_on_sweet_alert(buttonTitle) {
        buttonOnSweetAlert(buttonTitle).should('be.visible');
        buttonOnSweetAlert(buttonTitle).click();
        return this;
    };

    click_button(buttonTitle) {
        buttonByTitle(buttonTitle).should('be.visible');
        buttonByTitle(buttonTitle).should('be.enabled');
        buttonByTitle(buttonTitle).click('bottom');
        return this;
    };

    scroll_to_button(buttonTitle) {
        buttonByTitle(buttonTitle).scrollIntoView();
        return this;
    };

    scroll_to_element(elementTitle) {
        elementByTitle(elementTitle).scrollIntoView();
        return this;
    };

    hover_over_element(elementTitle) {
        elementByTitle(elementTitle).trigger('mouseover');
        return this;
    };

    scroll_and_click(buttonTitle) {
        buttonByTitle(buttonTitle).scrollIntoView();
        buttonByTitle(buttonTitle).should('be.visible');
        buttonByTitle(buttonTitle).should('be.enabled');
        buttonByTitle(buttonTitle).click('bottom');
        return this;
    };

    type_if_value_provided(element, value, typeaheadElement, aliasOfEndpointToBeAwaited) {
        if (value) {
            //  element().type(' ').clear()
            this.clearAndEnterValue(element, value)

            if (aliasOfEndpointToBeAwaited) {
                //this.wait_response_from_API_call(aliasOfEndpointToBeAwaited)
                this.wait_until_spinner_disappears();
            }

            if (typeaheadElement) {
                this.pause(1)
                // element().type('{enter}')
                typeaheadElement().click();
                this.pause(0.5)
            }
        }
        return this;
    };

    type_if_values_provided(element_Value__stacks) {
        let self = this
        element_Value__stacks.forEach(function (stack) {
            // element_Value__stacks --> array that contains the following:
            // 0 (stack[0]): element selector
            // 1 (stack[1]): value to be entered
            // 2 (stack[2]): typeahead selector (optional)
            // 3 (stack[3]): aliasOfEndpointToBeAwaited (optional)

            if (stack[1]) {
                if (stack[2]) {
                    // stack[0]().clear().type(stack[1])
                    stack[0]().type(stack[1])
                    if (stack[3]) {
                        self.wait_response_from_API_call(stack[3])
                    }
                    self.pause(1)
                    stack[2]().click();
                    self.pause(0.5)
                } else {
                    self.clearAndEnterValue(stack[0], stack[1])
                }
            }
        })
        return this;
    };

    verify_value_if_provided(element, value) {
        if (value) {
            this.verify_value(element, value)
        }
        return this;
    };

    clear_all_fields(elementsArray) {
        elementsArray.forEach(function (element) {
            element().clear()
        })
    }

    edit_fields_if_new_values_provided(elementValuePairs) {
        let self = this
        elementValuePairs.forEach(function (pair) {
            if (pair[1]) {
                self.clearAndEnterValue(pair[0], pair[1])

                // if element is like Tag input field - just press enter
                if (pair[2] === '{enter}') {
                    pair[0]().type('{enter}');
                } else if (pair[2]) {
                    // if element is like typeahead input field - select value from dropdown
                    pair[2]().click();
                }
            }
        });
        return this;
    };

    enter_values_on_single_multi_select_typeahead_field(LabelValueArray) {
        if (LabelValueArray[1]) {
            // if there are multiple values in array, repeat the same action to enter all of them
            for (let i = 0; i < LabelValueArray[1].length; i++) {
                if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
                    this.define_API_request_to_be_awaited('GET',
                        'api/users/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + LabelValueArray[1][i].replace(/\s+/g, '%20'),
                        "getUserInTypeahead")
                    this.define_API_request_to_be_awaited('GET',
                        '/api/userGroups/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + LabelValueArray[1][i].replace(/\s+/g, '%20'),
                        "getUserGroupInTypeahead")
                }

                if (typeof LabelValueArray[0] === 'string' || LabelValueArray[0] instanceof String) {
                    typeaheadInputField(LabelValueArray[0]).clear().invoke('val', LabelValueArray[1][i]).trigger('input')
                } else {
                    LabelValueArray[0]().clear().invoke('val', LabelValueArray[1][i]).trigger('input')
                }

                if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
                    this.wait_response_from_API_call("getUserInTypeahead")
                    this.wait_response_from_API_call("getUserGroupInTypeahead")
                }

                cy.wait(200)
                highlightedOptionOnTypeahead().click({force: true})
                cy.wait(200)

            }
        }
        return this;
    };

    enter_values_on_several_multi_select_typeahead_fields(element_value_typeahead__stacks) {
        let that = this
        element_value_typeahead__stacks.forEach(function (stack) {
            // perform actions only if value is provided
            // for some optional fields it might be null -- e.g. D.generateNewDataSet(true) --> with 'setNullForDisabledFields'
            that.enter_values_on_single_multi_select_typeahead_field(stack)
        });
        return this;
    };

    enter_values_on_typeahead_fields(element_value_typeahead__stacks) {
        element_value_typeahead__stacks.forEach(function (stack) {
            if (stack[1]) {
                for (let i = 0; i < stack[1].length; i++) {
                    stack[0]().clear().invoke('val', stack[1]).trigger('input')
                    highlightedOptionOnTypeahead().click({force: true})
                }
            }
        });
        return this;
    };

    // verify_values_on_the_grid(headerValuePairs) {
    //     var self = this;
    //     headerValuePairs.forEach(function (pair) {
    //         if (pair[1] !== null) {
    //             self.verify_content_of_specific_cell_in_first_table_row(pair[0], pair[1])
    //         }
    //     });
    //     return this;
    // };

    verify_values_on_the_grid(headerValuePairs) {
        var self = this;
        headerValuePairs.forEach(function (pair) {
            if (pair[1] !== null) {
                self.verify_content_of_first_table_row_by_provided_column_title_and_value(pair[0], pair[1])
            }
        });
        return this;
    };

    verify_values_on_multiple_elements(element_value__stacks) {
        let self = this
        element_value__stacks.forEach(function (stack) {
            // element_Value__stacks --> array that contains the following:
            // 0 (stack[0]): element selector
            // 1 (stack[1]): expected value in the field
            // 2 (stack[2]): wider element container for specifying the selector more precisely
            if (stack[2]) {
                self.verify_value(stack[0](stack[2]), stack[1])
            } else if (stack[1]) {
                self.verify_value(stack[0], stack[1])
            }
        });
        return this;
    };

    verify_text_on_multiple_elements(element_value__stacks) {
        let self = this
        element_value__stacks.forEach(function (stack) {
            // element_Value__stacks --> array that contains the following:
            // 0 (stack[0]): element selector
            // 1 (stack[1]): expected value in the field
            // 2 (stack[2]): wider element container for specifying the selector more precisely
            if (stack[2]) {
                self.verify_text(stack[0](stack[2]), stack[1])
            } else if (stack[1]) {
                self.verify_text(stack[0], stack[1])
            }
        });
        return this;
    };

    verify_multiple_input_values_in_one_container(container, arrayOfProperties) {
        let i = 0;
        arrayOfProperties.forEach(function (prop) {
            if (prop) {
                container().find('input').eq(i).invoke('val').should('contain', prop);
            }
            i++
        });
        return this;
    };

    verify_multiple_textarea_values_in_one_container(container, arrayOfProperties) {
        let i = 0;
        arrayOfProperties.forEach(function (prop) {
            if (prop) {
                container().find('textarea').eq(i).invoke('val').should('contain', prop);
            }
            i++
        });
        return this;
    };

    verify_multiple_text_values_in_one_container(container, arrayOfProperties) {
        container().should('exist');
        arrayOfProperties.forEach(function (prop) {
            if (prop !== null) {
                if (prop === '') {
                    container({timeout: 5000}).invoke('text').should('eq', prop);
                }
                {
                    container({timeout: 5000}).should('contain.text', prop);
                }
            }
        });
        return this;
    };

    verify_text_on_element_found_by_label(element, expectedText, elementLabel,) {
        if (this.isObject(expectedText)) {
            for (let property in expectedText) {
                element().invoke('val').then(function (textFound) {
                    element().invoke('text').should('contain', expectedText[property])
                })
            }
        } else if (Array.isArray(expectedText)) {
            expectedText.forEach(function (value) {
                element().invoke('text').then(function (textFound) {
                    element().invoke('text').should('contain', value)
                })
            })
        } else {
            element().invoke('text').then(function (textFound) {
                //  assert.include(textFound, expectedText);
                element().invoke('text').should('contain', expectedText)
            })
        }
        return this;
    };

    check_text(element, text) {
        if (element instanceof Function) {
            if (text === '') {
                element().invoke('text').should('eq', text)
            } else if (text) {
                element().should('contain.text', text)
            }
        } else {
            if (text === '') {
                element.invoke('text').should('eq', text)
            } else if (text) {
                element.should('contain.text', text)
            }
        }
    }

    check_value(element, value) {
        if (element instanceof Function) {
            if (value === '') {
                element().invoke('val').should('eq', value)
            } else if (value) {
                element().invoke('val').should('contain', value)
            }
        } else {
            if (value === '') {
                element.invoke('val').should('eq', value)
            } else if (value) {
                element.invoke('val').should('contain', value)
            }
        }
    }

    verify_text(element, expectedText) {
        let self = this
        if (this.isObject(expectedText)) {
            for (let property in expectedText) {
                self.check_text(element, expectedText[property])
            }
        } else if (Array.isArray(expectedText)) {
            expectedText.forEach(function (value) {
                self.check_text(element, value)
            })
        } else {
            self.check_text(element, expectedText)
        }
        return this;
    };

    verify_value(element, expectedText) {
        let self = this
        if (this.isObject(expectedText)) {
            for (let property in expectedText) {
                self.check_value(element, expectedText[property])
            }
        } else if (Array.isArray(expectedText)) {
            expectedText.forEach(function (value) {
                self.check_value(element, value)
            })
        } else {
            self.check_value(element, expectedText)
        }
        return this;
    };

    verify_exact_value(element, expectedText) {
        if (this.isObject(expectedText)) {
            for (let property in expectedText) {
                element().invoke('val').should('eq', expectedText[property])
            }
        } else if (Array.isArray(expectedText)) {
            expectedText.forEach(function (value) {
                element().invoke('val').should('eq', value)
            })
        }
        return this;
    };

    verify_text_regardless_of_the_DOM_structure(element, fullText) {
        element().invoke('text').then(function (text) {
            assert.equal(text, fullText);
        });
        return this;
    };

    verify_element_does_NOT_contain_text(element, text) {
        element().should('not.contain', text);
        return this;
    };

    verify_element_has_class(element, className) {
        element().should('have.class', className);
        return this;
    };

    verify_element_does_not_have_class(element, className) {
        element().should('not.have.class', className);
        return this;
    };

    click_element_if_has_a_class = function (elementAsFunction, className) {
        elementAsFunction.then(($el) => {
            if ($el.hasClass(className)) {
                element.click();
            }
        });
    };

    click_element_if_has_a_class_= function (element, className) {
        element().then(($el) => {
            if ($el.hasClass(className)) {
                element().click();
            }
        });
    };

    click_element_if_does_NOT_have_a_class = function (element, className) {
        element.then(($el) => {
            if (!$el.hasClass(className)) {
                element.click();
            }
        });
    };

    verify_selected_option_on_Checkbox_list(parentContainer, selectedOptionLabel, checkboxListLabel = 'Checkbox List') {
        parentContainer().should('exist');
        if (selectedOptionLabel) {
            parentContainer().contains(checkboxListLabel).parent().contains(selectedOptionLabel).parent().find('input').should('be.checked');
        }
        return this;
    };

    verify_if_Checkbox_is_selected(parentContainer, isSelected, checkboxLabel = 'Checkbox') {
        parentContainer().should('exist');
        if (isSelected) {
            parentContainer().contains(checkboxLabel).parent().find('input[type="checkbox"]').should('be.checked');
        } else {
            parentContainer().contains(checkboxLabel).parent().find('input[type="checkbox"]').should('not.be.checked');
        }

        return this;
    };

    getArrayWithoutSpecificValue(arrayOfAllValues, arrayOfValuesToRemove) {
        for (let i = 0; i < arrayOfValuesToRemove.length; i++) {
            var index = arrayOfAllValues.indexOf(arrayOfValuesToRemove[i]);
            if (index > -1) {
                arrayOfAllValues.splice(index, 1);
            }
        }
        return arrayOfAllValues;
    }

    verify_selected_option_on_Radiobutton_list(parentContainer, selectedOptionLabel, radiobuttonListLabel = 'Radiobutton List') {
        parentContainer().should('exist');
        if (selectedOptionLabel) {
            parentContainer().contains(radiobuttonListLabel).parent().contains(selectedOptionLabel).parent().find('input').should('be.checked');
        }
        return this;
    };

    verify_selected_option_on_Select_list(parentContainer, selectedOptionLabel, selectListLabel = 'Select List') {
        parentContainer().should('exist');
        if (selectedOptionLabel) {
            parentContainer().contains(selectListLabel).parent().find('[selected="selected"]').should('contain', selectedOptionLabel);
        }
        return this;
    };

    verify_value_in_input_filed_found_by_its_label(parentContainer, fieldLabel, fieldValue) {
        parentContainer().should('exist');
        if (fieldValue) {
            this.find_field_by_exactly_matching_text(parentContainer, fieldLabel).parent().find('input').invoke('val').should('contain', fieldValue);
        }
        return this;
    };

    click(text, container, elementSequentialId = 1) {

        let elmIndex = elementSequentialId - 1;

        if (container) {
            container.then(parentElm =>
                cy.findAllByText(text, {container: parentElm}).eq(elmIndex).click()
            )
        } else {
            cy.findAllByText(text).eq(elmIndex).should('be.visible');
            cy.findAllByText(text).eq(elmIndex).click();
        }
        return this;
    };

    click_Checkbox(label) {
        checkboxFieldFoundByLabel(label).should('be.enabled');
        checkboxFieldFoundByLabel(label).click();
        return this;
    };

    click_Ok() {
        okButton().should('be.enabled');
        okButton().click();
        return this;
    };

    click_Save() {
        saveButton().should('be.enabled');
        saveButton().click();
        return this;
    };

    get_next_item_id_for_case_and_Org(caseNumber) {
        cy.getLocalStorage("currentUserSettings").then(currentUserSettings => {
            if (!JSON.parse(currentUserSettings).isOrgAdmin) {
                authApi.get_tokens_without_page_reload(S.userAccounts.orgAdmin)
            }
        })
        casesApi.fetch_current_case_data(caseNumber);
        orgSettingsApi.get_current_org_settings();

        cy.getLocalStorage("orgSettings").then(orgSettings => {
            cy.getLocalStorage("currentCase").then(currentCase => {
                orgSettings = JSON.parse(orgSettings);
                currentCase = JSON.parse(currentCase).cases[0];

                cy.setLocalStorage('nextItemId_inOrg', orgSettings.nextItemId)
                cy.setLocalStorage('nextItemId_onCase', currentCase.nextItemId)
            });
        });
    }

    click_Edit() {
        editButton().should('be.enabled');
        editButton().click();
        saveButton().should('be.visible');
        return this;
    };

    click_Delete() {
        deleteButton().click();
        return this;
    };

    click_Actions() {
        this.pause(1)
        this.wait_until_modal_disappears()
        this.wait_until_spinner_disappears()
        //cy.contains('Actions').click()
        actionsButton().click()
        return this;
    };

    verify_Save_button_is_disabled() {
        saveButton().should('not.be.enabled');
        return this;
    };

    verify_save_auto_dispo_button_is_disabled() {
        saveAutoDispoButton().should('not.be.enabled');
        return this;
    }

    verify_Ok_button_is_disabled() {
        okButton().should('not.be.enabled');
        return this;
    };

    click_link(linkText, container) {
        if (container) {
            container.contains(linkText).click();
        } else {
            linkByText(linkText).click();
        }
        return this;
    };

    click_element_containing_link(linkText, parentElementTag = 'li') {
        linkWrappedInElement(linkText, parentElementTag).click();
        return this;
    };

    click_element_on_active_tab(elementTitle) {
        elementOnActiveTab(elementTitle).should('be.visible');
        elementOnActiveTab(elementTitle).click();
        return this;
    };

    click_element_on_grid_container(elementTitle) {
        elementOnGridContainer(elementTitle).should('be.visible');
        elementOnGridContainer(elementTitle).click();
        return this;
    };

    click_button_on_active_tab(buttonTitle) {
        buttonOnActiveTab(buttonTitle).should('be.visible');
        buttonOnActiveTab(buttonTitle).click();
        return this;
    };

    press_ENTER(element) {
        element().type('{enter}');
        return this;
    };

    press_ENTER_on_field_found_by_label(label) {
        inputFieldFoundByLabel(label).type('{enter}');
        return this;
    };

    verify_content_of_PDF_file() {
        cy.readFile('src/fixtures/files/PDF_file.pdf', 'binary').then((pdfData) => {
            cy.task('verify_PDF_content', {data: pdfData, pageNumber: 3}).then(textContent => {

                cy.log(JSON.stringify(textContent))
                const array = textContent.items;

                const names = array.filter(obj => obj.str !== '')
                    .map(obj => obj.str);

                const concatenatedNames = names.join(', ');

                console.log(concatenatedNames);

                cy.wrap(JSON.stringify(textContent))
                    //   cy.wrap(JSON.stringify(concatenatedNames))
                    .should('contain', 'sapien');
                //   cy.wrap(textContent.items).each((item) => {
                //       cy.wrap(JSON.stringify(item)).should('contain', 'Lorem');
                //   });
            });
        });
    }

    open_url_and_wait_all_GET_requests_to_finish(urlToOpen, partOfRequestUrl) {
        cy.server();
        this.define_API_request_to_be_mocked('GET', partOfRequestUrl)
        cy.intercept('GET', '**').as('all_GET_Requests').then(function () {
            cy.visit(urlToOpen);
        })
        cy.wait('@all_GET_Requests')
        this.wait_response_from_API_call(partOfRequestUrl)
        return this;
    };

    define_API_request_to_be_awaited(methodType, partOfRequestUrl, alias) {
        if (!alias) {
            alias = partOfRequestUrl;
        }
        cy.intercept(methodType, '**' + `${partOfRequestUrl}` + '**', (req) => {
            req.continue(); // Explicitly pass through to backend
        }).as(alias);
        return this;
    }

    define_API_request_to_be_mocked(methodType, partOfRequestUrl, alias, response) {
        alias = alias || partOfRequestUrl;

        cy.intercept(
            {
                method: methodType,
                url: '/api/' + partOfRequestUrl
            },
            response
        ).as(alias);
        return this;
    };

    wait_response_from_API_call(alias, status = 200, propertyToSaveToLocalStorage) {
        cy.wait('@' + alias)
            .then(interception => {
                // //cy.log('Intercepted response is ' + JSON.stringify(interception))
                let responseStatus = interception.status || interception.response.statusCode
                expect(responseStatus).to.equal(status);
                if (propertyToSaveToLocalStorage) {
                    cy.setLocalStorage(propertyToSaveToLocalStorage, JSON.stringify(interception.response.body));
                    if (S.selectedEnvironment[propertyToSaveToLocalStorage]) {
                        S.selectedEnvironment[propertyToSaveToLocalStorage] = Object.assign(S.selectedEnvironment[propertyToSaveToLocalStorage], interception.response.body);
                    }
                }
            })
        return this;
    };

    define_all_dashboard_GET_requests() {
        dashboardGetRequests.forEach(request => {
            this.define_API_request_to_be_mocked('GET', request)
        })
    };

    wait_all_dashboard_GET_requests() {
        // dashboardGetRequests.forEach(request => {
        //     this.wait_response_from_API_call(request)
        // })
    };

    set_visibility_of_table_column(columnName, shouldBeVisible) {
        cy.get('thead').invoke('text').then((text) => {
            if (shouldBeVisible && !text.includes(columnName)) {
                this.click_element_on_active_tab(C.buttons.menuCustomization);
                this.click_element_on_active_tab(C.buttons.options);
                this.click(columnName, gridOptionsDropdown());
            } else if (!shouldBeVisible && text.includes(columnName)) {
                this.click_element_on_active_tab(C.buttons.menuCustomization);
                this.click_element_on_active_tab(C.buttons.options);
                this.click(columnName, gridOptionsDropdown());
            } else {

            }
        })

        // this.click_element_on_active_tab(C.buttons.menuCustomization);
        // this.click_element_on_active_tab(C.buttons.options);
        //
        // columnVisibilityIndicatorOnOptionsDropdown(columnName).invoke('attr', 'class').then((classNames) => {
        //     if (shouldBeVisible && classNames.toString().includes('glyphicon-remove')) {
        //         this.click(columnName, gridOptionsDropdown());
        //     } else if (!shouldBeVisible && classNames.toString().includes('glyphicon-ok')) {
        //         this.click(columnName, gridOptionsDropdown());
        //     } else {
        //         this.click_element_on_active_tab(C.buttons.menuCustomization);
        //     }
        // });
        return this;
    };

    verify_email_content_old(subject, content, shouldSaveLinkToLocalStorage = false) {
        cy.wait(3000);

        let emailAccount = S.gmailAccount

        cy.task('fetchGmailUnseenMails', {
            username: emailAccount.email,
            password: emailAccount.password,
            markSeen: true
        }).then(mails => {

            var last_unread_email = mails[0];

            assert.isOk(last_unread_email.from === "do_not_reply@trackerproducts.com");

            if (shouldSaveLinkToLocalStorage) {
                let valueToSave = JSON.stringify(last_unread_email.body).match('href=\'' + "(.*)" + '\'>')[1];
                cy.setLocalStorage('linkFromEmail', valueToSave);
            }

            //cy.log('EMAIL IS ' + JSON.stringify(last_unread_email))
            expect(last_unread_email.subject).to.contain(subject);
            expect(last_unread_email.body.replace(/<(.|\n)*?>/g, '').replace(/[\r\n]+/g, " ")).to.contain(content.replace(/<(.|\n)*?>/g, '').replace(/[\r\n]+/g, " "));
        });
        return this;
    };

    verify_email_content(recipient, subject, content, numberOfExpectedEmails = 1, markSeen = true, shouldSaveLinkToLocalStorage) {
        let self = this
        this.pause(1)
        self.fetch_emails(markSeen).then(function (emails) {
            D.unreadEmails = emails

            cy.log('EMAIL TEMPLATE ' + content)
            cy.log('EMAIL received ' + JSON.stringify(emails))
            // if (emails[numberOfExpectedEmails - 1]) {
            self.verify_content_of_email_for_specific_recipient(recipient, subject, content, shouldSaveLinkToLocalStorage)
            // } else {
            //     self.pause(5)
            //     self.fetch_emails(markSeen).then(function (emails) {
            //         D.unreadEmails = emails
            //         self.verify_content_of_email_for_specific_recipient(recipient, subject, content, shouldSaveLinkToLocalStorage)
            //     })
            // }
        })
        return this;
    };

    verify_no_new_email_arrived_with_specific_subject(recipient, subject, content, numberOfExpectedEmails = 1, markSeen = true, shouldSaveLinkToLocalStorage) {
        let self = this
        D.unreadEmail1 = 'No Emails'
        D.unreadEmailsForSpecificRecipient = []

        self.fetch_emails(markSeen).then(function (emails) {
            D.unreadEmails = emails
            if (D.unreadEmails[0]) {
                D.unreadEmails.forEach(function (unreadEmail) {
                    if (JSON.stringify(unreadEmail.to).includes(recipient)) {
                        D.unreadEmailsForSpecificRecipient.push(unreadEmail)
                    }
                })

                D.unreadEmailsForSpecificRecipient.forEach(function (unreadEmail) {
                    if ((JSON.stringify(unreadEmail.subject)).includes(subject)) {
                        D.unreadEmail1 = unreadEmail
                        expect(D.unreadEmail1).to.equal('Email has arrived but it was not expected in this scenario!')
                    }
                })
            }
            expect(D.unreadEmail1).to.equal('No Emails')
        })
        return this;
    };

    clear_gmail_inbox() {
        D.unreadEmail1 = ''
        D.unreadEmailsForSpecificRecipient = ''

        cy.task('fetchGmailUnseenMails', {
            username: S.gmailAccount.email,
            password: S.gmailAccount.password,
            markSeen: true
        });
        return this;
    };

    fetch_emails(markSeen) {
        return cy.task('fetchGmailUnseenMails', {
            username: S.gmailAccount.email,
            password: S.gmailAccount.password,
            markSeen: markSeen
        })
    };

    verify_content_of_email_for_specific_recipient(recipient, subject, content, shouldSaveLinkToLocalStorage) {
        if (D.unreadEmails[0]) {
            D.unreadEmails.forEach(function (unreadEmail) {
                //cy.log('So far, those emails have arrived ' + JSON.stringify(unreadEmail.subject))

                if (JSON.stringify(unreadEmail.to).includes(recipient)) {
                    D.unreadEmailsForSpecificRecipient.push(unreadEmail)
                }
            })

            D.unreadEmailsForSpecificRecipient.forEach(function (unreadEmail) {
                if ((JSON.stringify(unreadEmail.subject)).includes(subject)) {
                    D.unreadEmail1 = unreadEmail
                }
            })

            if (D.unreadEmail1.from) {
                expect(D.unreadEmail1.from).to.contain("do_not_reply@trackerproducts.com")
                if (D.unreadEmail1.subject) expect(D.unreadEmail1.subject).to.include(subject)

                if (shouldSaveLinkToLocalStorage) {
                    let linkToSave = JSON.stringify(D.unreadEmail1).match('href=\'' + "(.*)" + '\'>')[1];
                    cy.setLocalStorage('linkFromEmail', linkToSave);
                    cy.log('linkToSave' + linkToSave)
                    //cy.log('link from email is ' + linkToSave)
                }

                const emailBody = JSON.stringify(D.unreadEmail1.body).replace(/=\\r\\n/g, '').replace(/\\r\\n/g, '').replace(/=\\r\\n/g, '')

                // if (Array.isArray(content)) {
                //     content.forEach(function (contentPart) {
                //         expect(emailBody).to.include(contentPart)
                //     })
                // } else {
                //     expect(emailBody).to.include(content)
                // }
            }
        } else {
            assert.isTrue(false, 'The expected email did not arrive  _____ Content: ' + content)
        }
    };

    verify_title_on_active_tab(tabTitle) {
        active_tab_title().should('contain', tabTitle);
        return this;
    };

    select_tab(tabTitle) {

        let tab = title => (tabTitle === C.tabs.history) ? historyTab() : specificTab(title);

        tab(tabTitle).should('be.visible');
        tab(tabTitle).click();
        tab(tabTitle).should('have.class', 'active');
        return this;
    };

    select_location(el, name) {
        if (name) {
            el().type(name.substr(0, 6))
            locationPin(name).click();
        }
        return this;
    };

    select_checkbox_on_first_table_row() {
        this.wait_until_spinner_disappears()
        checkboxOnFirstTableRow().should('be.enabled');
        checkboxOnFirstTableRow().click();
        return this;
    };

    click_checkbox_to_select_all_rows() {
        this.wait_until_spinner_disappears()
        this.pause(1)
        checkboxToSelectAll().should('be.enabled');
        checkboxToSelectAll().click();
        return this;
    };

    click_checkbox_to_select_specific_rows(rowNumbers) {
        this.wait_until_spinner_disappears()
        this.pause(1)

        checkboxToSelectAll().click({force:true})
        this.pause(0.3)
        checkboxToSelectAll().click({force:true})

        rowNumbers.forEach(row => {
            // checkboxOnSpecificTableRow(row).should('be.enabled');
            checkboxOnSpecificTableRow(row).click();
        })
        return this;
    };

    select_checkbox_on_specific_table_row(rowNumber) {
        checkboxOnSpecificTableRow(rowNumber).click();
        return this;
    };

    select_checkbox_on_specific_table_row_on_modal(rowNumber) {
        modal().should('be.visible');
        firstRowInResultsTableOnModal().should('be.visible');
        checkboxOnTableRowOnModal(rowNumber).click();
        return this;
    };

    verify_results_count(totalCount, pageSize = 25) {
        resultsEntriesCount().should('contain', `Showing 1 to ${pageSize} of ${totalCount} rows`)
        return this;
    };

    select_checkbox_for_all_records() {
        this.wait_element_to_be_visible(firstRowInResultsTable);
        checkboxOnTableHeader().click();
        return this;
    };

    click_option_on_expanded_menu(option) {
        optionOnExpandedMenu(option).should('be.visible');
        optionOnExpandedMenu(option).click();
        this.wait_until_spinner_disappears();
        return this;
    };

    click_option_on_typeahead(option) {
        optionOnTypeahead(option).should('be.visible');
        optionOnTypeahead(option).click();
        return this;
    };

    click_highlighted_option_on_typeahead() {
        highlightedOptionOnTypeahead().should('be.visible');
        highlightedOptionOnTypeahead().click();
        return this;
    };

    select_dropdown_option_on_modal(option) {
        dropdownOnModal().select(option);
        return this;
    };

    enter_notes_on_modal(note) {
        notesOnModal().type(note);
        return this;
    };

    enter_note_on_modal(note) {
        noteOnModal().type(note);
        return this;
    };

    verify_number_of_required_fields_marked_with_asterisk(count) {
        asterisks().should('have.length', count)
        return this;
    };

    verify_table_content_on_modal(textToBePresent) {
        tableOnModal().should('contain', textToBePresent);
        return this;
    };

    verify_modal_content(textToBePresent) {
        modal().should('be.visible');

        if (Array.isArray(textToBePresent)) {
            textToBePresent.forEach(label =>
                this.verify_text(modal, label))
        } else {
            this.verify_text(modal, textToBePresent)
        }
        return this;
    };

    verify_text_above_modal_footer(textToBePresent) {
        modalBodySectionAboveFooter().scrollIntoView();
        modalBodySectionAboveFooter().should('be.visible');

        if (Array.isArray(textToBePresent)) {
            textToBePresent.forEach(label =>
                this.verify_text_regardless_of_the_DOM_structure(modalBodySectionAboveFooter, label))
        } else {
            this.verify_text_regardless_of_the_DOM_structure(modalBodySectionAboveFooter, textToBePresent)
        }
        return this;
    };

    verify_messages_on_sweet_alert(messagesArray) {
        sweetAlert().should('be.visible');
        messagesArray.forEach(msg => sweetAlert().should('contain', msg));
        return this;
    };

    isObject(variable) {
        return Object.prototype.toString.call(variable) === '[object Object]'
    }

    click_table_cell_based_on_column_name_and_unique_value_in_the_row(columnName, uniqueValueInRow, tableIndex) {

        tableColumnFoundByText(columnName, tableIndex).prevAll()
            .then(columnsBefore => {
                const columnIndex = Cypress.$(columnsBefore).length;

                //cy.log('column index is' + columnIndex)

                tableRowFoundByUniqueTextInAnyCell(uniqueValueInRow, tableIndex).find('td').eq(columnIndex).click();
            });
        return this;
    };

    click_table_matrix_cell_based_on_column_name_and_unique_value_in_the_row(columnName, uniqueValueInRow, tableIndex, fieldType = 'input') {

        tableColumnFoundByText(columnName, tableIndex).prevAll()
            .then(columnsBefore => {
                const columnIndex = Cypress.$(columnsBefore).length;

                // there is always one 'th' cell in front of the 'td' in matrix structure, so the index caught above is off by 1
                tableRowFoundByUniqueTextInAnyCell(uniqueValueInRow, tableIndex).find('td').eq(columnIndex - 1).find(fieldType).click();
            });
        return this;
    };

    verify_content_of_first_row_in_results_table(content) {

        if (this.isObject(content)) {
            for (let property in content) {
                firstRowInResultsTable().should('contain', content[property]);
            }
        } else if (Array.isArray(content)) {
            content.forEach(function (value) {
                firstRowInResultsTable().should('contain', value);
            })
        } else {
            firstRowInResultsTable().should('contain', content);
        }
        return this;
    };

    verify_content_of_results_table(content) {

        if (this.isObject(content)) {
            for (let property in content) {
                dataGrid().should('contain', content[property]);
            }
        } else {
            dataGrid().should('contain', content);
        }
        return this;
    };

    verify_content_of_last_row_in_results_table(content) {

        if (this.isObject(content)) {
            for (let property in content) {
                lastRowInResultsTable().should('contain', content[property]);
            }
        } else {
            lastRowInResultsTable().should('contain', content);
        }
        return this;
    };

    verify_content_of_sequential_rows_in_results_table(arrayOfObjects) {
        for (let i = 0; i < arrayOfObjects.length; i++) {
            for (let property in arrayOfObjects[i]) {
                specificRowInResultsTable(i).should('contain', arrayOfObjects[i][property]);
            }
        }
        return this;
    };

    // verify_content_of_specific_cell_in_first_table_row(columnTitle, cellContent, headerCellTag = 'th') {
    //
    //     firstRowInResultsTable().within(($list) => {
    //         if (cellContent) {
    //             if (this.isObject(cellContent)) {
    //                 for (let property in cellContent) {
    //                     resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
    //                         cy.get('td').eq(i).invoke('text').then(function (textFound) {
    //                             assert.include(textFound, cellContent[property]);
    //                         })
    //
    //                     })
    //                 }
    //             } else if (Array.isArray(cellContent)) {
    //                 cellContent.forEach(function (value) {
    //                     resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
    //                         cy.get('td').eq(i).invoke('text').then(function (textFound) {
    //                             assert.include(textFound, value);
    //                         })
    //                     })
    //                 })
    //             } else {
    //                 resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
    //                     cy.get('td').eq(i).invoke('text').then(function (textFound) {
    //                         assert.include(textFound, cellContent.toString().trim());
    //                     })
    //                 });
    //             }
    //         }
    //     });
    //     return this;
    // };

 //need a review for this replaced method -> old one is above
    verify_content_of_specific_cell_in_first_table_row(columnTitle, cellContent, headerCellTag = 'th') {
        firstRowInResultsTable().within(($list) => {
            if (cellContent) {
                if (this.isObject(cellContent)) {
                    for (let property in cellContent) {
                        resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
                            cy.get('td').eq(i).should(($cell) => {
                                expect($cell.text()).to.include(cellContent[property]);
                            });
                        });
                    }
                } else if (Array.isArray(cellContent)) {
                    cellContent.forEach(function (value) {
                        resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
                            cy.get('td').eq(i).should(($cell) => {
                                expect($cell.text()).to.include(value);
                            });
                        });
                    });
                } else {
                    resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
                        cy.get('td').eq(i).should(($cell) => {
                            expect($cell.text().trim()).to.include(cellContent.toString().trim());
                        });
                    });
                }
            }
        });
        return this;
    };



    verify_content_of_first_table_row_by_provided_column_title_and_value(columnTitle, cellContent, headerCellTag = 'th') {
        let self = this
        if (Array.isArray(cellContent)) {
            resultsTableHeader().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
                tableStriped().find('td').eq(i).invoke('text').then(function (textFound) {
                    cellContent.forEach(function (value) {
                        if (value === '') {
                            tableStriped().find('td').eq(i).invoke('text').should('eq', value.toString().trim())
                        } else if (value) {
                            tableStriped().find('td').eq(i).should('contain.text', value.toString().trim())
                        }
                        // if (value === '') {
                        //     assert.equal(textFound.toString().trim(), value.toString().trim());
                        // } else if (value) {
                        //     assert.include(textFound, value);
                        // }
                    })
                });
            });
        } else {
            resultsTableHeader().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
                tableStriped().find('td').eq(i).invoke('text').then(function (textFound) {
                    self.verify_text(tableStriped().find('td').eq(i), cellContent)
                })
            });
        }
        return this;
    };

    verify_content_of_first_row_in_results_table_on_active_tab(content) {
        if (Array.isArray(content)) {
            content.forEach(value =>
                firstRowInResultsTableOnActiveTab().should('contain', value))
        } else {
            firstRowInResultsTableOnActiveTab().should('contain', content);
        }
        return this;
    };

    select_row_on_the_grid_that_contains_specific_value(value) {
        tableBody().within(($tableBody) => {
            cy.contains('td', value).parent('tr').invoke('index').then((i) => {
                cy.get('tr').eq(i).find('.bg-grid-checkbox').click()
            })
        })
        return this;
    };

    select_checkbox_on_first_table_row_on_active_tab() {
        checkboxOnFirstRowInResultsTableOnActiveTab().click();
        return this;
    };

    verify_element_is_visible(elementTitle) {
        cy.contains(elementTitle).should('be.visible');
        return this;
    };

    verify_text_is_not_visible(elementTitle) {
        cy.contains(elementTitle).should('not.be.visible');
        return this;
    };

    verify_element_is_not_visible(element) {
        element(10000).should('not.be.visible');
        return this;
    };

    verify_element_is_enabled(elementTitle) {
        cy.contains(elementTitle).should('be.enabled');
        return this;
    };

    verify_element_is_not_enabled(elementTitle) {
        cy.contains(elementTitle).should('be.visible');
        cy.contains(elementTitle).should('not.be.enabled');
        return this;
    };

    verify_Actions_option_is_disabled_and_has_a_tooltip(option, tooltip) {
        this.verify_element_is_not_enabled(option)
            .hover_over_element(option)
            .verify_element_is_visible(tooltip)
        return this;
    };

    reload_page() {
        cy.reload();
        this.pause(2)
        return this;
    };

    wait_all_GET_requests() {
        //   cy.wait('@all_GET_Requests')
        return this;
    };

    open_base_url() {
        cy.visit(S.base_url);
        return this
    };

    open_Dashboard() {
        cy.visit(S.base_url);
        this.verify_text_is_present_on_main_container('Welcome')
        return this
    };

    open_case_url(existingCaseId) {
        let url = `${S.base_url}/#/cases/${existingCaseId.toString()}/view`;

        this.open_url_and_wait_all_GET_requests_to_finish(url, `/cases/${existingCaseId.toString()}`);
        //cy.log('Opening Case URL: ' + url);
        return this;
    };

    open_item_url(existingItemId) {
        let url = `${S.base_url}/#/items/${existingItemId.toString()}/view`;
        //cy.log('Opening Item URL: ' + url);
        cy.visit(url);

        return this;
    };

    open_person_url(existingPersonId) {
        let url = `${S.base_url}/#/people/${existingPersonId.toString()}/view`;
        //cy.log('Opening Peron URL: ' + url);
        cy.visit(url);

        return this;
    };

    open_newly_created_task_via_direct_link() {
        cy.getLocalStorage("newTaskId").then(newTaskId => {
            let url = `${S.base_url}/#/view-task/` + newTaskId;
            cy.visit(url);
        })
        return this;
    };

    open_newly_created_case_via_direct_link() {
        cy.getLocalStorage("newCase").then(newCase => {
            newCase = JSON.parse(newCase);

            //cy.log('Opening Case URL: ' + S.base_url + '/#/cases/' + newCase.id.toString() + '/view')
            cy.server();
            cy.intercept(S.api_url + '/api/organizations/useCaseLevelPermissions').as('getSettingsOfCLP');

            cy.visit(S.base_url + '/#/cases/' + newCase.id.toString() + '/view')
            //   cy.wait('@getSettingsOfCLP');
        });
        return this;
    };

    open_newly_created_item_via_direct_link(isItemRestricted = false) {
        cy.getLocalStorage("newItem").then(newItem => {
            newItem = JSON.parse(newItem);
            //cy.log('Opening Item URL: ' + S.base_url + '/#/items/' + newItem.id.toString() + '/view');
            cy.visit(S.base_url + '/#/items/' + newItem.id.toString() + '/view');

            if (!isItemRestricted) {
                this.verify_text_is_present_on_main_container(C.labels.itemView.title);
            }
        });
        return this;
    };

    open_newly_created_person_via_direct_link() {
        cy.getLocalStorage("newPerson").then(newPerson => {
            newPerson = JSON.parse(newPerson);
            //cy.log('Opening Person URL: ' + S.base_url + '/#/people/' + newPerson.id.toString() + '/view');
            cy.visit(S.base_url + '/#/people/' + newPerson.id.toString() + '/view');
        });
        return this;
    };

    open_newly_created_task_via_direct_link() {
        cy.getLocalStorage("newTaskId").then(newTaskId => {
            //cy.log('Opening Task URL: ' + S.base_url + '/#/view-task/' + newTaskId);
            cy.visit(S.base_url + '/#/view-task/' + newTaskId);
        });
        return this;
    };

    generate_excel_file(fileName, dataObject) {
        cy.generate_excel_file(fileName, dataObject);
        return this;
    };

    log_title(test) {

        // cy.log(
        //     `
        //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  |   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
        //  |   |                            ${test.test.title}                                                                                    |  |
        //  |   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  |
        //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        return this;
    };

    hexStringToByte(str) {
        if (!str) {
            return new Uint8Array();
        }

        var a = [];
        for (var i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }
        return new Uint8Array(a);
    }

    upload_file_and_verify_toast_msg(fileName, successMessage = 'Saved', timeoutInMinutes) {
        const filePath = 'files/' + fileName;
        const filename = filePath.split('/').pop();

        uploadFileInput().then(($input) => {
            cy.fixture(filePath, 'hex').then((fileHex) => {
                //convert hex string to a blob
                const fileBytes = this.hexStringToByte(fileHex);
                const testfile = new File([fileBytes], filename
                    //, {type: fileType}
                );
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testfile);
                const input = $input[0];
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change'));
                this.verify_toast_message(successMessage, false, timeoutInMinutes);
            });
        });
        return this;
    }

    wait_search_criteria_to_be_visible() {
        this.searchParametersAccordion().should('be.visible');

        this.mainContainer().then(parentElm =>
            cy.findByText(C.buttons.search, {container: parentElm}).should('not.be.disabled')
        );
        return this;
    };

    wait_element_to_be_visible(element) {
        element().should('be.visible');
        return this;
    };

    check_if_Review_Date_and_Notes_fields_are_present(shouldBePresent) {
        if (shouldBePresent) {
            this.verify_text_is_present_on_main_container('Review Date')
                .verify_text_is_present_on_main_container('Review Date Notes')
        } else {
            this.verify_text_is_NOT_present_on_main_container('Review Date')
                .verify_text_is_NOT_present_on_main_container('Review Date Notes')
        }
        return this;
    };

    wait_element_to_become_invisible(element) {
        element().should('not.be.visible');
        return this;
    };

    wait_element_to_be_enabled(element) {
        element().should('be.enabled');
        return this;
    };

    wait_until_spinner_disappears() {
        bodyContainer().should('have.class', 'pace-done');
        return this;
    };

    wait_until_label_appears(text) {
        cy.contains(text).should('be.visible');
        return this;
    };

    wait_until_label_disappears(text, timeoutInSeconds) {
        this.pause(3)
        cy.contains(text, {timeout: (timeoutInSeconds * 1000)}).should('not.exist');
        return this;
    };

    wait_until_modal_disappears(text, timeoutInSeconds) {
        modal().should('not.exist');
        return this;
    };

    turn_ON_the_toggle_for_specific_field_on_modal(fieldLabel, parentElementTag = 'div') {
        parentContainerFoundByInnerLabelOnModal(fieldLabel, parentElementTag)
            .find('.toggle-off').last()
            .invoke('attr', 'class')
            .then((classNames) => {
                if (classNames.toString().includes('active')) {
                    parentContainerFoundByInnerLabelOnModal(fieldLabel, parentElementTag).find('.toggle-handle').last().click();
                }
            });

        parentContainerFoundByInnerLabelOnModal(fieldLabel, parentElementTag)
            .find('.toggle').last().should('not.have.class', 'off');
        return this;
    }

    check_asterisk_is_shown_for_specific_field_on_modal(fieldLabel, parentElementTag = 'div') {
        parentContainerFoundByInnerLabelOnModal(fieldLabel, parentElementTag)
            .find('[ng-message="required"]').scrollIntoView().should('be.visible');
        return this;
    }

    turn_ON_the_toggle_for_fields_on_modal(labelsArray) {
        labelsArray.forEach(fieldLabel => {
            this.turn_ON_the_toggle_for_specific_field_on_modal(fieldLabel)
        })
        return this;
    }

    turnOnToggleAndReturnParentElement(label) {
        return parentContainerFoundByInnerLabelOnModal(label)
            .find('.toggle-handle').last().click()
            .parents('.form-group').first()
    }

    turnOnToggleAndSelectDropdownOption(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('select').first()
            .select(value)
    }

    turnOnToggleAndSelectTypeaheadOption(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .type(value)
        highlightedOptionOnTypeahead().click()
    }

    turnOnToggleAndSelectTypeaheadOptionsOnMultiSelectField(label, value) {
        if (Array.isArray(value)) {
            for (let i = 0; i < value; i++) {
                this.turnOnToggleAndSelectTypeaheadOption(label, value)
            }
        } else {
            this.turnOnToggleAndSelectTypeaheadOption(label, value)
        }
    }

    turnOnToggleAndEnterValueInTextarea(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('textarea').first()
            .type(value)
    }

    turnOnToggleEnterValueAndPressEnter(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .clear()
            //    .type(value)
            .invoke('val', value).trigger('input')
            .type('{enter}')
    }

    turnOnToggleEnterValueAndWaitApiRequestToFinish(label, value, partOfApiRequest) {
        this.define_API_request_to_be_awaited('GET', partOfApiRequest)
        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .clear()
            .invoke('val', value).trigger('input')
        this.wait_response_from_API_call(partOfApiRequest)
        orgTagIconOnTagsTypeaheadList().click()
    }

    findElementByLabelAndSelectDropdownOption(label, value) {
        parentContainerFoundByInnerLabelOnModal(label, '.form-group')
            .find('select').first()
            .select(value)
    }

    findElementByLabelAndSelectTypeaheadOption(label, value) {
        parentContainerFoundByInnerLabelOnModal(label, '.form-group')
            .find('input').first()
            .type(value)
        highlightedOptionOnTypeahead().click()
    }

    findElementByLabelAndSelectTypeaheadOptionsOnMultiSelectField(label, value) {
        if (Array.isArray(value)) {
            for (let i = 0; i < value; i++) {
                this.findElementByLabelAndSelectTypeaheadOption(label, value)
            }
        } else {
            this.findElementByLabelAndSelectTypeaheadOption(label, value)
        }
    }

    findElementByLabelAndEnterValueInTextarea(label, value) {
        parentContainerFoundByInnerLabelOnModal(label, '.form-group')
            .find('textarea').first()
            .type(value)
    }

    findElementByLabelEnterValueAndPressEnter(label, value) {
        parentContainerFoundByInnerLabelOnModal(label, 'form')
            .find('input').first()
            .clear()
            .type(value)
            .type('{enter}')
    }

    enable_Case_Officers_overwrite() {
        caseOfficersOverwrite().click()
        return this
    }

    enable_Tags_overwrite() {
        tagsOverwrite().click()
        return this
    }

    turn_on_and_enter_values_to_all_fields_on_modal(labelsArray, valuesArray) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Offense Type', ''].some(v => label === v)) {
                this.turnOnToggleAndSelectDropdownOption(label, value)

            } else if (['Tags'].some(v => label === v)) {
                this.turnOnToggleEnterValueAndWaitApiRequestToFinish(label, value, 'tagTypeahead')

            } else if (['Status'].some(v => label === v)) {
                this.turnOnToggleAndReturnParentElement(label)
                    .then(() => {
                        if (value === 'Closed') {
                            parentContainerFoundByInnerLabelOnModal(labelsArray[i]).find('[title="Toggle Open/Closed"]').click();
                        }
                    });
            } else if (['Review Date Notes'].some(v => label === v)) {
                this.turnOnToggleAndEnterValueInTextarea(label, value)

            } else if (['Case Officer(s)'].some(v => label === v)) {
                this.turnOnToggleAndSelectTypeaheadOptionsOnMultiSelectField(label, value)
            } else {
                this.turnOnToggleEnterValueAndPressEnter(label, value)
            }
        }
        return this
    }

    enter_values_to_all_fields_on_modal(labelsArray, valuesArray) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Offense Type', ''].some(v => label === v)) {
                this.findElementByLabelAndSelectDropdownOption(label, value)

            } else if (['Status'].some(v => label === v)) {
                if (value === 'Closed') {
                    parentContainerFoundByInnerLabelOnModal(labelsArray[i]).find('[title="Toggle Open/Closed"]').click();
                }
            } else if (['Review Date Notes'].some(v => label === v)) {
                this.findElementByLabelAndEnterValueInTextarea(label, value)

            } else if (['Case Officer(s)'].some(v => label === v)) {
                this.findElementByLabelAndSelectTypeaheadOptionsOnMultiSelectField(label, value)
            } else {
                this.findElementByLabelEnterValueAndPressEnter(label, value)
            }
        }
        return this
    }

    verify_asterisk_is_shown_for_fields_on_modal(labelsArray) {
        labelsArray.forEach(fieldLabel => {
            this.check_asterisk_is_shown_for_specific_field_on_modal(fieldLabel)
        })

        return this;
    }

    turn_ON_the_toggle(element) {
        element().find('.toggle-off').invoke('attr', 'class').then((classNames) => {
            if (classNames.toString().includes('active')) {
                element().click();
            }
        });
        element().should('not.have.class', 'off');

        return this;
    }

    turn_OFF_the_toggle(element) {
        element().find('.toggle-on').invoke('attr', 'class').then((classNames) => {
            if (classNames.toString().includes('active')) {
                element().click();
            }
        });

        element().should('have.class', 'off');
        return this;
    }

    verify_enabled_and_disabled_options_under_Actions_dropdown(enabledOptions, disabledOptions) {
        actionsContainer().should('have.class', 'open')
        this.wait_until_spinner_disappears()

        actionsContainer().within(($list) => {
            for (let option of enabledOptions) {
                cy.contains('li', option).should('not.have.class', 'disabled')
            }
            for (let option of disabledOptions) {
                cy.contains('li', option).should('have.class', 'disabled')
            }
        })
        return this;
    }

    get_text_between_two_values_and_save_to_local_storage(element, firstValue, secondValue, propertyToSave) {
        element().invoke('text').then(function (label) {
            let valueToSave = label.match(firstValue + "(.*)" + secondValue)[1];
            cy.setLocalStorage(propertyToSave, valueToSave);
        });
    }

    get_text_on_element_and_save_as_object_property(element, object, propertyName) {
        element().invoke('text').then(function (text) {
            object[propertyName] = text
        });
    }

    //
    // get_text_from_grid_and_save_in_local_storage(columnTitle, object, propertyName, headerCellTag = 'th') {
    //     resultsTableHeader().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
    //         firstRowInResultsTable().find('td').eq(i).invoke('text').then(function (text) {
    //             return object[propertyName] = text
    //         });
    //     })
    // }

    get_text_from_grid_and_save_in_local_storage(columnTitle, propertyName, headerCellTag = 'th') {
        resultsTableHeader().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
            firstRowInResultsTable().find('td').eq(i).invoke('text').then(function (text) {
                cy.setLocalStorage(propertyName, text);
            });
        })
        return this
    }

    get_text_after_the_character_and_save_to_local_storage(element, character, propertyToSave) {
        element().invoke('text').then(function (label) {
            let valueToSave = label.split(character)[1];
            cy.setLocalStorage(propertyToSave, valueToSave);
        });
    }

    pause(numberOfSeconds) {
        cy.wait(numberOfSeconds * 1000)
        return this
    }

    populate_all_fields_on_Custom_Form(dataObject) {
        this.type_if_values_provided(
            [
                [textboxOnCustomForm, dataObject.custom_textbox],
                [emailOnCustomForm, dataObject.custom_email],
                [numberOnCustomForm, dataObject.custom_number],
                [passwordOnCustomForm, dataObject.custom_password],
                [textareaOnCustomForm, dataObject.custom_textarea],
                [dropdownTypeaheadOnCustomForm, dataObject.custom_dropdownTypeaheadOption, dropdownTypeaheadOption],
                [personOnCustomForm, dataObject.custom_person, dropdownTypeaheadOption],
                [dateOnCustomForm, dataObject.custom_date],
            ]);

        this.enter_values_on_several_multi_select_typeahead_fields([
            // [user_userGroup_OnCustomForm, dataObject.custom_user_or_group_names, userAndUserGroupTypeaheadOption]
            [user_userGroup_OnCustomForm, dataObject.custom_user_or_group_names, "usersCF"]
        ])

        if (dataObject.custom_selectListOption) {
            selectListOnCustomForm().select(dataObject.custom_selectListOption);
            selectListOnCustomForm().should('contain', dataObject.custom_selectListOption);
        }

        checkboxOnCustomForm().click()
        firstOptionOnCheckboxListOnCustomForm().click()
        secondOptionOnRadiobuttonListOnCustomForm().click()
        return this;
    }

    enable_all_standard_columns_on_the_grid(page) {
        menuCustomization().click()
        optionsOnMenuCustomization().click()
        pageSizeAndColumnsContianer().within(($list) => {
            enabledColumnsOnMenuCustomization().its('length').then(function (length) {
                if (length < page.numberOfStandardColumns + 1) {
                    disabledColumnsOsOnMenuCustomization().its('length').then(function (length) {
                        // iterate through options that have 'X' icon within "Options" section the number of times that matches the number of 'disabled columns' (exclude 3 'X' icons in pageSize section)
                        let numberOfPageSizeOptionsWithXIcon = (page === C.pages.taskList) ? 1 : 3

                        for (let i = 0; i < length - numberOfPageSizeOptionsWithXIcon; i++) {

                            //click 4th 'X' icon within 'Options' section one (1st disabled column)
                            disabledColumnsOsOnMenuCustomization().eq(numberOfPageSizeOptionsWithXIcon).click()

                            if (i < length - 1) {
                                menuCustomizationFromRoot().click()
                            }
                        }
                    })

                } else {
                    menuCustomizationFromRoot().click()
                }
            })
        })
        return this
    }


    enable_columns_for_specific__Custom_Form_on_the_grid(customFormName) {
        menuCustomization().click()
        customFormsSectionOnMenuCustomization().click()
        this.enterValue(searchCustomFormsOnMenuCustomization, customFormName)

        cy.get('[ng-if="customFieldsToggle.isOpen"]')
            .then(($body) => {
                if ($body.find('.glyphicon-remove').length > 0) {
                    disabledColumnsOsOnMenuCustomization().its('length').then(function (length) {
                        for (let i = 0; i < length; i++) {
                            disabledColumnsOsOnMenuCustomization().first().click()
                            if (i < length - 1) {
                                menuCustomization().click()
                            }
                        }
                    })
                } else {
                    menuCustomization().click()
                }
            })
        return this
    }

    enterValue(element, arrayOrString) {
        // this is a much faster action than 'element.type()'
        // element().invoke('val', value).trigger('input')

        if (Array.isArray(arrayOrString)) {
            arrayOrString.forEach(function (value) {
                element().invoke('val', value).trigger('input')
            })
        } else {
            element().invoke('val', arrayOrString).trigger('input')
        }
        return this
    }

    clearAndEnterValue(element, value) {
        element().clear()
        this.enterValue(element, value)
        return this
    }

    verify_system_services_page_names(fields) {
        var i;
        for (i = 0; i < fields.length; ++i) {
            systemServiceName().eq(i).should('have.text', fields[i]);
        }
        ;
        return this;
    }

    verify_system_services_page_status() {
        systemService().its('length').then(allServices => {
            for (let i = 0; i < allServices; i++) {
                systemServiceStatus().eq(i).should('have.attr', 'translate', 'SYSTEM_SERVICES.NO_ISSUES');
            }
        });

        return this;
    }

}
