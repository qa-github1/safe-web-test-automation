import BasePage from "./base-pages/base-page";
import LoginPage from "./login_page";
import D from "../fixtures/data";
import userAdmin from "./ui-spec";
import api from "../api-utils/api-spec";
import ui from "./ui-spec";

const S = require('../fixtures/settings');
const C = require('../fixtures/constants');
const userApi = require('../api-utils/endpoints/users/collection');
const permissionsApi = require('../api-utils/endpoints/permissions/collection');
const authApi = require('../api-utils/endpoints/auth');
const login = new LoginPage();

//************************************ ELEMENTS ***************************************//

let
    searchInput = e => cy.get('[name="userSearchField"]'),
    allUsersRadioButton = e => cy.get('[translate="GENERAL.ALL_TITLE"]'),
    activeUsersRadioButton = e => cy.get('[translate="GENERAL.ACTIVE"]'),
    inactiveUsersRadioButton = e => cy.get('[translate="GENERAL.INACTIVE"]'),
    firstNameInput = e => cy.get('[ng-model="user.firstName"]'),
    personnelNumberInput = e => cy.get('[ng-model="user.personnelNumber"]'),
    titleRankDropdown = e => cy.get('[ng-model="user.titleId"]'),
    divisionDropdown = e => cy.get('[ng-model="user.divisionId"]'),
    unitDropdown = e => cy.get('[ng-model="user.unitId"]'),
    lastNameInput = e => cy.get('[ng-model="user.lastName"]'),
    emailInput = e => cy.get('[ng-model="user.email"]'),
    middleNameInput = e => cy.get('[ng-model="user.middleName"]'),
    mobilePhoneInput = e => cy.get('[ng-model="user.mobilePhone"]'),
    otherPhoneInput = e => cy.get('[ng-model="user.otherPhone"]'),
    noteInput = e => cy.get('[ng-model="user.note"]'),
    supervisorInput = e => cy.get('[label="\'GENERAL.USER_GROUP_SUPERVISOR\'"]').find('input'),
    officeDropdown = e => cy.get('[ng-model="user.officeId"]'),
    activeCheckbox = e => cy.get('[ng-model="user.active"]'),
    passwordInput = e => cy.get('[model="newPassword"]'),
    passwordSetModal = e => cy.get('[ng-if="passwordSet"]'),
    confirmPasswordInput = e => cy.get('[ng-model="newPasswordVerify"]'),
    externlUsersEmailTextarea = e => cy.get('[placeholder="Please enter up to 100 emails at a time."]'),
    deactivateUserButton = e => cy.get('[ng-click="deactivateUsers()"]'),
    addToGroupButton = e => cy.get('[ng-click="addToGroup()"]'),
    groupInput = e => cy.get('[name="usergroups"] [type="search"]'),
    groupInTypeaheadList = e => cy.get('[ng-repeat="userGroup in $select.items"]'),
    userGroups = e => cy.get('[ng-model="selectedUserGroups.userGroups"]').last(),
    userGroupsOnReassignModal = e => cy.get('[ng-model="updateModel.newUserGroups""]').find('input'),
    reassign_active_tasks_and_cases_toggle_ON = e => cy.get('[ng-model="updateModel.reassign"]'),
    reassign_active_tasks_and_cases_toggle_OFF = e => cy.get('[class="btn active btn-default btn-sm toggle-off"]')
export default class UserAdminPage extends BasePage {

    constructor() {
        super()
    }

    //************************************ ACTIONS ***************************************//

    enter_values_on_reassign_modal(usersOrGroups, keepDeactivated = true) {
        this.pause(0.5)
        this.enter_values_on_single_multi_select_typeahead_field(['New Users/Groups to be added', usersOrGroups, "users/groups" ])
        return this;
    };

    search_for_user(email) {
        this.define_API_request_to_be_awaited('POST', '/api/users/search', 'searchUsers')
        this.enterValue(searchInput, email)
        this.wait_response_from_API_call('searchUsers')
        this.pause(0.7)
        this.wait_until_spinner_disappears();
        return this;
    };

    select_All_Users() {
        allUsersRadioButton().click();
        return this;
    };

    select_Active_Users() {
        activeUsersRadioButton().click();
        return this;
    };

    select_Inactive_Users() {
        inactiveUsersRadioButton().click();
        return this;
    };

