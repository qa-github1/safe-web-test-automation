import "cypress-localstorage-commands";

module.exports = {
    auth : require('./endpoints/auth'),
    cases : require('./endpoints/cases/collection'),
    items : require('./endpoints/items/collection'),
    people : require('./endpoints/people/collection'),
    tasks : require('./endpoints/tasks/collection'),
    users : require('./endpoints/users/collection'),
    locations : require('./endpoints/locations/collection'),
    org_settings : require('./endpoints/org-settings/collection'),
    permissions : require('./endpoints/permissions/collection'),
    transactions : require('./endpoints/transactions/collection'),
    workflows : require('./endpoints/workflows/collection'),
    auto_disposition : require('./endpoints/auto-disposition/collection'),
    tags : require('./endpoints/tags/collection'),

}