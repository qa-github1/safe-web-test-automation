const C = require('../fixtures/constants')

/*DATE FORMAT functions */
const dateFormat = (function () {
    const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
    const timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    const timezoneClip = /[^-+\dA-Z]/g;
    const pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = '0' + val;
        return val;
    };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        const dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date))
            throw SyntaxError('invalid date');

        mask = String(dF.masks[mask] || mask || dF.masks['default']);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) === 'UTC:') {
            mask = mask.slice(4);
            utc = true;
        }

        const _ = utc ? 'getUTC' : 'get';
        const d = date[_ + 'Date']();
        const D = date[_ + 'Day']();
        const m = date[_ + 'Month']();
        const y = date[_ + 'FullYear']();
        const H = date[_ + 'Hours']();
        const M = date[_ + 'Minutes']();
        const s = date[_ + 'Seconds']();
        const L = date[_ + 'Milliseconds']();
        const o = utc ? 0 : date.getTimezoneOffset();
        const flags = {
            d,
            dd: pad(d),
            ddd: dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H,
            HH: pad(H),
            M,
            MM: pad(M),
            s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? 'a' : 'p',
            tt: H < 12 ? 'am' : 'pm',
            T: H < 12 ? 'A' : 'P',
            TT: H < 12 ? 'AM' : 'PM',
            Z: utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
            o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
        };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}());

// Some common format strings
dateFormat.masks = {
    'default': 'ddd mmm dd yyyy HH:MM:ss',
    shortDate: 'm/d/yy',
    mediumDate: 'mmm d, yyyy',
    longDate: 'mmmm d, yyyy',
    fullDate: 'dddd, mmmm d, yyyy',
    shortTime: 'h:MM TT',
    mediumTime: 'h:MM:ss TT',
    longTime: 'h:MM:ss TT Z',
    isoDate: 'yyyy-mm-dd',
    isoTime: 'HH:MM:ss',
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
};

// For convenience...
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

exports.currentDate = dateFormat(Date(), 'mmm d, yyyy');
exports.currentDateAndTime = dateFormat(Date(), 'mmm d, yyyy hh:MM');
exports.currentDateAndHour = dateFormat(Date(), 'mmm d, yyyy hh');

// date formats
exports.fullDate = dateFormat(Date(), 'dddd, mmmm d, yyyy');
exports.longDate = dateFormat(Date(), 'mmmm d, yyyy');
exports.mediumDate = dateFormat(Date(), 'mmm d, yyyy');
exports.shortDate = dateFormat(Date(), 'm/d/yy');


function changeTimezone(date, ianatz) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to subtract
}

exports.getDateBeforeXDaysInSpecificFormat = function (mask, daysBeforeTheCurrentDate) {
    let today = new Date();
    let dateBeforeXDays = today.setDate(today.getDate() - daysBeforeTheCurrentDate);
    return dateFormat(dateBeforeXDays, mask);
};

exports.getDateBeforeXDaysFromSpecificDate = function (mask, date1, daysBeforeDate1) {
    let specific_date = new Date(date1);
    let dateBeforeXDays = specific_date.setDate(specific_date.getDate() - daysBeforeDate1);
    return dateFormat(dateBeforeXDays, mask);
};

exports.getDateAfterXDaysFromSpecificDate = function (mask, date1, daysAfterDate1) {
    let specific_date = new Date(date1);
    let dateAfterXDays = specific_date.setDate(specific_date.getDate() + daysAfterDate1);
    return dateFormat(dateAfterXDays, mask);
};

exports.getDateAfterXDaysInSpecificFormat = function (mask, daysAfterTheCurrentDate) {
    let today = new Date();
    let dateAfterXDays = today.setDate(today.getDate() + daysAfterTheCurrentDate);
    return dateFormat(dateAfterXDays, mask);
};

exports.getYesterdaysDateInSpecificFormat = function (mask) {
    let today = new Date();
    let yesterday = today.setDate(today.getDate() - 1);
    return dateFormat(yesterday, mask);
};

exports.getCurrentDateInSpecificFormat = function (mask) {
    const todaysDate = new Date()
    return dateFormat(todaysDate, mask)
};

exports.getCurrentMonthNumber = function () {
    const todaysDate = new Date()
    return todaysDate.getMonth() + 1;
};

