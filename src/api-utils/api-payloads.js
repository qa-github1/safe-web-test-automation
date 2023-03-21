import "cypress-localstorage-commands";

module.exports = {
    cases : require('./endpoints/cases/payload'),
    items : require('./endpoints/items/payload'),
    people : require('./endpoints/people/payload'),
    locations : require('./endpoints/locations/payload'),
    org_settings : require('./endpoints/org-settings/payload'),
    permissions : require('./endpoints/permissions/payload'),
    transactions : require('./endpoints/transactions/payload'),

}