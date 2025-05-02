import '@shelex/cypress-allure-plugin';
import './commands'

const C = require('../fixtures/constants');
const S = require('../fixtures/settings');
const api = require('../api-utils/api-spec');
const ui = require('../pages/ui-spec');

after(function() {
    cy.window().then(win => win.onbeforeunload = undefined );
});

Cypress.on('window:before:load', (win) => {
    const originalConsoleError = win.console.error;
    win.console.error = function (...args) {
        // Log it to terminal
        Cypress.log({
            name: 'console.error',
            message: args,
        });

        // Also keep default behavior
        originalConsoleError.apply(win.console, args);
    };
});