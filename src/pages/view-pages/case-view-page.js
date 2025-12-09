import BaseViewPage from "../base-pages/base-view-page";

const moment = require('moment');
const helper = require('../../support/e2e-helper');
const C = require('../../fixtures/constants');

//************************************ ELEMENTS ***************************************//

let
    formContainer = timeout => cy.get('.form-horizontal', timeout),
    searchInputField = e => cy.get('#searchinput'),
    caseOnTypeaheadDropdown = e => cy.get('[template-url="app/components/nav/search-pages/typeahead-template.html"]').contains(e),
    clpAdminAccessNotation = e => cy.get('[translate="CASE.LIMIT_ACCESS_ORG_ADMINS"]'),
    active_tab = e => cy.get('[class="tab-pane ng-scope active"]'),
    view_form = e => cy.get('[name="frm"]'),
    edit_form = e => cy.get('[name="frmEdit"]'),
    permissionGroupContainer = groupName => cy.contains(groupName).closest('tr'),
    userGroupInTypeaheadList = e => cy.get('[ng-repeat="userGroup in $select.items"]'),
    userInTypeaheadList = e => cy.get('[ng-repeat="user in $select.items"]'),
    permissionGroupInTypeaheadList = e => cy.get('[ng-repeat="group in $select.items"]'),
    userInputInPermissionGroup = permissionGroupName => permissionGroupContainer(permissionGroupName).children().find('input[placeholder="Users..."]'),
    userGroupInputInPermissionGroup = permissionGroupName => permissionGroupContainer(permissionGroupName).children().find('input[placeholder="User groups..."]'),
    permissionGroupInputInPermissionGroup = permissionGroupName => permissionGroupContainer(permissionGroupName).children().find('input[placeholder="Permission Groups"]'),
    toggle = e => active_tab().children().find('.toggle'),
    caseNumberInput_disabled = e => cy.get('[name="CaseNumber"]'),
    caseNumberInput_enabled = e => cy.get('[ng-model="caseEdit.caseNumber"]'),
    officeDropdown = e => cy.get('[ng-model="caseEdit.officeId"]'),
    offenseTypeDropdown = e => cy.get('[ng-model="caseEdit.offenseTypeId"]'),
    offenseTypeSelectedValue = e => cy.get('[ng-model="caseEdit.offenseTypeId"]').find('[selected="selected"]'),
    offenseLocationInput = e => cy.get('[ng-model="caseEdit.offenseLocation"]'),
    offenseDescriptionInput = e => cy.get('[ng-model="caseEdit.offenseDescription"]'),
    active_form = e => cy.get('.form-horizontal').not('.ng-hide'),
    tagsInput = e => cy.contains('Tags').parent('div').find('input'),
    offenseType = e => cy.get('[name="offenseType"]').eq(0),
    // tagsInput = e => tagsContainer().find('input[role="combobox"]'),
    reviewDateNotesInput = e => cy.get('[ng-model="caseEdit.reviewDateNotes"]'),
    offenseDateInput = e => cy.get('[ng-model="caseEdit.offenseDate"]').find('[ng-model="ngModel"]'),
    closedDateInput = e => cy.get('[ng-model="caseEdit.closedDate"]').find('[ng-model="ngModel"]'),
    reviewDateInput = e => cy.get('[ng-model="caseEdit.reviewDate"]').find('[ng-model="ngModel"]'),
    caseOfficerField = e => cy.get('[name="caseOfficers"]'),
    caseOfficerInput = e => cy.get('[name="caseOfficers"]').find('input'),
    caseOfficerEdit = e => cy.get('[id="caseOfficersEdit"]').find('input'),
    offenseLocationTypeahead = e => cy.root().parents('html').find('.pac-item').eq(0),
    requiredElement = e => cy.get(`label[for="${e}"]`).siblings().find('[ng-message="required"]'),
    caseNumber__ = e => cy.contains('Case Number').parent('div').find('input'),
    offenseLocation__ = e => cy.contains('Offense Location').parent('div').find('input'),
    offenseDescription__ = e => cy.contains('Offense Description').parent('div').find('textarea'),
    caseOfficersField__ = e => cy.contains('Case Officer(s)').parent('div').find('ng-transclude'),
    caseOfficersInput__ = e => cy.contains('Case Officer(s)').parent('div').find('input'),
    offenseDate__ = e => cy.contains('Offense Date').parent('div').find('ng-transclude'),
    closedDate__ = e => cy.contains('Closed Date').parent('div').find('ng-transclude'),
    tagsField__ = e => cy.contains('Tags').parent('div').find('ng-transclude'),
    offenseType__ = e => cy.contains('Offense Type').parent('div').find('ng-transclude'),
    offenseTypeDropdown__ = e => cy.contains('Offense Type').parent('div').find('select'),
    reviewDate__ = e => cy.contains('Review Date').parent('div').find('ng-transclude'),
    reviewDateNotes__ = e => cy.contains('Review Date Notes').parent('div').find('textarea'),
    statusToggle_  = e => cy.contains('Status').parent('div').find('.toggle'),
    tagsField = e => cy.get('[tagging="addNew"]')


