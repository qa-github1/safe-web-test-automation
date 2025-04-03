var S = require('../../fixtures/settings');
const C = require('../../fixtures/constants');
const api = require('../../api-utils/api-spec');

import BasePage from "./base-page";

//************************************ ELEMENTS ***************************************//
let
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    textareaFieldFoundByLabelOnSpecificContainer = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('textarea'),
    textareaFieldFoundByLabel = (fieldLabel) => cy.contains(fieldLabel).parent('div').find('textarea'),
    inputFieldFoundByLabelOnSpecificContainer = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('input'),
    inputFieldFoundByLabel = (fieldLabel) => cy.contains(fieldLabel).parent('div').find('input'),
    fieldValueFoundByLabelOnHistoryColumn = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('ng-transclude'),
    fieldValueFoundByLabel = (fieldLabel) => cy.contains(fieldLabel).parent('div').find('ng-transclude'),
    customFieldValueFoundByLabelOnHistoryColumn = (container, fieldLabel) => container().contains(fieldLabel).parent('div').find('.col-sm-4'),
    fieldFoundByLabelOnHistoryColumn = fieldLabel => cy.get('.modal-content').contains(fieldLabel).parents('tp-modal-field'),
    redFieldsOnHistoryColumn = e => cy.get('.modal-content').find('.red-field'),
    active_tab = e => cy.get('.nav-tabs').find('.active'),
    edit_form = e => cy.get('[name="frmEdit"]'),
    active_tab_container = e => cy.get('[class="tab-pane ng-scope active"]'),
    customFormContainerOnEdit = e => cy.get('[ng-repeat="form in formsEdit track by $index"]'),
    detailsButton = e => cy.get('[translate="GENERAL.DETAILS"]'),
    historyView_leftColumn = e => cy.get('[ng-class="previousHistory ? \'col-md-6\' : \'col-md-12\'"]'),
    historyView_rightColumn = e => cy.get('[ng-if="previousHistory"]'),
    fieldFoundByLabelOnLeftHistoryColumn = fieldLabel => historyView_leftColumn().contains(fieldLabel).parents('tp-modal-field'),
    fieldFoundByLabel = fieldLabel => cy.contains(fieldLabel).parents('tp-modal-field'),
    textboxOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Textbox').parent('div').find('input'),
    emailOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Email').parent('div').find('input'),
    numberOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Number').parent('div').find('input'),
    passwordOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Password').parent('div').find('input'),
    textareaOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Textarea').parent('div').find('textarea'),
    dropdownTypeaheadOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Dropdown Typeahead').parent('div').find('input'),
    personOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Person').parent('div').find('input'),
    userOrGroupOnCustomForm = (form = customFormContainerOnEdit) => form().contains('User/User Group').parent('div'),
    dateOnCustomForm = (form = customFormContainerOnEdit) => form().contains('Date').parent('div').find('[ng-model="ngModel"]'),
    customDateOnHistory = (form = historyView_rightColumn) => form().contains('Date').parent('div').find('input'),
    customFormContainerOnHistoryLeft = e => historyView_leftColumn().children().find('form').children().find('[ng-repeat="form in forms"]'),
    customFormContainerOnHistoryRight = e => historyView_rightColumn().children().find('form').children().find('[ng-repeat="form in forms"]'),
    element_on_active_tab = text => active_tab_container().children().contains(text),
    edit_button_on_active_tab = text => active_tab_container().children().find('[translate="GENERAL.EDIT"]'),
    save_button_on_active_tab = text => active_tab_container().children().find('[button-text="\'GENERAL.BUTTON_SAVE\'"]').find('button'),
    mediaDescriptionField = e => cy.get('[stop-event="touchend"]'),
    mediaDescriptionInput = e => cy.get('[stop-event="touchend"]').find('input'),
    noteInput = e => cy.get('[ui-view="notes"]').find('textarea'),
    noteCategory = e => cy.get('[ui-view="notes"]').find('select'),
    caseNumberInput = e => cy.get('#tpCaseTypeAheadId'),
    addingItemLabel = e => cy.get('[translate="ITEM.ADDING"]').first(),
    selectedTagOrUser_ByText = text => active_form().contains('span', text).parents('[ng-repeat="$item in $select.selected"]'),
    xButton_onselectedTagOrUser_ByText = text => selectedTagOrUser_ByText(text).find('.ui-select-match-close'),
    xButtons_onTagOrUserBoxes_byFieldLabel = label => active_form().contains(label).parent().find('[ng-click="$selectMultiple.removeChoice($index)"]'),
    xButtons_onTagOrUserBoxes = text => active_form().find('[ng-click="$selectMultiple.removeChoice($index)"]'),
    requiredElement = e => cy.get(`label[for="${e}"]`).siblings().find('[ng-message="required"]')

