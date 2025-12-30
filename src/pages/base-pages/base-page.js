import authApi, {log_out} from "../../api-utils/endpoints/auth";
import orgSettingsApi from "../../api-utils/endpoints/org-settings/collection";
import '../../support/commands';
import {selectedEnvironment} from "../../fixtures/settings";

let S = require('../../fixtures/settings');
let D = require('../../fixtures/data');
let C = require('../../fixtures/constants');
let helper = require('../../support/e2e-helper');
let casesApi = require('../../api-utils/endpoints/cases/collection')

//************************************ ELEMENTS ***************************************//
let bodyContainer = e => cy.get('body'), tableBody = e => cy.get('.table-striped').find('tbody'),
    pencilIcon = e => cy.get('.fa-pencil').first(),
    descriptionOnGrid = e => cy.get('[class="bs-grid-text-input ng-scope"]').find('input'),
    okButton = e => cy.findAllByText('Ok').last(), // saveButton = e => cy.get('[button-text="\'GENERAL.BUTTON_SAVE\'"]').contains('Save'),
    saveButton = e => cy.get('[button-text="\'GENERAL.BUTTON_SAVE\'"]').contains('Save'), // saveButton = e => cy.get('.btn-group').contains('Save'),
    saveAutoDispoButton = e => cy.get('[id="saveAutoDispo"]').contains('Save'),
    editButton = e => cy.get('[translate="GENERAL.EDIT"]').contains('Edit'),
    deleteButton = e => cy.get('[translate="GENERAL.DELETE"]').parent('li'),
    actionsButtonOnActiveTab = e => active_tab().find('.grid-buttons').contains('Actions'),
    actionsButton = e => cy.get('[title="Select an item or items for which you would like to perform Action."]'),
    actionsButton2 = e => cy.get('[translate="GENERAL.ACTIONS"]'),
    actionsButtonOnSearchPage = e => cy.get('[class="grid-buttons inline"]').eq(1),
    actionsButtonOnSearchPage2 = e => cy.get('[class="grid-buttons inline"]').eq(3),
    uploadFileInput = e => cy.get('input[type=file]'),
    addItem = e => cy.get('[translate="CASES.LIST.BUTTON_ADD_ITEM"]'),
    active_tab = e => cy.get('[class="tab-pane ng-scope active"]'),
    quickSearch = e => cy.get('[name="navbarSearchField"]'),
    customDataType = e => cy.get('ng-transclude > .form-control'),
    tableColumn_header = columnTitle => cy.get('thead').contains(columnTitle),
    tableColumn_header_arrowUp = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    tableColumn_header_sortingArrow = columnTitle => cy.get('thead').contains(columnTitle).parent().find('.order'),
    sortingArrow = columnTitle => cy.get('.order').first(),
    quickSearchCaseTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    quickSearchCaseTypeahead_FirstOption = e => cy.get('[ng-repeat="match in matches track by $index"]').eq(0), //quickSearchCaseTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    //quickSearchCaseTypeahead = e => cy.get('[ng-if="!match.model.last && match.model.text && !match.model.first"]'),
    active_tab_title = e => cy.get('[class="ng-scope ng-isolate-scope active"]'),
    gridOptionsDropdown = e => cy.get('[ng-if="optionsToggle.isOpen"]'),
    columnVisibilityIndicatorOnOptionsDropdown = (columnName) => cy.get('[ng-if="optionsToggle.isOpen"]').contains(columnName).find('i'),
    modal = e => cy.get('.modal-content'),
    modal__ = e => cy.get('.modal-content'),
    modalBodySectionAboveFooter = e => cy.get('.modal-body').children('div').last(),
    itemCategoryOnMassUpdate = e => cy.get('[ng-model="item.categoryId"]'),
    sweetAlert = e => cy.get('[data-animation="pop"]'),
    lastCoCMediaButton = e => cy.get('[class="btn btn-default btn-xs btn-block ng-binding"]').eq(1),
    typeaheadList = e => cy.get('.ui-select-choices'),
    firstTypeaheadOption = e => cy.get('.ui-select-choices-row').first(), //highlightedOptionOnTypeahead = e => cy.get('.ui-select-choices-row-inner').last(),
    highlightedOptionOnTypeahead = e => cy.get('.ui-select-highlight').last(),
    firstPersonOnItemBelongsToTypeahead = e => cy.get('[ng-repeat="person in $select.items"]').first(),
    specificPersonOnItemBelongsToTypeahead = person => cy.get('[ng-repeat="person in $select.items"]').contains(person),
    firstMatchOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    caseOfficersOverwrite = e => cy.get('[ng-model="toggle.caseOfficersOverwrite"]'),
    overwriteForm = e => cy.get('[ng-model="massUpdateOptions.overwrite"]'),
    replaceTagsRadioButton = e => cy.get('[translate="MASS.UPDATE.OVERWRITE_EXISTING_TAGS"]'),
    tagsTypeaheadList = e => cy.get('[repeat="tagModel in allTagModels | filter: $select.search"]'),
    orgTagIconOnTagsTypeaheadList = e => tagsTypeaheadList().find('[ng-if="model.tagUsedBy==1"]'),
    tagsInputWithinActiveForm = e => active_form().find('[label="\'GENERAL.TAGS\'"]').find('input'),
    linkByText = linkText => cy.get('a').contains(linkText),
    linkByTextOnFirstTableRow = linkText => cy.get('tr').first().contains(linkText),
    linkWrappedInElement = (linkText, parentElementTag) => cy.contains(linkText).parent(parentElementTag),
    parentLinkByInnerText = innerText => cy.get('link').contains(innerText).parent('a'),
    buttonByTitle = buttonTitle => cy.contains('button', buttonTitle),
    elementByTitle = elementTitle => cy.contains(elementTitle),
    inputFieldFoundByLabel = label => cy.contains(label).parent('div').find('input').first(),
    checkboxFieldFoundByLabel = label => cy.contains(label).parent('div').find('[type="checkbox"]').first(),
    buttonOnModal = buttonTitle => modal().children().contains(buttonTitle),
    buttonOnSweetAlert = buttonTitle => sweetAlert().children().contains('button', buttonTitle),
    buttonOnActiveTab = buttonTitle => active_tab().find('button').contains(buttonTitle),
    elementOnActiveTab = elementTitle => active_tab().contains(elementTitle),
    optionsDropdownUnderMenuCustomization = e => cy.get('[is-open="optionsToggle.isOpen"]'),
    pageSizesUnderMenuCustomization = e => cy.get('[ng-if="optionsToggle.isOpen"]'),
    largeView = e => cy.get('[tp-tooltip="GENERAL.LARGE_VIEW"]'),
    elementOnGridContainer = elementTitle => cy.get('.bs-grid').contains(elementTitle),
    parentContainerFoundByInnerLabel = (innerLabel, parentElementTag = 'div') => cy.contains(innerLabel).parent(parentElementTag),
    parentContainerFoundByInnerLabelOnModal = (innerLabel, parentElementTag = 'div') => modal().contains(innerLabel).parents(parentElementTag),
    navTabs = e => cy.get('.nav-tabs'), specificTab = tabTitle => navTabs().children().contains(tabTitle).parent('li'),
    historyTab = e => cy.get('[translate="GENERAL.HISTORY"]').parent('tab-heading').parent('a').parent('li'),
    expandedMenu = e => cy.get('button[aria-expanded="true"]'),
    optionOnExpandedMenu = option => expandedMenu().next().contains(option).parent('li'),
    dropdownOnModal = e => modal().children().get('select'),
    notesOnModal = e => modal().children().contains('Notes').parents('tp-modal-field').find('ng-transclude').find('.form-control'),
    tableOnModal = e => modal().find('tbody'),
    asterisks = e => cy.get('[ng-if="form.state[field.name].$error.required"]'),
    optionOnTypeahead = option => cy.get('.dropdown-menu[aria-hidden="false"]').contains(option),
    mainContainer = e => cy.get('.ui-view-main'), recoveryDate = e => cy.get('[ng-model="item.recoveryDate"]').last(),
    itemBelongsTo = e => cy.get('[placeholder="Persons for search"]').last(),
    textOnMainContainer = text => cy.get('.ui-view-main').contains(text),
    toastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout}),
    firstToastMessage = (timeout = 50000) => cy.get('.toast', {timeout: timeout}).first(),
    toastContainer = (timeout = 50000) => cy.get('#toast-container', {timeout: timeout}),
    toastTitle = (timeout = 50000) => cy.get('.toast-title', {timeout: timeout}),
    searchParametersAccordion = e => cy.get('#accordionSearchForm'),
    searchParametersExpandedPanel = e => cy.get('[class="panel-collapse collapse in"]'),
    resultsTable = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('tbody'),
    tableStriped = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex),
    cocTableStriped = (tableIndex = 0) => cy.get('.cocTable'),
    dataGrid = (tableIndex = 0) => cy.get('.table-striped[tp-fixed-table-header-scrollable="scrollable-area"]').eq(tableIndex).find('tbody'),
    resultsEntriesCount = e => cy.get('[translate="BSGRID.DISPLAY_STATS"]'), //menuCustomization = e => cy.contains('Menu Customization'),
    menuCustomization = e => cy.get('[translate="BSGRID.BUTTON_MENU_CUSTOMIZATION"]').first(),
    menuCustomizationFromRoot = e => cy.root().parents('html').contains('Menu Customization'),
    customFormsSectionOnMenuCustomization = e => cy.get('[is-open="customFieldsToggle.isOpen"]'),
    searchCustomFormsOnMenuCustomization = e => cy.get('[ng-model="options.customFormSearchField"]'),
    optionsOnMenuCustomization = e => cy.get('[is-open="optionsToggle.isOpen"]').first(),
    standardColumnsOnMenuCustomization = e => cy.get('[ng-repeat="col in getStandardFields() | orderBy:\'name | translate\'"]'),
    columnsOnMenuCustomization = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]'),

    //disabledColumnsOsOnMenuCustomization = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),
    // disabledColumnsOsOnMenuCustomization = e => cy.get('[class="glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray"]'),
    //disabledColumnsOsOnMenuCustomization = e => cy.get('[ng-class="col.visible ?\n' +
    //     '                                                            \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\':\n' +
    //    '                                                            \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),

    disabledColumnsOsOnMenuCustomization = e => cy.get('i.glyphicon.glyphicon-remove.glyphicon-image-md.glyphicon-gray'),
    disabledColumnsOsOnMenuCustomization_PENTEST = e => cy.get('[ng-class="col.visible ? \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\': \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),

    disabledColumnsOsOnMenuCustomization_DEV = e => cy.get('[ng-class="col.visible ?\n' + '                                                            \'glyphicon glyphicon-ok glyphicon-image-md glyphicon-gray\':\n' + '                                                            \'glyphicon glyphicon-remove glyphicon-image-md glyphicon-gray\'"]').not('.glyphicon-ok'),
    enabledColumnsOnMenuCustomization = e => cy.get('.glyphicon-ok'),
    pageSizeAndColumnsContianer = e => cy.get('.grid-menu-header').eq(1), //  resultsTableHeader = (tableIndex = 0) => cy.get('.table-striped').eq(tableIndex).find('thead'),
    resultsTableHeader = (tableIndex = 0) => cy.get('thead'),
    cocTableHeader = (tableIndex = 0) => cy.get('.cocTable').find('thead'),
    resultsTableHeaderFromRoot = (tableIndex = 0) => cy.root().parents('html').find('.table-striped').eq(tableIndex).find('thead'),
    firstRowInResultsTable = (tableIndex = 0) => resultsTable(tableIndex).children('tr').first(),
    specificRowInResultsTable = index => resultsTable().children('tr').eq(index),
    tableRowFoundByUniqueTextInAnyCell = (text, tableIndex = 0) => resultsTable(tableIndex).contains(text).parent('tr'),
    tableColumnFoundByText = (text, tableIndex = 0) => resultsTableHeader(tableIndex).contains(text),
    lastRowInResultsTable = e => resultsTable().children('tr').last(),
    firstRowInResultsTableOnModal = e => cy.get('.modal-content').find('tbody').children('tr').first(),
    visibleTable = e => cy.get('.table').not('.ng-hide'),
    checkboxOnFirstRowOnVisibleTable = e => visibleTable().find('tbody').children('tr').first(),
    checkboxOnLastRowOnVisibleTable = e => visibleTable().find('tbody').children('tr').last().find('.bg-grid-checkbox'),
    specificRowInResultsTableOnActiveTab = rowNumber => active_tab().find('tbody').children('tr').eq(rowNumber - 1),
    firstRowInResultsTableOnActiveTab = e => active_tab().find('tbody').children('tr').first(),
    lastRowInResultsTableOnActiveTab = e => active_tab().find('tbody').children('tr').last(),
    checkboxOnFirstRowInResultsTableOnActiveTab = (tableIndex = 0) => active_tab().find('tbody').eq(tableIndex)
        .children('tr').first().find('.bg-grid-checkbox'),
    checkboxOnFirstTableRow = e => resultsTable().find('.bg-grid-checkbox').first(),
    checkboxToSelectAll = e => cy.get('[ng-model="options.selectAllToggle"]').first(),
    statisticsBlock = e => cy.get('.statistic-block').first(),
    selectedItems = e => cy.get('[ng-if="options.selectedItems.length != 0"]').first(), // locationPin = name => cy.contains(name).parent('div'),
    locationPin = e => cy.get('.pac-matched'), firstCheckboxOnTableBody = e => cy.get('.bg-grid-checkbox').first(),
    checkboxOnSpecificTableRow = rowNumber => resultsTable().find('.bg-grid-checkbox', {timeout: 0}).eq(rowNumber - 1),
    bsGridCheckboxes = rowNumber => cy.get('.bg-grid-checkbox', {timeout: 0}).eq(rowNumber - 1),
    checkboxOnTableRowOnModal = rowNumber => tableOnModal().find('.bg-grid-checkbox').eq(rowNumber - 1),
    checkboxOnTableHeader = e => resultsTableHeader().find('[type="checkbox"]'),
    caseNumberOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    firstPersonOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    offenseTypeOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    firstLocationOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]').first(),
    locationsOnTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    lastTagOnTypeahead = e => cy.get('[ng-repeat="tagModel in $select.items"]').last(),
    caseOfficerTypeahead = e => cy.get('[ng-repeat="item in $group.items"]').first(),
    createPersonalTagOnTypeahead = e => cy.get('[ng-repeat="tagModel in $select.items"]').first(),
    addItemHeader = e => cy.get('[translate="ITEMS.ADD.MODAL_HEADING"]'),
    closedTaskFilter = e => cy.get('[ng-model="showClosedTasks"]'),
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
    tagsInputField = e => active_form().find('[label="\'GENERAL.TAGS\'"]').find('input'),
    tagsInput = e => active_form().contains('Tags').parent('div').find('input'),
    actionsContainer = e => cy.get('[translate="GENERAL.ACTIONS"]').closest('div'),
    actionsContainerOnSearchPage = e => cy.get('[title="Select an item or items for which you would like to perform Action."]').closest('div'),
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
    searchBar_history = e => cy.get('[ng-model="options.searchFilter"]'), searchButton = e => cy.get('#search-button'),
    typeaheadInputField = fieldLabel => cy.contains(fieldLabel).parent().find('input').first(),
    dropdownField = fieldLabel => cy.findByLabelText(fieldLabel).parent().find('select').eq(0),
    inputField = fieldLabel => cy.findByLabelText(fieldLabel).parent().find('input').eq(0), // textareaField = fieldLabel => cy.contains('span', fieldLabel).parents('labels').parent('div').find('textarea').eq(0),
    textareaField = fieldLabel => cy.contains('label', fieldLabel).parent().find('textarea').eq(0),
    typeaheadOption = fieldLabel => cy.contains(fieldLabel).parent().find('ul').find('li').eq(0),
    storageLocationInput = fieldLabel => cy.get('[placeholder="type ‘/‘ or start typing a location name"]').last(),
    returnedByInput = e => cy.get('[label="\'ITEMS.CHECK_IN.RETURNED_BY\'"]').find('[typeahead="l.id as l.text for l in getPerson($viewValue) | limitTo: 10"]'),
    checkedOutToInput = e => cy.get('[label="\'ITEMS.CHECK_OUT.TAKEN_BY\'"]').find('[typeahead="l.id as l.text for l in getPerson($viewValue) | limitTo: 10"]'),
    checkedReasonSelect = e => cy.get('[ng-model="checkout.reasonId"]'),
    transferFrom = e => cy.get('[name="transferredFrom"]'),
    transferFromInput = e => cy.get('[name="transferredFrom"]').find('input'),
    transferTo = e => cy.get('[name="transferredTo"]'),
    expectedReturnDateInput = e => cy.get('[ng-class="{invalidFutureDate: futureDateViolated, datePickerOnly: isDatePickerOnly}"]'),
    transferToInput = e => cy.get('[name="transferredTo"]').find('input'),
    locationInputOnModal = e => cy.get('.modal-content').find('.locationInput'),
    disposalWitnessInput = e => cy.get('span[ng-model="disposal.witnessId"]').find('input'),
    disposalMethodsDropdown = e => cy.get('[ng-options="t.id as t.name for t in data.disposalMethods"]'),
    usePreviousLocationCheckbox = e => cy.get('.icheckbox_square-blue').find('ins'),
    checkoutReason = e => cy.get('[ng-options="r.id as r.name for r in data.checkoutReasons"]'),
    typeaheadSelectorMatchInMatches = '[ng-repeat="match in matches track by $index"]',
    typeaheadSelectorItemInGroupItems = '[ng-repeat="item in $group.items"]',
    typeaheadSelectorChoicesRow = '.ui-select-choices-row'

