/// <reference types="cypress" />
/// <reference types="@shelex/cypress-allure-plugin" />

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const imaps = require('imap-simple');
//const puppeteer = require('puppeteer');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const Xvfb = require('xvfb');
const pdfjsLib = require("pdfjs-dist");

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */

let debuggingPort;

function getEnvironmentConfig(config) {
    const configJson = require(config.configFile);
    const environmentName = config["env"]["environment"] || configJson["defaultEnvironment"];
    if (!environmentName) {
        throw new Error(`Field "environment" or "defaultEnvironment" not found in config file.`);
    }

    let environmentData = configJson["environments"][environmentName] || configJson["defaultEnvironment"];
    configJson["env"] = environmentData;
    configJson["baseUrl"] = environmentData["baseUrl"];
    configJson["orgNum"] = config["env"]["orgNum"];
    configJson["env"]["allureResultsPath"] = "report/allure-results-" + + config["env"]["orgNum"] ;
    configJson["env"]["allure"] = true;

    console.log('CONFIG PARAMETERS: ' + JSON.stringify(configJson))

    return Object.assign({}, configJson);
}

const Log = {
    reset: '\x1b[0m',
    // Foreground (text) colors
    fg: {
        black: '30',
        red: '31',
        green: '32',
        yellow: '33',
        blue: '34',
        magenta: '35',
        cyan: '36',
        white: '37',
        crimson: '38',
    },
    // Background colors
    bg: {
        black: '40',
        red: '41',
        green: '42',
        yellow: '43',
        blue: '44',
        magenta: '45',
        cyan: '46',
        white: '47',
        crimson: '48',
    },
};

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name !== 'electron' || browser.name === 'chromium') {

            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--enable-webgl-developer-extensions');
            launchOptions.args.push('--enable-webgl-draft-extensions');
            launchOptions.args.push('--disable-web-security');
            launchOptions.args.push('--disable-features=IsolateOrigins,site-per-process');

            const existing = launchOptions.args.find(
                (arg) => arg.slice(0, 23) === '--remote-debugging-port',
            );
            debuggingPort = existing.split('=')[1];
        }
        return launchOptions;
    });

    on('task', {

        log(text) {
            if (text.color) {
                console.log(`\x1b[${Log.fg[text.color]};${Log.bg[text.bgColor]};1m`, text.message);
            } else {
                console.log(text);
            }

            console.log("\x1b[0m")
            return null
        },

        compare_images: (args) => {

            let firstImage = "./image-comparison/snapshots/" + args.fileName + '.png';
            let secondImage = "./image-comparison/baselines/" + args.fileName + '_BASELINE.png';
            let diffImage = "./image-comparison/diff/" + args.fileName + '.png';

            const fs = require('fs');
            const PNG = require('pngjs').PNG;
            const pixelmatch = require('pixelmatch');

            const img1 = PNG.sync.read(fs.readFileSync(firstImage));
            const img2 = PNG.sync.read(fs.readFileSync(secondImage));
            const {width, height} = img1;
            const diff = new PNG({width, height});

            fs.writeFileSync(diffImage, PNG.sync.write(diff));

            return pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});
        },

        // verify_report_gets_open_in_new_tab_with_xvfb: (args) => {
        //     return (async () => {
        //         var xvfb = new Xvfb({
        //             silent: true,
        //             displayNum: 99,
        //             reuse: true,
        //             xvfb_args: ["-screen", "0", '1280x1024x24', "-ac"],
        //         });
        //         xvfb.start((err) => {
        //             if (err) console.error(err)
        //         });
        //
        //         const browser = await puppeteer.connect({
        //             browserURL: `http://localhost:${debuggingPort}`,
        //             headless: false,
        //             defaultViewport: null,
        //             args: ['--no-sandbox', '--start-fullscreen', '--display=' + xvfb._display]
        //         });
        //
        //         let pages = await browser.pages();
        //         const page = pages[0];
        //         await page.waitFor(10000);
        //
        //         pages = await browser.pages();
        //         const newTab = pages[1];
        //         await newTab.screenshot({path: "image-comparison/snapshots/" + args.reportName + '.png'});
        //
        //         await newTab.close();
        //         await xvfb.stop();
        //
        //         return null
        //     })();
        // },

        generate_excel_file(args) {

            let filename = args.filename;
            let dataObject = args.dataObject;

            let excel = require('../fixtures/files/excel-helper');
            return new Promise((resolve, reject) => {
                excel.generate_file(filename, dataObject);
                return resolve(true)
            });
        },

        verify_PDF_content(args) {
            return pdfjsLib.getDocument({data: args.data}).promise.then((pdf) => {
                // PDF loaded successfully

                return pdf.getPage(args.pageNumber).then((page) => {
                    // Page loaded successfully

                    return page.getTextContent().then((textContent) => {
                        // Text content extracted successfully
                        return textContent

                    }, (error) => {
                        console.log(error)
                        // Error extracting text content
                    });

                }, (error) => {
                    console.log(error)
                    // Error loading page
                });

            }, (error) => {
                console.log(error)
                // Error loading PDF
            });
        },

        fetchGmailUnseenMails({username, password, markSeen}) {
            var config = {
                imap: {
                    user: username,
                    password: password,
                    host: 'imap.gmail.com',
                    port: 993,
                    tls: true,
                    authTimeout: 10000
                }
            };

            return imaps.connect(config).then(function (connection) {

                return connection.openBox('INBOX').then(function () {
                    var searchCriteria = [
                        'UNSEEN'
                    ];

                    var fetchOptions = {
                        bodies: ['HEADER', 'TEXT'],
                        markSeen: markSeen,
                        markRead: markSeen
                    };

                    return connection.search(searchCriteria, fetchOptions).then(function (results) {
                        var mails = [];
                        if (results) {
                            results.forEach(item => {
                                var _mail = {};
                                if (item && item.parts) {
                                    item.parts.forEach(_item => {
                                        if (_item.which == "TEXT") {
                                            _mail.body = _item.body;
                                        }
                                        if (_item.which == "HEADER" && _item.body && _item.body.from && _item.body.from.length) {
                                            _mail.from = _item.body.from[0];
                                        }
                                        if (_item.which == "HEADER" && _item.body && _item.body.subject && _item.body.subject.length) {
                                            _mail.subject = _item.body.subject[0];
                                        }
                                        if (_item.which == "HEADER" && _item.body && _item.body.to && _item.body.to.length) {
                                            _mail.to = _item.body.to[0];
                                        }
                                    })
                                }
                                mails.push(_mail);
                            });
                        }
                        connection.end();
                        return mails;
                    });
                });
            });
        }
    });

    allureWriter(on, config);

    return getEnvironmentConfig(config);
};
