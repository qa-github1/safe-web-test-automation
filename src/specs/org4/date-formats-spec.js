const C = require('../../fixtures/constants');
const S = require('../../fixtures/settings');
const D = require('../../fixtures/data');
const DF = require('../../support/date-time-formatting');
const api = require('../../api-utils/api-spec');
const ui = require('../../pages/ui-spec');
const helper = require('../../support/e2e-helper');
var data_driven = require('mocha-data-driven')

let user = S.getUserData(S.userAccounts.orgAdmin);

describe('Date & Time Formats - month/day notation', function () {

    let dateTimeFormatsInSettings = [
        {name: 'full', example: helper.setDateAndTime(C.dateTimeFormats['full'])},
        {name: 'long', example: helper.setDateAndTime(C.dateTimeFormats['long'])},
        {name: 'medium', example: helper.setDateAndTime(C.dateTimeFormats['medium'])},
        {name: 'short', example: helper.setDateAndTime(C.dateTimeFormats['short'])},
        {name: 'military', example: helper.setDateAndTime(C.dateTimeFormats['military'])},
        {name: 'iso8601', example: helper.setDateAndTime(C.dateTimeFormats['iso8601'])},
    ]

    let dateTimeFormatsForEntering = [
        {name: 'full', example: helper.setDateAndTime(C.dateTimeFormats['full'])},
       // {name: 'fullDayMonth', example: helper.setDateAndTime(C.dateTimeFormats['fullDayMonth'])},
        {name: 'fullWithLeadingZero', example: helper.setDateAndTime(C.dateTimeFormats['fullWithLeadingZero'])},
        {name: 'long', example: helper.setDateAndTime(C.dateTimeFormats['long'])},
      //  {name: 'longDayMonth', example: helper.setDateAndTime(C.dateTimeFormats['longDayMonth'])},
        {name: 'longWithLeadingZero', example: helper.setDateAndTime(C.dateTimeFormats['longWithLeadingZero'])},
        {name: 'medium', example: helper.setDateAndTime(C.dateTimeFormats['medium'])},
    //    {name: 'mediumDayMonth', example: helper.setDateAndTime(C.dateTimeFormats['mediumDayMonth'])},
        {name: 'mediumWithLeadingZero', example: helper.setDateAndTime(C.dateTimeFormats['mediumWithLeadingZero'])},
        {name: 'short', example: helper.setDateAndTime(C.dateTimeFormats['short'])},
        {name: 'shortDateOnlyWithoutLeadingZeros', example: helper.setDateAndTime(C.dateTimeFormats['shortDateOnlyWithoutLeadingZeros'])},
        {name: 'shortDateOnlyWithLeadingZeros', example: helper.setDateAndTime(C.dateTimeFormats['shortDateOnlyWithLeadingZeros'])},
        {name: 'military', example: helper.setDateAndTime(C.dateTimeFormats['military'])},
        {name: 'iso8601', example: helper.setDateAndTime(C.dateTimeFormats['iso8601'])},
    ]

    data_driven(dateTimeFormatsInSettings, function () {

        it('**** {name}  **** date-time format selected in USER SETTINGS, e.g. {example}', function (settings) {

            ui.app.log_title(this);
            api.auth.get_tokens(user);
            api.users.update_current_user_settings(user.id, settings.name)
            D.generateNewDataSet();
            api.cases.add_new_case();
            api.org_settings.disable_Item_fields([C.itemFields.recoveryDate]);

            C.selectedDateFormat = settings.name
            C.selectedDateFormatExample = settings.name
            C.selectedDateType = settings.type
        })

        data_driven(dateTimeFormatsForEntering, function () {

            it('Add Item - manual date entry with {name} date-time format, e.g. {example}', function (dtf) {

                C.currentDateTimeFormat = C.dateTimeFormats[dtf.name]

                api.auth.get_tokens(user);
                api.org_settings.get_current_org_settings()
                api.cases.fetch_updated_data_for_new_case()
                D.getItemDataWithReducedFields(D.newCase, [C.itemFields.recoveryDate]);

                ui.menu.click_Add__Item();
                ui.addItem.populate_all_fields_on_both_forms(D.newItem, false)
                    .select_post_save_action(C.postSaveActions.viewAddedItem)
                    .click_Save()
                    .verify_toast_message_()

                C.currentDateTimeFormat = C.dateTimeFormats[C.selectedDateFormat]
                D.getItemDataWithReducedFields(D.newCase, [C.itemFields.recoveryDate])

                if (dtf.name === 'shortDateOnlyWithoutLeadingZeros' || dtf.name === 'shortDateOnlyWithLeadingZeros'){
                   D.newItem.recoveryDate = D.newItem.recoveryDate_withoutTime
                   D.newItem.recoveryDateEditMode = D.newItem.recoveryDate_withoutTime_editMode

                    if (C.selectedDateFormat === 'military' || C.selectedDateFormat === 'iso8601'){
                        D.newItem.recoveryDate = D.newItem.recoveryDate + ' 00:00'
                        D.newItem.recoveryDateEditMode = D.newItem.recoveryDateEditMode + ' 00:00'
                    }
                    else {
                        D.newItem.recoveryDate = D.newItem.recoveryDate + ' 12:00 AM'
                        D.newItem.recoveryDateEditMode = D.newItem.recoveryDateEditMode + ' 12:00 AM'
                    }
                }

                    ui.itemView.verify_textual_values_on_the_form([D.newItem.recoveryDate])
                        .click_button(C.buttons.edit)
                        .verify_values_on_Edit_form(D.newItem)
            });
        })
    });
});