export default class CaseViewPage extends BaseViewPage {

    constructor() {
        super()
        this.requiredElement = requiredElement;
    }

    //************************************ ACTIONS ***************************************//

    enter_Case_Number(caseNo) {
       // caseNumberInput_enabled().clear();
        caseNumberInput_enabled().invoke('val', '').trigger('input')
        caseNumberInput_enabled().should('have.class', 'ng-empty');
        caseNumberInput_enabled().type(caseNo);
        return this;
    }

    verify_Case_View_page_is_open(caseNo) {
        this.toastMessage().should('not.exist');
        caseNumberInput_disabled().should('have.value', caseNo);
        this.verify_text_is_present_on_main_container(C.labels.caseView.title);
        return this;
    };

    change_Case_Number(newCaseNo) {
        this.click_element_on_active_tab(C.buttons.edit);
        caseNumberInput_enabled().clear().type(newCaseNo);
        this.click_element_on_active_tab(C.buttons.save);
        caseNumberInput_disabled().should('have.value', newCaseNo);
        return this;
    };

    verify_textual_values_on_the_form(arrayOfValues) {
        this.verify_multiple_text_values_in_one_container(
            formContainer,
            arrayOfValues
        )
        return this;
    }

    select_Offense_Type(option) {
        offenseType().select(option);
        offenseType().should('contain', option);
        return this;
    };

    verify_values_on_Edit_form(caseObject, includesCustomData) {

        this.verify_values_on_multiple_elements(
            [
                [caseNumberInput_enabled, caseObject.caseNumber],
                [offenseLocationInput, caseObject.offenseLocation],
                [offenseDescriptionInput, caseObject.offenseDescription],
                [reviewDateNotesInput, caseObject.reviewDateNotes],
                [offenseDateInput, caseObject.offenseDate],
                [reviewDateInput, caseObject.reviewDate]
            ]);

        this.verify_text_on_multiple_elements(
            [
                [caseOfficerField, caseObject.caseOfficers],
                [tagsField, caseObject.tags],
                [offenseTypeSelectedValue, caseObject.offenseType],
            ]);

        if (includesCustomData) {
            this.verify_custom_data_on_Edit_form(caseObject)
        }
        return this;
    };

    verify_edited_and_not_edited_values(viewOrEdit, labelsOfEditedFields, editedCaseObject, initialCaseObject, oldValueOverwritten, isUpdateImported) {

        editedCaseObject = Object.assign({}, editedCaseObject)
        initialCaseObject = Object.assign({}, initialCaseObject)
        let oldValueOverwrittenForTags = oldValueOverwritten
        if (isUpdateImported) oldValueOverwrittenForTags = false // requirement in card #9314

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Case Number', caseNumber__, editedCaseObject.caseNumber, initialCaseObject.caseNumber)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Offense Location', offenseLocation__, editedCaseObject.offenseLocation, initialCaseObject.offenseLocation)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Offense Description', offenseDescription__, editedCaseObject.offenseDescription, initialCaseObject.offenseDescription)

        this.verify_edited_or_old_VALUE_if_field_was_not_edited(
            labelsOfEditedFields, 'Review Date Notes', reviewDateNotes__, editedCaseObject.reviewDateNotes, initialCaseObject.reviewDateNotes)

        if (viewOrEdit === 'view'){
            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Offense Date', offenseDate__, editedCaseObject.offenseDate, initialCaseObject.offenseDate)
            this.verify_edited_or_old_TEXT_if_field_was_not_edited(
                labelsOfEditedFields, 'Review Date', reviewDate__, editedCaseObject.reviewDate, initialCaseObject.reviewDate)
            this.verify_edited_or_old_text_on_multi_select_field(
                labelsOfEditedFields, 'Tags', tagsField__, editedCaseObject.tagsOnHistory, initialCaseObject.tagsOnHistory, oldValueOverwrittenForTags)
        }
        else{
            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Offense Date', offenseDateInput, editedCaseObject.offenseDate, initialCaseObject.offenseDate)
            this.verify_edited_or_old_VALUE_if_field_was_not_edited(
                labelsOfEditedFields, 'Review Date', reviewDateInput, editedCaseObject.reviewDate, initialCaseObject.reviewDate)
            this.verify_edited_or_old_text_on_multi_select_field(
                labelsOfEditedFields, 'Tags', tagsField__, editedCaseObject.tags, initialCaseObject.tags, oldValueOverwrittenForTags)
        }

