const webdriver = require('selenium-webdriver');

let chromeCapabilities = webdriver.Capabilities.chrome();

// disable site notifications
let chromeOptions = {
    'args': ['disable-notifications']
};
chromeCapabilities.set('chromeOptions', chromeOptions);

module.exports = new webdriver.Builder().withCapabilities(chromeCapabilities).build();