let dashboardGetRequests = ['/api/users/currentuser?groups=true', '/api/users/currentuser?groups=false', '/api/dashboards', '/api/templatewidgets', '/api/charts/GetMyDataWidgets', '/api/access/offices']

let basePage = class BasePage {

    constructor() {
        this.typeaheadSelectorMatchInMatches = typeaheadSelectorMatchInMatches;
        this.typeaheadSelectorChoicesRow = typeaheadSelectorChoicesRow;
        this.typeaheadSelectorItemInGroupItems = typeaheadSelectorItemInGroupItems;
        this.searchParametersAccordion = searchParametersAccordion;
        this.searchParametersExpandedPanel = searchParametersExpandedPanel;
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
        this.firstMatchOnTypeahead = firstMatchOnTypeahead;
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

    click_element_by_text(text) {
        cy.log(text)
        cy.findByText(text)
            .should('be.visible')
            .scrollIntoView()
            .click({force: true});
        return this;
    }

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

    verify_tag_with_specific_type_is_visible(tagName, tagType) {
        if (tagType === 'Org') {
            cy.contains(tagName).parents('[ng-repeat="tag in tags"]').find('i').should('have.class', 'fa-building')
        } else if (tagType === 'Group') {
            cy.contains(tagName).parents('[ng-repeat="tag in tags"]').find('i').should('have.class', 'fa-group')
        } else if (tagType === 'User') {
            cy.contains(tagName).parents('[ng-repeat="tag in tags"]').find('i').should('have.class', 'fa-user')
        }
    }

    verify_text_is_present_on_main_container(text) {
        this.toastMessage().should('not.exist');
        cy.verifyTextAndRetry(() => mainContainer().invoke('text'), text);
        return this;
    };

    verify_text_is_present_and_check_X_more_times_after_waiting_for_Y_seconds(text, numberOfTimesToCheck, secondsToWait = 30, reloadBetweenAttempts, selectItemsTabAfterReload = false) {
        const tryFindingText = (attempt = 1) => {
            cy.log(`🔍 Attempt #${attempt} to find "${text}"`);

            return cy.document().then((doc) => {
                const found = doc.body.innerText.includes(text);

                if (found) {
                    cy.log(`✅ Found "${text}" on attempt #${attempt}`);
                } else if (attempt < numberOfTimesToCheck) {
                    if (reloadBetweenAttempts) {
                        cy.reload();
                        if (selectItemsTabAfterReload) this.select_tab('Items')
                        cy.wait(2000)
                        this.wait_until_spinner_disappears()
                    }
                    cy.log(`❌ "${text}" not found on attempt #${attempt}, retrying...`);
                    return cy.wait(secondsToWait * 1000).then(() => tryFindingText(attempt + 1));
                } else {
                    throw new Error(`❌ Text "${text}" not found after ${numberOfTimesToCheck} attempts`);
                }
            });
        };
        return tryFindingText();
        // return this
    }

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

    verify_records_count_on_grid(firstPageTotal, totalCount = firstPageTotal) {
        if (firstPageTotal === 0) {
            cy.contains(`Showing 0 to 0 of 0 `).should('be.visible');
        } else {
            cy.contains(`Showing 1 to ${firstPageTotal} of ${totalCount} `).should('be.visible');
        }
        return this;
    };

    quick_search_for_case(caseNumber, shouldFind = true) {
        let request = 'typeahead?allOffices=true&hideOverlay=true&search=' + caseNumber.replace(/\s+/g, '%20');
        this.define_API_request_to_be_awaited('GET', request)
        this.enterValue(quickSearch, caseNumber)
        this.wait_response_from_API_call(request, 200);

        if (shouldFind) {
            quickSearchCaseTypeahead_FirstOption().click();
            this.wait_until_spinner_disappears();
            this.verify_text_is_present_on_main_container(caseNumber)
        } else {
            this.verify_element_has_class(quickSearch, 'ng-invalid-empty-data-error')
        }
        return this;
    };

    verify_Error_toast_message_is_NOT_visible() {
        this.wait_until_spinner_disappears()
        //this.wait_all_GET_requests()
        this.verify_element_does_NOT_contain_text(toastContainer, 'Error')
    }

    click_toast_message_if_visible() {
        cy.document().then(doc => {
            const firstToast = doc.querySelector('.toast');
            if (firstToast) {
                if (firstToast.offsetParent !== null) {
                    firstToast.click(); // Use native click if the element is still visible
                }
            }
        });
    }

    verify_specific_toast_message_is_NOT_visible(text) {
        this.wait_until_spinner_disappears()
        //this.wait_all_GET_requests()
        this.verify_element_does_NOT_contain_text(toastContainer, text)
    }

    verify_toast_message(text, includesRecentCaseNumber = false, timeoutInMinutes = 1) {
        if (!timeoutInMinutes || isNaN(timeoutInMinutes)) {
            timeoutInMinutes = 1;
        }
        let timeoutInMiliseconds = timeoutInMinutes * 60000
        toastMessage(timeoutInMiliseconds).should('be.visible', {timeout: timeoutInMiliseconds});

        cy.getLocalStorage("recentCase").then(recentCase => {
            // toastMessage(timeoutInMiliseconds).should('be.visible');

            toastMessage(timeoutInMiliseconds).invoke('text').then(function (toastMsg) {
                // toastMessage().click({multiple: true})
                // firstToastMessage().click()

                cy.document().then(doc => {
                    // Find the first toast message element in the DOM
                    const firstToast = doc.querySelector('.toast');

                    if (firstToast) {
                        // Ensure the toast is still attached to the DOM and is visible
                        if (firstToast.offsetParent !== null) {
                            firstToast.click(); // Use native click if the element is still visible
                        }
                    }
                });

                toastMessage().should('not.exist');
                if (text instanceof Array) {
                    text.forEach(element => expect(toastMsg).to.contain(element));
                } else {
                    expect(toastMsg).to.contain(text);
                }

                if (includesRecentCaseNumber) expect(toastMsg).to.contain(JSON.parse(recentCase).caseNumber)
            });
        });
        return this;
    };

    verify_single_toast_message_if_multiple_shown(text) {

        let allToastMessages = []

        cy.get('.toast').first().invoke('text').then((firstToast) => {
            cy.get('.toast').last().invoke('text').then((lastToast) => {
                allToastMessages.push(firstToast)
                allToastMessages.push(lastToast)
                this.click_toast_message_if_visible()
                this.click_toast_message_if_visible()
                expect(allToastMessages.toString()).to.contain(text);
            });
        });
        return this;
    };

    verify_report_running_toast_message() {
        const isSecure = S.domain === 'SECURE';
        const isPentest = S.domain === 'PENTEST';

        this.verify_single_toast_message_if_multiple_shown(C.toastMsgs.reportRunning)

        // if (isPentest || isSecure){
        //     this.verify_single_toast_message_if_multiple_shown(C.toastMsgs.popupBlocked)
        // }
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
        this.pause(1)
        this.wait_until_spinner_disappears()
        return this;
    }

    wait_certain_number_of_rows_to_be_visible_on_grid(expectedNumberOfRows, tabToBeSelected = null) {
        let that = this;

        function verify() {
            cy.window({timeout: 70000}).then((win) => {
                const elements = win.document.querySelectorAll('.bg-grid-checkbox');

                if (elements.length !== expectedNumberOfRows) {
                    cy.reload();
                    cy.wait(1000); // give page time to reload

                    if (tabToBeSelected) {
                        that.select_tab(C.tabs[tabToBeSelected]);
                    }

                    verify(); // retry recursively
                } else {
                    cy.log(`✅ Found exactly ${expectedNumberOfRows} checkboxes`);
                }
            });
        }

        verify();
        return this;
    }


    click_number_on_pagination(pageNumber) {
        this.wait_until_spinner_disappears()

        cy.document().then(doc => {
            const pagination = doc.querySelector('.pagination-sm');
            if (pagination) {
                if (pagination.offsetParent !== null) {
                    cy.get('.pagination-sm').first().findByText(pageNumber).click()
                }
            }
        });
        this.pause(2)
        this.wait_until_spinner_disappears()
        return this;
    }

    set_large_view() {
        this.wait_until_spinner_disappears()
        largeView().should('be.enabled')
        this.pause(2)
        largeView().click();
        this.verify_element_has_class(largeView, 'btn-multi')
        this.pause(2)
        this.wait_until_spinner_disappears()
        return this;
    }

    reset_large_view() {
        this.wait_until_spinner_disappears()
        this.verify_element_has_class(largeView, 'btn-multi')
        largeView().should('be.enabled')
        this.pause(2)
        largeView().click();
        this.verify_element_does_not_have_class(largeView, 'btn-multi')
        this.wait_until_spinner_disappears()
        this.pause(1)
        largeView().should('be.enabled')
        this.pause(2)
        largeView().click();
        this.verify_element_has_class(largeView, 'btn-multi')
        this.wait_until_spinner_disappears()
        return this;
    }

    disable_large_view() {
        this.wait_until_spinner_disappears()
        this.click_element_if_has_a_class_(largeView, 'btn-multi')
        this.verify_element_does_not_have_class(largeView, 'btn-multi')
        this.pause(1)
        this.wait_until_spinner_disappears()
        return this;
    }

    click_Search() {
        cy.intercept('POST', '**/search').as('search')
        this.click(C.buttons.search, mainContainer());
        cy.wait('@search')
        this.wait_until_spinner_disappears()
        this.pause(0.5)
        return this;
    };

    click_button_on_modal(buttonTitle) {
        buttonOnModal(buttonTitle).scrollIntoView();
        buttonOnModal(buttonTitle).should('be.visible');
        buttonOnModal(buttonTitle).click();
        return this;
    };

    click_button_on_sweet_alert(buttonTitle) {
        this.pause(1)
        buttonOnSweetAlert(buttonTitle).should('be.visible');
        buttonOnSweetAlert(buttonTitle).click();
        return this;
    };

    click_button(buttonTitle) {
        buttonByTitle(buttonTitle).scrollIntoView()
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

    enter_value_and_retype_last_character_if_typeahead_did_not_appear(element, value, typeaheadSelector) {
        const lastChar = value.slice(-1);

        function attempt($el, attemptNum = 1) {
            if (attemptNum === 1) {
                // First attempt: enter full value
                cy.log(`Typeahead attempt ${attemptNum}: entering full value`);
                cy.wrap($el)
                    .clear()
                    .invoke('val', value)
                    .trigger('input');
            } else {
                // Subsequent attempts: backspace + retype last char
                cy.log(`Typeahead attempt ${attemptNum}: retyping last character`);
                cy.wrap($el)
                    .type('{backspace}')
                    .type(lastChar)
                    .trigger('input');
            }

            cy.wait(500).then(() => {
                cy.document().then(doc => {
                    const typeaheadExists = !!doc.querySelector(typeaheadSelector);

                    if (!typeaheadExists && attemptNum < 5) {
                        attempt($el, attemptNum + 1);
                    }
                });
            });
        }

        element().then($el => {
            attempt($el, 1);
        });
    }


    select_typeahead_option(element, value, typeaheadElementSelector, aliasOfEndpointToBeAwaited) {
        if (value) {
            this.enter_value_and_retype_last_character_if_typeahead_did_not_appear(element, value, typeaheadElementSelector)

            if (aliasOfEndpointToBeAwaited) {
                //this.wait_response_from_API_call(aliasOfEndpointToBeAwaited)
                this.wait_until_spinner_disappears();
            }

            if (typeaheadElementSelector) {
                this.pause(1)
                // element().type('{enter}')
                cy.get(typeaheadElementSelector).first().click();
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

                if (stack[2] === '{enter}') {
                    stack[0]().type('{enter}');
                } else if (stack[2]) {
                    stack[0]().clear().type(stack[1])
                    if (stack[3]) {
                        self.wait_response_from_API_call(stack[3])
                    }
                    self.pause(1.2)
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

    enter_values_on_single_multi_select_typeahead_field(LabelValueArray) {

        if (LabelValueArray[1]) {
            // if there are multiple values in array, repeat the same action to enter all of them
            for (let i = 0; i < LabelValueArray[1].length; i++) {
                // skip getUserinTypeahead if string is empty
                const searchValue = LabelValueArray[1][i] == null ? '' : String(LabelValueArray[1][i]).trim();
                if (searchValue === '') continue;
                if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
                    this.define_API_request_to_be_awaited('GET', 'api/users/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + searchValue.replace(/\s+/g, '%20'), "getUserInTypeahead")
                    this.define_API_request_to_be_awaited('GET', '/api/userGroups/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + searchValue.replace(/\s+/g, '%20'), "getUserGroupInTypeahead")
                } else if (["people", "peopleCF"].includes(LabelValueArray[2])) {
                    this.define_API_request_to_be_awaited('GET', '/api/people/typeahead', "getPeopleInTypeahead")
                }

                if (typeof LabelValueArray[0] === 'string' || LabelValueArray[0] instanceof String) {
                    // typeaheadInputField(LabelValueArray[0]).clear().invoke('val', LabelValueArray[1][i]).trigger('input')
                    typeaheadInputField(LabelValueArray[0])
                        .clear()
                        .invoke('val', LabelValueArray[1][i])
                        .trigger('input')
                        .then($input => {
                            // Wait 500ms
                            cy.wait(500).then(() => {
                                // Remove last character
                                const currentVal = $input.val();
                                const newVal = currentVal.slice(0, -1); // remove last character
                                cy.wrap($input).invoke('val', newVal).trigger('input');
                            });
                        });
                } else {
                    LabelValueArray[0]().clear().invoke('val', LabelValueArray[1][i]).trigger('input')
                }

                if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
                    this.wait_response_from_API_call("getUserInTypeahead")
                    this.wait_response_from_API_call("getUserGroupInTypeahead")
                } else if (["people", "peopleCF"].includes(LabelValueArray[2])) {
                    this.wait_response_from_API_call("getPeopleInTypeahead")
                }

                cy.wait(200)

                if (LabelValueArray[3] === '{enter}') {
                    typeaheadInputField(LabelValueArray[0]).type('{enter}')
                } else {
                    highlightedOptionOnTypeahead().click({force: true})
                }
                cy.wait(200)

            }
        }


        return this;
    };

    // enter_values_on_single_multi_select_typeahead_field(LabelValueArray) {
    //
    //     if (LabelValueArray[1]) {
    //         // if there are multiple values in array, repeat the same action to enter all of them
    //         for (let i = 0; i < LabelValueArray[1].length; i++) {
    //             // skip getUserinTypeahead if string is empty
    //             const searchValue = LabelValueArray[1][i] == null ? '' : String(LabelValueArray[1][i]).trim();
    //             if (searchValue === '') continue;
    //             if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
    //                 this.define_API_request_to_be_awaited('GET',
    //                     'api/users/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + searchValue.replace(/\s+/g, '%20'),
    //                     "getUserInTypeahead")
    //                 this.define_API_request_to_be_awaited('GET',
    //                     '/api/userGroups/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + searchValue.replace(/\s+/g, '%20'),
    //                     "getUserGroupInTypeahead")
    //             } else if (["people", "peopleCF"].includes(LabelValueArray[2])) {
    //                 this.define_API_request_to_be_awaited('GET',
    //                     '/api/people/typeahead',
    //                     "getPeopleInTypeahead")
    //
    //             }
    //
    //             if (typeof LabelValueArray[0] === 'string' || LabelValueArray[0] instanceof String) {
    //                 // typeaheadInputField(LabelValueArray[0]).clear().invoke('val', LabelValueArray[1][i]).trigger('input')
    //                 typeaheadInputField(LabelValueArray[0])
    //                     .clear()
    //                     .invoke('val', LabelValueArray[1][i])
    //                     .trigger('input')
    //                     .then($input => {
    //                         // Wait 500ms
    //                         cy.wait(500).then(() => {
    //                             // Remove last character
    //                             const currentVal = $input.val();
    //                             const newVal = currentVal.slice(0, -1); // remove last character
    //                             cy.wrap($input).invoke('val', newVal).trigger('input');
    //                         });
    //                     });
    //             } else {
    //                 LabelValueArray[0]().clear().invoke('val', LabelValueArray[1][i]).trigger('input')
    //             }
    //
    //             if (["users/groups", "usersCF"].includes(LabelValueArray[2])) {
    //                 this.wait_response_from_API_call("getUserInTypeahead")
    //                 this.wait_response_from_API_call("getUserGroupInTypeahead")
    //             } else if (["people", "peopleCF"].includes(LabelValueArray[2])) {
    //                 this.wait_response_from_API_call("getPeopleInTypeahead")
    //             }
    //
    //             cy.wait(200)
    //
    //             if (LabelValueArray[3] === '{enter}') {
    //                 typeaheadInputField(LabelValueArray[0]).type('{enter}')
    //             }
    //             else{
    //                 highlightedOptionOnTypeahead().click({force: true})
    //             }
    //             cy.wait(200)
    //
    //         }
    //     }
    //     return this;
    // };

    type_Tag_value_and_verify_if_option_is_available_on_dropdown(value, shouldExistingTagBeAvailable, shouldHaveOptionToCreatePersonalTag) {
        tagsInputField()
            .clear()
            .invoke('val', value)
            .trigger('input')
            .then($input => {
                cy.wait(500).then(() => {
                    const currentVal = $input.val();
                    const newVal = currentVal.slice(0, -1);
                    cy.wrap($input).invoke('val', newVal).trigger('input');
                });
            });

        let getTagOptions = () => {
            return highlightedOptionOnTypeahead().parents('.ui-select-choices-content').invoke('text')
        };

        if (shouldHaveOptionToCreatePersonalTag) {
            if (shouldExistingTagBeAvailable) {
                cy.verifyTextAndRetry(getTagOptions, value);
                cy.verifyTextAndRetry(getTagOptions, 'Create Personal Tag');
            } else {
                cy.verifyTextAndRetry(getTagOptions, 'Create Personal Tag');
                cy.verifyTextAndRetry(getTagOptions, 'Create Personal Tag');
            }
        } else {
            if (shouldExistingTagBeAvailable) {
                cy.verifyTextAndRetry(getTagOptions, value);
            } else {
                //typeaheadInputField('Tags').type('{enter}')
                this.verify_text_is_NOT_present_on_main_container(value)
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

    //
    // enter_values_on_Item_Belongs_To_typeahead_field(LabelValueArray) {
    //     let that = this
    //
    //     if (LabelValueArray[1]) {
    //         // if there are multiple values in array, repeat the same action to enter all of them
    //         for (let i = 0; i < LabelValueArray[1].length; i++) {
    //             // this.define_API_request_to_be_awaited('GET',
    //             //     'peopleListFiltered',
    //             //     "getPeopleList")
    //             //
    //             if (typeof LabelValueArray[0] === 'string' || LabelValueArray[0] instanceof String) {
    //                 typeaheadInputField(LabelValueArray[0]).clear().invoke('val', LabelValueArray[1][i]).trigger('input')
    //             } else {
    //                 LabelValueArray[0]().clear().invoke('val', LabelValueArray[1][i]).trigger('input')
    //             }
    //             //  this.wait_response_from_API_call("getPeopleList")
    //
    //             cy.wait(200)
    //             //firstPersonOnItemBelongsToTypeahead().should('exist').should('be.visible').click()
    //             specificPersonOnItemBelongsToTypeahead(LabelValueArray[1][i]).should('exist').should('be.visible').click()
    //             cy.wait(200)
    //         }
    //     }
    //     return this;
    // };

    enter_values_on_Item_Belongs_To_typeahead_field(element, valuesArray) {
        if (valuesArray[0]) {
            for (let i = 0; i < valuesArray.length; i++) {
                this.select_typeahead_option(element, valuesArray[i], this.typeaheadSelectorChoicesRow);
            }
        }
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

    verify_values_on_the_grid(headerValuePairs) {
        var self = this;
        headerValuePairs.forEach(function (pair) {
            if (pair[1] !== null && pair[1] !== '') {
                self.verify_content_of_first_table_row_by_provided_column_title_and_value(pair[0], pair[1], 'th')
            }
        });
        return this;
    };

    verify_values_on_multiple_rows_on_the_grid(headerValuePairs, isCoCTable) {
        var self = this;
        for (let i = 0; i < headerValuePairs.length; i++) {
            headerValuePairs[i].forEach(function (pair) {
                if (pair[1] !== null) {
                    self.verify_content_of_specific_table_row_by_provided_column_title_and_value(i, pair[0], pair[1], 'th', true)
                }
            });
        }
        return this;
    };

    verify_values_on_CoC(headerValuePairs) {
        var self = this;
        for (let i = 0; i < headerValuePairs.length; i++) {
            headerValuePairs[i].forEach(function (pair) {
                if (pair[1] !== null) {
                    self.verify_content_of_CoC_table_row_by_provided_column_title_and_value(i, pair[0], pair[1], 'th')
                }
            });
        }
        return this;
    };

    verify_last_transaction_media_from_CoC() {
        lastCoCMediaButton().click();
        this.verify_content_of_results_table('image.png')
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
                self.verify_value_within_container(stack[0], stack[1], stack[2])
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
                self.verify_text_within_container(stack[0], stack[1], stack[2])
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
        container().should('exist').and('not.be.empty');

        arrayOfProperties.forEach(function (prop) {
            if (prop !== null) {
                if (prop === '') {
                    container({timeout: 5000}).invoke('text').should('eq', '');
                } else {
                    // we have issues with trimming on DEV, so I had to add like this
                    cy.url().then(url => {
                        if (url.includes('dev')) {
                            container({timeout: 5000}).invoke('text').then(text => {
                                const normalizedText = text.replace(/\s+/g, ' ').trim();
                                const normalizedProp = prop.replace(/\s+/g, ' ').trim();
                                expect(normalizedText).to.include(normalizedProp);
                            });
                        } else {
                            container({timeout: 5000}).should('contain.text', prop);
                        }
                    });
                }
            }
        });

        return this;
    }

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

    // this was the source method that includes retry mechanism
    check_text(element, text, timeoutInSeconds = 60) {
        if (text) {
            let getTextFn = () => {
                return (element instanceof Function ? element() : element).invoke('text');
            };
            const retryInterval = 500
            let timeout = timeoutInSeconds * 1000
            let maxAttempts = timeout / retryInterval
            cy.verifyTextAndRetry(getTextFn, text, {maxAttempts: maxAttempts, retryInterval: retryInterval});
        }
    }

    //  AMN: I needed to add this method because we had an issue with reading  empty ' ' on DEV while on Pentest method above worked fine
    // SMJ: commenting out this method, to be deleted later, as we should try to use the check_text() method above on all envs, with retry mechanism which incorporates the trimming of whitespaces as well
    // check_text_2(element, text, fieldName = '') {
    //     if (element instanceof Function) {
    //         element = element();
    //     }
    //
    //     element.invoke('text').then((textFound) => {
    //         let actualText = textFound || '';
    //         let expectedText = text || '';
    //
    //         let normalizedText = actualText;
    //         let normalizedActual = (Number.isFinite(actualText)) ? actualText : actualText.toString();
    //
    //         if (fieldName.toLowerCase() !== 'Guid') {
    //             normalizedText = actualText.replace(/\s+/g, ' ').trim();
    //             normalizedExpected = normalizedExpected.replace(/\s+/g, ' ').trim();
    //         }
    //
    //         if (normalizedExpected === '') {
    //             expect(normalizedText).to.eq('');
    //         } else {
    //             expect(normalizedText).to.contain(normalizedExpected);
    //         }
    //     });
    // }

    // check_value(element, value) {
    //     const expected = value?.toString().trim() ?? '';
    //
    //     if (element instanceof Function) {
    //         element = element();
    //     }
    //
    //     if (expected === '') {
    //         element.invoke('val').should(val => {
    //             expect(val?.toString().trim() ?? '').to.eq('');
    //         });
    //     } else {
    //         element.invoke('val').should(val => {
    //             expect(val?.toString().trim() ?? '').to.contain(expected);
    //         });
    //     }
    // }

    check_value(element, value, timeoutInSeconds = 70, specificIndex) {

        if (value) {
            let getTextFn = () => {
                return (element instanceof Function ? element() : element).invoke('val');
            };

            const retryInterval = 500
            let timeout = timeoutInSeconds * 1000
            let maxAttempts = timeout / retryInterval
            cy.verifyTextAndRetry(getTextFn, value, {maxAttempts: maxAttempts, retryInterval: retryInterval});
        }
    }

    verify_value_within_container(element, value, container, timeoutInSeconds = 70) {

        if (value) {
            let getTextFn = () => {
                return element(container).invoke('val');
            };
            const retryInterval = 500
            let timeout = timeoutInSeconds * 1000
            let maxAttempts = timeout / retryInterval
            cy.verifyTextAndRetry(getTextFn, value, {maxAttempts: maxAttempts, retryInterval: retryInterval});
        }
    }

    verify_text_within_container(element, value, container, timeoutInSeconds = 70) {

        if (value) {
            let getTextFn = () => {
                return element(container).invoke('text');
            };
            const retryInterval = 500
            let timeout = timeoutInSeconds * 1000
            let maxAttempts = timeout / retryInterval
            cy.verifyTextAndRetry(getTextFn, value, {maxAttempts: maxAttempts, retryInterval: retryInterval});
        }
    }

    verify_text(element, expectedText, timeoutInSeconds) {
        let self = this
        if (this.isObject(expectedText)) {
            for (let property in expectedText) {
                self.check_text(element, expectedText[property], timeoutInSeconds)
            }
        } else if (Array.isArray(expectedText)) {
            expectedText.forEach(function (value) {
                self.check_text(element, value, timeoutInSeconds)
            })
        } else {
            self.check_text(element, expectedText, timeoutInSeconds)
        }
        return this;
    };

    //AMN: this method is added because of add-user spec -> we have different behavior on dev and pentest related to verifying empty ' '
    // SMJ: commenting out this method, to be deleted later, as we should try to use the verify_text() method above on all envs, with retry mechanism which incorporates the trimming of whitespaces as well
    // verify_text_2(element, expectedText) {
    //     let self = this
    //     if (this.isObject(expectedText)) {
    //         for (let property in expectedText) {
    //             self.check_text(element, expectedText[property])
    //         }
    //     } else if (Array.isArray(expectedText)) {
    //         expectedText.forEach(function (value) {
    //             self.check_text(element, value)
    //         })
    //     } else {
    //         self.check_text_2(element, expectedText)
    //     }
    //     return this;
    // };

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

    // verify_text_regardless_of_the_DOM_structure(element, fullText) {
    //     element().invoke('text').then(function (text) {
    //         assert.equal(text, fullText);
    //     });
    //     return this;
    // };
    verify_text_regardless_of_the_DOM_structure(element, fullText) {
        element().invoke('text').then(function (text) {
            const normalizedText = text.replace(/\s+/g, ' ').trim();
            const expectedText = fullText.replace(/\s+/g, ' ').trim();
            assert.equal(normalizedText, expectedText);
        });
        return this;
    }

    verify_element_does_NOT_contain_text(element, text) {
        element().invoke('text').should('not.include', text)
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
                elementAsFunction.click();
            }
        });
    };

    click_element_if_has_a_class_ = function (element, className) {
        element().then(($el) => {
            cy.wait(500)
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
        return this
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

    click_button_and_wait_text(buttonCssSelector, text) {
        cy.clickAndRetryUntilText(buttonCssSelector, [text], {
            maxAttempts: 20, retryInterval: 1000
        })
        return this;
    };

    click(text, container, elementSequentialId = 1) {

        let elmIndex = elementSequentialId - 1;

        if (container) {
            container.then(parentElm => cy.findAllByText(text, {container: parentElm}).eq(elmIndex).click())
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
        okButton().scrollIntoView()
        okButton().should('be.enabled');
        okButton().click();
        return this;
    };

    click_Save() {
        this.pause(2) // static wait is needed before clicking the Save button to improve test stability
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
        casesApi.quick_case_search(caseNumber);
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
        cy.wait(2000)
        return this;
    };

    click_Delete() {
        deleteButton().click();
        return this;
    };

    click_Actions(useButtonOnActiveTab) {
        this.pause(1)
        this.wait_until_modal_disappears()
        this.wait_until_spinner_disappears()

        if (useButtonOnActiveTab) {
            cy.log('Clicking actions button on active tab')
            actionsButtonOnActiveTab().click()
        } else {
            cy.get('body').then($body => {
                if ($body.find('[title="Select an item or items for which you would like to perform Action."]').length > 0) {
                    actionsButton().should('exist')
                    actionsButton().click()
                } else if ($body.find('[translate="GENERAL.ACTIONS"]').length > 0) {
                    actionsButton2().should('exist')
                    actionsButton2().click()
                } else {
                    cy.log('No action button found')
                }
            })
        }

        return this;
    };

    click_Actions_on_Search_Page() {
        this.pause(1)
        this.wait_until_modal_disappears()
        this.wait_until_spinner_disappears()
        actionsButtonOnSearchPage().click()
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
        this.wait_until_spinner_disappears()
        if (container) {
            container.contains(linkText).click();
        } else {
            linkByText(linkText).scrollIntoView().should('be.visible').click();
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

    press_ENTER_on_Tags(element) {
        tagsInputField().type('{enter}');
        this.pause(0.5)
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
        if (partOfRequestUrl) {
            this.define_API_request_to_be_mocked('GET', partOfRequestUrl)
            cy.visit(urlToOpen);
            this.wait_response_from_API_call(partOfRequestUrl)
            this.wait_until_spinner_disappears()
            this.click_toast_message_if_visible()
        } else {
            cy.visit(urlToOpen);
            this.wait_until_spinner_disappears()
            this.click_toast_message_if_visible()
        }
        return this
    };

    open_direct_url_for_page(page) {
        this.open_url_and_wait_all_GET_requests_to_finish(S.base_url + '/#/' + page.url)
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

    define_API_request_to_be_awaited2(methodType, partOfRequestUrl, alias) {
        if (!alias) {
            alias = partOfRequestUrl;
        }
        cy.intercept(methodType, new RegExp(`${partOfRequestUrl}(\\?.*)?$`), req => req.continue()).as(alias);
        return this;
    }

    define_API_request_to_be_awaited_with_last_part_of_url(methodType, lastPartOfRequestUrl, alias) {
        if (!alias) {
            alias = partOfRequestUrl;
        }
        cy.intercept(methodType, '**' + `${lastPartOfRequestUrl}`, (req) => {
            req.continue(); // Explicitly pass through to backend
        }).as(alias);
        return this;
    }

    define_API_request_to_be_awaited_with_numerical_part_at_the_end_of_url(methodType, partOfRequestUrl, alias) {
        if (!alias) {
            alias = partOfRequestUrl;
        }
        const urlRegex = new RegExp(`${partOfRequestUrl}/\\d+`);
        cy.intercept({
            method: methodType, url: urlRegex
        }, (req) => {
            req.continue();
        }).as(alias);
        return this;
    }

    define_API_request_to_be_awaited_with_textual_part_at_the_end_of_url(methodType, partOfRequestUrl, alias) {
        if (!alias) {
            alias = partOfRequestUrl;
        }

        // Matches partOfRequestUrl/<text> optionally followed by ?query=params
        const urlRegex = new RegExp(`${partOfRequestUrl}/[A-Za-z0-9_-]+(?:\\?.*)?$`);

        cy.intercept({
            method: methodType, url: urlRegex
        }, (req) => {
            req.continue();
        }).as(alias);

        return this;
    }

    define_API_request_to_be_mocked(methodType, partOfRequestUrl, alias, response) {
        alias = alias || partOfRequestUrl;

        cy.intercept({
            method: methodType, url: '/api/' + partOfRequestUrl
        }, response).as(alias);
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

    wait_response_from_API_call_extended(alias, status = 200, propertyToSaveToLocalStorage, timeout = 1000) {
        let requestOccurred = false;

        // Wrap in a Cypress command chain, no Promises
        cy.wait(0, {timeout: 0}) // dummy wait to start the chain
            .then(() => {
                const start = Date.now();

                function checkRequest() {
                    const intercepted = cy.state('requests')[alias];

                    if (intercepted && intercepted.length > 0) {
                        requestOccurred = true;
                        const interception = intercepted[0];

                        const responseStatus = interception.status || interception.response?.statusCode;

                        expect(responseStatus).to.equal(status);

                        if (propertyToSaveToLocalStorage) {
                            cy.setLocalStorage(propertyToSaveToLocalStorage, JSON.stringify(interception.response.body));

                            if (S.selectedEnvironment[propertyToSaveToLocalStorage]) {
                                S.selectedEnvironment[propertyToSaveToLocalStorage] = {
                                    ...S.selectedEnvironment[propertyToSaveToLocalStorage], ...interception.response.body,
                                };
                            }
                        }

                        return;
                    }

                    // timeout reached
                    if (Date.now() - start > timeout) {
                        cy.log(`⚠️ No API call triggered for @${alias} within ${timeout}ms — continuing test`);
                        return;
                    }

                    // wait a bit and check again
                    cy.wait(100, {log: false}).then(checkRequest);
                }

                checkRequest();
            });

        return this;
    }

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

    // set_visibility_of_table_column(columnName, shouldBeVisible) {
    //     cy.get('thead').invoke('text').then((text) => {
    //         if (shouldBeVisible && !text.includes(columnName)) {
    //             this.click_element_on_active_tab(C.buttons.menuCustomization);
    //             this.click_element_on_active_tab(C.buttons.options);
    //             this.click(columnName, gridOptionsDropdown());
    //         } else if (!shouldBeVisible && text.includes(columnName)) {
    //             this.click_element_on_active_tab(C.buttons.menuCustomization);
    //             this.click_element_on_active_tab(C.buttons.options);
    //             this.click(columnName, gridOptionsDropdown());
    //         } else {
    //
    //         }
    //     })

    set_visibility_of_table_column(columnName, shouldBeVisible, onActiveTab = true) {
        cy.wait(1000)
        if (onActiveTab) {
            if (shouldBeVisible) {
                active_tab().find('thead').contains(columnName).parents('th').then(($el) => {

                    if ($el.hasClass('ng-hide')) {
                        this.click_element_on_active_tab(C.buttons.menuCustomization);
                        this.click_element_on_active_tab(C.buttons.options);
                        this.click(columnName, gridOptionsDropdown());
                    }
                });
            }
        } else {
            if (shouldBeVisible) {
                cy.get('thead').contains(columnName).parents('th').then(($el) => {
                    if ($el.hasClass('ng-hide')) {
                        this.click_element_on_active_tab(C.buttons.menuCustomization);
                        this.click_element_on_active_tab(C.buttons.options);
                        this.click(columnName, gridOptionsDropdown());
                    }
                });
            }
        }
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
            username: emailAccount.email, password: emailAccount.password, markSeen: true
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
        this.pause(4)
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
            username: S.gmailAccount.email, password: S.gmailAccount.password, markSeen: true
        });
        return this;
    };

    fetch_emails(markSeen) {
        return cy.task('fetchGmailUnseenMails', {
            username: S.gmailAccount.email, password: S.gmailAccount.password, markSeen: markSeen
        })
    };

    verify_content_of_email_for_specific_recipient(recipient, subject, content, shouldSaveLinkToLocalStorage) {
        if (D.unreadEmails[0]) {
            if (!Array.isArray(D.unreadEmailsForSpecificRecipient)) {
                D.unreadEmailsForSpecificRecipient = [];
            }
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

        this.pause(1)
        this.wait_until_spinner_disappears()

        if (tabTitle === C.tabs.history) {
            historyTab(tabTitle).should('be.visible').click()
            historyTab(tabTitle).should('have.class', 'active')
        } else {
            specificTab(tabTitle).should('be.visible').click()
            specificTab(tabTitle).should('have.class', 'active')
        }
        this.pause(1)
        this.wait_until_spinner_disappears()
        return this;
    };

    click_closed_task_filter() {
        closedTaskFilter().click();
        return this;
    }

    select_location_from_Google_Address_Lookup(el, name) {
        if (name) {
            el().type(name.substr(0, 6))
            locationPin().first().click();
        }
        return this;
    };

    select_Storage_location(value) {
        this.enterValue(storageLocationInput, value)
        this.firstLocationOnTypeahead().click()

        return this;
    };

    select_checkbox_on_first_table_row(useTableOnActiveTab) {
        this.wait_until_spinner_disappears()
        this.pause(0.5)

        if (useTableOnActiveTab) {
            checkboxOnFirstRowInResultsTableOnActiveTab().should('be.enabled').click()
        } else {
            checkboxOnFirstTableRow().should('be.enabled').click()
        }
        return this;
    };

    click_checkbox_to_select_all_rows() {
        this.wait_until_spinner_disappears()
        this.pause(1)
        checkboxToSelectAll().should('be.enabled');
        checkboxToSelectAll().click();
        return this;
    };

    press_shift_and_click_row(rowNumber, tableIndex = 0) {
        if (rowNumber) {
            cy.get("body").type("{shift}", {release: false});

            if (tableIndex === 0) {

                cy.document().then((doc) => {
                    const checkbox = doc.querySelector('.bg-grid-checkbox');
                    if (checkbox) {
                        cy.get('.bg-grid-checkbox').eq(rowNumber - 1).click({force: true});
                    } else {
                        throw new Error('Checkbox not found in DOM');
                    }
                });

                //  bsGridCheckboxes(rowNumber).click();
            } else {
                checkboxOnSpecificTableRow(rowNumber).click();
            }

            cy.get("body").type("{shift}");
        }
        return this;
    };

    check_and_uncheck_all_rows() {
        checkboxToSelectAll().click({force: true})
        this.pause(0.3)
        checkboxToSelectAll().click({force: true})
        this.pause(0.7)
        return this;
    };

    check_all_rows() {
        this.uncheck_all_rows()
        checkboxToSelectAll().click()
        checkboxToSelectAll().should('have.class', 'ng-not-empty')
        return this;
    };

    uncheck_all_rows() {
        statisticsBlock().invoke('text').then((text) => {
            if (text.includes('Selected')) {
                const selector = '[ng-model="options.selectAllToggle"]';

                const clickCheckbox = () => {
                    //statisticsBlock().scrollIntoView().should('be.visible')
                    statisticsBlock().should('exist')
                    cy.document().then((doc) => {
                        const checkbox = doc.querySelector(selector);
                        if (checkbox) {
                            cy.wrap(checkbox).click({force: true});
                        } else {
                            throw new Error('Checkbox not found in DOM');
                        }
                    });
                };

                cy.wait(1000)
                // First click
                clickCheckbox();
                cy.wait(1000)

                // Re-check the text and potentially click again
                statisticsBlock().invoke('text').then((newText) => {
                    if (newText.includes('Selected')) {
                        clickCheckbox(); // Second click if needed
                    }
                });

                cy.wait(1000)
                // Final assertion to ensure it's unchecked
                cy.document().then((doc) => {
                    const checkbox = doc.querySelector(selector);
                    if (checkbox) {
                        cy.wrap(checkbox).should('have.class', 'ng-empty');
                    }
                });
            }
        });
        return this;
    }

    click_checkbox_to_select_specific_row(rowNumber, tableIndex = 0) {
        this.pause(1)
        this.wait_until_spinner_disappears()
        firstCheckboxOnTableBody().scrollIntoView().should('be.visible')
        this.pause(1)
        this.wait_until_spinner_disappears()

        if (tableIndex === 0) {

            cy.document().then((doc) => {
                const checkbox = doc.querySelector('.bg-grid-checkbox');
                if (checkbox) {
                    cy.get('.bg-grid-checkbox').eq(rowNumber - 1).click({force: true});
                } else {
                    throw new Error('Checkbox not found in DOM');
                }
            });
            //  bsGridCheckboxes(rowNumber).click();
        } else {
            checkboxOnSpecificTableRow(rowNumber).click();
        }
        return this;
    };

    click_checkbox_to_select_specific_rows(rowNumbers) {
        this.wait_until_spinner_disappears()
        this.pause(1)

        this.check_and_uncheck_all_rows()
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

    select_checkboxes_on_specific_table_rows(rowNumberRange) {
        this.uncheck_all_rows()
            .click_checkbox_to_select_specific_row(rowNumberRange[0])
            .press_shift_and_click_row(rowNumberRange[1])
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

    click_option_on_expanded_menu(option, waitUntilSpinnerDisappears = true) {
        this.pause(0.7)
        optionOnExpandedMenu(option).should('be.visible');
        optionOnExpandedMenu(option).should('not.have.class', 'disabled')
        optionOnExpandedMenu(option).click();
        if (waitUntilSpinnerDisappears) {
            this.wait_until_spinner_disappears();
        }
        return this;
    };

    click_Mass_Download() {
        cy.document().then(doc => {
            const el = doc.querySelector('[ng-click="isMassDownloadButtonDisabled() || massDownload()"]');   // raw DOM lookup
            el.click();                                     // native click
        });
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
        this.enterValue(notesOnModal, note)
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
            textToBePresent.forEach(label => this.verify_text(modal, label))
        } else {
            this.verify_text(modal, textToBePresent)
        }
        return this;
    };

    verify_text_above_modal_footer(textToBePresent) {
        modalBodySectionAboveFooter().scrollIntoView();
        modalBodySectionAboveFooter().should('be.visible');

        if (Array.isArray(textToBePresent)) {
            textToBePresent.forEach(label => this.verify_text_regardless_of_the_DOM_structure(modalBodySectionAboveFooter, label))
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

    verify_content_of_first_row_in_results_table(content, clickReloadIconBetweenAttempts = false) {
        this.wait_until_spinner_disappears()
        cy.verifyTextAndRetry(() => firstRowInResultsTable().invoke('text'), content, {clickReloadIconBetweenAttempts: clickReloadIconBetweenAttempts});
        this.wait_until_spinner_disappears()
        return this;
    }

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

    add_Tags(tagsArray) {
        this.enter_values_on_several_multi_select_typeahead_fields([[tagsInputWithinActiveForm, tagsArray, this.lastTagOnTypeahead],]);
        return this
    }

    verify_content_of_last_row_in_results_table(content) {
        this.pause(1)
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

    verify_content_of_specific_cell_in_first_table_row(columnTitle, cellContent, headerCellTag = 'th') {

        this.verify_content_of_specific_table_row_by_provided_column_title_and_value(0, columnTitle, cellContent, headerCellTag)
        // firstRowInResultsTable(0).within(($list) => {
        //     if (cellContent) {
        //         if (this.isObject(cellContent)) {
        //             for (let property in cellContent) {
        //                 resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
        //                     cy.get('td').eq(i).invoke('text').then(function (textFound) {
        //                         assert.include(textFound, cellContent[property]);
        //                     })
        //
        //                 })
        //             }
        //         } else if (Array.isArray(cellContent)) {
        //             cellContent.forEach(function (value) {
        //                 resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
        //                     cy.get('td').eq(i).invoke('text').then(function (textFound) {
        //                         assert.include(textFound, value);
        //                     })
        //                 })
        //             })
        //         } else {
        //             resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
        //                 cy.get('td').eq(i).invoke('text').then(function (textFound) {
        //                     assert.include(textFound, cellContent.toString().trim());
        //                 })
        //             });
        //         }
        //     }
        // });
        return this;
    };

    //need a review for this replaced method -> old one is above
    //    verify_content_of_specific_cell_in_first_table_row(columnTitle, cellContent, headerCellTag = 'th') {
    //        firstRowInResultsTable().within(($list) => {
    //            if (cellContent) {
    //                if (this.isObject(cellContent)) {
    //                    for (let property in cellContent) {
    //                        resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
    //                            cy.get('td').eq(i).should(($cell) => {
    //                                expect($cell.text()).to.include(cellContent[property]);
    //                            });
    //                        });
    //                    }
    //                } else if (Array.isArray(cellContent)) {
    //                    cellContent.forEach(function (value) {
    //                        resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).invoke('index').then((i) => {
    //                            cy.get('td').eq(i).should(($cell) => {
    //                                expect($cell.text()).to.include(value);
    //                            });
    //                        });
    //                    });
    //                } else {
    //                    resultsTableHeaderFromRoot().contains(headerCellTag, columnTitle).not('ng-hide').invoke('index').then((i) => {
    //                        cy.get('td').eq(i).should(($cell) => {
    //                            expect($cell.text().trim()).to.include(cellContent.toString().trim());
    //                        });
    //                    });
    //                }
    //            }
    //        });
    //        return this;
    //    };

    verify_content_of_specific_table_row_by_provided_column_title_and_value(rowIndex, columnTitle, cellContent, headerCellTag = 'th', isCoCTable = false) {
        const self = this;

        // Decide which header to use (normal or CoC)
        const headerFn = isCoCTable ? () => cy.get('.cocTable').find('thead') : resultsTableHeader;

        headerFn()
            .contains(headerCellTag, columnTitle)
            .not('ng-hide')
            .invoke('index')
            .then((i) => {
                const getCell = () => specificRowInResultsTable(rowIndex).find('td').eq(i);

                // Normalize to array for consistent iteration
                const values = Array.isArray(cellContent) ? cellContent : [cellContent];

                values.forEach((value) => {
                    self.verify_text(getCell, value);
                });
            });

        return this;
    }

    verify_content_of_CoC_table_row_by_provided_column_title_and_value(rowIndex, columnTitle, cellContent, headerCellTag = 'th') {
        const self = this;

        cocTableHeader()
            .contains(headerCellTag, columnTitle)
            .not('ng-hide')
            .invoke('index')
            .then((i) => {
                const getCell = () => specificRowInResultsTable(rowIndex).find('td').eq(i);

                // Always work with an array for consistency
                const values = Array.isArray(cellContent) ? cellContent : [cellContent];

                values.forEach((value) => {
                    self.verify_text(getCell, value);
                });
            });

        return this;
    }

    verify_content_of_first_table_row_by_provided_column_title_and_value(columnTitle, cellContent, headerCellTag = 'th', isCoCTable = false) {
        let self = this;
        let currentEnvironment = Cypress.env('environment');

        if (isCoCTable) {
            resultsTableHeader = cy.get('.cocTable').find('thead')
            tableStriped = cy.get('.cocTable')
        }

        if (Array.isArray(cellContent)) {
            resultsTableHeader()
                .find(headerCellTag)
                .filter((i, el) => Cypress.$(el).text().trim() === columnTitle)
                .not('.ng-hide').invoke('index').then((i) => {
                tableStriped().find('td').eq(i).invoke('text').then(function (textFound) {
                    cellContent.forEach(function (value) {
                        if (value === '') {
                            tableStriped().find('td').eq(i).invoke('text').should('eq', value.toString().trim());
                        } else if (value) {
                            tableStriped().find('td').eq(i).should('contain.text', value.toString().trim());
                        }
                    });
                });
            });
        } else {
            resultsTableHeader()
                .find(headerCellTag)
                .filter((i, el) => Cypress.$(el).text().trim() === columnTitle)
                //.contains(headerCellTag, columnTitle)
                .not('.ng-hide')
                .invoke('index')
                .then((i) => {
                    const getCellText = () => tableStriped().find('td').eq(i)
                    self.verify_text(getCellText, cellContent);
                });
        }
        return this;
    }

    verify_content_of_first_row_in_results_table_on_active_tab(content) {
        this.verify_content_of_specific_row_in_results_table_on_active_tab(1, content)
        return this;
    };

    verify_content_of_specific_row_in_results_table_on_active_tab(rowNumber, content) {

        function checkValue(value) {
            if (value) {
                let getTextFn = () => {
                    return specificRowInResultsTableOnActiveTab(rowNumber).invoke('val');
                };

                const retryInterval = 500
                let timeout = 40000
                let maxAttempts = timeout / retryInterval
                cy.verifyTextAndRetry(getTextFn, value, {maxAttempts: maxAttempts, retryInterval: retryInterval});
            }
        }

        const getRow = () => specificRowInResultsTableOnActiveTab(rowNumber)

        // Always work with an array for consistency
        const values = Array.isArray(content) ? content : [content];

        values.forEach((value) => {
            this.verify_text(getRow, value);
        });

        // if (Array.isArray(content)) {
        //     content.forEach(value => checkValue(value))
        // } else {
        //     checkValue(content)
        // }
        return this;
    };

    verify_content_of_last_row_in_results_table_on_active_tab(content) {
        if (Array.isArray(content)) {
            content.forEach(value => lastRowInResultsTableOnActiveTab().should('contain', value))
        } else {
            lastRowInResultsTableOnActiveTab().should('contain', content);
        }
        return this;
    };

    sort_by_descending_order(columnTitle) {
        tableColumn_header(columnTitle).click()
        sortingArrow().parents('th').invoke('text').then((text) => {
            //cy.log('Data is sorted by  '+ text)
            if (!text.includes(columnTitle)) {
                tableColumn_header(columnTitle).click()
            }
            this.pause(1)
            this.click_element_if_has_a_class(tableColumn_header_sortingArrow(columnTitle), 'dropup')
            tableColumn_header_sortingArrow(columnTitle).should('not.have.class', 'dropup')

        });
        return this;
    };

    sort_by_ascending_order(columnTitle) {
        sortingArrow().parents('th').invoke('text').then((text) => {
            //cy.log('Data is sorted by  '+ text)
            if (!text.includes(columnTitle)) {
                tableColumn_header(columnTitle).click()
            }
            this.pause(1)
            this.click_element_if_does_NOT_have_a_class(tableColumn_header_sortingArrow(columnTitle), 'dropup')
            tableColumn_header_sortingArrow(columnTitle).should('have.class', 'dropup')

        });
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

    select_checkbox_on_first_table_row_on_active_tab(tableIndex = 0) {
        checkboxOnFirstRowInResultsTableOnActiveTab(tableIndex).click();
        return this;
    };

    select_checkbox_on_first_row_on_visible_table() {
        checkboxOnFirstRowOnVisibleTable().click();
        return this;
    };

    select_checkbox_on_last_row_on_visible_table() {
        this.wait_until_spinner_disappears()
        checkboxOnLastRowOnVisibleTable().should('be.visible');
        cy.wait(300)
        checkboxOnLastRowOnVisibleTable().click();
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

    verify_text_is_visible(elementTitle) {
        cy.contains(elementTitle).should('be.visible');
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
        this.wait_until_spinner_disappears()
        return this;
    };

    wait_all_GET_requests() {
        //  cy.wait('@all_GET_Requests')
        return this;
    };

    wait_all_POST_requests() {
        //  cy.wait('@all_POST_Requests')
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
        this.verify_url_contains_some_value(`/#/cases/${existingCaseId.toString()}/view`)
        return this;
    };

    open_item_url(existingItemId) {
        let url = `${S.base_url}/#/items/${existingItemId.toString()}/view`;
        //cy.log('Opening Item URL: ' + url);
        cy.visit(url);
        this.verify_url_contains_some_value(`/#/items/${existingItemId.toString()}/view`)
        this.wait_until_spinner_disappears()
        return this;
    };

    open_person_url(existingPersonId) {
        let url = `${S.base_url}/#/people/${existingPersonId.toString()}/view`;
        //cy.log('Opening Peron URL: ' + url);
        cy.visit(url);
        this.verify_url_contains_some_value(`/#/people/${existingPersonId.toString()}/view`)
        this.wait_until_spinner_disappears()
        return this;
    };

    open_task_url(existingTaskId) {
        let url = `${S.base_url}/#/view-task/` + existingTaskId;
        cy.visit(url);
        this.verify_url_contains_some_value(`/#/view-task/${existingTaskId.toString()}`)
        this.wait_until_spinner_disappears()
        return this;
    };

    open_newly_created_task_via_direct_link(task_id) {
        cy.getLocalStorage("newTaskId").then(newTaskId => {
            let taskId = newTaskId ? newTaskId : task_id
            let url = `${S.base_url}/#/view-task/` + taskId;
            cy.visit(url);
        })
        return this;
    };

    open_newly_created_case_via_direct_link() {
        cy.getLocalStorage("newCase").then(newCase => {
            newCase = JSON.parse(newCase);

            cy.log('Opening Case URL: ' + S.base_url + '/#/cases/' + newCase.id.toString() + '/view')
            cy.server();
            cy.intercept(S.api_url + '/api/organizations/useCaseLevelPermissions').as('getSettingsOfCLP');

            cy.visit(S.base_url + '/#/cases/' + newCase.id.toString() + '/view')
            this.verify_url_contains_some_value(`/#/cases/${newCase.id.toString()}/view`)
            this.verify_text_is_present_on_main_container('Case View')
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

    define_get_task_items_endpoint_alias() {
        this.define_API_request_to_be_awaited('POST', 'itemsV2', 'getTaskItems')
    }

    open_newly_created_task_via_direct_link() {
        cy.getLocalStorage("newTaskId").then(newTaskId => {
            //cy.log('Opening Task URL: ' + S.base_url + '/#/view-task/' + newTaskId);
            cy.visit(S.base_url + '/#/view-task/' + newTaskId);
        });
        this.define_get_task_items_endpoint_alias()
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
                if (successMessage) {
                    this.verify_toast_message(successMessage, false, timeoutInMinutes);
                }
            });
        });
        return this;
    }

    wait_search_criteria_to_be_visible() {
        this.searchParametersAccordion().should('be.visible').and('not.be.disabled');
        searchButton().should('be.enabled');
        return this;
    };

    wait_element_to_be_visible(element) {
        cy.wait(2000);
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

    edit_Description_on_first_row_on_grid(value) {
        pencilIcon().click()
        this.enterValue(descriptionOnGrid, value)
        this.press_ENTER(descriptionOnGrid)
        this.verify_toast_message('Saved')
        return this;
    };

    // wait_until_spinner_disappears(timeoutInSeconds = 80) {
    //     bodyContainer().should('not.have.class', 'pace-running', {timeout: timeoutInSeconds * 1000});
    //     bodyContainer().should('have.class', 'pace-done', {timeout: timeoutInSeconds * 1000});
    //     return this;
    // };

    // Waits for Pace spinner to finish, but never fails the test.
// Queues polling in Cypress chain; after timeout it logs and continues.
    wait_until_spinner_disappears(timeoutInSeconds = 80) {
        const timeout = timeoutInSeconds * 1000;
        const interval = 500; // ms
        const started = Date.now();

        const poll = () => {
            cy.document({log: false}).then((doc) => {
                // Pace sometimes toggles classes on <body> or <html>
                const roots = [doc.body, doc.documentElement].filter(Boolean);
                const hasSpinner = roots.some(el => el.classList.contains('pace-running'));
                const isDone = roots.some(el => el.classList.contains('pace-done'));

                if (!hasSpinner && isDone) {
                    // spinner gone -> stop polling
                    return;
                }

                const elapsed = Date.now() - started;
                if (elapsed >= timeout) {
                    // eslint-disable-next-line no-console
                    console.warn(`[wait_until_spinner_disappears] still running after ${timeoutInSeconds}s — continuing test.`);
                    return;
                }

                // wait a bit, then check again (stays inside Cypress queue)
                cy.wait(interval, {log: false}).then(poll);
            });
        };

        // enqueue the polling steps before whatever comes next
        poll();

        // allow page-object style chaining
        return this;
    }


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
            .find('[ng-message="required"]').should('be.visible');
        return this;
    }

    turn_ON_the_toggle_for_fields_on_modal(labelsArray) {
        labelsArray.forEach(fieldLabel => {
            this.turn_ON_the_toggle_for_specific_field_on_modal(fieldLabel)
        })
        return this;
    }

    turnOnToggle(label) {
        return parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
            .find('[ng-click="onSwitch($event)"]').first().click()
    }

    turnOnToggleAndReturnParentElement(label) {
        return parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
            .find('[ng-click="onSwitch($event)"]').first().click()
            .parents('.form-group').first()
    }

    // turnOnAllTogglesOnModal() {
    //     cy.get('.modal-content').find('.toggle-off').click({multiple: true})
    //     return this
    // }

    turnOnOnlySpecificTogglesOnModal(toggleNumbers) {
        cy.get('.modal-content .toggle-off')
            .filter(':contains("Off")').then($toggles => {
            let togglesToClick;

            if (toggleNumbers === 'all') {
                togglesToClick = $toggles;

            } else if (toggleNumbers === 'none') {
                togglesToClick = [];

            } else {
                // Ensure values are in array form
                const numbersArray = Array.isArray(toggleNumbers) ? toggleNumbers : [toggleNumbers];

                // Convert 1-based → 0-based
                const targetIndexes = numbersArray.map(n => n - 1);

                // Keep only elements whose index *is* in the list
                togglesToClick = $toggles.filter((i) => targetIndexes.includes(i));
            }

            cy.wrap(togglesToClick).click({multiple: true});
        });

        return this;
    }


    turnOnAllTogglesOnModal(skip) {
        cy.get('.modal-content .toggle-off')
            .filter(':contains("Off")').then($toggles => {
            let togglesToClick;

            if (skip === 'first') {
                togglesToClick = $toggles.slice(1);

            } else if (skip === 'last') {
                togglesToClick = $toggles.slice(0, -1);

            } else if (Number.isInteger(skip)) {
                // single number → 1-based -> 0-based
                const zeroIndex = skip - 1;
                togglesToClick = $toggles.filter((i) => i !== zeroIndex);

            } else if (Array.isArray(skip)) {
                // array of numbers → map 1-based -> 0-based
                const zeroIndexes = skip.map(n => n - 1);
                togglesToClick = $toggles.filter((i) => !zeroIndexes.includes(i));

            } else {
                // no skipping
                togglesToClick = $toggles;
            }

            cy.wrap(togglesToClick).click({multiple: true});
        });
        return this;
    }


    turnOnToggleAndReturnParentElementOnCustomForm(label) {
        return cy.get('.modal-content')
            .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
            .closest('.fg-field-inner')
            .as('field')
            .within(() => {
                cy.get('[ng-click="onSwitch($event)"]').click({force: true});
            })
            .then(() => cy.get('@field'));
    }

    turnOnToggleEnterValueAndPressEnterOnCustomForm(label, value) {
        this.turnOnToggleAndReturnParentElementOnCustomForm(label)
            .find('input:visible, textarea:visible')
            .first()
            .as('cfInput');
        cy.get('@cfInput')
            .should('be.enabled')
            .clear({force: true})
            .invoke('val', value).trigger('input')
        cy.get('@cfInput').type('{enter}');
    }

    enterValueAndPressEnterOnCustomForm(label, value) {
        this.turnOnToggleAndReturnParentElementOnCustomForm(label)
            .find('input:visible, textarea:visible')
            .first()
            .as('cfInput');
        cy.get('@cfInput')
            .should('be.enabled')
            .clear({force: true})
            .invoke('val', value).trigger('input')
        cy.get('@cfInput').type('{enter}');
    }


    turnOnToggleAndSelectDropdownOption(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('select').first()
            .select(value)
        this.pause(0.3)
    }

    turnOnToggleAndSelectDropdownOptionOnCustomForm(label, value) {
        this.turnOnToggleAndReturnParentElementOnCustomForm(label)
            .find('select').first()
            .select(value)
        this.pause(0.3)
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
            .invoke('val', value).trigger('input')
    }

    turnOnToggleAndEnterValueInTextareaOnCustomForm(label, value) {
        this.turnOnToggleAndReturnParentElementOnCustomForm(label)
            .find('textarea').first()
            .invoke('val', value).trigger('input')
    }

    turnOnToggleEnterValueAndPressEnter(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .should('be.enabled')
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
    }

    turnOnToggleEnterValueAndWaitApiRequestToFinishOnCustomForm(label, value, partOfApiRequest) {
        this.define_API_request_to_be_awaited('GET', partOfApiRequest)
        this.turnOnToggleAndReturnParentElementOnCustomForm(label)
            .find('input').first()
            .clear()
            .invoke('val', value).trigger('input')
        this.wait_response_from_API_call(partOfApiRequest)
    }

    turnOnToggleAndEnterValueToInputField(label, value) {
        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .clear()
            .invoke('val', value).trigger('input')
    }

    turnOnToggleAndEnterValueToInputFieldWithLastCharacterReentering(label, value, typaheadSelectorToCheck) {
        const lastChar = value.slice(-1);

        this.turnOnToggleAndReturnParentElement(label)
            .find('input').first()
            .clear()
            .invoke('val', value)
            .then($el => {
                cy.wait(500).then(() => {
                    // Check if the element exists in the DOM
                    cy.document().then(doc => {
                        const exists = doc.querySelector(typaheadSelectorToCheck);
                        if (!exists) {
                            cy.wrap($el).type('{backspace}').type(lastChar);
                        }
                    });
                });
            });
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

    enable_overwrite_existing_form_data() {
        overwriteForm().click()
        return this
    }

    click_on_replace_tags() {
        replaceTagsRadioButton().click()
        return this
    }

    turn_on_all_toggles_on_modal(labelsArray) {
        this.pause(1)
        for (let i = 0; i < labelsArray.length; i++) {
            const label = labelsArray[i];
            this.turnOnToggle(label);

            if (label === 'Category' && S.isDispoStatusEnabled()) {
                this.click('Confirm');
            }
        }

        return this;
    }

    turn_off_all_toggles_on_modal(labelsArray) {
        this.pause(1)
        for (let i = 0; i < labelsArray.length; i++) {
            const label = labelsArray[i];
            this.turnOnToggle(label);

            if (label === 'Category' && S.isDispoStatusEnabled()) {
                this.click('Confirm');
            }
        }

        return this;
    }

    enter_values_to_all_fields_on_Mass_Update_modal(labelsArray, valuesArray, itemsOrCases) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Offense Type', 'Custody Reason'].some(v => label === v)) {
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('select').first()
                    .select(value)
            } else if (['Category'].some(v => label === v)) {
                this.turnOnToggle(label)
                if (S.isDispoStatusEnabled()) this.click('Confirm')
                cy.get('[category-name="item.categoryName"]').click()
                cy.get('[repeat="category in data.categories | filter: { name: $select.search }"]').contains(value).click();

            } else if (['Tags'].some(v => label === v)) {
                // this.turnOnToggleEnterValueAndWaitApiRequestToFinish(label, value, 'tagTypeahead')
                // orgTagIconOnTagsTypeaheadList().click()

                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('input').first()
                    .clear()
                    .invoke('val', value).trigger('input')

                cy.get('[repeat="tagModel in allTagModels | filter: $select.search"]').should('be.visible')
                orgTagIconOnTagsTypeaheadList().click()

            } else if (['Status'].some(v => label === v)) {
                if (value === 'Closed') {
                    parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field').find('[title="Toggle Open/Closed"]').click();
                }
            } else if (['Review Date Notes'].some(v => label === v)) {
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('textarea').first()
                    .invoke('val', value).trigger('input')

            } else if (['Case Officer(s)'].some(v => label === v)) {
                const values = Array.isArray(value) ? value : [value];
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('.ui-select-container')
                    .first()
                    .as('userSelect');

                values.forEach(v => {
                    this.define_API_request_to_be_awaited('GET', 'api/users/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + v.replace(/\s+/g, '%20'), "getUserInTypeahead")
                    this.define_API_request_to_be_awaited('GET', '/api/userGroups/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + v.replace(/\s+/g, '%20'), "getUserGroupInTypeahead")

                    cy.get('@userSelect').click().find('input.ui-select-search')
                        .invoke('val', v).trigger('input')
                    this.pause(0.5)
                    this.wait_response_from_API_call("getUserInTypeahead", 200, null, 1500)
                    this.wait_response_from_API_call("getUserGroupInTypeahead", 200, null, 1500)
                    cy.get('.ui-select-choices-row').contains(v).click();
                });

            } else if (['Recovered By', 'Submitted By'].some(v => label === v)) {
                const lastChar = value.slice(-1);
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('input').first()
                    .clear()
                    .invoke('val', value)
                    .then($el => {
                        cy.wait(500).then(() => {
                            // Check if the element exists in the DOM
                            cy.document().then(doc => {
                                const exists = doc.querySelector(this.typeaheadSelectorMatchInMatches);
                                if (!exists) {
                                    cy.wrap($el).type('{backspace}').type(lastChar);
                                }
                            });
                        });
                    });
                firstMatchOnTypeahead().click()
            } else if (['Item Belongs to'].some(v => label === v)) {
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('input').first()
                    .clear()
                    .invoke('val', value).trigger('input')
                firstPersonOnItemBelongsToTypeahead().click()

            } else {
                parentContainerFoundByInnerLabelOnModal(label, 'tp-modal-field')
                    .find('input').first()
                    .should('be.enabled')
                    .clear()
                    .invoke('val', value).trigger('input')
                    .type('{enter}')
            }
        }
        return this
    }

    turn_on_and_enter_values_to_all_fields_on_Mass_Update_Cases_modal(labelsArray, valuesArray) {
        this.turnOnAllTogglesOnModal(7) // Open/Closed toggles and Status toggle
        this.enter_values_to_all_fields_on_Mass_Update_modal(labelsArray, valuesArray)
        return this
    }

    turn_on_and_enter_values_to_all_fields_on_modal(labelsArray, valuesArray, itemsOrCases = 'items') {

        if (itemsOrCases === 'items') {
            this.turnOnAllTogglesOnModal(5)
        } else {
            this.turnOnAllTogglesOnModal(7) // Open/Closed toggles and Status toggle
        }
        this.enter_values_to_all_fields_on_Mass_Update_modal(labelsArray, valuesArray)
        return this
    }

    turn_on_and_enter_values_to_all_fields_on_custom_form_modal(labelsArray, valuesArray) {

        this.turnOnAllTogglesOnModal()

        for (let i = 0; i < labelsArray.length; i++) {
            const label = labelsArray[i];
            const value = valuesArray[i];

            if (['Textbox', 'Email', 'Custom Number', 'Password'].some(v => label === v)) {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('input')
                    .first()
                    .should('be.enabled')
                    .clear()
                    .invoke('val', value).trigger('input')
            } else if (label === 'Textarea') {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('textarea')
                    .first()
                    .should('be.enabled')
                    .clear()
                    .invoke('val', value).trigger('input')
            } else if (label === 'Checkbox') {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('input[type="checkbox"]:visible')
                    .first()
                    .then($cb => {
                        if (value) cy.wrap($cb).check(); else cy.wrap($cb).uncheck();
                    });

            } else if (label === 'Checkbox List') {
                const values = Array.isArray(value) ? value : [value];
                values.forEach(v => cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .contains('.checkbox, .checkbox-inline, label', new RegExp(`^\\s*${v}\\s*$`))
                    .find('input[type="checkbox"]')
                    .check());
            } else if (label === 'Radiobutton List') {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .contains('.radio, .radio-inline, label', new RegExp(`^\\s*${value}\\s*$`))
                    .find('input[type="radio"]')
                    .check();

            } else if (label === 'Select List') {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('select').first()
                    .select(value)

            } else if (label === 'Dropdown Typeahead') {
                // this.define_API_request_to_be_awaited('GET',
                //     'optionsTypeahead?search=' + value.replace(/\s+/g, '%20'),
                //     'getOptionTypeahead')

                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('input')
                    .first()
                    .as('cfInput')
                    .clear()
                    .invoke('val', value).trigger('input')
                // this.wait_response_from_API_call("getOptionTypeahead", 200, null, 2000)
                // cy.get('@cfInput').type('{enter}')
                cy.get('[ng-repeat="match in matches track by $index"]').first().click()

            } else if (label === 'User/User Group') {
                const values = Array.isArray(value) ? value : [value];
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('.ui-select-container')
                    .first()
                    .as('userSelect');

                values.forEach(v => {
                    this.define_API_request_to_be_awaited('GET', 'api/users/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + v.replace(/\s+/g, '%20'), "getUserInTypeahead")
                    this.define_API_request_to_be_awaited('GET', '/api/userGroups/multiselecttypeahead?showEmail=true&searchAccessibleOnly=false&search=' + v.replace(/\s+/g, '%20'), "getUserGroupInTypeahead")

                    cy.get('@userSelect').click().find('input.ui-select-search')
                        .invoke('val', v).trigger('input')
                    this.pause(0.5)
                    this.wait_response_from_API_call("getUserInTypeahead", 200, null, 1500)
                    this.wait_response_from_API_call("getUserGroupInTypeahead", 200, null, 1500)
                    cy.get('.ui-select-choices-row').contains(v).click();
                });
            } else if (label === 'Custom Person') {
                const values = Array.isArray(value) ? value : [value];
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('[typeahead="l.id as l.text for l in getPerson($viewValue) | limitTo: 10"]')
                    .first()
                    .as('personSelect');

                values.forEach(v => {
                    // this.define_API_request_to_be_awaited('GET',
                    //     'people/typeahead',
                    //     "getPeopleInTypeahead")

                    cy.get('@personSelect').invoke('val', v).trigger('input')
                    //  this.wait_response_from_API_call("getPeopleInTypeahead", 200, null, 2000)
                    cy.get('[ng-repeat="match in matches track by $index"]').first().click();
                });
            } else if (label === 'Custom Date') {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('input[tp-datepicker-popup][ng-model="ngModel"]')
                    .filter(':visible')
                    .first()
                    .scrollIntoView()
                    .click({force: true})
                    .clear({force: true})
                    .invoke('val', value).trigger('input')
                    .type('{enter}')
                    .blur();
            } else {
                cy.get('.modal-content')
                    .contains('.fg-field-inner label, .fg-field-inner .control-label', new RegExp(`^\\s*${label}\\s*$`))
                    .closest('.fg-field-inner')
                    .find('input:visible, textarea:visible')
                    .first()
                    .should('be.enabled')
                    .clear({force: true})
                    .invoke('val', value).trigger('input')
                cy.get('@cfInput').type('{enter}');
            }
        }

        return this;
    }

    choose_custom_form_from_mass_update_cf_modal(itemObject) {
        customDataType().select(`number:${itemObject.id}`, {force: true}).trigger('change');

        return this;
    }


    enter_values_to_all_fields_on_modal(labelsArray, valuesArray) {

        for (let i = 0; i < labelsArray.length; i++) {
            let label = labelsArray[i]
            let value = valuesArray[i]

            if (['Offense Type', 'Custody Reason'].some(v => label === v)) {
                this.findElementByLabelAndSelectDropdownOption(label, value)
            } else if (label === 'Recovered By') {
                cy.get('[name="recoveredBy"]').clear().type(value)
                cy.wait(2000)
                cy.get('[name="recoveredBy"]').type('{enter}');

            } else if (label === 'Submitted By') {
                cy.get('[name="submittedBy"]').clear().type(value)
                cy.wait(2000)
                cy.get('[name="submittedBy"]').type('{enter}');

            } else if (['Status'].some(v => label === v)) {
                if (value === 'Closed') {
                    parentContainerFoundByInnerLabelOnModal(labelsArray[i]).find('[title="Toggle Open/Closed"]').click();
                }
            } else if (['Review Date Notes'].some(v => label === v)) {
                this.findElementByLabelAndEnterValueInTextarea(label, value)

            } else if (['Case Officer(s)'].some(v => label === v)) {
                this.findElementByLabelAndSelectTypeaheadOptionsOnMultiSelectField(label, value)
            } else if (label === 'Offense Location') {
                cy.get('[name="offenseLocation"]').clear().type(value).click();
            } else if (label === 'Recovered At') {
                cy.get('[name="recoveryLocation"]').clear().type(value).click();
            } else if (label === 'Recovery Date') {
                //this.enterValue(recoveryDate, value)
                //   this.findElementByLabelEnterValueAndPressEnter(label, value)
                cy.get('.col-md-8 > .test > .input-group').clear().type(value)
                cy.wait(1000)
                cy.get('.col-md-8 > .test > .input-group').type('{enter}')

            } else if (label === 'Item Belongs to') {
                this.enterValue(itemBelongsTo, value)
                firstPersonOnItemBelongsToTypeahead().click()
            } else if (['Category'].some(v => label === v)) {
                cy.get('[category-name="item.categoryName"]').click()
                cy.get('[repeat="category in data.categories | filter: { name: $select.search }"]').contains(value).click();
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

    verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledOptions, disabledOptions) {
        actionsContainerOnSearchPage().should('have.class', 'open')
        this.wait_until_spinner_disappears()

        actionsContainerOnSearchPage().within(($list) => {
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
        this.type_if_values_provided([
            [textboxOnCustomForm, dataObject.custom_textbox],
            [emailOnCustomForm, dataObject.custom_email],
            [numberOnCustomForm, dataObject.custom_number],
            [passwordOnCustomForm, dataObject.custom_password],
            [textareaOnCustomForm, dataObject.custom_textarea],
            [dropdownTypeaheadOnCustomForm, dataObject.custom_dropdownTypeaheadOption, dropdownTypeaheadOption],
            [personOnCustomForm, dataObject.custom_personEmail, dropdownTypeaheadOption],
            [dateOnCustomForm, dataObject.custom_date]
        ]);

        this.enter_values_on_several_multi_select_typeahead_fields([// [user_userGroup_OnCustomForm, dataObject.custom_user_or_group_names, userAndUserGroupTypeaheadOption]
            [user_userGroup_OnCustomForm, dataObject.custom_user_or_group_names, "usersCF"]])

        if (dataObject.custom_selectListOption) {
            selectListOnCustomForm().select(dataObject.custom_selectListOption);
            selectListOnCustomForm().should('contain', dataObject.custom_selectListOption);
        }

        checkboxOnCustomForm().click()
        firstOptionOnCheckboxListOnCustomForm().click()
        secondOptionOnRadiobuttonListOnCustomForm().click()
        return this;
    }

    enable_all_standard_columns_on_the_grid(page, isDispoStatusEnabled) {
        let numnerOfFieldsOnMenuCustomization = isDispoStatusEnabled ? page.numberOfAllColumnsWithDispoStatusEnabled : page.numberOfStandardColumns

        menuCustomization().click()
        optionsOnMenuCustomization().click()
        pageSizeAndColumnsContianer().within(($list) => {
            enabledColumnsOnMenuCustomization().its('length').then(function (length) {
                if (length < numnerOfFieldsOnMenuCustomization + 1) {
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

    enable_columns_for_specific__Custom_Form_on_the_grid(customFormName, count) {
        menuCustomization().click();
        customFormsSectionOnMenuCustomization().click();
        this.enterValue(searchCustomFormsOnMenuCustomization, customFormName);

        cy.get('[ng-if="customFieldsToggle.isOpen"]').then(($body) => {
            if ($body.find('.glyphicon-remove').length > 0) {
                cy.get('body').then(($page) => {
                    let selectorToUse = $page.find(disabledColumnsOsOnMenuCustomization().selector).length > 0 ? disabledColumnsOsOnMenuCustomization_PENTEST : disabledColumnsOsOnMenuCustomization;

                    selectorToUse().then(($elements) => {
                        let clickCount = Math.min(count, $elements.length);

                        for (let i = 0; i < clickCount; i++) {
                            cy.wrap($elements.eq(i)).should('be.visible').click();
                            if (i < clickCount - 1) {
                                menuCustomization().click();
                            }
                        }
                    });
                });
            } else {
                menuCustomization().click();
            }
        });
        return this;
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

    populate_CheckIn_form(returnedBy, usePreviousLocation, fullLocationPath, note) {
        returnedByInput().type(returnedBy.email);
        this.click_option_on_typeahead(returnedBy.fullName);
        if (usePreviousLocation === true) {
            usePreviousLocationCheckbox().click();
        } else {
            this.select_Storage_location(fullLocationPath)
        }
        this.enter_notes_on_modal(note);
        return this;
    }

    populate_CheckOut_form(takenBy_personOrUserObject, checkoutReason, notes, expectedReturnDate) {
        checkedOutToInput().invoke('val', takenBy_personOrUserObject.email).trigger('input')
        // checkedOutToInput().type(takenBy_personOrUserObject.email);
        this.pause(0.5)
        this.click_option_on_typeahead(takenBy_personOrUserObject.fullName);

        checkedReasonSelect().select(checkoutReason)
        this.enter_notes_on_modal(notes);

        if (expectedReturnDate) {
            this.enterValue(expectedReturnDateInput, expectedReturnDate)
        }
        return this;
    }

    populate_Transfer_form(transferTo_user, transferFrom_user, notes) {
        this.select_typeahead_option(transferFromInput, transferFrom_user.email, this.typeaheadSelectorMatchInMatches)
        this.select_typeahead_option(transferToInput, transferTo_user.email, this.typeaheadSelectorMatchInMatches)
        this.enter_notes_on_modal(notes);
        return this;
    }

    populate_Move_form(fullLocationPath, notes) {
        this.select_Storage_location(fullLocationPath)
        this.enter_notes_on_modal(notes);
        return this;
    }

    populate_disposal_form(disposalWitness_user, method, notes) {
        this.select_typeahead_option(disposalWitnessInput, disposalWitness_user.email, typeaheadSelectorMatchInMatches)
        disposalMethodsDropdown().select(method)
        this.enter_notes_on_modal(notes);
        return this;
    }

    perform_Item_CheckIn_transaction(returnedBy_userObject, usePreviousLocation, fullLocationPath, note, isActionOnSearchResults, multipleItems) {
        //const label = multipleItems ? C.dropdowns.itemActions.checkItemsIn : C.dropdowns.itemActions.checkItemIn
        let label;

        if (isActionOnSearchResults) {
            label = multipleItems ? C.dropdowns.itemActionsOnSearchResults.checkItemsIn : C.dropdowns.itemActionsOnSearchResults.checkItemIn;
        } else {
            label = multipleItems ? C.dropdowns.itemActions.checkItemsIn : C.dropdowns.itemActions.checkItemIn;
        }
        this.click_option_on_expanded_menu(label)
            .populate_CheckIn_form(returnedBy_userObject, usePreviousLocation, fullLocationPath, note)

        if (isActionOnSearchResults) {
            this.verify_modal_content(' Warning! This action will check in all items found by the current search')
            this.verify_modal_content('Items shared among Organizations are not included in the transaction')
            cy.signOnCanvas()
        }
        this.upload_file_and_verify_toast_msg('image.png', null)
        this.click_button_on_modal(C.buttons.ok)
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Checked In'
        D.editedItem.location = fullLocationPath
        return this;
    }

    perform_Item_Undisposal_transaction(returnedBy_userObject, usePreviousLocation, fullLocationPath, note, isActionOnSearchResults, multipleItems) {
        const label = multipleItems ? C.dropdowns.itemActions.undisposeItems : C.dropdowns.itemActions.undisposeItem
        this.click_option_on_expanded_menu(label)
            .populate_CheckIn_form(returnedBy_userObject, usePreviousLocation, fullLocationPath, note)

        if (isActionOnSearchResults) {
            this.verify_modal_content(' Warning! This action will check in all items found by the current search')
            this.verify_modal_content('Items shared among Organizations are not included in the transaction')
        }
        this.upload_file_and_verify_toast_msg('image.png', null)
        this.click_button_on_modal(C.buttons.ok)
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Checked In'
        D.editedItem.location = fullLocationPath
        return this;
    }

    perform_Item_Check_Out_transaction(takenBy_personOrUserObject, checkOutReason, notes, expectedReturnDate, isActionOnSearchResults, multipleItems) {
        const label = multipleItems ? C.dropdowns.itemActions.checkItemsOut : C.dropdowns.itemActions.checkItemOut
        this.click_option_on_expanded_menu(label)
            .populate_CheckOut_form(takenBy_personOrUserObject, checkOutReason, notes, expectedReturnDate)

        if (isActionOnSearchResults) {
            this.verify_modal_content('This action will check out all items found by the current search')
            // ToDo: we need to ensure that Item Sharing/CLP is ON/OFF in Org before verifying the full warning.
            //  For now, I’ve excluded the part related to shared/CLP items. It can be added later once we define the precondition for displaying this part of the warning in the test
            //this.verify_modal_content('- Items shared among Organizations')
        }
        this.upload_file_and_verify_toast_msg('image.png', null)

        this.click_button_on_modal(C.buttons.ok)
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Checked Out'
        D.editedItem.location = ''
        D.editedItem.custodian = takenBy_personOrUserObject.fullName

        return this;
    }

    perform_Item_Transfer_transaction(transferTo_userObject, transferFrom_userObject, notes, isActionOnSearchResults, multipleItems) {
        const label = multipleItems ? C.dropdowns.itemActions.transferItems : C.dropdowns.itemActions.transferItem
        this.define_API_request_to_be_awaited('POST', 'api/transfers/V2')
        this.click_option_on_expanded_menu(label)
            .populate_Transfer_form(transferTo_userObject, transferFrom_userObject, notes)

        if (isActionOnSearchResults) {
            this.verify_modal_content(' Warning! This action will transfer all items found by the current search')
            this.verify_modal_content('Items shared among Organizations are not included in the transaction')
            cy.signOnCanvas()
        }
        this.upload_file_and_verify_toast_msg('image.png', null)
        this.click_button_on_modal(C.buttons.ok)
            //.wait_response_from_API_call('api/transfers/V2')
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Checked Out'
        D.editedItem.location = ''
        D.editedItem.custodian = transferTo_userObject.fullName
        return this;
    }

    perform_Item_Move_transaction(fullLocationPath, notes, isActionOnSearchResults, multipleItems) {
        const label = multipleItems ? C.dropdowns.itemActions.moveItems : C.dropdowns.itemActions.moveItem
        this.click_option_on_expanded_menu(label)
        cy.wait(1000)
        this.populate_Move_form(fullLocationPath, notes)

        if (isActionOnSearchResults) {
            this.verify_modal_content(' Warning! This action will move all items found by the current search')
            this.verify_modal_content('Items shared among Organizations are not included in the transaction')
        }
        this.upload_file_and_verify_toast_msg('image.png', null)
        this.click_button_on_modal(C.buttons.ok)
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Checked In'
        D.editedItem.location = fullLocationPath
        return this;
    }

    perform_Item_Disposal_transaction(witness_userObject, method, notes, isItemInContainer, isActionOnSearchResults, multipleItems) {
        const label = multipleItems ? C.dropdowns.itemActions.disposeItems : C.dropdowns.itemActions.disposeItem
        this.click_option_on_expanded_menu(label)
        if (isItemInContainer) {
            this.pause(1)
            this.click_button_on_sweet_alert('Ok')
        }

        this.populate_disposal_form(witness_userObject, method, notes, isItemInContainer)

        if (isActionOnSearchResults) {
            this.verify_modal_content(' Warning! This action will dispose all items found by the current search')
            this.verify_modal_content('Items shared among Organizations are not included in the transaction')
        }
        this.upload_file_and_verify_toast_msg('image.png', null)
        this.click_button_on_modal(C.buttons.ok)
            .verify_toast_message('Saved')
            .wait_until_spinner_disappears()
        D.editedItem.status = 'Disposed'
        D.editedItem.location = ''
        return this;
    }


};
export default basePage
