const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const authApi = require("../../api-utils/endpoints/auth");
const casesApi = require("../../api-utils/endpoints/cases/collection");
const orgSettingsApi = require("../../api-utils/endpoints/org-settings/collection");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let oldCase = S.selectedEnvironment.oldActiveCase;
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_officeAdmin = S.selectedEnvironment.admin_permissionGroup;

before(function () {
    api.auth.get_tokens(orgAdmin);
    D.generateNewDataSet();
    api.cases.add_new_case(D.newCase.caseNumber);
    api.org_settings.enable_all_Person_fields();
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat)
    api.auth.get_tokens(powerUser);
    api.users.update_current_user_settings(powerUser.id, C.currentDateTimeFormat)
});

describe('Add Item', function () {

    context('1. Org Admin', function () {

        it.only('1.1 All fields enabled ' +
            '-- "Item Belongs To Shows All People" turned ON in Org Settings -- multiple people not linked to Primary Case are selected in "Item Belongs to" field ', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.enable_all_Item_fields();
            D.newItem.itemBelongsTo = [S.selectedEnvironment.person.name, S.selectedEnvironment.person_2.name]

            api.items.add_new_item()
            ui.app.open_newly_created_item_via_direct_link()
            ui.itemView.click_Actions()
                .click('Check Item Out')
                .click_Checkbox('Check Out to Organization')

        });
    });
});
