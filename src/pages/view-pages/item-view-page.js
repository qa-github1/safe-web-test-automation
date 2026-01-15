const C = require('../../fixtures/constants');
const D = require('../../fixtures/data');
const S = require('../../fixtures/settings');
const helper = require('../../support/e2e-helper');
import BaseViewPage from "../base-pages/base-view-page";


//************************************ ELEMENTS ***************************************//

let
    formContainer = timeout => cy.get('.form-horizontal', timeout),
    view_form = e => cy.get('[name="frm"]'),
    edit_form = e => cy.get('[name="forms.frmEdit"]'),
    inputFieldFoundByLabelOnSpecificContainer = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('input'),
    fieldFoundByLabelOnHistoryColumn = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('ng-transclude'),
    active_tab_container = e => cy.get('[class="tab-pane ng-scope active"]'),
    additionalBarcodeInput = e => cy.get('input[name="barcodes"]'),
    categoryOnEditForm = e => cy.get('[ng-model="itemEdit.categoryId"]'),
    additionalBarcodeOldValue = e => cy.get('[label="\'ITEM_BARCODES\'"]').eq(2),
    additionalBarcodeNewValue = e => cy.get('[label="\'ITEM_BARCODES\'"]').eq(1),
    additionalBarcodes = e => cy.get('[ng-model="newItem.barcodes[0].value"]'),
    save_button_on_active_tab = text => active_tab_container().children().find('[ng-click="doPreSave()"]'),
    caseNumberInput_disabled = e => cy.get('[ng-model="item.primaryCaseId"]'),
    recoveryLocationInput = e => cy.get('[ng-model="itemEdit.recoveryLocation"]'),
    recoveryDateInput = e => cy.get('[ng-model="itemEdit.recoveryDate"]').find('.input-group').find('[ng-model="ngModel"]'),
    // recoveredByInput = e => cy.get('[ng-model="person.text"]'),
    recoveredByInput = e => cy.get('[for="recoveredBy"]').next().find('[ng-model="person.text"]'),
    storageLocationInput = e => cy.get('[ng-model="itemEdit.locationId"]'),
    categoryDropdown = e => cy.get('[ng-model="itemEdit.categoryId"]'),
    //categoryDropdown_selectedOption = e => cy.get('[ng-model="itemEdit.categoryId"]').find('[selected="selected"]'),
    categoryDropdown_selectedOption = (selectedCategory) => cy.get('[class="ng-binding ng-scope"]').contains(selectedCategory),
    custodyReasonDropdown = e => cy.get('[ng-model="itemEdit.custodyReasonId"]'),
    custodyReasonDropdown_selectedOption = e => cy.get('[ng-model="itemEdit.custodyReasonId"]').find('[selected="selected"]'),
    serialNoInput = e => cy.get('[ng-model="itemEdit.serialNumber"]'),
    modelInput = e => cy.get('[ng-model="itemEdit.model"]'),
    makeInput = e => cy.get('[ng-model="itemEdit.make"]'),
    descriptionInput = e => cy.get('[ng-model="itemEdit.description"]'),
    disabledItemBelongsTo = e => cy.get('.form-horizontal').contains('Item Belongs to').parent('div').find('span'),
    itemBelongsToContainer = e => cy.get('[ng-model="people"]'),
    itemBelongsToInput = e => cy.get('[ng-model="people"]').find('input'),
    personTypeahead = e => itemBelongsToContainer().find('.ui-select-choices-row'),
    recoveredByTypeahead = e => cy.get('[ng-repeat="match in matches track by $index"]'),
    //  tagsInput = e => cy.get('[tagging="addNew"]').find('[ng-model="$select.search"]'),
    parentItem = e => cy.get('[ng-repeat="item in vmItems"]'),
    addToCaseInputOnManageCases = e => cy.get('#tpCaseTypeAheadId'),
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    tagsField = e => active_form().find('[tagging="addNew"]'),
    tagsInput = e => active_form().contains('Tags').parent('div').find('input'),
    itemStatus = e => cy.get('[ng-model="item.statusId"]'),
    newPrimaryCaseField = e => cy.get('[name="primaryCaseId"]'),
    removeOldPrimaryCaseFromItemsCheckbox = e => cy.get('.deepGutter > .icheckbox_square-blue > .iCheck-helper'),
    xButtons_onAdditionalBarcodes = text => active_form().find('[ng-click="removeBarcode($index)"]')