export default class BaseViewPage extends BasePage {
    constructor() {
        super();
        this.activeTab = active_tab;
        this.activeTabContainer = active_tab_container;
        this.caseNumberInput_enabled = caseNumberInput;
        this.caseNumberInput_disabled = caseNumberInput;
        this.historyView_leftColumn = historyView_leftColumn;
        this.historyView_rightColumn = historyView_rightColumn;
        this.customFormContainerOnHistoryLeft = customFormContainerOnHistoryLeft;
        this.customFormContainerOnHistoryRight = customFormContainerOnHistoryRight;
        this.requiredElement = requiredElement;
        this.save_button_on_active_tab = save_button_on_active_tab;
    }

//************************************ ACTIONS ***************************************//


    enter_and_select_Case_Number(caseNo) {
        api.cases.get_most_recent_case();
        cy.getLocalStorage("recentCase").then(recentCase => {
            if (recentCase) {
                caseNumberInput().should('have.class', 'ng-not-empty');
            }
        });
        caseNumberInput().clear();
        caseNumberInput().should('have.class', 'ng-empty');
        caseNumberInput().type(caseNo);

        this.caseNumberOnTypeahead().should('be.visible');
        this.caseNumberOnTypeahead().click();
        return this;
    }

    add_item_to_case(caseNo, msg) {
        caseNumberInput().type(caseNo);
        addingItemLabel().click();
        super.verify_toast_message(C.toastMsgs.saved);
        return this;
    }

    remove_specific_values_on_multi_select_fields(valuesArray) {
        valuesArray.forEach(value => {
            xButton_onselectedTagOrUser_ByText(value).click()
        })
        return this;
    }

    remove_existing_values_on_all_multi_select_fields() {
        xButtons_onTagOrUserBoxes().its("length").then(function (length) {
            for (let i = length - 1; i >= 0; i--) {
                xButtons_onTagOrUserBoxes().eq(i).click()
            }
        })
        return this;
    }

    remove_existing_values_on_specific_multi_select_field(fieldLabel) {
        xButtons_onTagOrUserBoxes_byFieldLabel(fieldLabel).its("length").then(function (length) {
            for (let i = length - 1; i >= 0; i--) {
                xButtons_onTagOrUserBoxes_byFieldLabel(fieldLabel).eq(i).click()
            }
        })
        return this;
    }

    trigger_and_verify_Case_Number_validation_message(caseNo, msg) {
        caseNumberInput().type(caseNo);
        addingItemLabel().click();
        super.verify_modal_content(msg);
        return this;
    }

    open_last_history_record(tableIndex) {
        this.select_tab(C.tabs.history)
            .set_visibility_of_table_column(C.tableColumns.details, true)
            .verify_title_on_active_tab(C.tabs.history)
        // this method is used in a lot of tests. I changed the index from 1 to 0. Need to check if this method will be fine for all usages
            this.click(C.buttons.details, this.firstRowInResultsTable(tableIndex))
        //    .verify_element_is_visible('History View')

        return this;
    }

    enter_media_description(text) {
        mediaDescriptionField().click();
        mediaDescriptionInput().should('be.visible');
        mediaDescriptionInput().type(text);
        super.click_button(C.buttons.add);
        return this;
    }

    enter_note_and_category(note, category) {
        noteInput().should('be.visible');
        noteInput().type(note);
        noteCategory().select(category);
        this.click_button_on_active_tab(C.buttons.add);
        return this;
    }

    verify_active_tab(activeTabTitle) {
        active_tab().should('contain', activeTabTitle);
        return this;
    }

