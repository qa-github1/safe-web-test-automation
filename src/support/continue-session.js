export function enableSessionContinuationWithVisitingLastUrl({sessionName = 'app-session'} = {}) {
    let hasFailed = false;
    let persisted = {};
    let lastUrl = null;

    before(() => {
        cy.session(sessionName, () => {
            api.auth.get_tokens_without_page_load(orgAdmin);
            D.generateNewDataSet();
        });
    });

    beforeEach(function () {
        // restore localStorage
        Object.keys(persisted).forEach(k => {
            localStorage.setItem(k, persisted[k]);
        });

        // restore navigation
        if (lastUrl && !lastUrl.includes('about:blank')) {
            cy.visit(lastUrl);
        }

        // fail-fast
        if (hasFailed) {
            this.skip();
        }
    });

    afterEach(function () {
        // persist localStorage
        persisted = {};
        Object.keys(localStorage).forEach(k => {
            persisted[k] = localStorage.getItem(k);
        });

        // persist URL
        if (this.currentTest?.state !== 'skipped') {
            cy.url().then(url => {
                lastUrl = url;
            });
        }

        // mark failure
        if (this.currentTest?.state === 'failed') {
            hasFailed = true;
        }
    });
}


export function enableSessionContinuation({sessionName = 'app-session'} = {}) {
    let hasFailed = false
    let persisted = {}

    beforeEach(function () {
        Object.keys(persisted).forEach(k => {
            localStorage.setItem(k, persisted[k])
        })
        if (hasFailed) {
            this.skip()
        }
    })
    afterEach(function () {
        persisted = {}
        Object.keys(localStorage).forEach(k => {
            persisted[k] = localStorage.getItem(k)
        })
        if (this.currentTest && this.currentTest.state === 'failed') {
            hasFailed = true
        }
    })
}