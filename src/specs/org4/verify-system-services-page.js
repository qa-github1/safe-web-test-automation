const S = require('../../fixtures/settings');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('System Services Page: verify the existing Services are in place, if a new Service gets added =>' +
    'check the status for all of those', function () {
    let user = S.userAccounts.orgAdmin;

    it('1. Verify list of already existing services are in place and all listed services have a green status', function () {
        api.auth.get_tokens(user);
        ui.menu.click_Settings__System_Services();
        ui.app.verify_system_services_page_names([
            "Exporter",
            "Importer",
            "Reporter",
            "Workflow",
            "AutoDispo",
            //"Item To ES Service",
            "ObjectToEs",
            "OrgDataDelete",
            "ScheduledJobs",
            "PersonMerge",
            "ChangePrimaryCase",
            "ItemMassUpdate",
            "Verifications",
            "TransactionByQuery",
            "SharedViews",
            "MassUpdateByQuery",
            "LocationsMove",
            "ReassignUsers"
        ]);
        ui.app.verify_system_services_page_status();
    });
});
