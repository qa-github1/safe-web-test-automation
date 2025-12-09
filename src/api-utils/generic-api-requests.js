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
                headers: JSON.parse(headers),
                timeout: S.api_timeout
            })
                .then(response => {
                    let propertyName;
                    let propertyValue;

                    if (log === 'response') {
                        cy.log('RESPONSE IS ' + JSON.stringify(response.body))
                        cy.setLocalStorage('apiResponse', JSON.stringify(response.body));
                    }

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


                    // cy.log( '*********************************************    ' + log + propertyName + ' ' + response + '     *********************************************', 'blue');
                    // console.log( '*********************************************    ' + log + propertyName + ' ' + JSON.stringify(response)+ '     *********************************************');
                    //

                    // // log message and/or ID from the response object if available
                    // if (response.body) {
                    //    cy.log( '*********************************************    ' + log + propertyName + ' ' + propertyValue + '     *********************************************', 'blue');
                    //    console.log( '*********************************************    ' + log + propertyName + ' ' + propertyValue+ '     *********************************************');
                    //
                    // } else{
                    //    cy.log('*********************************************    ' + log + propertyName + '     *********************************************');
                    //    console.log('*********************************************    ' + log + propertyName + '     *********************************************');
                    // }
                });
        }
    )
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
