import C from "../fixtures/constants";

const S = require('../fixtures/settings');
const D = require('../fixtures/data');

import BasePage from "./base-pages/base-page";
import tags from "./ui-spec";

//************************************ ELEMENTS ***************************************//

let
    addTagButton = e => cy.get('[translate="TAGS.LIST.BUTTON_ADD"]'),
    addTagGroupButton = e => cy.get('[translate="GENERAL.ADD"]'),
    tagUsedBy = e => cy.get('[id="tagUsedBy"]'),
    tagGroupName = e => cy.get('[placeholder="Tag Group Name"]'),
    tagName = e => cy.get('[id="tagName"]'),
    tagColor = e => cy.get('.modal-body').find('[ng-model="tagModel.color"]').first(),
    groupTagColor = e => cy.get('.modal-body').find('[ng-model="tagGroup.color"]').first(),
    //tagsRadiobuttons = e => cy.get('[class="form-group"]').eq(0)
    tagsRadiobuttons = e => cy.get('[class="tab-content"]'),
    newRadiobutton = e => cy.get('[title="New"]'),
    newTagGroupName = e => cy.get('[id="newTagGroup"]'),
    tagsBoxOnAddTagGroupModal = e => cy.get('[id="tags"]'),
    selectUserOrGroup = e => cy.get('[placeholder="Start typing to search for users/groups"]').eq(1),
    searchField = e => cy.get('[placeholder="Search"]'),
    saveButtonEditTagModal = e => cy.get('[translate="GENERAL.BUTTON_SAVE"]'),
    editUserOrGroup = e => cy.get('[id="userSelection"]')


export default class tagsPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//


    open_direct_url_for_page() {
        this.open_url_and_wait_all_GET_requests_to_finish(S.base_url + '/#/tags')
    };

    click_add_tag_button() {
        addTagButton().click();
        return this
    };

    click_add_tag_group_button() {
        addTagGroupButton().click();
        return this
    };

    populate_add_tag_modal(data, useExistingTagGroup, newTagGroupObject) {
        let type = data.type === 'Org' ? 'Organization' : data.type;

        tagUsedBy().select(type);
        tagName().type(data.name);
        tagColor().clear();
        tagColor().type(data.color);
        if (data.type === 'Group') {
            if (useExistingTagGroup) tagGroupName().type(S.selectedEnvironment.tagGroup.name + '{enter}');
            else {
                newRadiobutton().click();
                newTagGroupName().type(newTagGroupObject.name);
                this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [newTagGroupObject.userNames], "users/groups", '{enter}'])
                this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [newTagGroupObject.userGroupNames], "users/groups", '{enter}'])
            }
        }
        return this;
    }


    verify_selected_tags_radiobutton_based_on_status(expectedLabel) {
        tagsRadiobuttons().should('exist').within(() => {
            cy.get('input[type="radio"]')
                .filter(':checked')
                .should('have.length.greaterThan', 0)
                .siblings('span')
                .invoke('text')
                .should('contain', expectedLabel);
        });
        return this;
    }

    select_radiobutton(labelText) {
        tagsRadiobuttons().should('exist').within(() => {
            cy.contains('label span', new RegExp(`^\\s*${labelText}\\s*$`, 'i'))
                .closest('label')
                .find('input[type="radio"]')
                .wait(300)
                .check({force: true});
        });
        return this;
    }

    populate_add_tag_group_modal(data) {
        tagGroupName().clear().type(data.name)
        this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [data.userNames], "users/groups", '{enter}'])
        this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [data.userGroupNames], "users/groups", '{enter}'])
        tagsBoxOnAddTagGroupModal().click();
        tagsBoxOnAddTagGroupModal().type(`${data.groupTag1}{enter}`)
        tagsBoxOnAddTagGroupModal().type(`${data.groupTag2}{enter}`)
        groupTagColor().clear().type(data.color)
        return this;
    }

    add_tags_on_add_tag_group_modal(data) {
        tagsBoxOnAddTagGroupModal().click();
        tagsBoxOnAddTagGroupModal().type(`${data.groupTag1}{enter}`)
        return this;
    }

    search(tagName) {
        searchField().clear().type(tagName)
        return this;
    }

    populate_edit_tag_modal(data) {
        tagName().clear().type(data.name)
        tagColor().clear().type(data.color)
        return this;
    }

    click_save_on_edit_tag_modal() {
        saveButtonEditTagModal().click();
        return this;
    }

    populate_edit_tag_group_modal(data) {
        tagGroupName().clear().type(data.name);
        this.remove_existing_users_or_groups()
        this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [data.userNames], "users/groups", '{enter}'])
        this.enter_values_on_single_multi_select_typeahead_field(['Users/Groups', [data.userGroupNames], "users/groups", '{enter}'])
        return this;
    }

    remove_existing_users_or_groups() {
        editUserOrGroup().should('exist').within(() => {
            cy.get('.ui-select-match-close').then($closeBtns => {
                if ($closeBtns.length) {
                    cy.wrap($closeBtns).each($btn => cy.wrap($btn).click({force: true}));
                }
            });
        });
        return this;
    }

}




