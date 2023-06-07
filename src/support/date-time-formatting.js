const helper = require('./e2e-helper')

let DF = exports;

DF.dateFormats = {
    fullDate: {
        name: 'fullDate',
        mask: 'dddd, mmmm d, yyyy',
        editMode: {
            mask: 'mmmm d, yyyy',
        }
    },
    longDate: {
        name: 'longDate',
        mask: 'mmmm d, yyyy',
        editMode: {
            mask: 'mmmm d, yyyy',
        }
    },
    mediumDate: {
        name: 'mediumDate',
        mask: 'mmm d, yyyy',
        editMode: {
            mask: 'mmm d, yyyy',
        }
    },
    shortDate: {
        name: 'shortDate',
        mask: 'mm/dd/yy',
        editMode: {
            mask: 'm/d/yy',
        }
    },
    shortDateWithoutLeadingZeros: {
        name: 'shortDate',
        mask: 'm/d/yyyy',
        editMode: {
            mask: 'm/d/yy',
        }
    },
    'long-dmy': {
        name: 'long-dmy',
        mask: 'd mmmm, yyyy',
        editMode: {
            mask: 'd mmmm, yyyy',
        }
    },
    'short-dmy': {
        name: 'short-dmy',
        mask: 'd/m/yyyy',
        editMode: {
            mask: 'd/m/yy',
        }
    }
}

DF.dateTimeFormats = {
    full: {
        name: 'full',
        get example() {
            return helper.setDateAndTime(DF.dateTimeFormats['full'])
        },
        mask: 'dddd, mmmm d, yyyy hh:MM TT',
        editMode: {
            mask: 'mmmm d, yyyy hh:MM TT',
        },
        dateOnly: {
            mask: 'mmmm d, yyyy',
            editMode : {
                mask: 'mmmm d, yyyy',
            }
        }
    },
    fullDayMonth: {
        name: 'fullDayMonth',
        mask: 'dddd, d mmmm, yyyy hh:MM TT',
    },
    fullWithLeadingZero: {
        name: 'fullWithLeadingZero',
        mask: 'dddd, mmmm dd, yyyy hh:MM TT',
    },
    long: {
        name: 'long',
        mask: 'mmmm d, yyyy hh:MM TT',
        editMode: {
            mask: 'mmmm d, yyyy hh:MM TT',
        },
        dateOnly: {
            mask: 'mmmm d, yyyy',
            editMode : {
                mask: 'mmmm d, yyyy',
            }
        }
    },
    longDayMonth: {
        name: 'longDayMonth',
        mask: 'd mmmm, yyyy hh:MM TT',
    },
    longWithLeadingZero: {
        name: 'longWithLeadingZero',
        mask: 'mmmm dd, yyyy hh:MM TT',
    },
    medium: {
        name: 'medium',
        mask: 'mmm d, yyyy hh:MM TT',
        editMode: {
            mask: 'mmm d, yyyy hh:MM TT',
        },
        dateOnly: {
            mask: 'mmm d, yyyy',
            editMode : {
                mask: 'mmm d, yyyy',
            }
        }
    },
    mediumDayMonth: {
        name: 'mediumDayMonth',
        mask: 'd mmm, yyyy hh:MM TT',
    },
    mediumWithLeadingZero: {
        name: 'mediumWithLeadingZero',
        mask: 'mmm dd, yyyy hh:MM TT',
    },
    short: {
        name: 'short',
        mask: 'mm/dd/yy hh:MM TT',
        fullYearMask: 'm/d/yyyy',
        editMode: {
            mask: 'mm/dd/yy hh:MM TT',
        },
        dateOnly: {
            fullYearMask: 'm/d/yyyy',
            mask: 'mm/dd/yy',
            editMode : {
                mask: 'mm/dd/yy',
            }
        }
    },
    shortDateOnlyWithLeadingZeros: {
        name: 'short',
        mask: 'mm/dd/yyyy',
        editMode: {
            mask: 'mm/dd/yy hh:MM TT',
        },
        dateOnly: {
            mask: 'mm/dd/yy',
            editMode : {
                mask: 'mm/dd/yy',
            }
        }
    },
    shortDateOnlyWithoutLeadingZeros: {
        name: 'short',
        mask: 'm/d/yyyy',
        editMode: {
            mask: 'm/d/yy hh:MM TT',
        },
        dateOnly: {
            mask: 'm/d/yy',
            editMode : {
                mask: 'mm/dd/yy',
            }
        }
    },
    military: {
        name: 'military',
        mask: 'mm/dd/yyyy HH:MM',
        editMode: {
            mask: 'mm/dd/yy HH:MM',
        },
        dateOnly: {
            mask: 'mm/dd/yyyy',
            editMode : {
                mask: 'mm/dd/yy',
            }
        }
    },
    iso8601: {
        name: 'iso8601',
        mask: 'yyyy-mm-dd HH:MM',
        editMode: {
            mask: 'yyyy-mm-dd HH:MM',
        },
        dateOnly: {
            mask: 'yyyy-mm-dd',
            editMode : {
                mask: 'yyyy-mm-dd',
            }
        }
    },
    'long-dmy': {
        name: 'long-dmy',
        mask: 'd mmmm yyyy hh:MM TT',
        editMode: {
            mask: 'd mmmm yyyy hh:MM TT',
        },
        dateOnly: {
            mask: 'd mmmm yyyy'
        }
    },
    'long-dmy-military': {
        name: 'long-dmy-military',
        mask: 'd mmmm yyyy HH:MM',
        editMode: {
            mask: 'd mmmm yyyy HH:MM',
        },
        dateOnly: {
            mask: 'd mmmm yyyy'
        }
    },
    'short-dmy': {
        name: 'short-dmy',
        mask: 'dd/mm/yyyy hh:MM TT',
        editMode: {
            mask: 'dd/mm/yy hh:MM TT',
        },
        dateOnly: {
            mask: 'dd/mm/yyyy'
        }
    },
    'short-dmy-withoutLeadingZeros': {
        name: 'short-dmy',
        mask: 'd/m/yyyy hh:MM TT',
        editMode: {
            mask: 'd/m/yy hh:MM TT',
        },
        dateOnly: {
            mask: 'd/m/yyyy'
        }
    },
    'short-dmy-military': {
        name: 'short-dmy-military',
        mask: 'dd/mm/yyyy HH:MM',
        editMode: {
            mask: 'dd/mm/yy HH:MM',
        },
        dateOnly: {
            mask: 'dd/mm/yyyy'
        }
    },
}

module.exports = DF;
