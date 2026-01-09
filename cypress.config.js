const { defineConfig } = require('cypress');

module.exports = defineConfig({
    projectId: 'c56sx9',

    // Global settings (replaces cypress.json)
    fixturesFolder: 'src/fixtures',
    screenshotsFolder: 'screenshots',
    videosFolder: 'report/videos',

    video: true,
    watchForFileChanges: false,

    viewportWidth: 1200,
    viewportHeight: 800,

    chromeWebSecurity: true,

    defaultCommandTimeout: 80000,
    requestTimeout: 30000,
    responseTimeout: 80000,
    taskTimeout: 50000,
    pageLoadTimeout: 90000,

    numTestsKeptInMemory: 0,
    retries: 0,

    env: {
        allure: true,
        CYPRESS_VERIFY_TIMEOUT: 60000,

        // ✅ This is the key fix: default environment name
        environment: 'pentest', // <-- default environment to use

        defaultEnvironment: {
            apiUrl: 'https://pentestapi.trackerproducts.com',
            domain: 'PENTEST',
        },

        environments: {
            qa: {
                baseUrl: 'https://qa.trackerproducts.com',
                apiUrl: 'https://qaapi.trackerproducts.com',
                domain: 'QA',
                runPreconditionForSpecificEnv: true,
            },
            pentest: {
                baseUrl: 'https://pentest.trackerproducts.com',
                apiUrl: 'https://pentestapi.trackerproducts.com',
                domain: 'PENTEST',
                runPreconditionForSpecificEnv: true,
            },
            dev: {
                baseUrl: 'https://dev.trackerproducts.com',
                apiUrl: 'https://devapi.trackerproducts.com',
                domain: 'DEV',
                runPreconditionForSpecificEnv: true,
            },
            secure: {
                baseUrl: 'https://secure.trackerproducts.com',
                apiUrl: 'https://securelb.trackerproducts.com',
                domain: 'SECURE',
                runPreconditionForSpecificEnv: true,
            },
        },
    },

    e2e: {
        // replaces integrationFolder
        specPattern: 'src/specs/**/*.{js,jsx,ts,tsx}',

        // replaces supportFile
        supportFile: 'src/support/index.js',

        setupNodeEvents(on, config) {
            // ✅ load plugins (replaces old pluginsFile)
            const updatedConfig = require('./src/plugins/index')(on, config);

            // Return updated config to Cypress
            return updatedConfig || config;
        },
    },
});
