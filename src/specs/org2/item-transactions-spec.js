const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let person = S.getUserData(S.selectedEnvironment.person);

describe('Item Transactions & Actions', function () {


    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.users.update_current_user_settings(orgAdmin.id)
        //api.org_settings.disable_Item_fields(['Description']);
        api.org_settings.enable_all_Item_fields(C.itemFields.dispositionStatus);
        api.org_settings.enable_all_Person_fields()
        api.org_settings.update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
        D.box2 = D.getStorageLocationData('BOX_2')
        api.locations.add_storage_location(D.box2)

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
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Check_Out_transaction(orgAdmin, C.checkoutReasons.lab, 'test-note1', D.currentDate)
        ui.itemView.verify_Items_Status('Checked Out')
            .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``],  ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
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
        api.transactions.check_out_item()
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Transfer_transaction(powerUser, orgAdmin, 'test-note2')
           ui.itemView.verify_Items_Status('Checked Out')
               .verify_edited_and_not_edited_values('view', ["Custodian"], D.editedItem, D.newItem)
               .select_tab(C.tabs.chainOfCustody)
               .verify_data_on_Chain_of_Custody([
                   [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``],  ['Check out Reason', ``], ['Note', `test-note2`]],
                   [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``],  ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                   [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
               ])
               .select_tab(C.tabs.basicInfo)
               .click_Actions()
               .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
       ui.searchItem.run_search_by_Item_Description(D.newItem.description)
           .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
           .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
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
        api.locations.add_storage_location('Box_2')
        ui.app.open_newly_created_item_via_direct_link();
        let initialItem = Object.assign({}, D.newItem)


        ui.app.click_Actions()
            .perform_Item_CheckIn_transaction(powerUser, false, D.box2.name, 'test-note3')
            ui.itemView.verify_Items_Status('Checked In')
            .click_Actions()
            ui.itemView.verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
                .verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name],  ['Check out Reason', ``], ['Note', `test-note3`]],
                [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``],  ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)

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
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Disposal_transaction(powerUser, C.disposalMethods.auctioned, 'test-note4')
            ui.itemView.verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
        ui.itemView.verify_Items_Status('Disposed')
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location',''],  ['Check out Reason', ``], ['Note', `test-note4`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)
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
        let initialItem = Object.assign({}, D.newItem)

        ui.app.click_Actions()
            .perform_Item_Undisposal_transaction(powerUser, false, D.box2.name, 'test-note5')
        ui.itemView.verify_edited_and_not_edited_values('view', ["Status", "Storage Location"], D.editedItem, D.newItem)
                .verify_Items_Status('Checked In')
            .select_tab(C.tabs.chainOfCustody)
            .verify_data_on_Chain_of_Custody([
                [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name],  ['Check out Reason', ``], ['Note', `test-note5`]],
                [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location',''],  ['Witness', powerUser.name], ['Storage Location',''],  ['Check out Reason', ``], ['Note', D.randomNo]],
              //  [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name],  ['Check out Reason', ``], ['Note', `test-note3`]],
               // [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``],  ['Check out Reason', ``], ['Note', `test-note2`]],
               // [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ``],  ['Check out Reason', `Lab`], ['Note', `test-note1`]],
                [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', initialItem.location], ['Notes', `Item entered into system.`]],
            ])
            .select_tab(C.tabs.basicInfo)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown(enabledActions, disabledActions)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .select_row_on_the_grid_that_contains_specific_value(D.newItem.description)
            .click_Actions()
            .verify_enabled_and_disabled_options_under_Actions_dropdown_on_Search_Page(enabledActions, disabledActions)

        //api.locations.get_and_save_any_location_data_to_local_storage('root')
       // api.locations.move_location('Box_2', 'root')

    });
});
