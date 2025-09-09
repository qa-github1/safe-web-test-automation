const S = require('./settings');

exports.userRoles = {
    systemAdmin: 'System Admin',
    orgAdmin: 'Org Admin',
    adminUser: 'Admin User',
    powerUser: 'Power User',
    basicUser: 'Basic User',
    blockedUser: 'Blocked User',
    readOnlyUser: 'Read-Only User',
    clpUser: 'Clp User'
};

exports.getTestAccounts = function (environment, orgNum = 1) {

    exports.userAccounts = {};

    exports.userAccounts[`orgNum${orgNum}`] = {
        orgAdmin: {
            title: exports.userRoles.orgAdmin,
            email: `qa+org${orgNum}admin@trackerproducts.com`,
            password: 'Qwerty123!',
            name: `Cypress Org${orgNum}Admin`,
            firstName: 'Cypress',
            lastName: `Org${orgNum}Admin`,
            fullName: `Cypress Org${orgNum}Admin`,
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.orgAdmin.id,
            guid: environment.users.orgAdmin.guid
        },
         // org2Admin: {
         //     title: exports.userRoles.orgAdmin,
         //     email: `qa+org3admin@trackerproducts.com`,
         //     password: 'Qwerty123!',
         //     officeId: environment.users.org2Admin.officeId,
         //     organizationId: environment.users.org2Admin.organizationId,
         //     id: environment.users.org2Admin.id,
         //    guid: environment.users.org2Admin.guid
         // },
        powerUser: {
            title: exports.userRoles.powerUser,
            email: `qa+org${orgNum}_poweruser@trackerproducts.com`,
            name: 'Power User',
            firstName: 'Power',
            lastName: 'User',
            fullName: `Power User`,
            password: 'Qwerty123!',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.powerUser.id,
            guid: environment.users.powerUser.guid
        },
        basicUser: {
            title: exports.userRoles.basicUser,
            email: `qa+org${orgNum}_basicUser@trackerproducts.com`,
            name: 'Basic CypressUser',
            firstName: 'Basic',
            lastName: 'CypressUser',
            password: 'Qwerty123!',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.basicUser.id,
            guid: environment.users.basicUser.guid
        },
        blockedUser: {
            title: exports.userRoles.blockedUser,
            email: `qa+org${orgNum}_blockedUser@trackerproducts.com`,
            name: 'Blocked CypressUser',
            firstName: 'Blocked',
            lastName: 'CypressUser',
            password: 'Qwerty123!',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.blockedUser.id,
            guid: environment.users.blockedUser.guid
        },
        systemAdmin: {
            title: exports.userRoles.systemAdmin,
            email: 'qa+systemadmin@trackerproducts.com',
            password: 'Qwerty123!',
            name: 'QA',
            firstName: 'SystemAdmin',
            lastName: 'SystemAdmin',
           officeId: environment.users.systemAdmin.officeId,
           organizationId: environment.users.systemAdmin.organizationId,
           id: environment.users.systemAdmin.id,
           guid: environment.users.systemAdmin.guid
        },
        clpUser: {
            title: exports.userRoles.clpUser,
            email: `qa+org${orgNum}_clpUser@trackerproducts.com`,
            password: 'Qwerty123!',
            name: 'Clp User',
            firstName: 'Clp',
            lastName: 'User',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.clpUser.id,
            guid: environment.users.clpUser.guid
        }

    }
    return exports.userAccounts['orgNum' + orgNum];
};

module.exports = exports;
