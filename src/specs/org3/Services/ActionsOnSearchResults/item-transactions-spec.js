const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let person = S.getUserData(S.selectedEnvironment.person);

let startTime;

for (let i = 0; i < 10; i++) {
    describe('Item Transactions on Action on Search Results', function () {

        before(function () {
            startTime = Date.now();
            api.auth.get_tokens(orgAdmin);
            api.users.update_current_user_settings(orgAdmin.id)
            api.org_settings.enable_all_Item_fields(C.itemFields.dispositionStatus);
            api.org_settings.enable_all_Person_fields()
            D.box2 = D.getStorageLocationData('BOX_2')
            api.locations.add_storage_location(D.box2)
        });

        after(() => {
            const endTime = Date.now();
            const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);
            cy.log(`⏱ Total time for suite: ${totalSeconds} seconds`);
        });

        it('1. Verify Check Out transaction with Uploaded Media and No Signature', function () {

            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item(true, null, 'newItem1')
            ui.menu.click_Search__Item()
            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Checked In', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_Check_Out_transaction(powerUser, C.checkoutReasons.lab, 'Check Out from Actions on Search Results', null, true, true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem1').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    // we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Notes', 'Check Out from Actions on Search Results']],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)
            })
        });

        it('2. Verify Transfer transaction with Uploaded Media and Signature Optional', function () {

            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, 'both', "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item()
            api.transactions.check_out_item()
            ui.menu.click_Search__Item()
            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Checked Out', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_Transfer_transaction(powerUser, orgAdmin, 'Transfer from Actions on Search Results', true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    // TODO: we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'Transfer'], ['Issued From', orgAdmin.name], ['Issued To', powerUser.name], ['Storage Location', ``], ['Check out Reason', ``], ['Note', `Transfer from Actions on Search Results`]],
                        [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``], ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)

            });
        });

        it('3. Verify Check In transaction with Uploaded Media and Signature Required', function () {

            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, true, "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item()
            api.transactions.check_out_item()
            ui.menu.click_Search__Item()
            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Checked Out', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_CheckIn_transaction(powerUser, false, D.box2.name, 'Check In from Actions on Search Results', true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    /// TODO: we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `Check In from Actions on Search Results`]],
                        [['Type', 'Out'], ['Issued From', orgAdmin.name], ['Issued To', person.fullName], ['Storage Location', ``], ['Check out Reason', `Court`], ['Note', `Note for Checked Out Item`]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)

            });
        });

        it('4. Verify Dispose transaction with Uploaded Media and No Signature', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item()
            ui.menu.click_Search__Item()

            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Checked In', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_Disposal_transaction(powerUser, C.disposalMethods.auctioned, 'Disposed from Actions on Search Results', false, true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    // TODO: we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', `Disposed from Actions on Search Results`]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)

            });
        });

        it('5. Verify Undispose transaction with Uploaded Media and No Signature', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item()
            api.transactions.dispose_item()
            ui.menu.click_Search__Item()
            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Disposed', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_Undisposal_transaction(powerUser, false, D.box2.name, 'Undispose from Actions on Search Results', true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    // TODO: we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'In'], ['Issued From', powerUser.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Check out Reason', ``], ['Note', `Undispose from Actions on Search Results`]],
                        [['Type', 'Disposal'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', ''], ['Witness', powerUser.name], ['Storage Location', ''], ['Check out Reason', ``], ['Note', D.randomNo]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)

            });
        });

        it('6. Verify Move transaction with Uploaded Media and No Signature', function () {

            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.org_settings.update_org_settings(false, true, false, "~person.firstName~ ~person.lastName~")
            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.items.add_new_item()
            ui.menu.click_Search__Item()
            ui.searchItem.search_with_minimum_required_fields_and_click_Actions_on_Search_Results
            ('Checked In', S.selectedEnvironment.office_1.name,  D.newItem.description)
                .perform_Item_Move_transaction(D.box2.name, 'Move from Actions on Search Results', true)
                .verify_text_is_present_on_main_container('Actions on Search Results Jobs')
                .sort_by_descending_order('Start Date')
                .verify_content_of_first_row_in_results_table('Completed')

            cy.getLocalStorage('newItem').then(item => {
                ui.app.open_item_url(JSON.parse(item).id)
                ui.itemView.select_tab(C.tabs.chainOfCustody)
                    // TODO: we should add verification for signature (true-false)
                    .verify_data_on_Chain_of_Custody([
                        [['Type', 'Move'], ['Issued From', orgAdmin.name], ['Issued To', orgAdmin.name], ['Storage Location', D.box2.name], ['Note', `Move from Actions on Search Results`]],
                        [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Notes', `Item entered into system.`]],
                    ])
                    .verify_last_transaction_media_from_CoC()
                api.auth.log_out(orgAdmin)
            });
        });
    });
}