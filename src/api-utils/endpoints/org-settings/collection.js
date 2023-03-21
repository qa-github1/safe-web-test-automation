const D = require('../../../fixtures/data');
const S = require('../../../fixtures/settings');
const generic_request = require('../../generic-api-requests');
const items = require('../items/collection');
const people = require('../people/collection');
const auth = require('../auth');
const body = require('./payload');

exports.get_current_org_settings = function (organizationId) {
    organizationId = organizationId || S.selectedEnvironment.orgSettings.id;

    generic_request.GET(
        '/api/organizations/' + organizationId,
        "Fetching the current Org Settings via API",
        'orgSettings');

};

exports.update_org_settings_by_specifying_property_and_value = function (property, value) {
    exports.get_current_org_settings();

    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;
        orgSettings[property] = value

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            orgSettings,
            "Org Settings updated via API",
            'orgSettings');
    });
    return this
};

exports.update_org_settings = function (useCLP, itemBelongsToShowsAllPeople, touchScreenSignature) {
    exports.get_current_org_settings();

    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            body.generate_request_payload_for_editing_Org(orgSettings, useCLP, itemBelongsToShowsAllPeople, touchScreenSignature),
            "Org Settings updated via API",
            'orgSettings');
    });
    return this
};

exports.set_Org_Level_Case_Number_formatting = function (
    isFormattingRequired,
    isDefaultCaseNumberPrefix,
    isAutoIncrementCaseNumberOn,
    formattingPattern,
    defaultPrefix,
    nextCaseNumber,
    formattingValidationMessageAtOrgLevel) {

    exports.get_current_org_settings();

    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            body.generate_request_payload_for_setting_Case_Number_Formatting(
                orgSettings,
                isFormattingRequired,
                isDefaultCaseNumberPrefix,
                isAutoIncrementCaseNumberOn,
                formattingPattern,
                defaultPrefix,
                nextCaseNumber,
                formattingValidationMessageAtOrgLevel),
            "Case Number Formatting updated via API");
    });
    return this
};

exports.set_Office_Level_Case_Number_formatting = function (officeId1, formattingPattern1, defaultPrefix1, formattingValidationMessageAtOrgLevel) {

    exports.get_current_org_settings();

    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            body.generate_request_payload_for_setting_Case_Number_Formatting_for_Offices(
                orgSettings,
                officeId1,
                formattingPattern1,
                defaultPrefix1,
                formattingValidationMessageAtOrgLevel),
            "Case Number Formatting updated via API");
    });
    return this
};

exports.disable_all_Office_Level_Case_Number_formattings = function () {

    exports.get_current_org_settings();

    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;
        orgSettings.caseNumberOfficeConfigurations = undefined;

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            orgSettings,
            "Case Number Formatting updated via API");
    });
    return this
};

exports.set_Next_Case_Number = function (nextCaseNumber) {
    cy.getLocalStorage("orgSettings").then(orgSettings => {
        orgSettings = JSON.parse(orgSettings);
        S.selectedEnvironment.orgSettings = orgSettings;

        orgSettings.nextCaseNumber = nextCaseNumber;

        generic_request.PUT(
            '/api/organizations/' + orgSettings.id,
            body.generate_request_payload_for_setting_Case_Number_Formatting(
                orgSettings,
                null,
                null,
                null),
            "Case Number Formatting updated via API");
    });
    return this;
};

exports.set_Case_Level_Permissions_on_Org_Settings = function (useCLP) {
    people.add_new_person(D.setNewRandomNo());
    items.add_new_item(false);
    exports.update_org_settings(useCLP);
    return this;
};

exports.enable_all_Case_fields = function (fieldsToDisable, optionalFields) {
    generic_request.POST(
        '/api/organizations/0/fields',
        body.generate_request_payload_for_setting_visible_and_required_Case_fields(fieldsToDisable, optionalFields),
        "Enabled all Case fields in Org Settings via API");
    return this;
};

exports.disable_Case_fields = function (fieldsToEnable) {
    generic_request.POST(
        '/api/organizations/0/fields',
        body.generate_request_payload_for_disabling_Case_fields(fieldsToEnable),
        "Disabled all configurable Case fields in Org Settings via API");
    return this;
};

exports.enable_all_Item_fields = function (fieldsToDisable, optionalFields) {
    exports.get_current_org_settings();
    generic_request.POST(
        '/api/organizations/1/fields',
        body.generate_request_payload_for_setting_visible_and_required_Item_fields(fieldsToDisable, optionalFields),
        "Enabled all Item fields in Org Settings via API");
    return this;
};

exports.disable_Item_fields = function (fieldsToEnable) {
    exports.get_current_org_settings();
    generic_request.POST(
        '/api/organizations/1/fields',
        body.generate_request_payload_for_disabling_Item_fields(fieldsToEnable),
        "Disabled all configurable Item fields in Org Settings via API");
    return this;
};

exports.enable_all_Person_fields = function () {
    generic_request.POST(
        '/api/organizations/2/fields',
        [],
        "Enabled all Person fields in Org Settings via API");
    return this;
};

exports.disable_Person_fields = function (fieldsToKeepEnabled) {
    generic_request.POST(
        '/api/organizations/2/fields',
        body.generate_request_payload_for_disabling_Person_fields(fieldsToKeepEnabled),
        "Disabled all configurable Person fields in Org Settings via API");
    return this;
};

exports.set_required_User_forms = function (formIds) {
    generic_request.PUT(
        '/api/userForms/updateUserForms/',
        formIds,
        "Setting required User Forms via API");
    return this;
};
