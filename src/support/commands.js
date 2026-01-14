// Custom Cypress commands for your project
// Cypress 15+ optimized

import 'cypress-wait-until';

// Utility to remove quotes
function unquote(str) {
    return str.replace(/(^")|("$)/g, '');
}

/**
 * Retry text verification until success or timeout
 */
Cypress.Commands.add('verifyTextAndRetry', (
    getActualTextFn,
    expectedValues,
    {
        maxAttempts = 60,
        retryInterval = 1000,
        clickReloadIconBetweenAttempts = false,
        reloadSelector = '.fa-refresh',
        ...options
    } = {}
) => {
    if (!expectedValues || (typeof expectedValues === 'string' && !expectedValues.trim())) {
        Cypress.log({
            name: 'verifyTextAndRetry',
            message: `[⚠️ Skipped] No expected text provided.`,
        });
        return;
    }

    let attempt = 0;

    const normalizeText = text => (text ? String(text).replace(/\s+/g, ' ').trim() : '');
    const normalizeExpected = expected => {
        if (Array.isArray(expected)) return expected.map(normalizeText);
        if (typeof expected === 'object') return Object.values(expected).map(normalizeText);
        return [normalizeText(expected)];
    };

    const wrappedCondition = () => {
        attempt++;
        return getActualTextFn().then(actualText => {
            const normalizedActual = normalizeText(actualText);
            const expectedArray = normalizeExpected(expectedValues);
            const missing = expectedArray.filter(v => !normalizedActual.includes(v));
            const passed = missing.length === 0;

            Cypress.log({
                name: 'verifyTextAndRetry',
                message: passed
                    ? `[✅ Attempt ${attempt}] Found all expected values: [${expectedArray.join(', ')}]`
                    : `[❌ Attempt ${attempt}] Missing: [${missing.join(', ')}], TEXT FOUND: ${normalizedActual}`,
                consoleProps: () => ({ attempt, expected: expectedArray, missing, actual: normalizedActual }),
            });

            if (!passed && clickReloadIconBetweenAttempts) {
                cy.get(reloadSelector, { timeout: 1000 }).click({ force: true });
            }

            return passed;
        });
    };

    return cy.waitUntil(wrappedCondition, {
        timeout: maxAttempts * retryInterval,
        interval: retryInterval,
        ...options,
    });
});

/**
 * Retry typeahead selection
 */
Cypress.Commands.add('retryTypeaheadSelect', (
    inputFn,
    inputValue,
    dropdownSelector,
    { matchText = '', maxAttempts = 5, retryInterval = 1000 } = {}
) => {
    let attempt = 0;

    const attemptInteraction = () => {
        attempt++;
        cy.log(`🔁 [Attempt ${attempt}] Typing: "${inputValue}"`);

        return cy.wrap(null).then(() => {
            inputFn().clear().type(inputValue, { delay: 100 });
            return cy.wait(300).then(() => {
                return cy.document().then(doc => {
                    const items = [...doc.querySelectorAll(dropdownSelector)];
                    if (items.length > 0) {
                        const matchingItem = matchText
                            ? items.find(el => el.textContent.includes(matchText))
                            : items[0];

                        if (matchingItem) {
                            cy.wrap(matchingItem).click({ force: true });
                            cy.log(`✅ Clicked on: "${matchingItem.textContent.trim()}"`);
                            return true;
                        }
                    }
                    cy.log('❌ No matching dropdown item found');
                    return false;
                });
            });
        });
    };

    return cy.waitUntil(attemptInteraction, {
        timeout: maxAttempts * retryInterval,
        interval: retryInterval,
        errorMsg: `❌ Failed to select typeahead value '${inputValue}' after ${maxAttempts} attempts`,
    });
});

/**
 * Click element and retry until expected text appears
 */
Cypress.Commands.add('clickAndRetryUntilText', (
    clickSelector,
    expectedText,
    { maxAttempts = 10, retryInterval = 1000, clickOptions = {} } = {}
) => {
    let attempt = 0;

    const wrappedAction = () => {
        attempt++;
        Cypress.log({ name: 'clickAndRetryUntilText', message: `Attempt ${attempt}` });

        return cy.get(clickSelector).click(clickOptions).then(() => {
            return cy.document().then(doc => {
                const found = Array.from(doc.querySelectorAll('body *'))
                    .some(el => el.textContent?.includes(expectedText));

                Cypress.log({
                    name: 'Text Check',
                    message: found
                        ? `[✅] Text "${expectedText}" found`
                        : `[❌] Text "${expectedText}" not found`,
                    consoleProps: () => ({ found, expectedText }),
                });

                return found;
            });
        });
    };

    return cy.waitUntil(wrappedAction, {
        timeout: maxAttempts * retryInterval,
        interval: retryInterval,
        errorMsg: `Text "${expectedText}" was not found after ${maxAttempts} retries.`,
    });
});

// Other helpers: Excel, PDF, canvas signing, color checks, etc. can remain here
// Make sure Cypress.Commands.add is used, and no duplicate addQuery commands

// Prevent Cypress from failing on uncaught exceptions (optional)
Cypress.on('uncaught:exception', (err, runnable) => false);

Cypress.Commands.add('signOnCanvas', () => {
    cy.get('canvas')
        .should('have.length.at.least', 1)
        .first()
        .trigger('mousedown', { which: 1, clientX: 100, clientY: 100 })
        .trigger('mousemove', { clientX: 120, clientY: 120 })
        .trigger('mousemove', { clientX: 140, clientY: 140 })
        .trigger('mouseup');
});