    click_element_on_active_tab(text) {
        element_on_active_tab(text).click();
        return this;
    }

    click_Save() {
        save_button_on_active_tab().click();
        return this;
    }

    verify_Save_isDisabled() {
        this.save_button_on_active_tab().should('have.attr', 'disabled');
        return this;
    }

    verify_Save_isPresent() {
        this.save_button_on_active_tab().should('be.visible');
        return this;
    }

    verify_Save_isEnabled() {
        this.save_button_on_active_tab().should('not.have.attr', 'disabled');
        return this;
    }

    click_Edit() {
        edit_button_on_active_tab().click();
        cy.wait(1000)
        this.wait_element_to_be_visible(save_button_on_active_tab)
        this.verify_Save_isPresent()
        return this;
    }

    verify_edited_or_old_VALUE_if_field_was_not_edited(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue) {
        if (labelsOfEditedFields.includes(label) && editedValue !== null) {
            this.verify_value(fieldSelector, editedValue);
        } else if (initialValue) {
            this.verify_value(fieldSelector, initialValue);
        }
    }

    // verify_edited_or_old_TEXT_if_field_was_not_edited(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue) {
    //     if (labelsOfEditedFields.includes(label) && editedValue !== null) {
    //         this.verify_text(fieldSelector, editedValue);
    //     } else if (initialValue) {
    //         this.verify_text(fieldSelector, initialValue);
    //     }
    // }

    verify_edited_or_old_TEXT_if_field_was_not_edited(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue) {
        const isDev = S.selectedEnvironment.name === 'dev';
        const isPentest = S.selectedEnvironment.name === 'pentest';

        if (labelsOfEditedFields.includes(label) && editedValue !== null) {
            if (isDev) {
                this.verify_text_2(fieldSelector, editedValue);
            } else if (isPentest) {
                this.verify_text(fieldSelector, editedValue);
            }
        } else if (initialValue) {
            if (isDev) {
                this.verify_text_2(fieldSelector, initialValue);
            } else if (isPentest) {
                this.verify_text(fieldSelector, initialValue);
            }
        }
    }


    // verify_edited_or_old_text_on_multi_select_field(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue, oldValueOverwritten = false) {
    //     if (labelsOfEditedFields.includes(label) && editedValue !== null) {
    //         this.verify_text(fieldSelector, editedValue);
    //         // if (oldValueOverwritten) {
    //         //     this.verify_element_does_NOT_contain_text(fieldSelector, initialValue);
    //         // }
    //        //  else {
    //        //     this.verify_text(fieldSelector, initialValue);
    //        // }
    //     }
    //     else if (initialValue) {
    //         this.verify_text(fieldSelector, initialValue);
    //     }
    //
    // }

    verify_edited_or_old_text_on_multi_select_field(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue, oldValueOverwritten = false) {
        const isPentest = Cypress.env('env') === 'pentest';
        const verifyMethod = isPentest ? this.verify_text : this.verify_text_2;

        if (labelsOfEditedFields.includes(label) && editedValue !== null) {
            verifyMethod.call(this, fieldSelector, editedValue);
        } else if (initialValue) {
            verifyMethod.call(this, fieldSelector, initialValue);
        }
    }





    verify_value_on_multi_select_fields(labelsOfEditedFields, label, fieldSelector, editedValue, initialValue, oldValueOverwritten = false) {
        if (labelsOfEditedFields.includes(label) && editedValue) {
            this.verify_text(fieldSelector, editedValue);
            if (oldValueOverwritten) {
                this.verify_element_does_NOT_contain_text(fieldSelector, initialValue);
            } else {
                this.verify_text(fieldSelector, initialValue);
            }
        } else if (initialValue) {
            this.verify_text(fieldSelector, initialValue);
        }
    }

