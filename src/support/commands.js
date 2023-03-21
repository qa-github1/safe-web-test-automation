import '@testing-library/cypress/add-commands'
//
// Cypress.Commands.overwrite('log', (subject, message, color, bgColor) => cy.task('log', message, {
//     color: color,
//     bgColor: bgColor
// }));

function unquote(str) {
    return str.replace(/(^")|("$)/g, '');
}

Cypress.Commands.add(
    'before',
    {
        prevSubject: 'element',
    },
    (el, property) => {
        const win = el[0].ownerDocument.defaultView;
        const before = win.getComputedStyle(el[0], 'before');
        return unquote(before.getPropertyValue(property));
    },
);

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
Cypress.Commands.add('generate_excel_file', (filename, dataObject) => {
    return cy.task('generate_excel_file', {
        filename: filename,
        dataObject: dataObject
    });
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