describe('Date & Time Formats - day/month notation', function () {

    let dateTimeFormatsInSettings = [
         {name: 'long-dmy', example: helper.setDateAndTime(C.dateTimeFormats['long-dmy'])},
         {name: 'long-dmy-military', example: helper.setDateAndTime(C.dateTimeFormats['long-dmy-military'])},
         {name: 'short-dmy', example: helper.setDateAndTime(C.dateTimeFormats['short-dmy'])},
         {name: 'short-dmy-military', example: helper.setDateAndTime(C.dateTimeFormats['short-dmy-military'])},
    ]

  let dateTimeFormatsForEntering = [
        {name: 'long-dmy', example: helper.setDateAndTime(C.dateTimeFormats['long-dmy'])},
        {name: 'long-dmy-military', example: helper.setDateAndTime(C.dateTimeFormats['long-dmy-military'])},
        {name: 'short-dmy', example: helper.setDateAndTime(C.dateTimeFormats['short-dmy'])},
        {name: 'short-dmy-withoutLeadingZeros', example: helper.setDateAndTime(C.dateTimeFormats['short-dmy-withoutLeadingZeros'])},
        {name: 'short-dmy-military', example: helper.setDateAndTime(C.dateTimeFormats['short-dmy-military'])},
    ]

    data_driven(dateTimeFormatsInSettings, function () {

        it('**** {name}  **** date-time format selected in USER SETTINGS, e.g. {example}', function (settings) {

            ui.app.log_title(this);
            api.auth.get_tokens(user);
            api.users.update_current_user_settings(user.id, settings.name)
            D.generateNewDataSet();
            api.cases.add_new_case();
            api.org_settings.disable_Item_fields([C.itemFields.recoveryDate]);

            C.selectedDateFormat = settings.name
            C.selectedDateFormatExample = settings.name
            C.selectedDateType = settings.type
        })

        data_driven(dateTimeFormatsForEntering, function () {

            it('Add Item - manual date entry with {name} date-time format, e.g. {example}', function (dtf) {

                C.currentDateTimeFormat = C.dateTimeFormats[dtf.name]

                api.auth.get_tokens(user);
                api.org_settings.get_current_org_settings()
                api.cases.fetch_updated_data_for_new_case()
                D.getItemDataWithReducedFields(D.newCase, [C.itemFields.recoveryDate]);

                ui.menu.click_Add__Item();
                ui.addItem.populate_all_fields_on_both_forms(D.newItem, false)
                    .select_post_save_action(C.postSaveActions.viewAddedItem)
                    .click_Save()
                    .verify_toast_message_()

                C.currentDateTimeFormat = C.dateTimeFormats[C.selectedDateFormat]
                D.getItemDataWithReducedFields(D.newCase, [C.itemFields.recoveryDate])
                ui.itemView.verify_textual_values_on_the_form([D.newItem.recoveryDate])
                    .click_button(C.buttons.edit)
                    .verify_values_on_Edit_form(D.newItem)
            });
        })
    });

});