    verify_custom_data_on_Edit_form(dataObject) {
        if (dataObject.custom_checkbox !== undefined) this.verify_if_Checkbox_is_selected(customFormContainerOnEdit, dataObject.custom_checkbox);
        this.verify_selected_option_on_Checkbox_list(customFormContainerOnEdit, dataObject.custom_checkboxListOption);
        this.verify_selected_option_on_Radiobutton_list(customFormContainerOnEdit, dataObject.custom_radiobuttonListOption);
        if (dataObject.custom_selectListOption) this.verify_selected_option_on_Select_list(customFormContainerOnEdit, dataObject.custom_selectListOption);

        this.verify_values_on_multiple_elements(
            [
                [textboxOnCustomForm, dataObject.custom_textbox],
                [emailOnCustomForm, dataObject.custom_email],
                [numberOnCustomForm, dataObject.custom_number],
                [passwordOnCustomForm, dataObject.custom_password],
                [textareaOnCustomForm, dataObject.custom_textarea],
                [dropdownTypeaheadOnCustomForm, dataObject.custom_dropdownTypeaheadOption],
                [personOnCustomForm, dataObject.custom_person],
                [dateOnCustomForm, dataObject.custom_dateEditMode],
            ]);

        //using this instead of the commented row above until the issue with shared form gets fixed ----> #14625 ⁃ 'Dropdown Typeahead' on the Shared custom form has options available only in the originating Org
        if (Cypress.env('orgNum') === 1) {
            this.verify_values_on_multiple_elements([[dropdownTypeaheadOnCustomForm, dataObject.custom_dropdownTypeaheadOption]])
        }

        this.verify_text(userOrGroupOnCustomForm, dataObject.custom_user_or_group_names);
        return this;
    };

    verify_all_values_on_history_for_standard_fields__OLD(leftOrRightColumn, label_TextPairs, label_InputValuePairs, label_TextareaValuesPairs) {
        let column;

        if (leftOrRightColumn === 'left') {
            column = this.historyView_leftColumn
        } else if (leftOrRightColumn === 'right') {
            column = this.historyView_rightColumn
        }

        let self = this

        label_TextPairs
            .forEach(function (stack) {
                if (stack[1]) self.verify_text(fieldValueFoundByLabelOnHistoryColumn(column, stack[0]), stack[1])
            })

        if (label_InputValuePairs) {
            label_InputValuePairs
                .forEach(function (stack) {
                    if (stack[1]) self.verify_value(inputFieldFoundByLabelOnSpecificContainer(column, stack[0]), stack[1])
                })
        }

        if (label_TextareaValuesPairs) {
            label_TextareaValuesPairs
                .forEach(function (stack) {
                    if (stack[1]) self.verify_value(textareaFieldFoundByLabelOnSpecificContainer(column, stack[0]), stack[1])
                })
        }

        return this;
    };

    // verify_all_values_on_history_for_standard_fields(leftOrRightColumn, label_TextPairs, label_InputValuePairs, label_TextareaValuesPairs) {
    //     let column = this.historyView_leftColumn
    //
    //     if (leftOrRightColumn === 'right') {
    //         column = this.historyView_rightColumn
    //     }
    //     let self = this
    //
    //     column().within(($form) => {
    //         label_TextPairs
    //             .forEach(function (stack) {
    //                 if (stack[1] !== null) self.verify_text(fieldValueFoundByLabel(stack[0]), stack[1])
    //             })
    //
    //         if (label_InputValuePairs) {
    //             label_InputValuePairs.forEach(function (stack) {
    //                 if (stack[1] !== null) self.verify_value(inputFieldFoundByLabel(stack[0]), stack[1])
    //             })
    //         }
    //
    //         if (label_TextareaValuesPairs) {
    //             label_TextareaValuesPairs.forEach(function (stack) {
    //                 if (stack[1] !== null) self.verify_value(textareaFieldFoundByLabel(stack[0]), stack[1])
    //             })
    //         }
    //     })
    //     return this;
    // };

