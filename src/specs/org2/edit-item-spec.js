const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');

describe('Edit Item', function () {

    let user = S.getUserData(S.userAccounts.orgAdmin);

    before(function () {
        api.auth.get_tokens(user);
        api.users.update_current_user_settings(user.id)
        api.org_settings.update_org_settings(true, true);
    });

    it('1. Edit and verify all values on Item View page -- replace the current values in multiselect fields - Tags & Item Belongs To', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Item_fields();
        D.generateNewDataSet();
        const itemBelongsToCurrently = D.newItem.itemBelongsTo[0]
        const currentTag = D.newItem.tags[0]
        D.editedItem.caseNumber = D.newItem.caseNumber = D.newCase.caseNumber

        api.cases.add_new_case();
        api.items.add_new_item();
        ui.app.open_newly_created_item_via_direct_link();
        ui.app.click_Edit();
        ui.itemView.verify_values_on_Edit_form(D.newItem, false)
            .remove_specific_values_on_multi_select_fields([itemBelongsToCurrently, currentTag])
            .remove_existing_values_on_Additional_Barcodes_field()
            .edit_all_values(D.editedItem)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedItem, D.newItem)
            .verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)
    });

    it('2. Edit and verify all values on Item View page -- keep the previous values in multiselect fields  - Tags & Item Belongs To;' +
        ' 2.1. hitting *enter* button does not wipe out Additional Barcode', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        api.org_settings.enable_all_Item_fields();
        D.generateNewDataSet();
        D.editedItem.caseNumber = D.newItem.caseNumber = D.newCase.caseNumber

        api.cases.add_new_case();
        api.items.add_new_item();
        ui.app.open_newly_created_item_via_direct_link();
         ui.app.click_Edit();
        ui.itemView.edit_all_values(D.editedItem)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, false)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, false)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedItem, D.newItem)
            .verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)
            .click_button_on_modal(C.buttons.cancel)
            .verify_title_on_active_tab(2)
            .select_tab(C.tabs.basicInfo)

        ui.itemView.verify_additional_barcode_is_not_wiped_out_when_pressing_enter_on_any_focused_input_field([
            "Item #",
            "Recovered At",
            "Recovery Date",
            "Serial Number",
            "Additional Barcodes",
            "Model",
            "Make"
        ]);
    });

    it('3. Remove all optional values & check history records', function () {
        ui.app.log_title(this);
        api.auth.get_tokens(user);
         api.org_settings.enable_all_Item_fields([], [C.itemFields.description, C.itemFields.recoveryDate, C.itemFields.recoveryLocation, C.itemFields.itemBelongsTo]);
        D.generateNewDataSet()

        let allEditedFieldsArray = [
            'Description',
            'Recovered At',
            'Recovery Date',
            'Description',
            'Serial Number',
            'Model',
            'Make',
            // uncomment the line below when bug gets fixed in card #13844
            //   'Additional Barcodes',
            'Item Belongs to',
            'Tags']

        let editedItem = Object.assign({}, D.newItem)

        api.items.add_new_item(false);
        ui.app.open_newly_created_item_via_direct_link()
            .click_Edit();
        ui.itemView.verify_values_on_Edit_form(D.newItem, false)
            .remove_all_optional_values(editedItem, false)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Item_View_form(allEditedFieldsArray, editedItem, D.newItem, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Item_Edit_form(allEditedFieldsArray, editedItem, D.newItem, true)
            .open_last_history_record()
            .verify_all_values_on_history(editedItem, D.newItem)
            .verify_red_highlighted_history_records(allEditedFieldsArray)
    });

    it('4. Edit and verify reduced number of values on Item View page ', function () {
        ui.app.log_title(this);
        let allFieldsOnHistory = [
            'Update Made By',
            'Update Date',
            'Org #',
            'Item #',
            'Case',
            'Status',
            'Storage Location',
            'Submitted By',
            'Category',
            'Barcode',
            'Custodian'
        ]

        api.auth.get_tokens(user);
        api.org_settings.disable_Item_fields();
        D.getNewCaseData();
        D.getItemDataWithReducedFields(D.newCase);

        api.cases.add_new_case();
         api.items.add_new_item();
        ui.app.open_newly_created_item_via_direct_link()
            .click_Edit()
        ui.itemView.edit_all_values(D.editedItem)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.reducedEditableFieldsArray, D.editedItem, D.newItem, true)
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.reducedEditableFieldsArray, D.editedItem, D.newItem, true)
            .open_last_history_record()
            .verify_all_values_on_history(D.editedItem, D.newItem)
            .verify_red_highlighted_history_records(C.itemFields.reducedEditableFieldsArray, allFieldsOnHistory)
    });

    it('5. Add an Item with disabled non required / required fields & check if those are shown up on Item Edit page after enabling', function () {
        ui.app.log_title(this);

        api.auth.get_tokens(user);
        api.org_settings.disable_Item_fields();
        D.getNewCaseData();
        D.getItemDataWithReducedFields(D.newCase);

        api.cases.add_new_case();
        api.items.add_new_item();

        api.org_settings.enable_all_Item_fields([], [C.itemFields.description, C.itemFields.recoveryDate, C.itemFields.recoveryLocation]);

        ui.app.open_newly_created_item_via_direct_link();
        ui.itemView.click_Edit()
            .verify_required_fields([
              //  "recoveredBy",
              //  "custodyReason"
            ])
            .verify_non_required_fields([
                "recoveryLocation",
                "recoveryDate",
                "description"
            ])
            .verify_Save_isDisabled();

        api.org_settings.enable_all_Item_fields([], []);
        ui.itemView.reload_page()
            .click_Edit()
            .verify_required_fields([
                //"recoveredBy",
                //"custodyReason",
                "recoveryLocation",
                "recoveryDate",
                "description"
            ])
            .verify_Save_isDisabled();
    });
});
