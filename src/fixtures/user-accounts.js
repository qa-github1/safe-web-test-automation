const S = require('./settings');

exports.userRoles = {
    systemAdmin: 'System Admin',
    orgAdmin: 'Org Admin',
    adminUser: 'Admin User',
    powerUser: 'Power User',
    basicUser: 'Basic User',
    blockedUser: 'Blocked User',
    readOnlyUser: 'Read-Only User',
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
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: environment.users.orgAdmin.id,
            guid: environment.users.orgAdmin.guid
        },
        orgAdmin2: {
            title: exports.userRoles.orgAdmin,
            email: `qa+orgadmin1_2@trackerproducts.com`,
            password: 'Qwerty123!',
            name: 'Cypress OrgAdmin2',
            firstName: 'Cypress',
            lastName: 'OrgAdmin',
            officeId: environment.office_1.id,
            organizationId: environment.orgSettings.id,
            id: 40934,
            guid: environment.users.orgAdmin.guid
        },
        org2Admin: {
            title: exports.userRoles.orgAdmin,
            email: `qa+orgadmin${orgNum}@trackerproducts.com`,
            password: 'Qwerty123!',
            officeId: environment.org2Admin.officeId,
            organizationId: environment.org2Admin.organizationId,
            id: environment.org2Admin.id,
            guid: environment.org2Admin.guid
        },
        powerUser: {
            title: exports.userRoles.powerUser,
            email: `qa+org${orgNum}_poweruser@trackerproducts.com`,
            name: 'Power User',
            firstName: 'Power',
            lastName: 'User',
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
        }
    }

    if (S.domain !== 'APAC'){
        exports.userAccounts[`orgNum${orgNum}`]['systemAdmin'] = {
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
        }
    }
    return exports.userAccounts['orgNum' + orgNum];
};

module.exports = exports;
