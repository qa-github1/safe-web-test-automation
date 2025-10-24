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
    tagGroupColor = e => cy.get('.modal-body').find('[ng-model="tagGroup.color"]').first(),
    //tagsRadiobuttons = e => cy.get('[class="form-group"]').eq(0)
    tagsRadiobuttons = e => cy.get('[class="tab-content"]'),
    newRadiobutton = e => cy.get('[title="New"]'),
    newTagGroupName = e => cy.get('[id="newTagGroup"]'),
    tagsBoxOnAddTagGroupModal = e => cy.get('[id="tags"]'),
    selectUserOrGroup = e => cy.get('[placeholder="Start typing to search for users/groups"]').eq(1),
    searchField = e => cy.get('[placeholder="Search"]'),
    saveButtonEditTagModal = e => cy.get('[translate="GENERAL.BUTTON_SAVE"]'),
    editUserOrGroup = e => cy.get('[id="userSelection"]'),
    tagsInput = index => cy.get('[placeholder="Enter Tag Name"]').eq(index)


export default class tagsPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    click_add_tag_button() {
        addTagButton().click();
        return this
    };

    click_add_tag_group_button() {
        addTagGroupButton().click();
        return this
    };

    populate_add_tag_modal(data) {
        tagUsedBy().select(data.tagUsedBy);
        tagName().type(data.tagName);
        tagColor().clear();
        tagColor().type(data.color);
        if (data.tagUsedBy === 'Group' && data.tagGroupName === "smj 1") {
            tagGroupName().type(data.tagGroupName + '{enter}');
        } else if (data.tagUsedBy === 'Group' && data.tagGroupName !== "smj 1") {
            newRadiobutton().click();
            newTagGroupName().type(data.tagGroupName);
            selectUserOrGroup().type(data.user)
            cy.wait(1000)
            selectUserOrGroup().type('{enter}')

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
        tagGroupName().clear().type(data.tagGroupName)
        selectUserOrGroup().type(`${data.userGroup}{enter}`)
        tagGroupColor().clear();
        tagGroupColor().type(data.color);
        return this;
    }

    add_tags_on_add_tag_group_modal(data) {
        tagsBoxOnAddTagGroupModal().click();
        tagsBoxOnAddTagGroupModal().type(`${data.newTag1}{enter}`)
        return this;
    }

    search_for_tag_on_tags_page(data) {
        searchField().type(data.tagName)

        return this;
    }

    populate_edit_tag_modal(data) {
        tagName().clear().type(data.editedTagName)
        tagColor().clear().type(data.editedTagColor)
        return this;
    }

    click_save_on_edit_tag_modal() {
        saveButtonEditTagModal().click();
        return this;
    }

    populate_edit_tag_group_modal(data) {
        tagGroupName().clear().type(data.editedTagGroupName);
        this.remove_existing_and_add_new_user_or_group(data.editedUser)
        return this;
    }

    remove_existing_and_add_new_user_or_group(userName) {
        editUserOrGroup().should('exist').within(() => {
            cy.get('.ui-select-match-close').then($closeBtns => {
                if ($closeBtns.length) {
                    cy.wrap($closeBtns).each($btn => cy.wrap($btn).click({force: true}));
                }
            });

            cy.get('input.ui-select-search, input[type="search"]')
                .filter(':visible')
                .first()
                .should('be.visible')
                .click({force: true})
                .clear({force: true})
                .type(userName)
                .wait(1000)
                .type('{enter}');
        });

        return this;
    }

    add_user_tag_on_edit_modal(data,index){
        tagsInput(index).click();
        tagsInput(index).type(`${data.tagName}{enter}`)
        return this;
    }


}




