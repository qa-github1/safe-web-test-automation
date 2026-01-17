const { defineConfig } = require('cypress');
const del = require('del')

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
    retries: {
        // Configure retry attempts for `cypress run`
        // Default is 0
        runMode: 3,
        // Configure retry attempts for `cypress open`
        // Default is 0
        openMode: 0,
    },
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
            on('after:spec', (spec, results) => {
                if (results && results.video) {
                    // Do we have failures for any retry attempts?
                    const failures = results.tests.some(test =>
                        test.attempts.some(attempt => attempt.state === 'failed')
                    )
                    if (!failures) {
                        // delete the video if the spec passed and no tests retried
                        return del(results.video)
                    }
                }
            })
            const updatedConfig = require('./src/plugins/index')(on, config);
            return updatedConfig || config;
        },
    },
});
