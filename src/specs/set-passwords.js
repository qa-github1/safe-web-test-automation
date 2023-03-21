const S = require('../fixtures/settings');
const api = require('../api-utils/api-spec');
const accounts = require('../fixtures/user-accounts');

for (var i = Cypress.env('runPreconditionForSpecificEnv') ? 2 : 0; i < 3; i++) {

    let envs = [
        {
            "baseUrl_": "https://qa.trackerproducts.com",
            "apiUrl_": "https://qaapi.trackerproducts.com",
            "domain_": "QA",
            orgNum_: 1,
        },
        // {
        //     "baseUrl_": "https://qa.trackerproducts.com",
        //     "apiUrl_": "https://qaapi.trackerproducts.com",
        //     "domain_": "QA",
        //     orgNum_: 2,
        // },
        // {
        //     "baseUrl_": "https://apac.trackerproducts.com",
        //     "apiUrl_": "https://apaclb.trackerproducts.com",
        //     "domain_": "APAC",
        //     orgNum_: 1,
        // },
        {
            "baseUrl_": "https://pentest.trackerproducts.com",
            "apiUrl_": "https://pentestapi.trackerproducts.com",
            "domain_": "PENTEST",
            orgNum_: 1,
        },
        // {
        //     "baseUrl_": "https://apac.trackerproducts.com",
        //     "apiUrl_": "https://apaclb.trackerproducts.com",
        //     "domain_": "APAC",
        //     orgNum_: 2,
        // },
    ]

    if (Cypress.env('runPreconditionForSpecificEnv')) {
        envs[i] = Cypress.env('environment')
    }

    describe(
        'Precondition for all tests',
        {
            env: envs[i],
        },
        () => {

            it('Setting passwords for all accounts - Org Num ', function () {

                if (!Cypress.env('runPreconditionForSpecificEnv')) {
                    S.domain = Cypress.env('domain_')
                    S.base_url = Cypress.env('baseUrl_')
                    S.api_url = Cypress.env('apiUrl_')
                    S.orgNum = Cypress.env('orgNum_')
                }

                cy.log('*********************************************    ' +
                    'Changing paswsword for all accounts on ' + S.domain + ', Org Num: ' +
                    S.orgNum + '     *********************************************', 'cyan', 'green');

                S.selectedEnvironment = S.setEnvironmentProperties(S.orgNum)
                S.userAccounts = accounts.getTestAccounts(S.selectedEnvironment, S.orgNum);

                //  if (S.domain === 'QA' && S.orgNum === 1) {
                //     api.auth.set_password(S.userAccounts.systemAdmin)
                //    // api.auth.set_password(S.userAccounts.org2Admin)
                // }
                // api.auth.set_password(S.userAccounts.orgAdmin)
                // api.auth.set_password(S.userAccounts.powerUser)
                // api.auth.set_password(S.userAccounts.clpUser)
            });
        });
}
