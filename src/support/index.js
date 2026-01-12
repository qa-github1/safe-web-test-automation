// -------------------------------------------------------------------
// Allure (must be first)
// -------------------------------------------------------------------
import '@shelex/cypress-allure-plugin'
import '@testing-library/cypress/add-commands';

// -------------------------------------------------------------------
// Custom commands
// -------------------------------------------------------------------
import './commands'

// -------------------------------------------------------------------
// Shared fixtures / helpers (kept as-is)
// -------------------------------------------------------------------
const C = require('../fixtures/constants')
const S = require('../fixtures/settings')
const api = require('../api-utils/api-spec')
const ui = require('../pages/ui-spec')

// -------------------------------------------------------------------
// Global configuration (SAFE way in Cypress 15)
// -------------------------------------------------------------------

// ❌ Cypress.config() is READ-ONLY at runtime in Cypress 12+
// ✅ Use env → config at startup instead
const timeout = Number(Cypress.env('defaultCommandTimeout') || 60000)

Cypress.on('test:before:run', () => {
    Cypress.config('defaultCommandTimeout', timeout)
})

// -------------------------------------------------------------------
// Cleanup before unload (SAFE)
// -------------------------------------------------------------------

after(() => {
    cy.window({ log: false }).then((win) => {
        win.onbeforeunload = null
    })
})

// -------------------------------------------------------------------
// Browser console error forwarding (Cypress 15-safe)
// -------------------------------------------------------------------

Cypress.on('window:before:load', (win) => {
    const originalConsoleError = win.console.error

    win.console.error = (...args) => {
        // Send to terminal via task (preferred over Cypress.log)
        Cypress.log({
            name: 'console.error',
            message: args.map(String),
        })

        originalConsoleError.apply(win.console, args)
    }
})

Cypress.Commands.add('generate_excel_file', (fileName, dataObject) => {
    return cy.task('generate_excel_file', {
        filename: fileName,
        arrayOfArraysWithExcelHeadersAndData: dataObject,
    });
});
