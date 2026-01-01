const S = require('../../fixtures/settings.js');
const C = require('../../fixtures/constants.js');
const generic_requests = require('../generic-api-requests.js');
const ui = require('../../pages/ui-spec.js');
const orgSettingsApi = require('../endpoints/org-settings/collection');
const usersApi = require('../endpoints/users/collection')


function token_request(selectedUser) {

   // cy.clearLocalStorage();

   //cy.log('-------------------------------- Getting token via API - LOGIN with ' + selectedUser.title + ' --------------------------------');

    return cy.request({
        method: 'POST',
        url: S.api_url + '/token',
        form: true, //sets to application/x-www-form-urlencoded
        body: {
            grant_type: 'password',
            username: selectedUser.email,
            password: selectedUser.password,
        },
        headers: {
            'kick-out-user': true
        },
        failOnStatusCode: false
    })
}

function get_token_status(selectedUser) {

    return token_request(selectedUser).then(response => {
        return response.status;
    })
}

exports.get_tokens = function (selectedUser, arrayOfPropertiesToRetain, specificOffice) {

 //   ui.app.define_API_request_to_be_awaited('POST', '', 'all_POST_Requests')
  //  ui.app.define_API_request_to_be_awaited('GET', '', 'all_GET_Requests')
   // ui.app.define_all_dashboard_GET_requests();
    // cy.log(`Logging in with  __________________________________________________________
    //             ${selectedUser.email} /  ${selectedUser.password}
    //              _________________________________________________________________________
    //              ` );

    console.log ('TIME: ' + S.currentDateAndTime)
    cy.log ('TIME: ' + S.currentDateAndTime)

    token_request(selectedUser)
        .then(response => {

            response = response.body;

            if (response.error) {
               cy.log(`ERROR on login ___
                ${response.error}
                ${response.error_description}`)

            } else {
                exports.keep_some_values_in_local_storage(arrayOfPropertiesToRetain, selectedUser, response)
            }
        })
        .then(() => {
            cy.visit(S.base_url).then(() => {
                ui.app.wait_all_dashboard_GET_requests();
                // cy.get('.alert-dismissable').eq(0).invoke('remove');
                // cy.get('.alert-dismissable').eq(0).invoke('remove');
                cy.getLocalStorage("token").should("not.equal", null).then(() => {
                    cy.saveLocalStorage().then(() => {

                        if (selectedUser.title === S.userRoles.systemAdmin || specificOffice) {
                            let office = specificOffice || S.selectedEnvironment.office_1

                            if (selectedUser.title === S.userRoles.systemAdmin){
                                ui.menu.select_office(office.orgAndOfficeName)
                            }

                            cy.getLocalStorage("headers").then(headers => {
                                let updatedHeaders = JSON.parse(headers);
                                updatedHeaders.organizationid = S.selectedEnvironment.orgSettings.id;
                                updatedHeaders.officeid = office.id

                                cy.clearLocalStorage("headers");
                                cy.setLocalStorage("headers", JSON.stringify(updatedHeaders));
                                cy.saveLocalStorage()
                            })
                        }
                    });
                });
            });
        });
    return this;
}

exports.get_tokens_without_page_load = function (selectedUser, arrayOfPropertiesToRetain) {

    ui.app.define_API_request_to_be_awaited('GET', '', 'all_GET_Requests')
    ui.app.define_all_dashboard_GET_requests();
    // cy.log(`Logging in with  __________________________________________________________
    //             ${selectedUser.email} /  ${selectedUser.password}
    //              _________________________________________________________________________
    //              ` );

    token_request(selectedUser)
        .then(response => {

            response = response.body;

            if (response.error) {
               cy.log(`ERROR on login ___
                ${response.error}
                ${response.error_description}`)

            } else {
                exports.keep_some_values_in_local_storage(arrayOfPropertiesToRetain, selectedUser, response)
            }
        })
        .then(() => {
             //   ui.app.wait_all_dashboard_GET_requests();
                cy.getLocalStorage("token").should("not.equal", null).then(() => {
                    cy.saveLocalStorage().then(() => {

                        if (selectedUser.title === S.userRoles.systemAdmin) {
                            ui.menu.select_office(S.selectedEnvironment.office_1.name)

                            cy.getLocalStorage("headers").then(headers => {
                                let updatedHeaders = JSON.parse(headers);
                                updatedHeaders.organizationid = S.selectedEnvironment.orgSettings.id;
                                updatedHeaders.officeid = S.selectedEnvironment.office_1.id;

                                cy.clearLocalStorage("headers");
                                cy.setLocalStorage("headers", JSON.stringify(updatedHeaders));
                                cy.saveLocalStorage()
                            })
                        }
                    });
                });
        });
    return this;
}

