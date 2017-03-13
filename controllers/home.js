let driver = module.require('./../config/selenium');

module.exports = {
    loginGet: (req, res) => {
        driver.get('http://www.neobux.com');

        // Check if user is logged
        driver
            .findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[2]/td[2]/table/tbody/tr/td[1]/a[4]'})
            .then(() => {
                    // Click login button
                    driver
                        .findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[2]/td[2]/table/tbody/tr/td[1]/a[4]' })
                        .then((element) => {
                            element.click();
                        }, (err) => {
                            if (err) console.log('There is no login button!')
                        });

                    // Check for image authentication
                    driver
                        .findElement({ xpath: '//*[@id="Kf0"]/tbody/tr[1]/td[1]/table/tbody/tr[4]/td[2]/table/tbody/tr/td[2]/img'})
                        .then((element) => {
                            // get image
                            let link = element.getAttribute('src');
                            // console.log(link);
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
                    res.redirect('home/profile')
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

        // check if login was successful
        driver.findElement({ xpath: '//*[@id="ubar_w1"]/tbody/tr/td[3]/a'})
            .then(() => {
                console.log('Login successful')
            }, (err) => {
                if (err) {
                    console.log('Login failed!');
                }
            });

        driver.sleep(5000);
    }
};
