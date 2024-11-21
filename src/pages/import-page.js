let C = require('../fixtures/constants')
let S = require('../fixtures/settings')
import BasePage from "./base-pages/base-page";

//************************************ ELEMENTS ***************************************//

let
    importNameInput = e => cy.get('[ng-model="flatImport.name"]'),
    importTypeDropdown = e => cy.get('[ng-model="flatImport.importType"]'),
    mapFieldsSection = e => cy.get('[title="Map Fields"]'),
    importerContainer = e => cy.get('[tp-model-type="\'import\'"]'),
    dropdownFieldForMapping = fieldName => mapFieldsSection().find('[name="frm"]').contains('label', fieldName).parent().find('select'),
    defaultMappingSelected = (label) => mapFieldsSection().find('[name="frm"]').contains('label', label).parent().find('[selected="selected"]'),
    checkDefaultMappingSelected = (rowNumber, label) => mapFieldsSection().find('[data-ng-repeat="column in selected.imports[0].columns"]').eq(rowNumber).contains('option', label).parent().find('[selected="selected"]').should('contain', label),
   // checkDefaultMappingSelected = (label, number) => mapFieldsSection().find('[name="frm"]').contains('option', label).parent().find('[value="number:' + number + '"]').should('contain', label),
    activeDropdown = e => mapFieldsSection().find('[name="frm"]').contains('active').parent().find('[selected="selected"]'),
    caseNumberDropdown = e => mapFieldsSection().find('[name="frm"]').contains('caseNumber').parent().find('[selected="selected"]'),
    creatorIdDropdown = e => mapFieldsSection().find('[name="frm"]').contains('creatorID').parent().find('[selected="selected"]'),
    categoryDropdown = e => mapFieldsSection().find('[name="frm"]').contains('label', 'Category').parent().find('[selected="selected"]'),
    submittedByDropdown = e => mapFieldsSection().find('[name="frm"]').contains('submittedByID').parent().find('[selected="selected"]'),
    firstNameDropdown = e => mapFieldsSection().find('[name="frm"]').contains('firstName').parent().find('[selected="selected"]'),
    personTypeDropdown = e => mapFieldsSection().find('[name="frm"]').contains('person Type').parent().find('[selected="selected"]'),
    clientSourceDropdown = e => mapFieldsSection().find('[name="frm"]').get('[ng-model="selected.imports[0].clientSourceColumn"]'),
    targetSourceDropdown = e => mapFieldsSection().find('[name="frm"]').get('[ng-model="selected.imports[0].trackerTargetColumn"]'),
    updateOnlyCheckbox = e => mapFieldsSection().find('[name="frm"]').get('[ng-if="flatImport.importType === 1 || flatImport.importType === 5 || flatImport.importType === 3"]').find('ins');

export default class ImportPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    save_import_type_and_name(type, isUpdate = false, name = null) {
        if (name) {
            importNameInput().clear().type(name);
        }
        importTypeDropdown().select(type);

