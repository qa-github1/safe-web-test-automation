const C = require('../fixtures/constants');
const S = require('../fixtures/settings');
const D = require('../fixtures/data');
const api = require('../api-utils/api-spec');
const ui = require('../pages/ui-spec');
const E = require("../fixtures/files/excel-data");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
describe('Case', function () {

    it('Add -- Edit -- Search -- MassUpdate Case', function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        const currentCaseOfficer = D.newCase.caseOfficerName
        const currentTag = D.newCase.tags[0]
        api.org_settings.enable_all_Case_fields();
        api.auto_disposition.edit(true);

        //ADD Case
        ui.menu.click_Add__Case();
        ui.addCase.verify_Add_Case_page_is_open()
            .populate_all_fields_on_both_forms(D.newCase)
            .select_post_save_action(C.postSaveActions.viewAddedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.addedNewCase + D.newCase.caseNumber);

        // EDIT CASE
        ui.caseView.verify_Case_View_page_is_open(D.newCase.caseNumber)
            .click_Edit()
            .verify_values_on_Edit_form(D.newCase)
            .remove_specific_values_on_multi_select_fields([currentCaseOfficer, currentTag])
            .edit_all_values(D.editedCase)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Case_View_form(C.caseFields.allEditableFieldsArray, D.editedCase, D.newCase, true)
            .open_last_history_record(0)
            .verify_all_values_on_history(D.editedCase, D.newCase, null)
            .verify_red_highlighted_history_records(C.caseFields.allEditableFieldsArray)
            .click_button('Cancel')

        //SEARCH CASE
        ui.searchCase.run_search_by_Case_Number(C.searchCriteria.inputFields.equals, D.editedCase.caseNumber)
            .verify_items_count_on_grid(1)
            .verify_data_on_the_grid(D.editedCase)


        //MASS UPDATE CASES
        D.generateNewDataSet();

        let allValues = [
            D.editedCase.offenseType,
            D.editedCase.caseOfficerName,
            D.editedCase.offenseLocation,
            D.editedCase.offenseDescription,
            D.editedCase.offenseDate,
            D.editedCase.tags[0],
            D.editedCase.status,
            D.editedCase.reviewDate,
            D.editedCase.reviewDateNotes
        ]
        api.cases.add_new_case(D.newCase.caseNumber + ' _1')
        api.cases.add_new_case(D.newCase.caseNumber + ' _2')

        ui.searchCase.expand_search_criteria()
            .enter_Case_Number(C.searchCriteria.inputFields.textSearch, D.newCase.caseNumber)
            .click_Search()
            .select_checkbox_on_specific_table_row(1)
            .select_checkbox_on_specific_table_row(2)
            .click_button(C.buttons.actions)
            .click_option_on_expanded_menu(C.dropdowns.caseActions.massUpdate)
            .turn_on_and_enter_values_to_all_fields_on_modal(C.caseFields.massUpdateModal, allValues)
            .verify_text_above_modal_footer('\n        Mass updating\n         2 \n        \n        cases\n    ')
            .click_Ok()
            .verify_toast_message(C.toastMsgs.saved)
            .quick_search_for_case(D.newCase.caseNumber + ' _1')
            .click_Edit()
        ui.caseView.verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.massUpdateModal, D.editedCase, D.newCase)
            .quick_search_for_case(D.newCase.caseNumber + ' _2')
            .click_Edit()
            .verify_edited_and_not_edited_values_on_Case_Edit_form(C.caseFields.massUpdateModal, D.editedCase, D.newCase)
    });

});
describe.only('Item', function () {

    it('Add -- Edit -- Search -- MassUpdate Item', function () {
        api.auth.get_tokens(orgAdmin);
        D.generateNewDataSet();
        const itemBelongsToCurrently = D.newItem.itemBelongsTo[0]
        const currentTag = D.newItem.tags[0]
        D.editedItem.caseNumber = D.newItem.caseNumber = D.newCase.caseNumber
        api.cases.add_new_case(D.newCase.caseNumber);
         api.org_settings.update_org_settings(false, true);
         api.org_settings.enable_all_Item_fields();

        // ADD ITEM
        ui.app.open_newly_created_case_via_direct_link()
        ui.menu.click_Add__Item()
        ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
            .populate_all_fields_on_both_forms(D.newItem)
            .select_post_save_action(C.postSaveActions.viewAddedItem)
            .click_Save(D.newItem)
            .verify_toast_message_(D.newCase);
        ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
            .click_Edit()
            .verify_values_on_Edit_form(D.newItem)

        // EDIT ITEM
        ui.itemView.remove_specific_values_on_multi_select_fields([itemBelongsToCurrently, currentTag])
            .edit_all_values(D.editedItem)
            .click_Save()
            .verify_toast_message(C.toastMsgs.saved)
            .reload_page()
            .verify_edited_and_not_edited_values_on_Item_View_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem, true)
            .open_last_history_record(0)
            .verify_all_values_on_history(D.editedItem, D.newItem)
            .verify_red_highlighted_history_records(C.itemFields.allEditableFieldsArray)
            .click_button('Cancel')

        // SEARCH ITEM
        ui.searchItem.run_search_by_Item_Description(D.editedItem.description)
            .verify_content_of_first_row_in_results_table(D.editedItem.description);

        //MASS UPDATE ITEMS
        D.generateNewDataSet();

        let allValues = [
            D.editedItem.description,
            D.editedItem.recoveryLocation,
            D.editedItem.recoveredByName,
            D.editedItem.submittedBy,
            D.editedItem.category,
            D.editedItem.custodyReason,
            D.editedItem.recoveryDate,
            D.editedItem.make,
            D.editedItem.model,
            D.editedItem.itemBelongsTo[0],
            D.editedItem.tags[0]
        ]

        let allUpdatedFieldsOnHistory = [
                'Description',
                'Recovered At',
                'Recovered By',
                'Category',
                'Custody Reason',
                'Recovery Date',
                'Make',
                'Model',
                'Item Belongs to',
                'Tags',
            ]
        D.editedItem.serialNumber = D.newItem.serialNumber

        D.newItem1 = Object.assign({}, D.newItem)
        D.newItem1.description = '1__ ' + D.newItem.description
        D.newItem2 = Object.assign({}, D.newItem)
        D.newItem2.description = '2__ ' + D.newItem.description

        api.items.add_new_item(true, null, 'item_1', D.newItem1)
        api.items.add_new_item(true, null, 'item_2', D.newItem2)

        ui.searchItem
           .expand_search_criteria()
           .enter_Description(C.searchCriteria.inputFields.textSearch, D.newItem.description)
           .click_Search()
            .select_checkbox_on_specific_table_row(1)
            .select_checkbox_on_specific_table_row(2)
            .click_Actions()
            .click_option_on_expanded_menu(C.dropdowns.caseActions.massUpdate)
            .turn_on_and_enter_values_to_all_fields_on_modal(C.itemFields.massUpdateModal, allValues)
           // .verify_text_above_modal_footer('\n        Mass updating\n         2 \n        \n        cases\n    ')
            .click_Ok()
            .verify_toast_message(C.toastMsgs.saved)

        cy.getLocalStorage('item_1').then(item => {
            ui.app.open_item_url(JSON.parse(item).id)
            ui.itemView.click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem1, true)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedItem, D.newItem1)
                .verify_red_highlighted_history_records(allUpdatedFieldsOnHistory)
        })


        cy.getLocalStorage('item_2').then(item => {
            ui.app.open_item_url(JSON.parse(item).id)
            ui.itemView.click_Edit()
                .verify_edited_and_not_edited_values_on_Item_Edit_form(C.itemFields.allEditableFieldsArray, D.editedItem, D.newItem2, true)
                .open_last_history_record(0)
                .verify_all_values_on_history(D.editedItem, D.newItem2)
                .verify_red_highlighted_history_records(allUpdatedFieldsOnHistory)
        })
    });

});

describe('Person', function () {

    it('Add/Edit/MassUpdate/Search Person', function () {


    });

});

describe('Task', function () {

    it('Add/Edit/Search Task', function () {


    });

});

describe('Media', function () {

    it('Add/Edit/Search Media', function () {


    });

});

describe('Notes', function () {

    it('Add/Edit/Search Note', function () {


    });

});
