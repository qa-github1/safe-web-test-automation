const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
describe('Dispo Auth', function () {

    it('Add Dispo Task with 11 1DA items and assign to Org Admin, ' +
        'set different actions for item using all variations' +
        'using Actions menu and grid, ' +
        'check statuses and notes upon submission', function () {

        let user = S.getUserData(S.userAccounts.orgAdmin);

        ui.app.log_title(this);
        api.auth.get_tokens(user);

        let selectedTemplate = S.selectedEnvironment.taskTemplates.dispoAuth
        D.getNewTaskData()
        D.generateNewDataSet()
        D.newTask = Object.assign(D.newTask, selectedTemplate)
        D.newTask.creatorId = S.userAccounts.orgAdmin.id
        D.newTask.assignedUserIds = [S.userAccounts.orgAdmin.id]
        api.cases.add_new_case()
        let newAddress1 = D.newPersonAddress

     //   person1 NOT linked to the case, WITHOUT an address -->link person to the case from modal but keep address blank
        let person1 = Object.assign({}, D.getNewPersonData())
        D.newPersonAddress = {}
        api.people.add_new_person(false)

        //person2 linked to the case, WITHOUT an address -->  populate address on the modal
        let person2 = Object.assign({}, D.getNewPersonData())
        D.newPersonAddress = {}
        api.people.add_new_person(true, D.newCase, person2)
        let newAddress2 = D.getNewPersonAddressData()

        //person3 linked to multiple cases, with multiple addresses
        let person3 =  Object.assign({}, D.getNewPersonData())
        api.people.add_new_person(true, D.newCase, person3)
        api.people.add_person_to_case(true, false, null, S.selectedEnvironment.oldActiveCase.id)

        //api.people. TODO Make api request to add another address

        for (let i = 0; i < 11; i++) {
            api.items.add_new_item(true, null, 'item' + i)
        }
        api.tasks.add_new_task(D.newTask, 11)

        ui.taskView.open_newly_created_task_via_direct_link()
            .select_tab('Items')
            .set_Action___Approve_for_Disposal([1, 2])
            .set_Action___Approve_for_Release([3, 4], person1, {}, true, false, false)
            .set_Action___Delayed_Release([5, 6], person2, newAddress2, true, true, false)
            .set_Action___Delayed_Release([7,8], person3, {}, true, true, true)
            .set_Action___Hold([9],  'Case Active', false, 10)
            .set_Action___Hold([10],  'Active Warrant', true)
            .set_Action___Timed_Disposal([11], '3y' )
            .verify_values_on_the_grid()
            .click('Submit For Disposition')
            .verify_toast_message('Saved')
            .select_tab('Basic Info')
            .verify_text_is_present_on_main_container('Closed')

    });

});