describe('Date Formats - month/day notation', function () {

    let dateFormatsInSettings = [
        {name: 'fullDate', example: helper.setDateAndTime(C.dateFormats['fullDate'])},
        {name: 'longDate', example: helper.setDateAndTime(C.dateFormats['longDate'])},
        {name: 'mediumDate', example: helper.setDateAndTime(C.dateFormats['mediumDate'])},
        {name: 'shortDate', example: helper.setDateAndTime(C.dateFormats['shortDate'])},
    ]

    let dateFormatsForEntering = [
        {name: 'fullDate', example: helper.setDateAndTime(C.dateFormats['fullDate'])},
        {name: 'longDate', example: helper.setDateAndTime(C.dateFormats['longDate'])},
        {name: 'mediumDate', example: helper.setDateAndTime(C.dateFormats['mediumDate'])},
        {name: 'shortDate', example: helper.setDateAndTime(C.dateFormats['shortDate'])},
    ]

    data_driven(dateFormatsInSettings, function () {

        it('**** {name}  **** date format selected in USER SETTINGS, e.g. {example}', function (settings) {

            ui.app.log_title(this);
            api.auth.get_tokens(user);
            api.users.update_current_user_settings(user.id, "full", settings.name)
            api.org_settings.disable_Person_fields([C.personFields.dateOfBirth, C.personFields.businessName])
            D.getNewCaseData()
            api.cases.add_new_case()

            C.selectedDateFormat = settings.name
            C.selectedDateFormatExample = settings.name
            C.selectedDateType = settings.type
        })

        data_driven(dateFormatsForEntering, function () {

            it('Add Person - manual date entry with {name} date-time format, e.g. {example}', function (df) {

                    C.currentDateFormat = C.dateFormats[df.name]

                    api.auth.get_tokens(user);
                    api.org_settings.get_current_org_settings()
                    api.org_settings.enable_all_Person_fields()
                    D.getPersonDataWithReducedFields(D.newCase,[C.personFields.dateOfBirth, C.personFields.businessName])
                    D.newPerson.firstName = null;
                    D.newPerson.lastName = null;

                    ui.menu.click_Add__Person();
                    ui.addPerson.populate_all_fields(D.newPerson, false)
                        .select_post_save_action(C.postSaveActions.viewAddedPerson)
                        .click_Save()
                        .verify_toast_message(C.toastMsgs.saved);

                    C.currentDateFormat = C.dateFormats[C.selectedDateFormat]
                    D.getPersonDataWithReducedFields(D.newCase,[C.personFields.dateOfBirth, C.personFields.businessName])
                    D.newPerson.firstName = null;
                    D.newPerson.lastName = null;
                    D.newPerson.businessName = null;
                    ui.personView.verify_textual_values_on_the_form([D.newPerson.dateOfBirthEditMode])
                        .click_button(C.buttons.edit)
                        D.newPerson.dateOfBirth = D.newPerson.dateOfBirthEditMode
                   ui.personView.verify_values_on_Edit_form(D.newPerson)
            });
        })
    });
});

describe('Date Formats - day/month notation', function () {

    let dateFormatsInSettings = [
        {name: 'long-dmy', example: helper.setDateAndTime(C.dateFormats['long-dmy'])},
        {name: 'short-dmy', example: helper.setDateAndTime(C.dateFormats['short-dmy'])}
    ]

    let dateFormatsForEntering = [
        {name: 'long-dmy', example: helper.setDateAndTime(C.dateFormats['long-dmy'])},
        {name: 'short-dmy', example: helper.setDateAndTime(C.dateFormats['short-dmy'])}
    ]

    data_driven(dateFormatsInSettings, function () {

        it('**** {name}  **** date format selected in USER SETTINGS, e.g. {example}', function (settings) {

            ui.app.log_title(this);
            api.auth.get_tokens(user);
            api.users.update_current_user_settings(user.id, "full", settings.name)
            api.org_settings.disable_Person_fields([C.personFields.dateOfBirth, C.personFields.businessName])
            D.getNewCaseData()
            api.cases.add_new_case()

            C.selectedDateFormat = settings.name
            C.selectedDateFormatExample = settings.name
            C.selectedDateType = settings.type
        })

        data_driven(dateFormatsForEntering, function () {

            it('Add Person - manual date entry with {name} date-time format, e.g. {example}', function (df) {

                    C.currentDateFormat = C.dateFormats[df.name]

                    api.auth.get_tokens(user);
                    api.org_settings.get_current_org_settings()
                    D.getPersonDataWithReducedFields(D.newCase,[C.personFields.dateOfBirth, C.personFields.businessName])
                    D.newPerson.firstName = null;
                    D.newPerson.lastName = null;

                    ui.menu.click_Add__Person();
                    ui.addPerson.populate_all_fields(D.newPerson, false)
                        .select_post_save_action(C.postSaveActions.viewAddedPerson)
                        .click_Save()
                        .verify_toast_message(C.toastMsgs.saved);

                    C.currentDateFormat = C.dateFormats[C.selectedDateFormat]
                    D.getPersonDataWithReducedFields(D.newCase,[C.personFields.dateOfBirth, C.personFields.businessName])
                    D.newPerson.firstName = null;
                    D.newPerson.lastName = null;
                    D.newPerson.businessName = null;
                    ui.personView.verify_textual_values_on_the_form([D.newPerson.dateOfBirth])
                        .click_button(C.buttons.edit)
                        .verify_values_on_Edit_form(D.newPerson)
            });
        })
    });
});
