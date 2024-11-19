const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const authApi = require("../../api-utils/endpoints/auth");
const casesApi = require("../../api-utils/endpoints/cases/collection");
const orgSettingsApi = require("../../api-utils/endpoints/org-settings/collection");

let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);
let powerUser = S.getUserData(S.userAccounts.powerUser);
let oldCase = S.selectedEnvironment.oldActiveCase;
let office_1 = S.selectedEnvironment.office_1;
let permissionGroup_officeAdmin = S.selectedEnvironment.admin_permissionGroup;

before(function () {
    api.auth.get_tokens(orgAdmin);
    D.generateNewDataSet();
    api.cases.add_new_case(D.newCase.caseNumber);
    api.org_settings.enable_all_Person_fields();
    api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat)
    api.auth.get_tokens(powerUser);
    api.users.update_current_user_settings(powerUser.id, C.currentDateTimeFormat)
});

describe('Add Item', function () {

    context('1. Org Admin', function () {

        it('1.1 All fields enabled ' +
            '-- "Item Belongs To Shows All People" turned ON in Org Settings -- multiple people not linked to Primary Case are selected in "Item Belongs to" field ', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData(D.newCase);
             api.org_settings.update_org_settings(true, true);
            api.org_settings.enable_all_Item_fields();
            D.newItem.itemBelongsTo = [S.selectedEnvironment.person.name, S.selectedEnvironment.person_2.name]

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
            ui.menu.click_Item();
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
        });

        it('1.2. Optional fields disabled -- redirect to View Added Item ' +
            '-- Item Belongs To Shows All People" turned OFF in Org Settings -- multiple values selected for "Item Belongs to" and Tags', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, false);
            api.org_settings.disable_Item_fields([C.itemFields.itemBelongsTo, C.itemFields.tags]);
            D.newItem.itemBelongsTo = [S.selectedEnvironment.person.name, S.selectedEnvironment.person_2.name]
            D.newItem.tags = [S.selectedEnvironment.orgTag1.name, S.selectedEnvironment.orgTag2.name]
            api.auth.get_tokens(orgAdmin);

            ui.app.open_newly_created_case_via_direct_link()
            ui.menu.click_Add__Item()
            ui.addItem.enter_Case_Number_and_select_on_typeahead(D.newItem.caseNumber)
                .select_Category(D.newItem.category)
                .click(C.buttons.next)
                .verify_text_is_present_on_main_container('You must have a Person in this case before you can add a value to this field')

            D.newItem.caseNumber = oldCase.caseNumber
            ui.app.open_case_url(oldCase.id)
            ui.addItem.select_tab(C.tabs.items)
                .click_element_on_active_tab(C.buttons.addItem)
                .verify_Add_Item_page_is_open()
                .populate_all_fields_on_both_forms(D.newItem, false, true )
                 .select_post_save_action(C.postSaveActions.viewAddedItem)
                 .click_Save(D.newItem)
                 .verify_toast_message_(oldCase)
             ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
                 .click_Edit()
                .verify_values_on_Edit_form(D.newItem)
            ui.menu.click_Item();
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
        });

        it('1.3. Add Item from Case View /Items tab -- redirect to Add Item page again', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();
            api.users.update_current_user_settings(orgAdmin.id, C.currentDateTimeFormat)

            ui.app.open_case_url(oldCase.id)
            ui.addItem.select_tab(C.tabs.items)
                .click_element_on_active_tab(C.buttons.addItem)
                .verify_Add_Item_page_is_open()
                .verify_Case_Number_is_populated_on_enabled_input_field(oldCase.caseNumber)
                .populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.addItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber);
            ui.itemView.open_newly_created_item_via_direct_link()
                .verify_textual_values_on_the_form([D.newItem.recoveryDate])
                .click_Edit()
                .verify_values_on_Edit_form(D.newItem, false, false)
        });

        it('1.4. Add item from Item Search -- redirect to Case View /Items tab', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            ui.app.open_case_url(oldCase.id)
            ui.menu.click_Search__Item()
                .click_Add_Item_button();
            ui.addItem.verify_Add_Item_page_is_open()
                .verify_Case_Number_is_populated_on_enabled_input_field(oldCase.caseNumber)
                .populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.viewItemsInCase)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.caseView.title);
            ui.itemView.verify_active_tab(C.tabs.items)
            ui.menu.click_Add__Item();
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
        });

        it('1.5. Add item from Scan page -- redirect to Item View/Media tab', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            ui.menu.click_Scan()
                .click_Add_Item_button();
            ui.addItem.verify_Add_Item_page_is_open()
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newCase.caseNumber)
                .populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.addMediaForTheItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase);
            ui.itemView.verify_active_tab(C.tabs.media)
                .verify_text_is_present_on_main_container(C.labels.itemView.title)
            ui.menu.click_Add__Item();
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
        });

        it('1.6. Add Item from Person View/ Items Recovered By -- redirect to Item View/ Notes tab', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();
            ui.app.open_newly_created_case_via_direct_link()

            api.people.add_new_person();
            ui.app.open_newly_created_person_via_direct_link()
                .select_tab(C.tabs.itemsRecoveredBy)
                .click_Add_Item_button();
            ui.addItem.verify_Add_Item_page_is_open()
                .populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.addNoteForTheItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.itemView.title);
            ui.itemView.verify_active_tab(C.tabs.notes)
        });

        it('1.7. Add Item from Person View/ "Items Belonging to" tab -- redirect to Add Duplicate Item page and complete the action', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            D.getNewPersonData()
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            api.people.add_new_person();
            ui.app.open_newly_created_person_via_direct_link()
                .select_tab(C.tabs.itemsBelongingTo)
                .click_Add_Item_button();
            ui.addItem.populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.duplicateItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
                .verify_Category(D.newItem.category)
                .click(C.buttons.next)
                .verify_location(D.newItem.location)
                .verify_text_on_main_Form(C.labels.addItem.confirmItemDuplication)
                .select_checkbox()
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
        });

        it('1.8. Add Item from Person View/ Items Custodian tab -- redirect to Split Item page and complete the action', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            D.getNewPersonData()
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            api.people.add_new_person();
            ui.app.open_newly_created_person_via_direct_link()
                .select_tab(C.tabs.itemsBelongingTo)
                .click_Add_Item_button();
            ui.addItem.populate_all_fields_on_both_forms(D.newItem)
                .select_post_save_action(C.postSaveActions.splitItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
                .verify_Category(D.newItem.category)
                .click(C.buttons.next)
                .verify_location(D.newItem.location)
                .verify_text_on_main_Form(C.labels.addItem.confirmItemSplit)
                .select_checkbox()
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(S.selectedEnvironment.newCase, null, null, '.1');
            ui.itemView.verify_Parent_Item(D.newItem.description);
        });

        it('1.9. Only active people should show up in "Recovered By" field when searching by first/middle/last name or email', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewItemData(D.newCase);
            api.org_settings.enable_all_Item_fields();
            api.users.add_new_user('new_user');

            ui.menu.click_Add__Item();
            ui.addItem.populate_all_fields_on_first_form(D.newItem.caseNumber, D.newItem.category)
                .enter_recoveredBy(D.newUser.firstName)
                .verify_RecoveredBy_dropdown_is_visible(1)
                .enter_recoveredBy(D.newUser.middleName)
                .verify_RecoveredBy_dropdown_is_visible(1)
                .enter_recoveredBy(D.newUser.lastName)
                .verify_RecoveredBy_dropdown_is_visible(1)
                .enter_recoveredBy(D.newUser.email)
                .verify_RecoveredBy_dropdown_is_visible(1)

            api.users.deactivate_users(['new_user']);
            ui.addItem.reload_page()
                .populate_all_fields_on_first_form(D.newItem.caseNumber, D.newItem.category)
                .enter_recoveredBy(D.newUser.firstName)
                .verify_RecoveredBy_dropdown_is_NOT_visible()
                .enter_recoveredBy(D.newUser.email)
                .verify_RecoveredBy_dropdown_is_NOT_visible()
        });
    });

    context('2 Power User -- all permissions in Office, with and without access to Storage Location', function () {

        it('2.1 verify that user can add all values but can select only Storage Location(s) that s/he has access to', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            api.permissions
                .update_ALL_permissions_for_an_existing_Permission_group
                (permissionGroup_officeAdmin, true, true, true, true)

            api.permissions.assign_office_based_permissions_to_user(
                powerUser.id,
                office_1.id, permissionGroup_officeAdmin.id);

            D.getItemDataWithReducedFields(D.newCase);
            D.getNewPersonData()
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();
            let accessibleLocation = S.selectedEnvironment.locations[0]
            let inaccessibleLocation = S.selectedEnvironment.locations[1]

            api.locations.set_Permission_Groups_to_Storage_Location(
                accessibleLocation, [permissionGroup_officeAdmin])
            api.locations.set_Permission_Groups_to_Storage_Location(
                inaccessibleLocation, [])

            api.auth.get_tokens(powerUser);
            ui.app.open_case_url(oldCase.id)
            ui.menu.click_Add__Item()
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(oldCase.caseNumber)
                .enter_Case_Number_and_select_on_typeahead(D.newItem.caseNumber)
                .select_Category(D.newItem.category)
                .click(C.buttons.next)
                .enter_storage_location(inaccessibleLocation.name)
                .verify_storage_location_typeahead_is_not_shown(inaccessibleLocation.name)
                // .enter_storage_location(inaccessibleLocation.guid)
                // .verify_storage_location_typeahead_is_not_shown()
                // .verify_text_is_present_on_main_container("You don't have access to this storage location")
                .select_Storage_Locations_with_arrow_icon(accessibleLocation.name)
                .populate_all_fields_on_second_form(D.newItem, true)
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
            ui.itemView.verify_Item_View_page_is_open(D.newItem.caseNumber)
                .click_Edit()
                .verify_values_on_Edit_form(D.newItem)
            ui.menu.click_Item();
            ui.addItem.verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
        });
    });

    context('3 Add Item with Custom Form', function () {

        //setting this test just for Org#1 until the issue with shared form gets fixed ----> #14625 ⁃ 'Dropdown Typeahead' on the Shared custom form has options available only in the originating Org
        if (Cypress.env('orgNum') === 1) {
            it('3.1 --- with required Custom Form filled out, all required fields on Form', function () {
                ui.app.log_title(this);
                api.auth.get_tokens(orgAdmin);
                D.getItemDataWithReducedFields(D.newCase);
                api.org_settings.update_org_settings(true, true);
                api.org_settings.disable_Item_fields();

                D.newItem.category = D.newItem.categoryLinkedToRequiredForm1
                D.newCase.categoryId = D.newItem.categoryIdLinkedToRequiredForm1
                ui.menu.click_Add__Item()
                ui.addItem.populate_all_fields_on_both_forms(D.newItem, false)
                    .verify_number_of_required_fields_marked_with_asterisk(12)
                    .verify_Save_button_is_disabled()
                    .populate_all_fields_on_Custom_Form(D.newCustomFormData)
                    .select_post_save_action(C.postSaveActions.addItem)
                    .click_Save(D.newItem)
                    .verify_toast_message_(D.newCase)
                    .verify_text_is_present_on_main_container(C.labels.addItem.title)
                    .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber);
                ui.itemView.open_newly_created_item_via_direct_link()
                    .verify_textual_values_on_the_form([D.newItem.recoveryDate])
                    .click_Edit()
                    .verify_values_on_Edit_form(D.newItem, true)
            });
        }

        it('3.2 --- with required Custom Form but not filled out, all optional fields on Form', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            D.newItem = Object.assign(D.newItem, D.defaultCustomFormData)
            D.newItem.category = D.newItem.categoryLinkedToRequiredForm2
            D.newCase.categoryId = D.newItem.categoryIdLinkedToRequiredForm2
            ui.menu.click_Add__Item()
            ui.addItem.populate_all_fields_on_both_forms(D.newItem, false)
                .verify_number_of_required_fields_marked_with_asterisk(0)
                .select_post_save_action(C.postSaveActions.addItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber);
            ui.itemView.open_newly_created_item_via_direct_link()
                .verify_textual_values_on_the_form([D.newItem.recoveryDate])
                .click_Edit()
                .verify_values_on_Edit_form(D.newItem, true)
        });

        it('3.3 --- with required Currency Form attached - System Template', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getItemDataWithReducedFields(D.newCase);
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            D.newItem = Object.assign(D.newItem, D.defaultCustomFormData)
            D.newItem.category = 'Currency'
            ui.menu.click_Add__Item()
            ui.addItem.populate_all_fields_on_both_forms(D.newItem)
                .enter_value_to_input_field('Currency Total', 0)
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
            ui.itemView.click_Edit()
                .verify_values_on_Edit_form(D.newItem)
                .verify_value_on_input_field('Currency Total', 0)
        });

        it('3.4 --- Duplicating item with Currency Form attached', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewCaseData()
            D.getItemDataWithReducedFields(D.newCase)
            api.cases.add_new_case()
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            D.newItem.category = 'Currency'
            ui.app.open_newly_created_case_via_direct_link()
            ui.menu.click_Add__Item()
            ui.addItem.populate_all_fields_on_both_forms(D.newItem)
                .enter_value_to_input_field('$100s', 20)
                .select_post_save_action(C.postSaveActions.duplicateItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_Add_Item_page_is_open()
                .click_Next()
                .select_checkbox()
                .verify_location(D.newItem.location)
                .verify_text_on_main_Form(C.labels.addItem.confirmItemDuplication)
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase, '2')
            ui.itemView.click_Edit()
                .verify_values_on_Edit_form(D.newItem)
                .verify_value_on_input_field('$100s', 20)
        });

        it('3.5 --- Splitting item with Currency Form attached', function () {
            ui.app.log_title(this);
            api.auth.get_tokens(orgAdmin);
            D.getNewCaseData()
            D.getItemDataWithReducedFields(D.newCase)
            api.cases.add_new_case()
            api.org_settings.update_org_settings(true, true);
            api.org_settings.disable_Item_fields();

            D.newItem.category = 'Currency'
            ui.app.open_newly_created_case_via_direct_link()
            ui.menu.click_Add__Item()
            ui.addItem.populate_all_fields_on_both_forms(D.newItem, false)
                .enter_value_to_input_field('$100s', 4)
                .select_post_save_action(C.postSaveActions.splitItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase)
                .verify_text_is_present_on_main_container(C.labels.addItem.title)
                .verify_Case_Number_is_populated_on_enabled_input_field(D.newItem.caseNumber)
                .verify_Category(D.newItem.category)
                .click(C.buttons.next)
                .verify_location(D.newItem.location)
                .verify_text_on_main_Form(C.labels.addItem.confirmItemSplit)
                .select_checkbox()
                .select_post_save_action(C.postSaveActions.viewAddedItem)
                .click_Save(D.newItem)
                .verify_toast_message_(D.newCase, null, null, '.1');
            ui.itemView.click_Edit()
                .verify_values_on_Edit_form(D.newItem)
                .verify_value_on_input_field('$100s', 4)
        });
    });
});
