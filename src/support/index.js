import '@shelex/cypress-allure-plugin';
import './commands'
require('cypress-failed-log');

const C = require('../fixtures/constants');
const S = require('../fixtures/settings');
const api = require('../api-utils/api-spec');
const ui = require('../pages/ui-spec');

after(function() {
    cy.window().then(win => win.onbeforeunload = undefined );
});
