const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let user = S.getUserData(S.userAccounts.orgAdmin2);

describe('Chain of Custody', function () {

    let CoC_checkout = S.chainOfCustody.SAFE.checkedOut;
    let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;

    beforeEach(function () {
        cy.restoreLocalStorage();
    });

    before(function () {
        api.auth.get_tokens(user);

        api.users.update_current_user_settings(user.id, C.currentDateTimeFormat, C.currentDateFormat)
        api.org_settings.update_org_settings()

        D.generateNewDataSet();
        api.org_settings.enable_all_Person_fields();
        api.org_settings.enable_all_Item_fields();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item(true);
        ui.app.reload_page();
        cy.saveLocalStorage();
    });

    it('CoC_1. New Item Entry', function () {
        ui.app.log_title(this);

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView.select_tab(C.tabs.chainOfCustody)
            .verify_content_of_first_row_in_results_table(CoC_newItemEntry)
    });

    it('CoC_1. Check Out', function () {
        ui.app.log_title(this);

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView.check_Out_the_item(
            S.selectedEnvironment.person.email, CoC_checkout.checkoutReason, CoC_checkout.notes, CoC_checkout.expectedReturnDate)
            .select_tab(C.tabs.chainOfCustody)
            .verify_content_of_sequential_rows_in_results_table([
                CoC_checkout,
                CoC_newItemEntry
            ])
    });

});
