const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const E = require('../../../../fixtures/files/excel-data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);

// Aug 11, 2025, Sumejja's Note ----> All tests pass on Dev - Org#3 ---> Total time: 420 sec (7 min)
describe('Import Items', function () {

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.org_settings.enable_all_Case_fields();
        api.org_settings.enable_all_Person_fields();
        api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat, C.currentDateFormat)
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
    });

    it('1. Item with all regular and custom fields - Checked In status', function () {
        ui.app.log_title(this);
        let fileName = 'ItemImport_allFields_' + S.domain;
        api.auth.get_tokens(orgAdmin);

        D.getNewItemData(D.newCase);

        E.generateDataFor_ITEMS_Importer([D.newItem], S.customForms.itemFormWithOptionalFields);
        cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

        api.org_settings.enable_all_Item_fields();

        // verify item data precheck
        ui.importer.precheck_import_data(fileName, C.importTypes.items)
        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .verify_records_count_on_grid(0)

        // verify item import
        ui.importer.open_direct_url_for_page()
            .click_Play_icon_on_first_row()
            //.verify_toast_message([C.toastMsgs.importComplete, 1 + C.toastMsgs.recordsImported])
            .check_import_status_on_grid('1 records imported')

        ui.searchItem.run_search_by_Item_Description(D.newItem.description)
            .verify_content_of_first_row_in_results_table(D.newItem.description)
            .click_button(C.buttons.view);
        ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
            .click_button_on_active_tab(C.buttons.edit)
            .verify_values_on_Edit_form(D.newItem, true)
            // .select_tab(C.tabs.chainOfCustody)
            // .verify_content_of_sequential_rows_in_results_table([
            //     CoC_disposal_ItemEntry
            // ])
            .open_last_history_record()
            .verify_all_values_on_history(D.newItem, null, S.customForms.itemFormWithOptionalFields, true, D.newCustomFormData)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(1)
    });

    if (S.isFullRegression()) {
        //TODO: Sumejja should check further
        it.only('2. Item with all fields - Disposed Status', function () {
            ui.app.log_title(this);
            let fileName = 'ItemImport_allFields_Disposed_' + S.domain;
            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Item_fields();

            D.getNewItemData(D.newCase);
            D.getDisposedItemData('newItem')
            D.newItem.disposedDate = D.newItem.actualDisposedDate
            D.newItem.actualDisposedDate = '';
            D.newItem.disposalNotes = 'Imported Disposed item';
            let CoC_disposal_ItemEntry = S.chainOfCustody.SAFE.disposal(D.newItem);

            E.generateDataFor_ITEMS_Importer([D.newItem]);
            cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

            ui.menu.click_Tools__Data_Import();
            ui.importer.import_data(fileName, C.importTypes.items)

            ui.searchItem.run_search_by_Item_Description(D.newItem.description)
                .verify_item_data_on_grid(D.newItem)
                .click_button(C.buttons.view);

            ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
                .click_button_on_active_tab(C.buttons.edit)
                .verify_values_on_Edit_form(D.newItem)
                .select_tab(C.tabs.chainOfCustody)
                .verify_data_on_Chain_of_Custody([
                    [['Type', 'Disposals'], ['Issued From', D.newItem.disposalUser], ['Issued To', D.newItem.disposedByName], ['Notes', D.newItem.disposalNotes]],
                ])
                .open_last_history_record()
                .verify_all_values_on_history(D.newItem)
                .click_button_on_modal(C.buttons.cancel)
                .verify_title_on_active_tab(1)
        });

        it('3. Item with all fields - Checked Out Status', function () {
            ui.app.log_title(this);
            let fileName = 'ItemImport_allFields_CheckedOut_' + S.domain;
            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Item_fields();

            D.getNewItemData(D.newCase);
            D.getCheckedOutItemData(true)
            D.newItem.checkedOutNotes = 'Imported Checked Out item';
            D.newItem.custodianGuid = S.selectedEnvironment.person.email;
            let CoC_checkout_ItemEntry = S.chainOfCustody.SAFE.checkout(D.newItem);

            E.generateDataFor_ITEMS_Importer([D.newItem]);
            cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

            ui.importer.import_data(fileName, C.importTypes.items)

            ui.searchItem.run_search_by_Item_Description(D.newItem.description)
                .verify_item_data_on_grid(D.newItem)
                .click_button(C.buttons.view);

            ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
                .click_button_on_active_tab(C.buttons.edit)
                .verify_values_on_Edit_form(D.newItem)
                .select_tab(C.tabs.chainOfCustody)
                .verify_content_of_sequential_rows_in_results_table([
                    CoC_checkout_ItemEntry
                ])
                .open_last_history_record()
                .verify_all_values_on_history(D.newItem)
                .click_button_on_modal(C.buttons.cancel)
                .verify_title_on_active_tab(1)
        });

        it('4. Item with minimum number of fields', function () {
            ui.app.log_title(this);
            let fileName = 'ItemImport_minimumFields_' + S.domain;
            api.auth.get_tokens(orgAdmin);

            D.getItemDataWithReducedFields(D.newCase, [C.itemFields.description]);
            E.generateDataFor_ITEMS_Importer([D.newItem]);
            cy.generate_excel_file(fileName, E.itemImportDataWithMinimumFields);

            api.org_settings.disable_Item_fields([C.itemFields.description]);

            ui.importer.import_data(fileName, C.importTypes.items)

            ui.menu.click_Search__Item();
            ui.searchItem.enter_Created_Date(D.newItem.createdDate, C.searchCriteria.dates.exactly)
                .enter_Description(C.searchCriteria.inputFields.equals, D.newItem.description)
                .click_button(C.buttons.search)
                .sort_by_descending_order(C.itemFields.orgNo)
                .click_View_on_first_table_row();
            ui.itemView.verify_Item_View_page_is_open(D.newCase.caseNumber)
                .click_button_on_active_tab(C.buttons.edit)
                .verify_values_on_Edit_form(D.newItem)
                .open_last_history_record()
                .verify_all_values_on_history(D.newItem)
                .click_button_on_modal(C.buttons.cancel)
                .verify_title_on_active_tab(1)
        });

        it('5. Import 1k items', function () {
            ui.app.log_title(this);
            var numberOfRecords = 1000
            let fileName = numberOfRecords + '_Items_' + S.domain;
            api.auth.get_tokens(orgAdmin);

            D.getNewCaseData();
            api.cases.add_new_case();

            D.getNewItemData(D.newCase)
            D.newItem.description = D.currentDateAndRandomNumber
            E.generateDataFor_ITEMS_Importer([D.newItem], false, false, numberOfRecords);
            cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

            api.org_settings.enable_all_Item_fields();

            ui.menu.click_Tools__Data_Import();
            ui.importer.upload_then_Map_and_Submit_file_for_importing(fileName, C.importTypes.items, C.importMappings.minimumCaseFields, null, 2)
                .verify_toast_message([
                    C.toastMsgs.importComplete,
                    numberOfRecords + C.toastMsgs.recordsImported], false, 2);
            ui.app.open_newly_created_case_via_direct_link()
                .select_tab(C.tabs.items)
                .verify_title_on_active_tab(numberOfRecords)
        });
    }
});
