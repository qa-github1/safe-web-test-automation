const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);

describe('Item Transactions & Actions', function () {


    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.users.update_current_user_settings(orgAdmin.id)
        api.org_settings.disable_Item_fields(['Description']);
        api.org_settings.enable_all_Person_fields()
    });

    it('1. Verify Check Out transaction and enabled/disabled actions for Checked Out item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item In',
            'Transfer Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item Out',
            'Move Item',
            'Undispose Item',
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link();

        ui.itemView.check_Out_the_item(orgAdmin, C.checkoutReasons.lab, 'test-note', D.currentDate)
            .verify_Items_Status('Checked Out')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
    });

    it('2. Verify Transfer transaction and enabled/disabled actions for Checked Out item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item In',
            'Transfer Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item Out',
            'Move Item',
            'Undispose Item',
        ]

        api.auth.get_tokens(orgAdmin);
         D.generateNewDataSet()
         api.items.add_new_item(false);
         ui.app.open_newly_created_item_via_direct_link();

        ui.itemView
            .check_Out_the_item(orgAdmin, C.checkoutReasons.lab, 'test-note', D.currentDate)
            .transfer_the_item(powerUser, 'test-note')
            .verify_Items_Status('Checked Out')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
    });

    it('3. Verify Check Item In transaction and enabled/disabled actions for Checked In item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item Out',
            'Move Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Transfer Item',
            'Undispose Item'
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        api.transactions.check_out_item()
        ui.app.open_newly_created_item_via_direct_link();

        ui.itemView.check_In_the_item(powerUser, true, 'test-note')
            .verify_Items_Status('Checked In')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
    });

    it('4. Verify Dispose transaction and enabled/disabled actions for Disposed item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Undispose Item',
            'Duplicate',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Check Item Out',
            'Move Item',
            'Transfer Item',
            'Dispose Item',
           // 'Split' // uncomment this when bugs gets fixed -- card  #14841 /#20
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link();

        ui.itemView.dispose_the_item(powerUser, C.disposalMethods.auctioned, 'test-note')
            .verify_Items_Status('Disposed')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
    });

    it('5. Verify Undispose transaction and enabled/disabled actions for Checked In item', function () {
        ui.app.log_title(this);
        const enabledActions = [
            'Check Item Out',
            'Move Item',
            'Dispose Item',
            'Duplicate',
            'Split',
            'Manage Cases']

        const disabledActions = [
            'Check Item In',
            'Transfer Item',
            'Undispose Item'
        ]

        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        api.items.add_new_item(false);
        api.transactions.dispose_item()
        ui.app.open_newly_created_item_via_direct_link();

        ui.itemView.undispose_the_item(powerUser, true, 'test-note')
            .verify_Items_Status('Checked In')
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
    });
});
