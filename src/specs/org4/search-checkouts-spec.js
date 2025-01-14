const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const helper = require('../../support/e2e-helper');

const orgAdmin = S.getUserData(S.userAccounts.orgAdmin),
    powerUser = S.getUserData(S.userAccounts.powerUser),
    regularUser = S.getUserData(S.userAccounts.clpUser),
    notEquals = C.searchCriteria.inputFields.notEquals,
    equals = C.searchCriteria.inputFields.equals,
    contains = C.searchCriteria.inputFields.contains,
    before_ = C.searchCriteria.dates.before,
    after = C.searchCriteria.dates.after,
    between = C.searchCriteria.dates.between,
    exactly = C.searchCriteria.dates.exactly,
    newerThanX = C.searchCriteria.dates.newerThanX,
    olderThanX = C.searchCriteria.dates.olderThanX,
    betweenXandY = C.searchCriteria.dates.betweenXandY,
    currentWeek = C.searchCriteria.dates.currentWeek,
    lastWeek = C.searchCriteria.dates.lastWeek,
    monthToDate = C.searchCriteria.dates.monthToDate,
    lastMonth = C.searchCriteria.dates.lastMonth,
    yearToDate = C.searchCriteria.dates.yearToDate,
    lastYear = C.searchCriteria.dates.lastYear

describe('Search Checkouts', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet()
        D.checkout = {
            checkedOutTo: D.newPerson.name,
            checkedOutBy: orgAdmin.name,
            reason: S.selectedEnvironment.checkoutReason.name,
            //notes: D.randomNo,
            notes: 'Note for Checked Out Item',
            expectedReturnDate: '',
            itemsCount: 1,
            mediaCount: 0,
        }
        api.cases.add_new_case()
        api.items.add_new_item();
        D.newPerson.active = true
        api.people.add_new_person();
        api.transactions.check_out_item()
    });

    context('1 Org Admin', function () {

        context('1.1 Checked Out To', function () {

            it.only("1.1.1 'equals' correct Person's name", function () {
                ui.app.log_title(this);
                api.auth.get_tokens(orgAdmin);
                ui.menu.click_Search__Checkouts();
                ui.searchCheckOuts.enter_CheckedOutTo(D.newPerson.email)
                    .click_Search()
                    .verify_data_on_the_grid(D.checkout)
                    .verify_results_count(1)
            });

            it("1.1.2 'not equals' another Person's name + transaction date", function () {
                ui.app.log_title(this);
                api.auth.get_tokens(orgAdmin);
                ui.menu.click_Search__Checkouts();
                ui.searchCheckOuts.enter_CheckedOutTo(S.selectedEnvironment.person.email, notEquals)
                    .enter_CheckOutDate(exactly, S.currentDate)
                    .click_Search()
                    .sort_by_descending_order('Transaction Date')
                    .verify_data_on_the_grid(D.checkout)
            });

        });


    });
});
