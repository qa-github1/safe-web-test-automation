var S = require('../fixtures/settings');

function request_with_JSON_data(httpMethod, urlSuffix, requestBody, log = '', propertyToSaveInLocalStorage, specificResponseProperty = null) {

    function isObject(variable) {
        return Object.prototype.toString.call(variable) === '[object Object]'
    }

    cy.getLocalStorage("headers").then(headers => {

        cy.request({
            url: S.api_url + urlSuffix,
            method: httpMethod,
            json: true,
            body: requestBody,
            headers: JSON.parse(headers)
        })
            .then(response => {
                let propertyName;
                let propertyValue;

                propertyName = propertyToSaveInLocalStorage || '';

                // set value to be saved in settings.js file and local storage
                if (specificResponseProperty) {
                    propertyValue = JSON.stringify(response.body[specificResponseProperty]);

                    if (isObject(propertyValue)) {
                        S.selectedEnvironment[propertyName] = Object.assign(S.selectedEnvironment[propertyName], JSON.parse(propertyValue));
                    } else {
                        S.selectedEnvironment[propertyName] = JSON.parse(propertyValue);
                    }

                    cy.setLocalStorage(propertyName, propertyValue);
                } else if (response.body) {
                    propertyValue = JSON.stringify(response.body);

                    if (isObject(propertyValue)) {
                        S.selectedEnvironment[propertyName] = Object.assign(S.selectedEnvironment[propertyName], JSON.parse(propertyValue));
                    } else {
                        S.selectedEnvironment[propertyName] = JSON.parse(propertyValue);
                    }

                    cy.setLocalStorage(propertyName, propertyValue);
                }

                // log message and/or ID from the response object if available
                // if (response.body && response.body.id) {
                //    cy.log( '*********************************************    ' + log + propertyName + ' ' + JSON.parse(propertyValue).id + '     *********************************************', 'blue');
                //
                // } else {
                //    cy.log('*********************************************    ' + log + propertyName + '     *********************************************', 'blue');
                // }
            });
}

)
;
return this;
}

exports.POST = function (urlSuffix, requestBody, log, propertyToSaveInLocalStorage) {
    request_with_JSON_data('POST', urlSuffix, requestBody, log, propertyToSaveInLocalStorage);
    return this;
};

exports.PUT = function (urlSuffix, requestBody, log, propertyToSaveInLocalStorage) {
    request_with_JSON_data('PUT', urlSuffix, requestBody, log, propertyToSaveInLocalStorage);
    return this;
};

exports.DELETE = function (urlSuffix, requestBody, log) {
    request_with_JSON_data('DELETE', urlSuffix, requestBody, log);
    return this;
};

exports.GET = function (urlSuffix, log, propertyToSaveInLocalStorage, specificResponseProperty) {
    request_with_JSON_data('GET', urlSuffix, null, log, propertyToSaveInLocalStorage, specificResponseProperty);
    return this;
};
