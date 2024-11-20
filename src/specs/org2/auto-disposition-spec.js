const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const DF = require('../../support/date-time-formatting');
const C = require('../../fixtures/constants');
const E = require('../../fixtures/files/excel-data');
const api = require('../../api-utils/api-spec');
const helper = require('../../support/e2e-helper');
const ui = require('../../pages/ui-spec');

let user = S.getUserData(S.userAccounts.orgAdmin);

before(function () {
    api.auth.get_tokens(user)
    api.users.update_current_user_settings(user.id, C.currentDateTimeFormat, C.currentDateFormat)
    D.generateNewDataSet();
});

describe('Auto-Disposition', function () {

    it('1 Verify auto-dispo can be enabled and disabled in Org Settings', function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(false);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition)
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types()
        ui.autoDispo.click_Edit()
            .turn_On_the_toggle()
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .click_Edit()
            .turn_Off_the_toggle()
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved);
    });

    it('2. Verify Save button is disabled for Follow Up Days', function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
        ui.autoDispo.click_Edit()
            .clear_and_enter_value_for_Days_to_follow_up(C.offenseTypes.arson, '')
            .verify_save_auto_dispo_button_is_disabled()
            //.click_Save()
           // .verify_toast_message(C.toastMsgs.daysCanOnlyBePositiveNumber);
    });

    context('3. Verify "Re-Distribute Case Review Dates" functionality', function () {

        let minDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2025, 11, 15);
        let maxDate = helper.setDate(C.currentDateTimeFormat.dateOnly.editMode, 2025, 11, 15);
        let redistributeNote = 'Redistributing Case Review dates from ' + minDate + ' to ' + maxDate;

        before(function () {
            api.auth.get_tokens(user);
            api.org_settings.enable_all_Case_fields();
            api.auto_disposition.edit(true);
            api.users.update_current_user_settings(user.id, DF.dateTimeFormats.long)
        });

        it('3.1 Verify "Re-Distribute" for "Past Due" cases', function () {
            api.auth.get_tokens(user);
            ui.menu.click_Settings__Organization()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
            ui.autoDispo.verify_Redistribute_Case_Review_Date_labels(true)

            D.generateNewDataSet()
            D.getDataForMultipleCases(3)
            let fileName = 'Case_pastDueReview';
            D.case1.reviewDate = '';
            D.case2.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.long.mask, '01/08/2019');
            D.case3.reviewDate = helper.getSpecificDateInSpecificFormat(DF.dateTimeFormats.long.mask, '01/08/2030');

            // import 3 cases (NO Review Date, Review Date past due and Upcoming Review Date )
            E.generateDataFor_CASES_Importer([D.case1, D.case2, D.case3]);
            ui.app.generate_excel_file(fileName, E.caseImportDataWithAllFields);
            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases, null, 1, null,
                ['Some Review Dates are blank. They will be auto-applied. Select Import to proceed.'])
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    3 + C.toastMsgs.recordsImported])

            // redistribute dates and verify Review Date and notes again
            D.case2.reviewDate = minDate;
            D.case2.reviewDateNotes = redistributeNote;

            ui.menu.click_Settings__Organization()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            ui.autoDispo.verify_Redistribute_Case_Review_Date_labels(false, 1, 2)
                .click_button(C.buttons.redestributeCaseReviewDates)
                .verify_modal_content(C.labels.autoDisposition.updateCases)
                .click_button(C.tabs.pastDue)
                .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
                .click_button(C.buttons.updateCases)
                .verify_toast_message(C.toastMsgs.saved)
                .verify_Redistribute_Case_Review_Date_labels(true, 0, 3)
                .quick_search_for_case(D.case2.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(D.case2);

            // // verify change is not applied for Case with 'No Review Date'
            // ui.app.quick_search_for_case(D.case1.caseNumber)
            //     .click_button(C.buttons.edit);
            // ui.caseView.verify_values_on_Edit_form(D.case1);

            // verify change is not applied for Case with 'Upcoming Review Date'
            ui.app.quick_search_for_case(D.case3.caseNumber)
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(D.case3);
        });

        // enable test just during the full regression as it takes longer to redistribute review dates
        //for all cases with upcoming review date in Org
        it('A.D.4.2 Verify "Re-Distribute" for "Upcoming" cases', function () {
            api.auth.get_tokens(user);
            D.generateNewDataSet()
            api.cases.add_new_case(D.newCase.caseNumber);
            D.setDateOnlyValues(C.currentDateTimeFormat);
            D.newCase.reviewDateEditMode = minDate;
            D.newCase.reviewDateNotes = redistributeNote;

            ui.menu.click_Settings__Organization()
                .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
            ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
            ui.autoDispo.get_statistics_for_Review_Dates()
                .click_button(C.buttons.redestributeCaseReviewDates)
                .verify_modal_content(C.labels.autoDisposition.updateCases)
                .click_button(C.tabs.upcoming)
                .populate_Update_Cases_modal(minDate, maxDate, redistributeNote)
                .click_button(C.buttons.updateCases)
                .verify_toast_message(C.toastMsgs.saved)
                .wait_until_label_disappears(C.labels.autoDisposition.pleaseWait, 360)
                .open_newly_created_case_via_direct_link()
                .click_button(C.buttons.edit);
            ui.caseView.verify_values_on_Edit_form(D.newCase);
        });
    });

    it('3.2 Verify "Close X Cases" functionality', function () {
        api.auth.get_tokens(user);
        api.auto_disposition.edit(true);
        api.cases.add_new_case();

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
        ui.autoDispo.click_Recalculate_Cases_to_Dispose()
            .get_number_of_cases_without_items()
            .click_Close_X_Cases_button()
            //.verify_modal_content(C.labels.autoDisposition.casesToBeClosed(D.newCase.caseNumber))
            .enter_Closed_date(S.currentDate)
            .click_button(C.buttons.closeCases)
            .verify_toast_message(C.toastMsgs.saved);

        ui.app.pause(3)
            .open_base_url()
            .open_newly_created_case_via_direct_link()
            .click_button(C.buttons.edit)
            .verify_text_is_present_on_main_container('Closed')
            .verify_text_is_present_on_main_container(S.currentDate)
    });

    it('3.3 Verify "Recalculate Cases to Dispose" functionality', function () {
        api.auth.get_tokens(user);
        D.getNewCaseData();
        api.auto_disposition.edit(true);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.click_disposition_Configuration_For_Case_Offense_Types();
        ui.autoDispo.click_Recalculate_Cases_to_Dispose()
            .get_number_of_cases_without_items();
        api.cases.add_new_case();
        ui.autoDispo.click_Recalculate_Cases_to_Dispose()
            .verify_labels_for_cases_to_dispose(1)
    });

    it('3.4 Verify "View X Cases" functionality', function () {
        api.auth.get_tokens(user);
        api.org_settings.enable_all_Case_fields();
        api.auto_disposition.edit(true);

        let fileName = 'Case_allFields-AutoDispo7';
        D.getNewCaseData();
        D.newCase.offenseDate = 'Jan 8, 2019';
        D.newCase.reviewDate = 'May 8, 2019';
        E.generateDataFor_CASES_Importer(D.newCase);
        cy.generate_excel_file(fileName, E.caseImportDataWithAllFields);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);
        ui.autoDispo.get_number_of_cases_without_task();

        // import case with Review Date in past and open tab again to fetch a new data
        ui.menu.click_Tools__Data_Import();
        ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.cases)
            .verify_toast_message([
                C.toastMsgs.importComplete,
                1 + C.toastMsgs.recordsImported]);

        ui.menu.click_Settings__Organization()
            .click_element_containing_link(C.labels.organization.tabs.orgSettings)
            .click_element_containing_link(C.labels.organization.tabs.autoDisposition);

        ui.autoDispo.verify_label_for_cases_without_open_tasks(1)
            .get_number_of_cases_without_task()
            .click_View_X_Cases_button()
            .verify_modal_content(C.labels.autoDisposition.viewCases)
            .verify_modal_content(D.newCase.caseNumber)
    });
});


