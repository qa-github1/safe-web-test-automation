const S = require('../fixtures/settings');
const api = require('../api-utils/api-spec');
const accounts = require('../fixtures/user-accounts');

for (var i = Cypress.env('runPreconditionForSpecificEnv') ? 2 : 0; i < 3; i++) {

   // let envs = [
    const envMap = {
      qa:  {
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

       pentest: {
            "baseUrl_": "https://pentest.trackerproducts.com",
            "apiUrl_": "https://pentestapi.trackerproducts.com",
            "domain_": "PENTEST",
            orgNum_: 1,
        },
        dev: {
            "baseUrl_": "https://dev.trackerproducts.com",
            "apiUrl_": "https://devapi.trackerproducts.com",
            "domain_": "DEV",
            orgNum_: 2,
        },
    };
    let envs = [
        envMap.qa,
        envMap.pentest,
        envMap.dev
    ];
  //  ]

    if (Cypress.env('runPreconditionForSpecificEnv')) {
       // envs[i] = Cypress.env('environment')
        const envKey = Cypress.env('environment');
        envs = [envMap[envKey]];
    }
    envs.forEach((envConfig) => {
    describe(
        'Precondition for all tests',
        {
            env: envConfig,
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
                    'Changing password for all accounts on ' + S.domain + ', Org Num: ' +
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
                //
                //
                 if (S.domain === 'DEV' && S.orgNum === 2) {
                  //  api.auth.set_password(S.userAccounts.systemAdmin)
                 //   api.auth.set_password(S.userAccounts.org2Admin)
                }
                api.auth.set_password(S.userAccounts.orgAdmin)
               // api.auth.set_password(S.userAccounts.powerUser)
               // api.auth.set_password(S.userAccounts.clpUser)
            });
        }
    );
});
}