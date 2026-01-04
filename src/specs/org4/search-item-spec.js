const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);

describe('Search Item', function () {

    let user = S.getUserData(S.userAccounts.orgAdmin);
    let equals = C.searchCriteria.inputFields.equals;


    before(function () {
        api.auth.get_tokens(user);
        api.org_settings.enable_all_Item_fields();
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item(true);
    });

    beforeEach(function () {
        api.auth.get_tokens(user);
        ui.app.reload_page();
    });

    after(function () {
        api.auth.log_out(user);
    });

    it('S.I_1. Search by Item Description', function () {
        ui.app.log_title(this);
        let itemDescription = D.newItem.description;

        ui.searchItem.run_search_by_Item_Description(itemDescription)
            .verify_content_of_first_row_in_results_table(itemDescription);
    });

    context('S.I_2. Search by Item Description AND', function () {
        //TODO: Sumejja should check further
        xit('S.I_2.1 Created By', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            api.auth.get_tokens(S.userAccounts.orgAdmin)
            api.items.add_new_item(true);

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Created_By(user.email)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription)
                .verify_records_count_on_grid(2)
        });

        it('S.I_2.2 Created Date', function () {
            ui.app.log_title(this);
            let currentDate = ui.app.getCurrentDate();
            let itemDescription = D.newItem.description;
            let exactly = C.searchCriteria.dates.exactly

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Created_Date(currentDate, exactly)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });


        it('S.I_2.3 Custody Reason', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .select_Custody_Reason(D.newItem.custodyReason)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.4 Recovery Date', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Recovery_Date(D.newItem.recoveryDate)
                .click_button(C.buttons.search)
               // .verify_content_of_first_row_in_results_table(itemDescription);
            // TODO: Adjust test after we get card #19720
        });

        it('S.I_2.5 Recovered At', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Recovered_At(D.newItem.recoveryLocation)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.6 Status', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .select_Status(D.newItem.status)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.7 Recovered By', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Recovered_By(D.newItem.recoveredBy)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.8 Storage Location', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Storage_Location(D.newItem.location)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.9 Category', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .select_Category(D.newItem.category)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.10 Make', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Make(D.newItem.make)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.11 Model', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Model(D.newItem.model)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });

        it('S.I_2.12 Serial Number', function () {
            ui.app.log_title(this);
            let itemDescription = D.newItem.description;

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Description(equals, itemDescription)
                .enter_Serial_Number(D.newItem.serialNumber)
                .click_button(C.buttons.search)
                .verify_content_of_first_row_in_results_table(itemDescription);
        });
    });

});
