const S = require('../fixtures/settings');
const api = require('../api-utils/api-spec');
let orgAdmin = S.getUserData(S.userAccounts.orgAdmin);

describe('Location Name Batch Updates', function () {

    it('LOCATIONS MOVE Service', function () {

        api.auth.get_tokens(orgAdmin);

        const fullLocationPaths = [
            '0000001/LL-1',
            '0000001/LL-2',
            '0000001/LL-3'
        ]

        function getLocationIdByFullPath(fullLocationPath) {
            const parts = fullLocationPath.split('/')

            let chain = cy.wrap(null)
            let parentId = null

            cy.log(`🔍 Resolving fullLocationPath: ${fullLocationPath}`)
            cy.log(`➡ Path segments: ${parts.join(' -> ')}`)

            // clear previous value
            cy.setLocalStorage('immediateParentId', '')

            parts.forEach((part, index) => {
                chain = chain.then(() => {

                    cy.log(`---`)
                    cy.log(`🔎 Resolving segment [${index}]: "${part}"`)
                    cy.log(`Current parentId: ${parentId ?? 'ROOT (parentLoc = 0)'}`)

                    // ROOT
                    if (index === 0) {
                        api.locations.get_and_save_any_location_data_to_local_storage(part)

                        return cy.getLocalStorage(part).then(loc => {
                            const parsed = JSON.parse(loc)
                            parentId = parsed.id

                            cy.log(`✅ Root resolved → id: ${parentId}`)
                        })
                    }

                    // CHILD LEVELS
                    api.locations.get_storage_locations(parentId)

                    return cy.getLocalStorage('locations').then(locs => {
                        const parsedLocs = JSON.parse(locs)

                        const match = parsedLocs.find(
                            l => l.name === part && l.parentLocationId === parentId
                        )

                        expect(match, `Location "${part}" should exist`).to.exist

                        parentId = match.id
                        cy.setLocalStorage('immediateParentId', parentId)

                        cy.log(`✅ Segment "${part}" resolved → id: ${parentId}`)
                    })
                })
            })
        }

        cy.wrap(fullLocationPaths).each(fullLocationPath => {

            cy.log(`🚀 Starting sublocation update for parent: ${fullLocationPath}`)

            getLocationIdByFullPath(fullLocationPath)

            cy.getLocalStorage('immediateParentId').then(parentLocationId => {

                cy.log(`📡 Fetching sublocations for parentId = ${parentLocationId}`)
                api.locations.get_storage_locations(parentLocationId, 'Sublocations')

                cy.getLocalStorage('Sublocations').then(locs => {
                    const parsedLocs = JSON.parse(locs)

                    cy.log(`📦 Sublocations found: ${parsedLocs.length}`)

                    parsedLocs.forEach(loc => {
                        cy.log(`✏️ Updating sublocation`)
                        cy.log(`   path: ${loc.fullLocationPath}`)
                        cy.log(`   id: ${loc.id}`)
                        cy.log(`   old Name: ${loc.name}`)
                        cy.log(`   new Name (legacyBarcode): ${loc.legacyBarcode}`)

                        const newLocationName = loc.legacyBarcode
                            .replace(/%/g, '')
                            .trim()

                        api.locations.update_location_by_full_loc_object(
                            loc,
                            'name',
                            newLocationName
                        )
                    })
                })
            })
        })

    })
});


////// Browser-based script


/*******************************************************
 * LOCATION NAME BATCH UPDATE
 * WITH SAFE ROLLBACK SNAPSHOT
 *******************************************************/

/* =======================
   API CONFIG
======================= */
const API_BASE = 'https://pentestapi.trackerproducts.com';

/* =======================
   AUTH / CONTEXT
======================= */
const profile = JSON.parse(localStorage.getItem('profile')) || {};
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));

let specificOrgId = JSON.parse(localStorage.getItem('orgId'));
let specificOfficeId = JSON.parse(localStorage.getItem('officeId'));

console.log('✅ Access token loaded');


/* =======================
   API HELPERS
======================= */
async function apiFetchForCurrentOffice(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refreshtoken': `${refreshToken}`,
            'Organizationid': profile.organizationId,
            'Officeid': profile.officeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refreshtoken': `${refreshToken}`,
            'Organizationid': specificOrgId,
            'Officeid': specificOfficeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}

/* =======================
   ORG / OFFICE SELECTION
======================= */
async function getAvailableOffices() {
    const offices = await apiFetchForCurrentOffice('/api/access/offices');

    const orgOfficeName = prompt(
        'Enter ORGANIZATION - OFFICE exactly as shown in selector'
    );

    if (!orgOfficeName) throw new Error('❌ No org/office provided');

    const match = offices.find(o => o.name === orgOfficeName);

    if (!match) {
        throw new Error('❌ Organization / Office not found');
    }

    const proceed = confirm(
        `Run script for:\n\n${orgOfficeName}\n\nProceed?`
    );

    if (!proceed) throw new Error('❌ Cancelled by user');

    specificOrgId = match.organizationId;
    specificOfficeId = match.id;

    localStorage.setItem('orgId', specificOrgId);
    localStorage.setItem('officeId', specificOfficeId);

    console.log('✅ Org / Office verified');
}

/* =======================
   LOCATION RESOLUTION
======================= */
async function getLocationIdByFullPath(fullLocationPath) {
    const parts = fullLocationPath.split('/');
    let parentId = null;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i === 0) {
            const root = await apiFetch('/api/locations/childrenOrRoots?parentLocationId=0');
            const match = root.locations.find(l => l.name === part);
            if (!match) throw new Error(`❌ Root not found: ${part}`);
            parentId = match.id;
            continue;
        }

        const children = await apiFetch(
            `/api/locations/childrenOrRoots?parentLocationId=${parentId}`
        );

        const match = children.locations.find(l => l.name === part);
        if (!match) throw new Error(`❌ Child not found: ${part}`);
        parentId = match.id;
    }

    return parentId;
}

