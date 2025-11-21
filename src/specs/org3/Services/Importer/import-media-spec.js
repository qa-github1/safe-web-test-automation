const C = require('../../../../fixtures/constants');
const S = require('../../../../fixtures/settings');
const D = require('../../../../fixtures/data');
const E = require('../../../../fixtures/files/excel-data');
const api = require('../../../../api-utils/api-spec');
const ui = require('../../../../pages/ui-spec');

describe('Import Media', function () {

    it('1 Precheck and Import Media', function () {
        ui.app.log_title(this);
        let fileName = 'Media_allFields_'+ S.domain;
        let user = S.userAccounts.orgAdmin;
        api.auth.get_tokens(user);
        D.generateNewDataSet();
        api.cases.add_new_case();
        api.items.add_new_item();

        cy.getLocalStorage("newItem").then(newItem => {
            E.generateDataFor_MEDIA_Importer(D.newItem, JSON.parse(newItem).barcode);
            cy.generate_excel_file(fileName, E.mediaWithAllFields);

            ui.importer.precheck_import_data(fileName, C.importTypes.media)
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.media)
                .verify_text_is_NOT_present_on_main_container(E.mediaWithAllFields[1][13])

            ui.importer.reload_page()
                .import_data(fileName, C.importTypes.media)
            ui.caseView.open_newly_created_item_via_direct_link()
                .select_tab(C.tabs.media)
                .verify_text_is_present_on_main_container(E.mediaWithAllFields[1][13])
        });
    });
});