exports.getCurrentMonthYear = function () {
    const todaysDate = new Date()
    return todaysDate.getFullYear();
};

exports.getDateInPastInSpecificFormat = function (mask, numberOfDaysAgo) {
    let today = new Date();
    let specificDateInPast = today.setDate(today.getDate() - numberOfDaysAgo);
    return dateFormat(specificDateInPast, mask);
};

exports.getDateInPastInIsoString = function (numberOfDaysAgo) {
    let today = new Date();
    let specificDateInPast = new Date(today.setDate(today.getDate() - numberOfDaysAgo));
    cy.log('Date in ISO format is '+ specificDateInPast.toISOString())
    return specificDateInPast.toISOString();
};

exports.getSpecificDateInSpecificFormat = function (mask, date = "11/25/2021") {
    let specificDate = new Date(date);
    return dateFormat(specificDate, mask);
};

exports.getNumberOfDaysBetween2Dates = function (date1 = "11/25/2021", date2 = "10/25/2021") {
    let date_1 = new Date(date1);
    let date_2 = new Date(date2);
    let difference = date_1.getTime() - date_2.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
};

exports.getCurrentDateInCurrentFormat = function (formatObject) {
    return exports.getCurrentDateInSpecificFormat(formatObject.mask)
};

exports.tomorrowsDate = function (format = C.currentDateTimeFormat) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateFormat(tomorrow, format.mask);
};

exports.yesterdaysDate = function (format = C.currentDateTimeFormat) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateFormat(yesterday, format.mask);
};

exports.setIsoDateAndTime = function (year, month, date, h, min,) {

    const now = new Date()
    const definedDate = new Date(year, month - 1, date, h, min, 0, 0);
    let dateAndTime = year ? definedDate : now;

    return dateAndTime.toISOString();
};

exports.getCurrentDateAndTimeInIsoFormat = function () {
    const now = new Date()
    return now.toISOString();
};

exports.getSpecificDateInIsoString = function (specificDate = "11/25/2021") {
    const date = new Date(specificDate)
    return date.toISOString();
};

exports.setCurrentDateAndTime = function (dateTimeFormat) {

    let now = new Date()
    return dateFormat(now, dateTimeFormat.mask)
};

exports.setDateAndTime = function (dateTimeFormat, year, month, date, h = 0, min = 0) {

    const now = new Date()
    const definedDate = new Date(year, month - 1, date, h, min, 0, 0);
    let dateAndTime = year ? definedDate : now;

    return dateFormat(dateAndTime, dateTimeFormat.mask)
};

exports.setDate = function (dateOnlyFormat, year, month, date) {

    const now = new Date()
    const definedDate = new Date(year, month - 1, date);

    let selectedDate = year ? definedDate : now;
    return dateFormat(selectedDate, dateOnlyFormat.mask)
};

exports.randomNo = Math.floor(1000 * Math.random() + 1).toString() + Date.now().toString().substring(-12);

exports.setNewRandomNo = function () {
    return exports.randomNo = this.getCurrentDateInSpecificFormat('mdyy') + Math.floor(1000000 * Math.random() + 1).toString()
};

exports.setNewRandomString = function (length = 3) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    exports.randomString = dateFormat(Date(), 'mmmd') + result;
    return exports.randomString.toLowerCase();
};

exports.getRandomNo = function (length) {
    if (length) {
        let randomChars = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        // return dateFormat(Date(), 'ddmmyy') + result;
        return result;
    } else {
        return exports.randomNo;
    }
};

exports.fetch_all_dropdown_values_and_convert_to_object_properties = function (dropdownSelector) {
    var objectWithValues = {};
    $(dropdownSelector + ' option').each(function () {
        objectWithValues[$(this).text().charAt(0).toLowerCase() + $(this).text().slice(1).replace(/\s/g, '')] = $(this).text();
    });

    const json = JSON.stringify(objectWithValues);  // {"name":"John Smith"}
    const unquoted = json.replace(/"([^"]+)":/g, '$1:');
    console.log(unquoted);  // {name:"John Smith"}

};

exports.format_as_phone_number = function (str) {
    //Filter only numbers from the input
    let cleaned = ('' + str).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    ;
    return null
};

exports.print_out_value_from_local_storage = function (property) {
    cy.getLocalStorage(property).then(value => {
        cy.log('Value in local storage is ' + value);
    })
}