exports.keep_some_values_in_local_storage = function (arrayOfPropertiesToRetain, selectedUser, response) {
   //cy.log('******************************** Setting local storage ********************************');
    if (selectedUser && response) {

        let tokens = JSON.stringify(response);

        let propertiesToSave = [
            'newCase',
            'newItem',
            'newPerson',
            'locations',
            'newUser',
            'orgSettings',
            'currentCase',
            'currentUserSettings',
            'profile',
        ]

        if (arrayOfPropertiesToRetain) {
            arrayOfPropertiesToRetain.forEach(property => {
                cy.setLocalStorage(property, JSON.stringify(S.selectedEnvironment[property]));
            })
        }

        propertiesToSave.forEach(property => {
            cy.setLocalStorage(property, JSON.stringify(S.selectedEnvironment[property]));
        })

        cy.getLocalStorage("user1").then(userFromLocalStorage => {

            if (userFromLocalStorage) selectedUser = JSON.parse(userFromLocalStorage);

            selectedUser.isSystemAdmin = selectedUser.title === S.userRoles.systemAdmin;
            selectedUser.isOrgAdmin = selectedUser.title === S.userRoles.orgAdmin || selectedUser.title === S.userRoles.systemAdmin

            let headers = {
                'Content-Type': 'application/json',
                officeid: selectedUser.officeId,
                organizationid: selectedUser.organizationId,
                authorization: 'Bearer ' + response.access_token,
                refreshtoken: response.refresh_token,
            };

            cy.setLocalStorage("headers", JSON.stringify(headers));
            cy.setLocalStorage("identity_data", tokens);
            cy.setLocalStorage("token", JSON.stringify(response.access_token));
            cy.setLocalStorage("refresh-token", JSON.stringify(response.refresh_token));


            if (selectedUser.title === 'Org Admin' || selectedUser.title === 'System Admin') {
                orgSettingsApi.get_current_org_settings(selectedUser.organizationId)
            }

            usersApi.get_current_user_settings(selectedUser.id)

            cy.getLocalStorage("currentUserSettings").then(userSettings => {
                cy.getLocalStorage("orgSettings").then(orgSettings => {

                    let signatureConfig = JSON.parse(orgSettings).signatureConfiguration
                    let dateTimeFormat = JSON.parse(userSettings).dateTimeFormat
                    let dateFormat = JSON.parse(userSettings).dateFormat
                    let idle = JSON.parse(orgSettings).idle || 45
                    let timeout = JSON.parse(orgSettings).timeout || 2

                    cy.setLocalStorage("profile", JSON.stringify(
                        {
                            "id": selectedUser.id,
                            "organizationId": selectedUser.organizationId,
                            "officeId": selectedUser.officeId,
                            "dateFormat": dateFormat,
                            "dateTimeFormat": dateTimeFormat,
                            "useDateFormatOnly": false,
                            "idle": idle,
                            "timeout": timeout,
                            "isAdmin": selectedUser.isSystemAdmin,
                            "showNewUserPopup": true,
                            "signatureConfig": signatureConfig,
                            "organizationType": 1
                        }))
                })
            })

            cy.setLocalStorage("BrowserId", JSON.stringify('98a5ccc2-8c6b-4352-a786-5a215de12710'));
            cy.setLocalStorage("deviceId", JSON.stringify("f482591a-0d77-4531-b28d-f08d038e6484"));
            cy.setLocalStorage("maxStringFieldLength", JSON.stringify("10000"));
            cy.setLocalStorage("selected", JSON.stringify({
                "selectedOfficeId": selectedUser.officeId,
                "selectedOrganizationId": selectedUser.organizationId,
                "selectedOrganizationProductTypeId": 1
            }));
            cy.setLocalStorage("isMostRecentCaseCurrent", JSON.stringify(true));
            cy.setLocalStorage("uac", []);
            cy.setLocalStorage("loginTimeAndVersion", JSON.stringify({
                "loginTimeAsUtcString": new Date().toUTCString(),
                "systemVersionNumberStringAtLogin": "8.73.001"
            }));
            cy.setLocalStorage("isOrgAutoIncrementCaseNumberOn", false);
            cy.setLocalStorage("undefined_isSaasAccepted", true);
            cy.setLocalStorage("uac", []);
            cy.setLocalStorage("opfs", null);
            cy.setLocalStorage("isOrgAdmin", selectedUser.isOrgAdmin);
        })
    }
};

