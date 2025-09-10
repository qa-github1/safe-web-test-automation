import '@testing-library/cypress/add-commands'
import 'cypress-wait-until';
//
// Cypress.Commands.overwrite('log', (subject, message, color, bgColor) => cy.task('log', message, {
//     color: color,
//     bgColor: bgColor
// }));

function unquote(str) {
    return str.replace(/(^")|("$)/g, '');
}
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
    if (
        expectedValues === undefined ||
        expectedValues === null ||
        (typeof expectedValues === 'string' && expectedValues.trim() === '')
    ) {
        Cypress.log({
            name: 'verifyTextAndRetry',
            message: `[⚠️ Skipped] No expected text provided, skipping verification.`,
        });
        return;
    }

    let attempt = 0;

    const normalizeText = (text) => {
        if (text == null) return '';
        return String(text).replace(/\s+/g, ' ').trim();
    };

    const normalizeExpected = (expected) => {
        if (Array.isArray(expected)) return expected.map(normalizeText);
        if (typeof expected === 'object') return Object.values(expected).map(normalizeText);
        return [normalizeText(expected)];
    };

    const wrappedCondition = () => {
        attempt++;

        return getActualTextFn().then(actualText => {
            const normalizedActual = normalizeText(actualText);
            const expectedArray = normalizeExpected(expectedValues);
            const failedMatches = expectedArray.filter(val => !normalizedActual.includes(val));
            const passed = failedMatches.length === 0;

            Cypress.log({
                name: 'verifyTextAndRetry',
                message: passed
                    ? `[✅ Attempt ${attempt}] Found all expected values: [${expectedArray.join(', ')}]`
                    : `[❌ Attempt ${attempt}] Missing: [${failedMatches.join(', ')}], TEXT FOUND: ${normalizedActual} `,
                consoleProps: () => ({
                    attempt,
                    expected: expectedArray,
                    missing: failedMatches,
                    actual: normalizedActual,
                })
            });

            // 🔁 If not passed and reload icon should be clicked
            if (!passed && clickReloadIconBetweenAttempts) {
                cy.get(reloadSelector, { timeout: 1000 }).click({ force: true });
            }

            return passed;
        });
    };

    return cy.waitUntil(wrappedCondition, {
        timeout: maxAttempts * retryInterval,
        interval: retryInterval,
        ...options
    });
});

//EXAMPLE
//cy.verifyTextAndRetry(
//     () => mainContainer().invoke('text'),
//     'Expected Text',
//     {
//         maxAttempts: 30,
//         retryInterval: 500,
//         clickReloadIconBetweenAttempts: true,
//         reloadSelector: '[data-testid="reload-icon"]'
//     }
// );

