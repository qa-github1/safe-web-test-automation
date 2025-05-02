const S = require('../../fixtures/settings');
const C = require('../../fixtures/constants');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Reports', function () {

    // before(function () {
    //     api.auth.get_tokens(S.userAccounts.orgAdmin);
    //     api.org_settings.enable_all_Case_fields();
    //     api.org_settings.enable_all_Person_fields();
    //     api.org_settings.enable_all_Item_fields();
    // });

    context('Verify generating and opening Report "Primary Label 4X3"', function () {

        it.only('1. Report from Case View page - Items tab', function () {


            api.auth.get_tokens(S.userAccounts.orgAdmin);
            cy.window().then((win) => {
                cy.stub(win, 'open').as('windowOpen');
            });
            ui.app.open_case_url(S.selectedEnvironment.oldActiveCase.id)
                .select_tab(C.tabs.items)
                .select_checkbox_for_all_records()
                .click_element_on_active_tab(C.buttons.reports)
                .click_option_on_expanded_menu(C.reports.primaryLabel4x3)
            cy.get('@windowOpen').should('have.been.called');
            cy.get('@windowOpen').should('have.been.calledWithMatch', /Report.*\.pdf/);
                ui.app.verify_toast_message(C.toastMsgs.reportRunning);
            // cy.verify_report_gets_open_in_new_tab_with_xvfb('CaseView_ItemsTab_Report_' + C.reports.primaryLabel4x3)
            // ui.app.verify_content_of_PDF_file()
        });

        // it('2. Report from Item View page - Cases tab', function () {
        //     api.auth.get_tokens(S.userAccounts.orgAdmin);
        //     ui.app.open_item_url(S.selectedEnvironment.itemForReport.id)
        //         .select_tab(C.tabs.cases)
        //         .select_checkbox_on_first_table_row()
        //         .click_element_on_active_tab(C.buttons.reports)
        //         .click_option_on_expanded_menu(C.reports.primaryLabel4x3)
        //         .verify_toast_message(C.toastMsgs.reportRunning);
        //      cy.verify_report_gets_open_in_new_tab_with_xvfb('ItemsView_CasesTab_Report_' + C.reports.primaryLabel4x3)
        // });
        //
        // it('3. Report from Person View page - Items Belonging To tab', function () {
        //     api.auth.get_tokens(S.userAccounts.orgAdmin);
        //     ui.app.open_person_url(S.selectedEnvironment.personForReport.id)
        //         .select_tab(C.tabs.itemsBelongingTo)
        //         .select_checkbox_on_first_table_row_on_active_tab()
        //         .click_element_on_active_tab(C.buttons.reports)
        //         .click_option_on_expanded_menu(C.reports.primaryLabel4x3)
        //         .verify_toast_message(C.toastMsgs.reportRunning);
        //     cy.verify_report_gets_open_in_new_tab_with_xvfb('PersonView_ItemsBelongingTo_Report_' + C.reports.primaryLabel4x3)
        //
        // });
        // });
        //
        //
        // context('Verify generating and opening Report "Evidence List / Report by Case - Landscape"', function () {
        //
        //     it('1. Report from Case View page - Basic Info', function () {
        //         api.auth.get_tokens(S.userAccounts.orgAdmin);
        //         ui.app.open_case_url(S.selectedEnvironment.caseForReport.id)
        //             .click_element_on_active_tab(C.buttons.reports)
        //             .click_option_on_expanded_menu(C.reports.printCaseAndPeopleOnly)
        //             .click_option_on_expanded_menu(C.reports.evidenceList)
        //             .verify_toast_message(C.toastMsgs.reportRunning);
        //        cy.verify_report_gets_open_in_new_tab_with_xvfb(C.reports.evidenceList);
        //       // cy.compare_image_with_the_baseline(C.reports.evidenceList);
        //
        //         // cy.readFile('./image-comparison/snapshots/' + C.reports.evidenceList + '.png', 'base64').then((img) => {
        //         //     cy.allure().attachment('test', img, 'image/png')
        //         // })
        //
        //     });
        //
        //     it('2. Report from Item View page - Basic Info', function () {
        //         api.auth.get_tokens(S.userAccounts.orgAdmin);
        //         ui.app.open_item_url(S.selectedEnvironment.itemForReport.id)
        //             .click_element_on_active_tab(C.buttons.reports)
        //             .click_option_on_expanded_menu(C.reports.evidenceList)
        //            .verify_toast_message(C.toastMsgs.reportRunning);
        //         cy.verify_report_gets_open_in_new_tab_with_xvfb('ItemsView_BasicInfo_Report_' + C.reports.evidenceList)
        //        // cy.compare_image_with_the_baseline('ItemsView_BasicInfo_Report_' + C.reports.evidenceList);
        //     });
        // });
        //
        // context('Verify generating and opening Report "Property Release Form"', function () {
        //
        //     it('1. Report from Person View page - Cases Involved tab', function () {
        //         api.auth.get_tokens(S.userAccounts.orgAdmin);
        //         ui.app.open_person_url(S.selectedEnvironment.personForReport.id)
        //             .select_tab(C.tabs.casesInvolved)
        //             .select_checkbox_on_first_table_row_on_active_tab()
        //             .click_element_on_active_tab(C.buttons.reports)
        //             .click_option_on_expanded_menu(C.reports.printCaseAndPeopleOnly)
        //             .click_option_on_expanded_menu(C.reports.selectPeople)
        //             .click_option_on_expanded_menu(C.reports.propertyReleaseForm)
        //             .select_checkbox_on_specific_table_row_on_modal(1)
        //             .click(C.buttons.runReport)
        //             .verify_toast_message(C.toastMsgs.reportRunning);
        //          cy.verify_report_gets_open_in_new_tab_with_xvfb('PersonView_CasesInvolved_Person_1_Report_' + C.reports.propertyReleaseForm);
        //
        //         ui.app.click_element_on_active_tab(C.buttons.reports)
        //             .click_option_on_expanded_menu(C.reports.propertyReleaseForm)
        //             .select_checkbox_on_specific_table_row_on_modal(1)
        //             .select_checkbox_on_specific_table_row_on_modal(2)
        //             .click(C.buttons.runReport)
        //             .verify_toast_message(C.toastMsgs.reportRunning);
        //          cy.verify_report_gets_open_in_new_tab_with_xvfb('PersonView_CasesInvolved_Person_2_Report_' + C.reports.propertyReleaseForm)
        //     });
        //
        //     it('2. Report from Item Search page', function () {
        //         api.auth.get_tokens(S.userAccounts.orgAdmin);
        //         ui.searchItem.run_search_by_Item_Description(S.selectedEnvironment.itemForReport.descrption)
        //             .select_checkbox_on_first_table_row()
        //             .click_button(C.buttons.reports)
        //             .click_option_on_expanded_menu(C.reports.propertyReleaseForm);
        //          cy.verify_report_gets_open_in_new_tab_with_xvfb('ItemsView_BasicInfo_Report_' + C.reports.propertyReleaseForm)
        //     });
         });
});
