import C from "../fixtures/constants";

const S = require('../fixtures/settings');
const D = require('../fixtures/data');

import BasePage from "./base-pages/base-page";
import tags from "./ui-spec";

//************************************ ELEMENTS ***************************************//

let
    addTagButton = e => cy.get('[translate="TAGS.LIST.BUTTON_ADD"]'),
    tagUsedBy = e => cy.get('[id="tagUsedBy"]'),
    tagGroupName = e => cy.get('[placeholder="Tag Group Name"]'),
    tagName = e => cy.get('[id="tagName"]'),
    tagColor = e => cy.get('.modal-body').find('[ng-model="tagModel.color"]').first(),
    //tagsRadiobuttons = e => cy.get('[class="form-group"]').eq(0)
    tagsRadiobuttons = e => cy.get('[class="tab-content"]'),
    newRadiobutton = e => cy.get('[title="New"]'),
    newTagGroupName = e => cy.get('[id="newTagGroup"]'),
    selectUserOrGroup = e => cy.get('[placeholder="Start typing to search for users/groups"]').eq(1)


export default class tagsPage extends BasePage {
    constructor() {
        super();
    }

//************************************ ACTIONS ***************************************//

    click_add_tag_button() {
        addTagButton().click();
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
                .should('have.length', 2)
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


}