    enter_all_values(userObject) {
        this.modal__().within(($list) => {

            if (userObject.titleRank) titleRankDropdown().select(userObject.titleRank);

            this.type_if_values_provided([
                    [firstNameInput, userObject.firstName],
                    [lastNameInput, userObject.lastName],
                    [emailInput, userObject.email],
                    [personnelNumberInput, userObject.personnelNumber],
                ]
            )

            this.type_if_values_provided(
                [
                    [middleNameInput, userObject.middleName],
                    // [mobilePhoneInput, userObject.mobilePhone],
                    //  [otherPhoneInput, userObject.otherPhone],
                    [noteInput, userObject.note],
                ]);

            //setting those separately as there is some weird issue with the flag when using the above method
            if (userObject.mobilePhone) {
                mobilePhoneInput().clear().type(userObject.mobilePhone)
            }
            if (userObject.otherPhone) {
                otherPhoneInput().clear().type(userObject.otherPhone)
            }

            if (userObject.supervisors) {
                for (let i = 0; i < userObject.supervisors.length; i++) {
                    // this.type_if_values_provided([
                    //     [supervisorInput, userObject.supervisors[i], this.userAndUserGroupTypeaheadOption]])

                    this.select_typeahead_option(supervisorInput, userObject.supervisors[i], this.typeaheadSelectorItemInGroupItems)
                }
            }

            officeDropdown().select(userObject.office);
            if (userObject.division) divisionDropdown().select(userObject.division);
            if (userObject.unit) unitDropdown().select(userObject.unit);

            if (!userObject.active) {
                activeCheckbox().click()
            }

            if (userObject.emailDisable) {
                cy.contains('Send Email Notifications').parents('div').find('toggle').find('.active')
                    .invoke('text').then(function (text) {
                    if ((text === 'Off' && userObject.emailDisable) || (text === 'On' && !userObject.emailDisable)) {
                        cy.contains('Send Email Notifications').parents('div').find('.toggle').not('.active').click()
                    }
                })
            }
            this.define_API_request_to_be_awaited('POST', 'api/users', 'addUser')

        })
        return this;
    };

    edit_values(userObject) {
        this.enter_all_values(userObject)
        return this;
    }

    verify_toast_message_(text) {
        this.verify_toast_message(text)
        this.wait_response_from_API_call('addUser', 200, 'newUser')
        return this;
    };

    select_permission_group_per_office(permissionGroup, officeName) {
        this.wait_until_label_appears('Permissions Matrix')
        this.click_table_matrix_cell_based_on_column_name_and_unique_value_in_the_row(permissionGroup, officeName, 1)
        return this;
    };

    verify_email_content_(emailAccount, emailTemplate, userObject, spaceBeforeMiddleName = '') {
        this.verify_email_content
        (emailAccount, emailTemplate.subject, emailTemplate.content(userObject, spaceBeforeMiddleName), 1, true, true)
        return this;
    };

    open_verification_link_from_email() {
        cy.getLocalStorage("linkFromEmail").then(link => {
            cy.visit(link);
        })
        return this;
    };

    set_password(password, confirmPassword = password) {
        passwordInput().type(password);
        confirmPasswordInput().type(confirmPassword);
        return this;
    };

    verify_confirmation_message_for_setting_Password(msg) {
        passwordSetModal().should('contain', msg)
        return this;
    };

    save_current_user_profile_to_local_storage() {
        cy.getLocalStorage("profile").then(newUser => {
            S.selectedEnvironment.newUser = JSON.parse(newUser)
        });
        return this;
    };

    enter_emails_for_external_user(arrayOfUserEmails) {
        arrayOfUserEmails.forEach(email => {
                externlUsersEmailTextarea().type(email)
                this.press_ENTER(externlUsersEmailTextarea);
            }
        )
        return this;
    };

    complete_verification_and_set_password_for_new_user_account(userObject) {
        this
            .verify_email_content_(userObject.email, C.users.emailTemplates.welcomeToSafe, userObject, ' ')
            .open_verification_link_from_email()
            .set_password(D.newUser.password)
            .scroll_and_click(C.buttons.setPassword)
            .verify_confirmation_message_for_setting_Password(C.users.setPassword.confirmationMsg)
            .click_button(C.buttons.login);
        login.enter_credentials(D.newUser.email, D.newUser.password)
            .click_Login_button()

        if (S.isOrg2() || S.isOrg3() || S.isOrg4() ) {
            cy.contains('END OF TERMS AND CONDITIONS').scrollIntoView()
            cy.get('[title="Accept"]').click()
        }
        // login.reload_page()
        login.verify_text_is_present_on_main_container(C.labels.dashboard.title)
        this.save_current_user_profile_to_local_storage()
    }

    add_and_verify_new_user_and_get_tokens() {
        userApi.add_new_user()
            .send_verification_email('newUser')
        permissionsApi.assign_office_based_permissions_to_user('newUser', S.selectedEnvironment.office_1.id, S.selectedEnvironment.regularUser_permissionGroup.id)
        this.complete_verification_and_set_password_for_new_user_account(D.newUser)
        authApi.get_tokens(D.newUser)
    }