/* =======================
   PREVIEW
======================= */
async function previewSublocations(parentLocationId) {
    const res = await apiFetch(
        `/api/locations/childrenOrRoots?parentLocationId=${parentLocationId}`
    );

    return (res.locations || []).map(loc => ({
        id: loc.id,
        lineage: loc.lineage,
        oldName: loc.name,
        newName: loc.legacyBarcode,
        raw: loc
    }));
}

/* =======================
   MAIN FLOW
======================= */
(async () => {
    const previewByParent = {};

    await getAvailableOffices();

    /* =======================
   USER INPUT: LOCATIONS
======================= */
    const input = prompt(
        'Enter parent location paths (comma separated)\n\nExample:\nA/A1, A/A2'
    );

    if (!input) {
        throw new Error('❌ No location paths provided');
    }

    const fullLocationPaths = input
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

    console.log('📂 Location paths:', fullLocationPaths);

    /* -------- PREVIEW -------- */
    for (const path of fullLocationPaths) {
        const parentId = await getLocationIdByFullPath(path);
        const sublocs = await previewSublocations(parentId);

        previewByParent[path] = sublocs;

        console.group(`📦 ${path} (${sublocs.length})`);
        console.table(
            sublocs.map(l => ({
                lineage: l.lineage,
                oldName: l.oldName,
                newName: l.newName
            }))
        );
        console.groupEnd();
    }

    const total = Object.values(previewByParent).flat().length;

    const proceed = confirm(
        `Preview complete.\n\nParents: ${fullLocationPaths.length}\nSublocations: ${total}\n\nApply updates?`
    );

    if (!proceed) {
        console.warn('❌ Update cancelled');
        return;
    }

    /* -------- ROLLBACK SNAPSHOT -------- */
    const rollbackSnapshot = {
        createdAt: new Date().toISOString(),
        organizationId: specificOrgId,
        officeId: specificOfficeId,
        parents: fullLocationPaths,
        locations: Object.values(previewByParent)
            .flat()
            .map(l => ({
                id: l.id,
                lineage: l.lineage,
                oldName: l.oldName
            }))
    };

    localStorage.setItem(
        'locationNameRollbackSnapshot',
        JSON.stringify(rollbackSnapshot)
    );

    console.log(`🛟 Rollback snapshot saved (${rollbackSnapshot.locations.length})`);

    /* -------- APPLY UPDATES -------- */
    console.log('🚀 APPLYING UPDATES');

    for (const sublocs of Object.values(previewByParent)) {
        for (const loc of sublocs) {
            if (!loc.newName || loc.oldName === loc.newName) continue;

            await apiFetch(`/api/locations/${loc.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...loc.raw,
                    name: loc.newName
                })
            });

            console.log(`✅ Updated: ${loc.lineage}`);
        }
    }

    console.log('🎉 ALL UPDATES COMPLETED');
})();



// ROLLBACK SCRIPT
const API_BASE = 'https://pentestapi.trackerproducts.com';
const profile = JSON.parse(localStorage.getItem('profile')) || {};
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));

let specificOrgId = JSON.parse(localStorage.getItem('orgId'));
let specificOfficeId = JSON.parse(localStorage.getItem('officeId'));

console.log('✅ Access token loaded');


/* =======================
   API HELPERS
======================= */
async function apiFetchForCurrentOffice(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refreshtoken': `${refreshToken}`,
            'Organizationid': profile.organizationId,
            'Officeid': profile.officeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refreshtoken': `${refreshToken}`,
            'Organizationid': specificOrgId,
            'Officeid': specificOfficeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}
(async () => {
    const snapshot = JSON.parse(
        localStorage.getItem('locationNameRollbackSnapshot') || 'null'
    );

    if (!snapshot || !snapshot.locations?.length) {
        console.warn('❌ No rollback snapshot found in localStorage');
        return;
    }

    console.log('🛟 Rollback snapshot loaded');
    console.log(`📦 Locations to restore: ${snapshot.locations.length}`);
    console.log(`🏢 OrgId: ${snapshot.organizationId}`);
    console.log(`🏬 OfficeId: ${snapshot.officeId}`);

    const proceed = confirm(
        `ROLLBACK LOCATION NAMES\n\n` +
        `OrganizationId: ${snapshot.organizationId}\n` +
        `OfficeId: ${snapshot.officeId}\n\n` +
        `Restore ${snapshot.locations.length} locations?\n\n` +
        `This will fetch the latest server version for each location.`
    );

    if (!proceed) {
        console.log('⛔ Rollback cancelled by user');
        return;
    }

    for (const loc of snapshot.locations) {
        try {
            console.log(`↩️ Restoring: ${loc.lineage}`);
            console.log(`   name → "${loc.oldName}"`);

            // 🔹 1. Fetch latest server version
            const latest = await apiFetch(`/api/locations/${loc.id}`);

            if (!latest?.id) {
                console.warn(`⚠️ Skipping ${loc.id} — location not found`);
                continue;
            }

            // 🔹 2. PUT full object, override name only
            await apiFetch(`/api/locations/${loc.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...latest,
                    name: loc.oldName
                })
            });

        } catch (err) {
            console.error(`❌ Failed rollback for ${loc.lineage}`, err);
        }
    }

    console.log('✅ ROLLBACK COMPLETED (latest server version used)');
})();