export default class ItemViewPage extends BaseViewPage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    verify_Item_View_page_is_open(caseNo) {
        this.verify_text_is_present_on_main_container(C.labels.itemView.title);
        caseNumberInput_disabled().should('contain', caseNo);
        return this;
    };

    verify_textual_values_on_the_form(arrayOfValues) {
        this.verify_multiple_text_values_in_one_container(
            formContainer,
            arrayOfValues
        )
        return this;
    }

    click_Save() {
        save_button_on_active_tab().click();
        return this;
    }

    verify_values_on_Edit_form(itemObject, includesCustomData, VerifyItemBelongsToField) {
        this.pause(1)
        this.verify_values_on_multiple_elements(
            [
                [recoveryLocationInput, itemObject.recoveryLocation],
                [recoveredByInput, itemObject.recoveredByName],
                [recoveryDateInput, itemObject.recoveryDateEditMode],
                [serialNoInput, itemObject.serialNumber],
                [makeInput, itemObject.make],
                [modelInput, itemObject.model],
                [descriptionInput, itemObject.description],
                [additionalBarcodeInput, itemObject.barcodes]
            ]);

        this.verify_text_on_multiple_elements(
            [
                [categoryOnEditForm, itemObject.category],
                [this.tagsField, itemObject.tags],
                [custodyReasonDropdown_selectedOption, itemObject.custodyReason]

            ]);


        if (includesCustomData) {
            this.verify_custom_data_on_Edit_form(itemObject)
        }

        if (VerifyItemBelongsToField) {
            this.verify_text_on_multiple_elements(
                [
                    [itemBelongsToContainer, itemObject.itemBelongsTo]
                ]
            )
        }

        return this;
        };

    verify_edited_and_not_edited_values_on_Item_View_form(labelsOfEditedFields, editedItemObject, initialItemObject, oldValueOverwritten, isUpdateImported) {
        view_form().within(($list) => {
            this.verify_edited_and_not_edited_values('view', labelsOfEditedFields, editedItemObject, initialItemObject, oldValueOverwritten, isUpdateImported)
        })
        return this;
    };

    verify_edited_and_not_edited_values_on_Item_Edit_form(labelsOfEditedFields, editedItemObject, initialItemObject, oldValueOverwritten, isUpdateImported) {
        edit_form().within(($list) => {
            this.verify_edited_and_not_edited_values('edit', labelsOfEditedFields, editedItemObject, initialItemObject, oldValueOverwritten, isUpdateImported)
        })
        return this;
    };

    verify_edited_and_not_edited_values(viewOrEdit, labelsOfEditedFields, editedItemObject, initialItemObject, oldValueOverwritten, isUpdateImported) {

        editedItemObject = Object.assign({}, editedItemObject)
        initialItemObject = Object.assign({}, initialItemObject)
        let oldValueOverwrittenForTags = oldValueOverwritten
        if (isUpdateImported) oldValueOverwrittenForTags = false // requirement in card #9314

        if (viewOrEdit === 'view') {
            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovered At', this.recoveredAt__, editedItemObject.recoveryLocation, initialItemObject.recoveryLocation)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovery Date', this.recoveryDate__, editedItemObject.recoveryDateEditMode, initialItemObject.recoveryDateEditMode)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovered By', this.recoveredBy__, editedItemObject.recoveredByName, initialItemObject.recoveredByName)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Serial Number', this.serialNumber__, editedItemObject.serialNumber, initialItemObject.serialNumber)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Model', this.model__, editedItemObject.model, initialItemObject.model)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Make', this.make__, editedItemObject.make, initialItemObject.make)

            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Description', this.description__, editedItemObject.description, initialItemObject.description)

            if (initialItemObject.itemBelongsTo === '') initialItemObject.itemBelongsTo = 'No Persons'
            if (editedItemObject.itemBelongsTo === '') editedItemObject.itemBelongsTo = 'No Persons'
            if (initialItemObject.tags === '') initialItemObject.tags = 'No Tags'
            if (editedItemObject.tags === '') editedItemObject.tags = 'No Tags'
        } else {
            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovered At', recoveryLocationInput, editedItemObject.recoveryLocation, initialItemObject.recoveryLocation)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovery Date', recoveryDateInput, editedItemObject.recoveryDateEditMode, initialItemObject.recoveryDateEditMode)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Recovered By', recoveredByInput, editedItemObject.recoveredByName, initialItemObject.recoveredByName)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Serial Number', serialNoInput, editedItemObject.serialNumber, initialItemObject.serialNumber)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Model', modelInput, editedItemObject.model, initialItemObject.model)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Make', makeInput, editedItemObject.make, initialItemObject.make)

            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Description', descriptionInput, editedItemObject.description, initialItemObject.description)

            if (initialItemObject.tags === '') initialItemObject.tags = 'No tags selected'
            if (editedItemObject.tags === '') editedItemObject.tags = 'No tags selected'
        }

        this.verify_edited_or_old_TEXT_if_field_was_not_edited(
            labelsOfEditedFields, 'Category', this.category__, editedItemObject.category, initialItemObject.category)

        this.verify_edited_or_old_TEXT_if_field_was_not_edited(
            labelsOfEditedFields, 'Custody Reason', this.custodyReason__, editedItemObject.custodyReason, initialItemObject.custodyReason)

        this.verify_edited_or_old_text_on_multi_select_field(
            labelsOfEditedFields, 'Item Belongs to', this.itemBelongsTo__, editedItemObject.itemBelongsTo, initialItemObject.itemBelongsTo, oldValueOverwritten)

        this.verify_edited_or_old_text_on_multi_select_field(
            labelsOfEditedFields, 'Tags', this.tags__, editedItemObject.tags, initialItemObject.tags, oldValueOverwrittenForTags)

        return this;
    };

    edit_all_values(newItemObject) {
        this.type_if_values_provided(
            [
                [recoveryLocationInput, newItemObject.recoveryLocation],
                [recoveryDateInput, newItemObject.recoveryDate],
                [recoveredByInput, newItemObject.recoveredByName, recoveredByTypeahead],
                [serialNoInput, newItemObject.serialNumber],
                [makeInput, newItemObject.make],
                [modelInput, newItemObject.model],
                [descriptionInput, newItemObject.description]
            ]);

        categoryDropdown().click().contains(newItemObject.category).click()

        if (newItemObject.custodyReason) custodyReasonDropdown().select(newItemObject.custodyReason);


        this.enter_values_on_several_multi_select_typeahead_fields(
            [
                [itemBelongsToInput, newItemObject.itemBelongsTo],
                [tagsInput, newItemObject.tags],
            ]);

        if (newItemObject.additionalBarcodes) {
            cy.contains('Add Barcode').click()
            for (let i = 0; i < newItemObject.additionalBarcodes.length; i++) {
                this.additionalBarcodesInput__().invoke('val', newItemObject.additionalBarcodes[i]).trigger('input')
            }
        }
        return this;
    };

    remove_all_optional_values(object) {
        this.clear_all_fields(
            [
                descriptionInput,
                recoveryLocationInput,
                recoveryDateInput,
                additionalBarcodeInput,
                serialNoInput,
                makeInput,
                modelInput
            ]);

        // Item Belongs To, Tags
        this.remove_existing_values_on_all_multi_select_fields()

        object.description = '';
        object.recoveryLocation = '';
        object.recoveryDate = '';
        object.recoveryDateEditMode = '';
        object.barcodes = '';
        object.additionalBarcodes = '';
        object.serialNumber = '';
        object.make = '';
        object.model = '';
        object.tags = '';
        object.tagsOnHistory = 'No Tags';
        object.itemBelongsTo = '';
        object.itemBelongsToOnHistory = 'No Persons';
        return this;
    };

    remove_additional_barcode() {
        additionalBarcodeInput().clear();
        return this;
    }

    remove_existing_values_on_Additional_Barcodes_field() {
        xButtons_onAdditionalBarcodes().its("length").then(function (length) {
            for (let i = length - 1; i >= 0; i--) {
                xButtons_onAdditionalBarcodes().eq(i).click()
            }
        })
        return this;
    }

    verify_additional_barcode_is_not_wiped_out_when_pressing_enter_on_any_focused_input_field(fields) {
        edit_form().within(($list) => {
            additionalBarcodeInput().invoke('val').then(additional_barcode_val => {
                for (let field of fields) {
                    this.press_ENTER_on_field_found_by_label(field);
                    additionalBarcodeInput().should('be.visible')
                        .and('have.class', 'ng-not-empty')
                        .and('have.value', additional_barcode_val);
                }
            })
        })
        return this;
    }

    verify_all_values_on_history(newItemObject, oldItemObject, customFormName = null, isNewlyAttachedForm = false, newFormData, oldFormData) {
        this.verify_all_values_on_history_in_specific_column(newItemObject, 'left', customFormName, isNewlyAttachedForm, newFormData, oldFormData)
        if (oldItemObject) this.verify_all_values_on_history_in_specific_column(oldItemObject, 'right', customFormName, isNewlyAttachedForm, newFormData, oldFormData)
        return this;
    };

    verify_all_values_on_history_in_specific_column(dataObject, leftOrRightColumn, customFormName, isNewlyAttachedForm, newFormData, oldFormData) {

        this.verify_all_values_on_history_for_standard_fields(leftOrRightColumn,
            [
                ['Update Date', dataObject.updateDate],
                // ['Org#', dataObject.orgNumber],
                //['Item#', dataObject.itemNumber],
                ['Case', dataObject.caseNumber],
                ['Status', dataObject.status],
                ['Recovered At', dataObject.recoveryLocation],
                ['Recovery Date', dataObject.recoveryDateEditMode],
                ['Recovered By', dataObject.recoveredByName],
                ['Storage Location', dataObject.location],
                ['Submitted By', dataObject.submittedByName],
                ['Category', dataObject.category],
                ['Custody Reason', dataObject.custodyReason],
                ['Serial Number', dataObject.serialNumber],
                ['Model', dataObject.model],
              //  ['Additional Barcodes', dataObject.additionalBarcodes],
                ['Make', dataObject.make],
                ['Item Belongs to', dataObject.itemBelongsToOnHistory],
                ['Custodian', dataObject.custodian],
                ['Tags', dataObject.tagsOnHistory]
            ],
            [['Update Made By', dataObject.updateMadeBy]],
            [['Description', dataObject.description]]
            [['Public Facing Description', dataObject.publicFacingDescription]]
           // [['Disposition Status', dataObject.dispositionStatus]]
        )

        if (customFormName) {

            if (isNewlyAttachedForm && leftOrRightColumn === 'right'){
             this.verify_custom_data_is_not_present_on_history(leftOrRightColumn, customFormName)
            }
            else if (leftOrRightColumn === 'left') {
                this.verify_custom_data_on_History(leftOrRightColumn, customFormName, newFormData)
            }
            else if (leftOrRightColumn === 'right') {
                this.verify_custom_data_on_History(leftOrRightColumn, customFormName, oldFormData)
            }
        }
        return this;
    };

    verify_red_highlighted_history_records(redFields, allFieldsOnHistory) {
        let fieldsToCheck = allFieldsOnHistory || C.itemFields.allFieldsOnHistory
        super.verify_red_highlighted_history_records(fieldsToCheck, redFields)
        return this;
    }

    verify_Items_Status(status) {
        itemStatus().should('have.text', status);
        return this
    }

    verify_Parent_Item(itemDescription) {
        itemDescription = itemDescription || 'No Description';
        parentItem().should('contain', itemDescription);
        return this;
    };

    manage_cases__Add_to_case(caseNUmber, nonExistingOrRestrictedCase) {
        addToCaseInputOnManageCases().type(caseNUmber)

        if (nonExistingOrRestrictedCase) {
            this.verify_element_is_visible(C.labels.itemView)
        }
        return this;
    };


    verify_data_on_Chain_of_Custody(columnValuePairs) {
        this.verify_values_on_CoC(columnValuePairs, true)
        return this;
    }

    change_primary_case(data, removeOldPrimaryCase = true) {
        newPrimaryCaseField().type(data.caseNumber)
            cy.wait(1000)
                newPrimaryCaseField().type('{enter}');
        return this;
    }

    click_remove_old_primary_case_checkbox(){
        removeOldPrimaryCaseFromItemsCheckbox().click();
        return this;
    }

}