    verify_user_data_on_grid(userObject, customFormName, enableFields = true, count) {
        if (customFormName) this.enable_columns_for_specific__Custom_Form_on_the_grid(customFormName, count);

        if (enableFields) {
            this.enable_all_standard_columns_on_the_grid(C.pages.userAdmin)
        }

        this.verify_values_on_the_grid([
            ['First Name', userObject.firstName],
            ['Middle Name', userObject.middleName],
            ['Last Name', userObject.lastName],
            ['Email', userObject.email],
            ['Mobile Phone', userObject.mobilePhone],
            ['Other Phone', userObject.otherPhone],
            ['Guid', userObject.guid],
            ['Permission Groups', userObject.permissionGroups],
            ['User Groups', userObject.userGroups],
            ['Note', userObject.note],
            ['External', userObject.external],
            ['MFA Enabled', userObject.mfaEnabled],
            ['Email Disable', userObject.emailDisableGridValue],
            ['Division', userObject.division],
            ['Unit', userObject.unit],
            ['Title/Rank', userObject.titleRank],
            ['Supervisor', userObject.supervisors],

        ])

        // this approach is more precise (checking value in specific cell based on its title)
        // and it would be better than the one below (checking values are present "anywhere" in the first row)
        // BUT it's hard to traverse through the table with many possible custom fields since it takes even the index of the cells that are hidden as we have them in DOM
        // regardless of setting the selector '.not('ng-hide'), so we don't get the precise index of the visible column

        if (customFormName) {
            //     this.verify_values_on_the_grid([
            //         [customFormName + '-Textarea', userObject.custom_textarea],
            //         [customFormName + '-Textbox', userObject.custom_textbox],
            //         [customFormName + '-Person', userObject.custom_person],
            //         [customFormName + '-User', userObject.custom_user_name],
            //         [customFormName + '-Date', userObject.custom_date],
            //         [customFormName + '-Email', userObject.custom_email],
            //         [customFormName + '-Password', userObject.custom_password],
            //         [customFormName + '-Number', userObject.custom_number],
            //         [customFormName + '-Checkbox List', userObject.custom_checkboxListOption],
            //         [customFormName + '-Radiobutton List', userObject.custom_radiobuttonListOption],
            //         [customFormName + '-Dropdown Typeahead', userObject.custom_dropdownTypeaheadOption],
            //     ])

            this.verify_content_of_first_row_in_results_table([
                userObject.custom_textarea,
                userObject.custom_textbox,
                userObject.custom_person,
                userObject.custom_user_or_group_names,
                userObject.custom_date,
                userObject.custom_email,
                userObject.custom_password,
                userObject.custom_number,
                userObject.custom_checkboxListOption,
                userObject.custom_radiobuttonListOption,
                userObject.custom_dropdownTypeaheadOption,
            ])
            if (userObject.custom_checkbox) {
                this.verify_content_of_first_row_in_results_table(
                    userObject.custom_checkbox.toString().charAt(0).toUpperCase() + userObject.custom_checkbox.toString().slice(1),
                )
            }
        }
        return this;
    }


    open_direct_url_for_page() {
        this.open_url_and_wait_all_GET_requests_to_finish(S.base_url + '/#/' + C.pages.userAdmin.url)
        return this
    }

    deactivateUser(userObject, searchForUser = true) {
        if (searchForUser) {
            this.search_for_user(userObject.email);
            this.select_checkbox_on_first_table_row();
        }

        this.click_Actions();
        deactivateUserButton().should('be.visible');
        deactivateUserButton().click();
        this.verify_toast_message(C.toastMsgs.saved);
        this.wait_until_spinner_disappears();
        this.pause(1)

        return this;
    }

    remove_external_user() {
            this.select_checkbox_on_first_table_row()
                .click_button(C.buttons.actions)
                .click_option_on_expanded_menu(C.dropdowns.userActions.removeExternalUsers)
                .click_button_on_sweet_alert('OK')
        return this;
    }

    add_user_to_group(userGroup, selectUser = true) {
        if (selectUser) {
            this.select_checkbox_on_first_table_row();
        }

        this.click_Actions();
        addToGroupButton().should('be.visible');
        addToGroupButton().click();
        this.enterValue(groupInput, userGroup)
        groupInTypeaheadList().should('be.visible').click();

        this.click_button(C.buttons.ok);
        this.wait_until_spinner_disappears();
        userGroups().scrollIntoView().should('be.visible');
        userGroups().contains(userGroup).should('be.visible');
        return this;
    }

    turn_off_reassign_tasks_and_cases_modal(){
reassign_active_tasks_and_cases_toggle_ON().click()
        this.click_Ok()
        return this;
    }



}