exports.log_out = function (selectedUser) {
    cy.getLocalStorage("token").then(token => {
        cy.getLocalStorage("refresh-token").then(refresh_token => {

            let headers = {
                'Content-Type': 'application/json',
                officeid: selectedUser.officeId,
                organizationid: selectedUser.organizationId,
                authorization: 'Bearer ' + JSON.parse(token),
                refreshtoken: JSON.parse(refresh_token),
            };

            cy.setLocalStorage("headers", JSON.stringify(headers));

            generic_requests.POST('/api/users/logout');
        });
    });
};

exports.login_and_logout = function (selectedUser) {
    exports.get_tokens(selectedUser, true);
    exports.log_out(selectedUser);
};

exports.set_password = function (selectedUser) {

    token_request(selectedUser)
        .then(response => {

            if (response.status === 200) {
               cy.log('*********************************************    ' +
                    'Password is already based on the current date: ' + S.getCurrentDate(S.passwordPattern) +
                    S.orgNum + '     *********************************************');

            } else if (response.body.error && response.body.error_description.includes('You typed the password incorrectly')) {

               //cy.log('Updating the password with current date/time value')
                exports.update_password_by_trying_values_based_on_recent_dates(selectedUser, 1)
            } else {
               //cy.log(JSON.stringify(response))
            }

            let user = Object.assign({}, selectedUser);
            user.password = S.getCurrentDate(S.passwordPattern)
            get_token_status(user).should("be.equal", 200)
        })
}

//workaround for changing the password, as we have Captcha that prevents having the step to Reset Password with the link
exports.update_password_by_trying_values_based_on_recent_dates = function (selectedUser, daysBeforeTheCurrentDate) {

    if (daysBeforeTheCurrentDate < 5) {

        selectedUser.password = S.getDateBeforeXDaysInSpecificFormat(S.passwordPattern, daysBeforeTheCurrentDate)
       //cy.log('Trying with password: ' + selectedUser.password)

        token_request(selectedUser)
            .then(response => {

                response = response.body;
                if (response.error) {
                    exports.update_password_by_trying_values_based_on_recent_dates(selectedUser, daysBeforeTheCurrentDate + 1)
                } else {
                    exports.get_tokens(selectedUser)
                    usersApi.update_password(selectedUser.password, S.getCurrentDate(S.passwordPattern))
                    // ui.open_base_url()
                    // ui.menu.click_User_Settings()
                    // ui.userSettings
                    //     .click_button(C.buttons.changePassword)
                    //     .enter_current_and_new_password(selectedUser.password, S.getCurrentDate(S.passwordPattern))
                    //     .click_button(C.buttons.save)
                    //     .verify_toast_message('Saved')

                    selectedUser.password = S.getCurrentDate(S.passwordPattern)
                    cy.clearLocalStorage();
                }
            })
    }
}