        this.verify_edited_or_old_TEXT_if_field_was_not_edited(
            labelsOfEditedFields, 'Offense Type', offenseType__, editedCaseObject.offenseType, initialCaseObject.offenseType)

        this.verify_edited_or_old_text_on_Case_Officers_field(
            labelsOfEditedFields, editedCaseObject.caseOfficers, initialCaseObject.caseOfficers, oldValueOverwritten)
        return this;
    };

    verify_edited_and_not_edited_values_on_Case_View_form(labelsOfEditedFields, editedCaseObject, initialCaseObject, oldValueOverwritten) {
        view_form().within(($list) => {
            this.verify_edited_and_not_edited_values('view', labelsOfEditedFields, editedCaseObject, initialCaseObject, oldValueOverwritten)
        })
        return this;
    };

    verify_edited_and_not_edited_values_on_Case_Edit_form(labelsOfEditedFields, editedCaseObject, initialCaseObject, oldValueOverwritten, isUpdateImported = false) {
        edit_form().within(($list) => {
            this.verify_edited_and_not_edited_values('edit', labelsOfEditedFields, editedCaseObject, initialCaseObject, oldValueOverwritten, isUpdateImported)
        })
        return this;
    };

    verify_edited_or_old_text_on_Case_Officers_field(labelsOfEditedFields, editedValue, initialValue, oldValueOverwritten = false) {
        if (labelsOfEditedFields.includes('Case Officer(s)') && editedValue) {
            this.verify_text(caseOfficerField, editedValue);
            if (oldValueOverwritten) {
                this.verify_element_does_NOT_contain_text(caseOfficersField__, initialValue);
            } else {
                this.verify_text(caseOfficersField__, initialValue);
            }
        } else if (initialValue) {
            this.verify_text(caseOfficersField__, initialValue);
        }
    }

    remove_all_optional_values(object) {
        this.clear_all_fields(
            [
                offenseLocationInput,
                offenseDescriptionInput,
                offenseDateInput,
                reviewDateNotesInput
            ]);

        // Tags
        this.remove_existing_values_on_specific_multi_select_field('Tags')

        object.offenseLocation = '';
        object.offenseDescription = '';
        object.offenseDate = '';
        object.reviewDateNotes = '';
        object.tags = '';
        object.tagsOnHistory = 'No Tags';
        return this;
    };

    verify_all_values_on_history_in_specific_column(dataObject_, leftOrRightColumn, customFormName, isNewlyAttachedForm) {

        let dataObject = Object.assign({}, dataObject_)
        dataObject.offenseDate = dataObject.offenseDate || ''
        dataObject.offenseLocation = dataObject.offenseLocation || ''
        dataObject.offenseDescription = dataObject.offenseDescription || ''
        dataObject.tagsOnHistory = dataObject.tags? dataObject.tags : 'No Tags'

        this.verify_all_values_on_history_for_standard_fields(leftOrRightColumn,
            [
                ['Update Made By', dataObject.updateMadeBy],
                ['Update Date', dataObject.updateDate],
                ['Org / Office', dataObject.orgAndOffice],
                ['Case Officer(s)', dataObject.caseOfficers],
                ['Offense Date', dataObject.offenseDate],
                ['Offense Type', dataObject.offenseType],
                ['Tags', dataObject.tagsOnHistory],
                ['Status', dataObject.status]
            ],
            [
                ['Case Number', dataObject.caseNumber],
                ['Offense Location', dataObject.offenseLocation],
            ],
            [
                ['Offense Description', dataObject.offenseDescription],
            ]
        )

        if (dataObject.reviewDate) {
            this.verify_all_values_on_history_for_standard_fields(leftOrRightColumn,
                [['Review Date', dataObject.reviewDate]],
                [],
                [['Review Date Notes', dataObject.reviewDateNotes]]
            )
        }

        if (customFormName){
            if (isNewlyAttachedForm && leftOrRightColumn === 'right'){
                this.verify_custom_data_is_not_present_on_history(leftOrRightColumn, customFormName)
            }
            else{
                this.verify_custom_data_on_History(leftOrRightColumn, customFormName, dataObject)
            }
        }
        return this;
    };

    verify_all_values_on_history_in_specific_column2(dataObject_, leftOrRightColumn, customFormName) {

        let dataObject = Object.assign({}, dataObject_)
        // dataObject.offenseDate = dataObject.offenseDate || ''
        // dataObject.offenseLocation = dataObject.offenseLocation || ''
        // dataObject.offenseDescription = dataObject.offenseDescription || ''
        // dataObject.tagsOnHistory = dataObject.tags? dataObject.tags : 'No Tags'

        this.verify_all_values_on_history_for_standard_fields2(leftOrRightColumn,
            [
                ['Update Date', dataObject.updateDate],
                ['Org / Office', dataObject.orgAndOffice],
                ['Case Officer(s)', dataObject.caseOfficers],
                ['Offense Date', dataObject.offenseDate],
                ['Offense Type', dataObject.offenseType],
                ['Tags', dataObject.tagsOnHistory],
                ['Status', dataObject.status]
            ],
            [
                ['Update Made By', dataObject.updateMadeBy],
                ['Case Number', dataObject.caseNumber],
                ['Offense Location', dataObject.offenseLocation],
            ],
            [
                ['Offense Description', dataObject.offenseDescription],
            ]
        )

        if (dataObject.reviewDate) {
            this.verify_all_values_on_history_for_standard_fields2(leftOrRightColumn,
                [['Review Date', dataObject.reviewDate]],
                [],
                [['Review Date Notes', dataObject.reviewDateNotes]]
            )
        }

        if (customFormName) {
            this.verify_custom_data_on_History(leftOrRightColumn, customFormName, dataObject)
        }
        return this;
    };

    verify_red_highlighted_history_records(redFields, allFieldsOnHistory) {
        let fieldsToCheck = allFieldsOnHistory || C.caseFields.allFieldsOnHistory
        super.verify_red_highlighted_history_records(fieldsToCheck, redFields)
        return this;
    }

    verify_all_values_on_history(newCaseObject, oldCaseObject, customFormName = null , isNewlyAttachedForm = false) {
        this.verify_all_values_on_history_in_specific_column(newCaseObject, 'left', customFormName)
        if (oldCaseObject) this.verify_all_values_on_history_in_specific_column(oldCaseObject, 'right', customFormName, isNewlyAttachedForm )
        return this;
    };


    edit_Status(setToActive) {
        let that = this
        edit_form().within(($list) => {
            statusToggle_().then(($el) => {
                if ($el.hasClass('off') && setToActive || !($el.hasClass('off')) && !setToActive) {
                    statusToggle_().click();
                }
            });
        })
        return this;
    };

    edit_all_values(newCaseObject) {
        edit_form().within(($list) => {
            statusToggle_().then(($el) => {
                if ($el.hasClass('off') && newCaseObject.active || !($el.hasClass('off')) && !newCaseObject.active) {
                    statusToggle_().click();
                }
            });
            this.wait_element_to_be_visible(caseNumberInput_enabled);

            this.type_if_values_provided(
                [
                    [caseNumberInput_enabled, newCaseObject.caseNumber],
                    [offenseLocationInput, newCaseObject.offenseLocation, offenseLocationTypeahead],
                    [offenseDescriptionInput, newCaseObject.offenseDescription],
                    [offenseDateInput, newCaseObject.offenseDate],
                    [reviewDateInput, newCaseObject.reviewDate],
                    [reviewDateNotesInput, newCaseObject.reviewDateNotes],
                    [closedDateInput, newCaseObject.closedDate]
                ]);

            this.enter_values_on_several_multi_select_typeahead_fields(
                [
                    [caseOfficerInput, newCaseObject.caseOfficers, "users/groups"],
                    [tagsInput, newCaseObject.tags, this.lastTagOnTypeahead],
                ]);

            offenseType().select(newCaseObject.offenseType);
            offenseType().should('contain', newCaseObject.offenseType);
        })
        return this;
    };

    set_Access_to_case_is_restricted(setYes) {
        if (setYes) {
            this.click_element_if_has_a_class(toggle(), 'off');
        } else {
            this.click_element_if_has_a_class(toggle(), 'on');
        }
        return this;
    }

    turn_on_Permissions_on_case(CLP_permissionGroup, user, userGroup, office_permissionGroup) {
        this.select_tab(C.tabs.basicInfo);
        this.select_tab(C.tabs.permissions)
            .click_Edit();

        this.click_element_if_has_a_class(toggle(), 'off');

        if (user) {
            userInputInPermissionGroup(CLP_permissionGroup.name).type(user.email);
            userInTypeaheadList().should('be.visible');
            userInTypeaheadList().click();
        }

        if (userGroup) {
            userGroupInputInPermissionGroup(CLP_permissionGroup.name).type(userGroup.name);
            userGroupInTypeaheadList().should('be.visible');
            userGroupInTypeaheadList().click();
        }

        if (office_permissionGroup) {
            permissionGroupInputInPermissionGroup(CLP_permissionGroup.name).type(office_permissionGroup.name);
            permissionGroupInTypeaheadList().should('be.visible');
            permissionGroupInTypeaheadList().click();
        }

        this.click_Save();
        if (office_permissionGroup) {
            this.verify_messages_on_sweet_alert(
                [C.CLP.caseLevelPermissionsForGroups, office_permissionGroup.name]);
            this.click_button(C.buttons.ok);
        }
        this.verify_toast_message(C.toastMsgs.saved);

        return this;
    }
}