    verify_all_values_on_history_for_standard_fields(leftOrRightColumn, label_TextPairs, label_InputValuePairs, label_TextareaValuesPairs) {
        let column = this.historyView_leftColumn;

        if (leftOrRightColumn === 'right') {
            column = this.historyView_rightColumn;
        }
        let self = this;
        const isDev = S.selectedEnvironment.name === 'dev';
        const isPentest = S.selectedEnvironment.name === 'pentest';

        column().within(($form) => {
            label_TextPairs.forEach(function (stack) {
                if (stack[1] !== null) {
                    if (isDev) {
                        self.verify_text_2(fieldValueFoundByLabel(stack[0]), stack[1]);
                    } else if (isPentest) {
                        self.verify_text(fieldValueFoundByLabel(stack[0]), stack[1]);
                    }
                }
            });

            if (label_InputValuePairs) {
                label_InputValuePairs.forEach(function (stack) {
                    if (stack[1] !== null) {
                        self.verify_value(inputFieldFoundByLabel(stack[0]), stack[1]);
                    }
                });
            }

            if (label_TextareaValuesPairs) {
                label_TextareaValuesPairs.forEach(function (stack) {
                    if (stack[1] !== null) {
                        self.verify_value(textareaFieldFoundByLabel(stack[0]), stack[1]);
                    }
                });
            }
        });

        return this;
    }


    verify_all_values_on_Edit_form_for_standard_fields(label_TextPairs, label_InputValuePairs, label_TextareaValuesPairs) {
        let self = this

        edit_form().within(($form) => {
            label_TextPairs
                .forEach(function (stack) {
                    if (stack[1]) self.verify_text(fieldValueFoundByLabel(stack[0]), stack[1])
                })

            if (label_InputValuePairs) {
                label_InputValuePairs.forEach(function (stack) {
                    if (stack[1]) self.verify_value(inputFieldFoundByLabel(stack[0]), stack[1])
                })
            }

            if (label_TextareaValuesPairs) {
                label_TextareaValuesPairs.forEach(function (stack) {
                    if (stack[1]) self.verify_value(textareaFieldFoundByLabel(stack[0]), stack[1])
                })
            }
        })
        return this;
    };

    verify_custom_data_on_History(leftOrRightColumn, formName, dataObject) {

        let formContainer;

        if (leftOrRightColumn === 'left') {
            formContainer = e => historyView_leftColumn().contains(formName).parents('[ng-repeat="form in forms"]')
        } else if (leftOrRightColumn === 'right') {
            formContainer = e => historyView_rightColumn().contains(formName).parents('[ng-repeat="form in forms"]')
        }


        this.verify_if_Checkbox_is_selected(formContainer, dataObject.custom_checkbox);
        this.verify_selected_option_on_Checkbox_list(formContainer, dataObject.custom_checkboxListOption);
        this.verify_selected_option_on_Radiobutton_list(formContainer, dataObject.custom_radiobuttonListOption);
        this.verify_selected_option_on_Select_list(formContainer, dataObject.custom_selectListOption);

        this.verify_values_on_multiple_elements(
            [
                [textboxOnCustomForm, dataObject.custom_textbox, formContainer],
                [emailOnCustomForm, dataObject.custom_email, formContainer],
                [numberOnCustomForm, dataObject.custom_number, formContainer],
                [passwordOnCustomForm, dataObject.custom_password, formContainer],
                [personOnCustomForm, dataObject.custom_person, formContainer],
                [dropdownTypeaheadOnCustomForm, dataObject.custom_dropdownTypeaheadOption, formContainer],
                [customDateOnHistory, dataObject.custom_date, formContainer],
            ]);

        this.verify_text_on_multiple_elements([
            [userOrGroupOnCustomForm, dataObject.custom_user_or_group_names, formContainer],
        ]);

        return this;
    };

    verify_red_highlighted_history_records(allFieldsOnHistory, redFields) {
        historyView_leftColumn().within(($form) => {
            for (let field of allFieldsOnHistory) {
                if (redFields.includes(field)) {
                    cy.contains(field)
                        .should('have.color', 'rgb(255, 0, 0)')
                } else {
                    cy.contains(field)
                        // .then(($el) => {
                        //     return window.getComputedStyle($el[0])
                        // })
                        // .invoke('getPropertyValue', 'color')
                        // .should('equal', 'rgb(103, 106, 108)')
                        .should('have.color', 'rgb(103, 106, 108)')
                }
            }
        })
        return this;
    }

    verify_required_fields(fields) {
        for (let field of fields) {
            this.requiredElement(field).should('be.visible');
        }
        return this;
    }

    verify_non_required_fields(fields) {
        for (let field of fields) {
            this.requiredElement(field).should('not.exist');
        }
        return this;
    }

}
