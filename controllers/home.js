const webdriver = require('selenium-webdriver');
let driver = new webdriver.Builder().forBrowser('chrome').build();

module.exports = {
    loginGet: (req, res) => {
        driver.get('http://www.neobux.com');

        // Check if user is logged
        driver
            .findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[2]/td[2]/table/tbody/tr/td[1]/a[4]'})
            .then((element) => { // User is not logged
                    // Check for image authentication
                    element.click();

                    driver
                        .findElement({ xpath: '//*[@id="Kf0"]/tbody/tr[1]/td[1]/table/tbody/tr[4]/td[2]/table/tbody/tr/td[2]/img'})
                        .then((element) => {
                            // get image
                            let link = element.getAttribute('src');
                            // render image in extension
                            res.render('user/login', { image: true, imageLink: link});

                        }, (err) => {
                            if (err) {
                                console.log('No image authentication!');
                                res.render('user/login', { image: false})
                            }
                        });

        }, (err) => {
                if (err) {
                    console.log('User is logged!');
                    res.render('home/profile');
                }
            });

    },
    loginPost: (req, res) => {
        let registerArgs = req.body;

        // send username from the extension to neobux username field
        driver.findElement({ xpath: '//*[@id="Kf1"]' }).sendKeys(registerArgs.username);
        // send password from the extension to neobux password field
        driver.findElement({ xpath: '//*[@id="Kf2"]' }).sendKeys(registerArgs.password);

        // send image code from the extension to neobux code field
        if (registerArgs.code) driver.findElement({ xpath: '//*[@id="Kf3"]'}).sendKeys(registerArgs.code);

        // click neobux login button
        driver.findElement({ xpath: '//*[@id="botao_login"]' }).click();

        driver.findElement({ xpath: '//*[@id="ubar_w1"]/tbody/tr/td[3]/a'})
            .then(() => {
                console.log('Login successful')
            }, (err) => {
                if (err) console.log(err)
            });

        // open neobux advertisements page
        driver.findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[3]/td/table/tbody/tr/td[3]/a'}).click();

        // render profile view in extension
        res.render('home/profile')

    }
};