Cypress.Commands.add('retryTypeaheadSelect', (
    inputFn,
    inputValue,
    dropdownSelector,
    {
        matchText = '',               // optional: match dropdown content
        maxAttempts = 5,
        retryInterval = 1000,
    } = {}
) => {
    let attempt = 0;

    const attemptInteraction = () => {
        attempt++;
        cy.log(`🔁 [Attempt ${attempt}] Typing: "${inputValue}" and checking for dropdown items...`);

        return cy.wrap(null).then(() => {
            inputFn().clear().type(inputValue, { delay: 100 });

            return cy.wait(300).then(() => {
                return cy.document().then((doc) => {
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

Cypress.Commands.add('clickAndRetryUntilText', (
    clickSelector,
    expectedText,
    {
        maxAttempts = 10,
        retryInterval = 1000,
        clickOptions = {},
        matchOptions = {}, // Options for `cy.contains`, if needed
    } = {}
) => {
    let attempt = 0;

    const wrappedAction = () => {
        attempt++;
        Cypress.log({ name: 'clickAndRetryUntilText', message: `Attempt ${attempt}` });

        return cy.then(() => {
            return cy.get(clickSelector).click(clickOptions).then(() => {
                // Use contains with fallback to manual resolve
                return cy.document().then((doc) => {
                    const found = Array.from(doc.querySelectorAll('body *'))
                        .some(el => el.textContent?.includes(expectedText));

                    Cypress.log({
                        name: 'Text Check',
                        message: found
                            ? `[✅] Text "${expectedText}" found`
                            : `[❌] Text "${expectedText}" not found`,
                        consoleProps: () => ({ found, expectedText })
                    });

                    return found;
                });
            });
        });
    };

    // Use cy.waitUntil to repeat the wrappedAction
    return cy.waitUntil(wrappedAction, {
        timeout: maxAttempts * retryInterval,
        interval: retryInterval,
        errorMsg: `Text "${expectedText}" was not found after ${maxAttempts} retries.`,
    });
});


// EXAMPLE
//cy.clickAndRetryUntilText(
//   'button[translate="GENERAL.BUTTON_NEXT"]',
//   ['Welcome', 'Dashboard'],
//   {
//     maxAttempts: 20,
//     retryInterval: 1000
//   }
// );


const Log = {
    reset: '\x1b[0m',
    // Foreground (text) colors
    fg: {
        black: '30',
        red: '31',
        green: '32',
        yellow: '33',
        blue: '34',
        magenta: '35',
        cyan: '36',
        white: '37',
        crimson: '38',
    },
    // Background colors
    bg: {
        black: '40',
        red: '41',
        green: '42',
        yellow: '43',
        blue: '44',
        magenta: '45',
        cyan: '46',
        white: '47',
        crimson: '48',
    },
};

if (Cypress.config('isInteractive')) {
    Cypress.Commands.overwrite('log', (subject, message) => {
        cy.task('log', message);
    });
}
else{
    Cypress.Commands.overwrite('log', (subject, message, color, bgColor) => {

        let args = {
            message: message,
            color: color,
            bgColor: bgColor,
        }
        cy.task('log', args);
    });
}

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});

//cy.generate_excel_file('Case_Import')  == usage example
Cypress.Commands.add('generate_excel_file', (filename, arrayOfArraysWithExcelHeadersAndData) => {
    return cy.task('generate_excel_file', {
        filename: filename,
        arrayOfArraysWithExcelHeadersAndData: arrayOfArraysWithExcelHeadersAndData
    });
});

Cypress.Commands.add('verify_PDF_content', (filename, dataObject) => {
    return cy.task('verify_PDF_content', {});
});

Cypress.Commands.add('compare_image_with_the_baseline', (fileName) => {
    cy.wait(3000);
    return cy.task('compare_images', {
        fileName: fileName
    }).then(function (pixels) {
        cy.log("Difference in pixels: ", pixels);
        expect(pixels).equals(0);
    })
});

Cypress.Commands.add('verify_report_gets_open_in_new_tab', (reportName) => {
    return cy.task('verify_report_gets_open_in_new_tab', {
        reportName: reportName
    });
});


Cypress.Commands.add('verify_report_gets_open_in_new_tab_with_xvfb', (reportName) => {
    return cy.task('verify_report_gets_open_in_new_tab_with_xvfb', {
        reportName: reportName
    });
});


const compareColor = (color, property) => (targetElement) => {
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    tempElement.style.display = 'none'; // make sure it doesn't actually render
    document.body.appendChild(tempElement); // append so that `getComputedStyle` actually works

    const tempColor = getComputedStyle(tempElement).color;
    const targetColor = getComputedStyle(targetElement[0])[property];

    document.body.removeChild(tempElement); // remove it because we're done with it

    expect(tempColor).to.equal(targetColor);
};

Cypress.Commands.overwrite('should', (originalFn, subject, expectation, ...args) => {
    const customMatchers = {
        'have.backgroundColor': compareColor(args[0], 'backgroundColor'),
        'have.color': compareColor(args[0], 'color'),
        'have.borderColor': compareColor(args[0], 'border-color'),
    };

    // See if the expectation is a string and if it is a member of Jest's expect
    if (typeof expectation === 'string' && customMatchers[expectation]) {
        return originalFn(subject, customMatchers[expectation]);
    }
    return originalFn(subject, expectation, ...args);
});

const _ = Cypress._;
const $ = Cypress.$;