        if (isUpdate) {
            this.click_update_only();
        }
        this.click(C.buttons.ok);
        this.verify_toast_message(C.toastMsgs.saved);
        return this;
    };

    click_update_only() {
        updateOnlyCheckbox().click();
        return this;
    };

    map_source_fields(importType, sourceField) {

        if (importType === C.importTypes.items) {
            clientSourceDropdown().select(sourceField);
            targetSourceDropdown().select('Barcode');
            this.map_the_field_from_excel_to_system_field(sourceField, '- Do not import -')
        } else {
            clientSourceDropdown().select(sourceField);
            targetSourceDropdown().select(sourceField);
        }

        return this;
    };

    map_the_field_from_excel_to_system_field(excelField, systemField) {
        dropdownFieldForMapping(excelField).select(systemField);
        return this;
    };

    exclude_Excel_field_on_mapping_list(excelField) {
        dropdownFieldForMapping(excelField).select('- Do not import -');
        return this;
    };

    wait_Map_Fields_section_to_be_loaded(importType, isLinkedToCase = true, hasMinimumFields) {
        mapFieldsSection().should('be.visible');

        switch (importType) {
            case C.importTypes.cases:

                for(let i =0; i<6; i++){
                    let values = [
                        'Active',
                        'Case Number',
                        'Created By [User Email or GUID]',
                        'Case Officer(s) [UserEmail OR userGUID, GroupName OR GroupID]',
                        'Office [Name or GUID]',
                        'Offense Type',
                        'Offense Description',
                        'Offense Date',
                        'Offense Location',
                        'Tags',
                        'Created Date',
                        'Review Date',
                        'Review Date Notes',
                        'Closed Date',

                    ]
                    checkDefaultMappingSelected(i, values[i]);
                }

                // checkDefaultMappingSelected('Active', '108');
                // checkDefaultMappingSelected('Case Number', '101');
                // checkDefaultMappingSelected('Case Officer(s) [UserEmail OR userGUID, GroupName OR GroupID]', '102');
                // checkDefaultMappingSelected('Offense Location', '105');
                // checkDefaultMappingSelected('Office [Name or GUID]', '109');
                // checkDefaultMappingSelected('Created By edited [User Email or GUID]', '110');

                break;
            case C.importTypes.items:
                checkDefaultMappingSelected('Category');
                checkDefaultMappingSelected('SubmittedById');
                if (!hasMinimumFields) {
                    this.map_the_field_from_excel_to_system_field('Make', 'Make')
                    checkDefaultMappingSelected('Make');
                }
                break;
            case C.importTypes.people:
                checkDefaultMappingSelected('FirstName');
                checkDefaultMappingSelected('LastName');

                if (!hasMinimumFields) {
                    this.map_the_field_from_excel_to_system_field('Email', 'Email')
                    checkDefaultMappingSelected('Email');
                }
                break;
            case C.importTypes.users:
                checkDefaultMappingSelected('FirstName');
                this.map_the_field_from_excel_to_system_field('Email', 'Email');
                checkDefaultMappingSelected('Email');
                break;
            case C.importTypes.notes:
                checkDefaultMappingSelected('Text');
                checkDefaultMappingSelected('Date');
                this.exclude_Excel_field_on_mapping_list('Id');

                if (isLinkedToCase) {
                    this.exclude_Excel_field_on_mapping_list('ItemGuid');
                }
                break;
            case C.importTypes.legacyCoC:
                checkDefaultMappingSelected('IssuedFrom');
                break;
            case C.importTypes.legacyTasks:
                checkDefaultMappingSelected('User');
                checkDefaultMappingSelected('Message');
                break;
            case C.importTypes.locations:
                checkDefaultMappingSelected('Name');
                break;
            case C.importTypes.media:
                checkDefaultMappingSelected('Hash');
                break;
        }
        return this;
    };

    wait_specific_fields_to_be_automatically_mapped(specificFieldsToBeAutomaticallyMapped) {
        mapFieldsSection().should('be.visible');

        specificFieldsToBeAutomaticallyMapped.forEach(field => {
            checkDefaultMappingSelected(field);
        })
        return this;
    };

    check_validation_messages(messagesArray) {
        if (messagesArray) this.verify_text_is_present_on_main_container(messagesArray)
        return this;
    };

    upload_then_Map_and_Submit_file_for_importing(fileName, importType, isLinkedToCase, timeoutInMinutes, hasMinimumFields, validationMessagesAfterNextButton) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete, timeoutInMinutes)
            .save_import_type_and_name(importType)
            .click_button(C.buttons.next)
            .wait_Map_Fields_section_to_be_loaded(importType, isLinkedToCase, hasMinimumFields)
            .click_button(C.buttons.nextSave)
            .check_validation_messages(validationMessagesAfterNextButton)
            .click_button(C.buttons.import);
        return this;
    };

    upload_then_Map_and_Submit_file_for_importing_Items(fileName, hasMinimumFields) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete, 2)
            .save_import_type_and_name('Items')
            .click_button(C.buttons.next)
            .wait_Map_Fields_section_to_be_loaded('Items', null, hasMinimumFields)
            .click_button(C.buttons.nextSave)
            .click_button(C.buttons.import);
        return this;
    };

    upload_then_Map_and_Submit_file_for_importing_People(fileName, isLinkedToCase, hasMinimumFields) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete, 2)
            .save_import_type_and_name('People')
            .click_button(C.buttons.next)
            .wait_Map_Fields_section_to_be_loaded('People', isLinkedToCase, hasMinimumFields)
            .click_button(C.buttons.nextSave)
            .click_button(C.buttons.import);
        return this;
    };

    upload_then_Map_and_Submit_file_for_update_importing(fileName, importType, sourceField, specificFieldsToBeAutomaticallyMapped, hasMinimumFields) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete)
            .save_import_type_and_name(importType, true)
            .click_button(C.buttons.next)

        if (specificFieldsToBeAutomaticallyMapped) {
            this.wait_specific_fields_to_be_automatically_mapped(specificFieldsToBeAutomaticallyMapped)
        } else {
            this.wait_Map_Fields_section_to_be_loaded(importType, null, hasMinimumFields)
        }

        this.map_source_fields(importType, sourceField)
            .click_button(C.buttons.nextSave)
            .click_button(C.buttons.import);
        return this;
    };

    upload_then_Map_and_Submit_file_for_Item_Updates_import(fileName, hasMinimumFields) {
        this.upload_then_Map_and_Submit_file_for_update_importing(fileName, C.importTypes.items, 'ItemBarcode', null, hasMinimumFields = false)
        return this;
    };

    upload_then_Map_and_Submit_file_for_precheck(fileName, importType, isLinkedToCase) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete)
            .save_import_type_and_name(importType)
            .click_button(C.buttons.next)
            .wait_Map_Fields_section_to_be_loaded(importType, isLinkedToCase)
            .click_button(C.buttons.nextSave)
            .click_button(C.buttons.precheckOnly);
        return this;
    };

    upload_file_and_go_to_import_preview(fileName, importType, waitDefaultMappingToBeLoaded = true) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete)
            .save_import_type_and_name(importType)
            .click_button(C.buttons.next)

        if (waitDefaultMappingToBeLoaded) this.wait_Map_Fields_section_to_be_loaded(importType)
        this.click_button(C.buttons.nextSave)
        return this;
    };

    upload_then_Map_and_Submit_file_for_updates_precheck(fileName, importType, sourceField) {
        this.upload_file_and_verify_toast_msg(fileName + '.xlsx', C.toastMsgs.uploadComplete)
            .save_import_type_and_name(importType, true)
            .click_button(C.buttons.next)
            .wait_Map_Fields_section_to_be_loaded(importType)
            .map_source_fields(importType, sourceField)
            .click_button(C.buttons.nextSave)
            .click_button(C.buttons.precheckOnly);
        return this;
    };

    verify_importer_validation_messages(arrayOfMessages) {
        this.verify_multiple_text_values_in_one_container(importerContainer, arrayOfMessages)
        return this;
    };


}
