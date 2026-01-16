const { defineConfig } = require('cypress');

module.exports = defineConfig({
    projectId: 'c56sx9',
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
        allure: false,
        CYPRESS_VERIFY_TIMEOUT: 60000,
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
        specPattern: 'src/specs/**/*.{js,jsx,ts,tsx}',
        supportFile: 'src/support/index.js',
        setupNodeEvents(on, config) {
            const updatedConfig = require('./src/plugins/index')(on, config);
            return updatedConfig || config;
        },
    },
});
