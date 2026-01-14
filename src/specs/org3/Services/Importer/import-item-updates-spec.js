const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const E = require('../../../../fixtures/files/excel-data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');
const _ = require('lodash');

// Aug 11, 2025, Sumejja's Note ----> All tests pass on Dev - Org#3 ---> Total time: 600 sec (10 min)

describe('Import Item Updates', function () {

    let orgAdmin = S.userAccounts.orgAdmin;

    before(function () {
        api.auth.get_tokens(orgAdmin);
        api.users.update_current_user_settings(orgAdmin.id)
        api.org_settings.update_org_settings(true, true)
        api.org_settings.enable_all_Item_fields();
        D.generateNewDataSet();
        api.cases.add_new_case(D.newCase.caseNumber);
        api.items.add_new_item(false);
        cy.getLocalStorage("newItem").then(newItem => {
            D.newItem = Object.assign(D.newItem, JSON.parse(newItem))
        })
    });
    //TODO: Sumejja should check further

    it('1. Import updates for all regular and custom fields', function () {
        ui.app.log_title(this);
        let fileName = 'ItemUpdatesImport_allRegularFieldsUpdated-CustomFormAttached';

        api.auth.get_tokens(orgAdmin);
        D.editedItem.caseNumber = D.newCase.caseNumber;
        D.editedItem.people.shift()

        cy.getLocalStorage("newItem").then(newItem => {
            D.editedItem.barcode = JSON.parse(newItem).barcode
            E.editedCustomFieldsValues = E.generateCustomValues()
            D.editedItem = Object.assign(D.editedItem, D.newCustomFormData)
            E.generateDataFor_ITEMS_Importer([D.editedItem], S.customForms.itemFormWithOptionalFields, true);
            cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

            cy.log(" 🟢🟢🟢  Verify Item Data Precheck 🟢🟢🟢  ")
            ui.importer.precheck_import_data(fileName, C.importTypes.items, true)
            ui.app.open_newly_created_item_via_direct_link()
            ui.itemView.select_tab(C.tabs.history)
                .verify_title_on_active_tab(1)

            cy.log(" 🟢🟢🟢  Verify Item Updates Import -- With Custom Form Attached And Initially Populated By Importer 🟢🟢🟢  ")
            ui.importer.open_direct_url_for_page()
                .click_Play_icon_on_first_row()
                .check_import_status_on_grid('1 records imported')
            let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Case'])
            ui.itemView.open_newly_created_item_via_direct_link()
                .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)
                .verify_custom_data_on_Edit_form(D.newCustomFormData)
                .open_last_history_record()
                .verify_all_values_on_history(D.editedItem, D.newItem, S.customForms.itemFormWithOptionalFields, true, D.newCustomFormData)
                .verify_red_highlighted_history_records(allEditedFields)

            fileName = 'ItemUpdatesImport_CustomFieldsUpdated';
            cy.log(" 🟢🟢🟢  Verify Item Updates Import -- With Custom Data Updated By Importer 🟢🟢🟢  ")
            E.editedCustomFieldsValues = E.generateEditedCustomValues()
            D.editedItem = Object.assign(D.editedItem, D.editedCustomFormData)
            E.generateDataFor_ITEMS_Importer([D.editedItem], S.customForms.itemFormWithOptionalFields, true);
            cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);

            cy.log(" 🟢🟢🟢  Verify Item Updates Import 🟢🟢🟢  ")
            ui.importer.import_data(fileName, C.importTypes.items, true)
            ui.itemView.open_newly_created_item_via_direct_link()
                .click_Edit()
                .verify_custom_data_on_Edit_form(D.editedCustomFormData)
        });
    });

    if (S.isFullRegression()) {

        it('2. Import update for item status (Check Out transaction)', function () {
            ui.app.log_title(this);
            let fileName = 'ItemUpdatesImport_CheckOut_' + S.domain;

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            api.cases.add_new_case();
            api.items.add_new_item(false);

            D.editedItem.caseNumber = D.newCase.caseNumber;
            D.getCheckedOutItemData()
            D.newItem.checkedOutNotes = 'Checked_out_through_Importer';
            let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;
            let CoC_checkout = S.chainOfCustody.SAFE.checkout(D.editedItem);

            cy.getLocalStorage("newItem").then(newItem => {
                D.editedItem.barcode = JSON.parse(newItem).barcode
                E.generateDataFor_ITEMS_Importer([D.editedItem], null, true);
                E.itemImportDataWithAllFields[1][9] = S.selectedEnvironment.person.guid;
                cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);
                ui.importer.import_data(fileName, C.importTypes.items, true)

                let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Case', 'Status', 'Storage Location', 'Custodian'])
                ui.itemView.open_newly_created_item_via_direct_link()
                    .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .select_tab(C.tabs.chainOfCustody)
                    .verify_content_of_sequential_rows_in_results_table([
                        CoC_checkout,
                        CoC_newItemEntry
                    ])
                    .open_last_history_record()
                    .verify_all_values_on_history(D.editedItem, D.newItem)
                    .verify_red_highlighted_history_records(allEditedFields)
            });
        });

        it('3. Import update for item status (CheckIn transaction)', function () {
            ui.app.log_title(this);
            let fileName = 'ItemUpdatesImport_CheckIn_' + S.domain;

            api.auth.get_tokens(orgAdmin);
            D.generateNewDataSet()
            D.getEditedItemData(S.selectedEnvironment.oldActiveCase)
            D.getCheckedInItemData(S.selectedEnvironment.locations[0])
            api.cases.add_new_case();

            // set 'true' as a first parameter in the next line when the issue in the following card gets fixed : '[Importer] ‘Error updating items in Elastic Search’ when performing ‘CheckIn/Undispose’ transaction'
            api.items.add_new_item(false, null,);
            api.transactions.check_out_item();

            D.newItem.location = '';
            D.newItem.status = 'Checked Out';
            D.editedItem.status = 'Checked In';
            let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;
            let CoC_checkin = S.chainOfCustody.SAFE.checkin(D.editedItem);

            cy.getLocalStorage("newItem").then(newItem => {
                D.editedItem.barcode = JSON.parse(newItem).barcode
                E.generateDataFor_ITEMS_Importer([D.editedItem], null, true);
                cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);
                ui.importer.import_data(fileName, C.importTypes.items, true)
                //add 'Case' when issue from the point above is fixed
                let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Status', 'Storage Location', 'Custodian'])
                ui.itemView.open_newly_created_item_via_direct_link()
                    .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)

                D.getCheckedOutItemData()
                let CoC_checkout = S.chainOfCustody.SAFE.checkout(D.editedItem)
                ui.itemView
                    .select_tab(C.tabs.chainOfCustody)
                    .verify_content_of_sequential_rows_in_results_table([
                        CoC_checkin,
                        CoC_checkout,
                        CoC_newItemEntry
                    ])
                D.getCheckedInItemData(S.selectedEnvironment.locations[0], 'newItem')

            });
            let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Status', 'Storage Location', 'Custodian'])

            ui.itemView.open_last_history_record()
                .verify_all_values_on_history(D.editedItem, D.newItem, false)
                .verify_red_highlighted_history_records(allEditedFields)
        });

        //TODO: Sumejja should check further
        it('4. Import update for item status (Move transaction)', function () {
            ui.app.log_title(this);
            let fileName = 'ItemUpdatesImport_Move_' + S.domain;

            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Item_fields();
            D.generateNewDataSet();
            api.cases.add_new_case();
            api.items.add_new_item(false);
            let originalItem = _.cloneDeep(D.newItem);
            //D.newItem.caseNumber = D.newCase.caseNumber
            D.editedItem.caseNumber = D.newCase.caseNumber;

            //D.getEditedItemData(S.selectedEnvironment.oldActiveCase, S.selectedEnvironment.locations[1])
            D.getMovedItemData(S.selectedEnvironment.locations[1])
            let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;
            let CoC_move = S.chainOfCustody.SAFE.move(D.editedItem);

            cy.getLocalStorage("newItem").then(newItem => {
                D.editedItem.barcode = JSON.parse(newItem).barcode
                E.generateDataFor_ITEMS_Importer([D.editedItem], null);
                cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);
                ui.importer.import_data(fileName, C.importTypes.items, true)
                let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Case', 'Storage Location'])
                ui.itemView.open_newly_created_item_via_direct_link()
                    .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .select_tab(C.tabs.chainOfCustody)
                    .verify_content_of_sequential_rows_in_results_table([
                        CoC_move,
                        CoC_newItemEntry
                    ])
                    .open_last_history_record()
                    .verify_all_values_on_history(D.editedItem, originalItem)
                    .verify_red_highlighted_history_records(allEditedFields)
            });
        });

        //TODO: Sumejja should check further
        it('5. Import update for item status (Disposal transaction)', function () {
            ui.app.log_title(this);
            let fileName = 'ItemUpdatesImport_Disposal_' + S.domain;

            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Item_fields([C.itemFields.dispositionStatus, C.itemFields.releasedTo]);
            D.generateNewDataSet();
            D.getEditedItemData(S.selectedEnvironment.oldActiveCase);
            api.cases.add_new_case();
            //in all these tests I changed true to false
            //need a review if this is OK because I had issues with verifying and comparing history
            // especially case number fields
            api.items.add_new_item(false);
            //also, I added this to keep source new item data on the history right side
            let originalItem = _.cloneDeep(D.newItem);
            D.editedItem.caseNumber = D.newCase.caseNumber;

            //D.newItem.caseNumber = D.newCase.caseNumber;
            D.getDisposedItemData()
            D.newItem.actualDisposedDate = '';
            D.editedItem.disposalNotes = 'Disposed_through_Importer'
            // let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;
            // let CoC_disposal = S.chainOfCustody.SAFE.disposal(D.editedItem);

            cy.getLocalStorage("newItem").then(newItem => {
                D.editedItem.barcode = JSON.parse(newItem).barcode;
                E.generateDataFor_ITEMS_Importer([D.editedItem], null);
                E.itemImportDataWithAllFields[1][22] = S.selectedEnvironment.users.powerUser.guid;
                //E.itemImportDataWithAllFields[1][24] = D.newItem.dispositionStatus;
                cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);
                ui.importer.import_data(fileName, C.importTypes.items, true)

                let allEditedFieldsWithoutDisposition = C.itemFields.allFieldsOnHistory.filter(f => f !== 'Disposition Status');
                let allEditedFieldsWithoutReleasedTo = C.itemFields.allEditableFieldsArray.filter(f => f !== 'Released To');
                let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Case', 'Status', 'Storage Location'])
                ui.itemView.open_newly_created_item_via_direct_link()
                    .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .click_Edit()
                    .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)
                    .select_tab(C.tabs.chainOfCustody)
                     .verify_data_on_Chain_of_Custody([
                         [['Type', 'Disposals'], ['Issued From', D.editedItem.disposedByName], ['Issued To', D.editedItem.disposedByName], ['Notes', D.editedItem.disposalNotes]],
                         [['Type', 'In'], ['Issued From', orgAdmin.name], ['Issued To', 'New Item Entry'], ['Storage Location', D.newItem.location], ['Notes', `Item entered into system.`]],
                     ])
                    .open_last_history_record()
                    ui.itemView.verify_all_values_on_history(D.editedItem, originalItem)
                    .verify_red_highlighted_history_records(allEditedFieldsWithoutDisposition, allEditedFieldsWithoutReleasedTo, allEditedFields)
                    .click_button_on_modal(C.buttons.cancel);
            });
        });

        //TODO: Sumejja should check further
        it('6. Import update for item status (Undispose transaction)', function () {
            ui.app.log_title(this);
            let fileName = 'ItemUpdatesImport_Undispose_' + S.domain;

            api.auth.get_tokens(orgAdmin);
            api.org_settings.enable_all_Item_fields();
            api.org_settings.setDisposalReleaseOverride([orgAdmin.id])
            D.generateNewDataSet();
            D.getEditedItemData(S.selectedEnvironment.oldActiveCase);
            api.cases.add_new_case();
            api.items.add_new_item(false);
            api.transactions.dispose_item();

            D.getDisposedItemData();
            D.getCheckedInItemData(S.selectedEnvironment.locations[1]);
            D.newItem.location = '';
            D.newItem.status = 'Disposed';
            D.editedItem.status = 'Checked In';

            let CoC_newItemEntry = S.chainOfCustody.SAFE.newItemEntry;
            let CoC_disposal = S.chainOfCustody.SAFE.disposal(D.newItem);
            let CoC_undispose = S.chainOfCustody.SAFE.checkin(D.editedItem);

            cy.getLocalStorage("newItem").then(newItem => {
                D.editedItem.barcode = JSON.parse(newItem).barcode;

                E.generateDataFor_ITEMS_Importer([D.editedItem], null, true);

                const barcodeIndex = E.itemImportDataWithAllFields[0].indexOf('ItemBarcode');
                const personGuidIndex = E.itemImportDataWithAllFields[0].indexOf('Returned By');

                E.itemImportDataWithAllFields[1][barcodeIndex] = D.editedItem.barcode;
                E.itemImportDataWithAllFields[1][personGuidIndex] = S.selectedEnvironment.person.guid;

                cy.generate_excel_file(fileName, E.itemImportDataWithAllFields);
                ui.importer.import_data(fileName, C.importTypes.items, true)
            });
            let allEditedFields = C.itemFields.allEditableFieldsArray.concat(['Status', 'Storage Location', 'Disposition Status']);

            ui.itemView.open_newly_created_item_via_direct_link()
                .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFields, D.editedItem, D.newItem, true, true)
                .click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFields, D.editedItem, D.newItem, true, true)
                .select_tab(C.tabs.chainOfCustody)
                .verify_content_of_sequential_rows_in_results_table([
                    CoC_undispose,
                    CoC_disposal,
                    CoC_newItemEntry
                ])
                .open_last_history_record()
                .verify_all_values_on_history(D.editedItem, D.newItem, false)
                .verify_red_highlighted_history_records(allEditedFields);
        });
    }

});
