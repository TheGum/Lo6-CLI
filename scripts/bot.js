let driver = module.require('./selenium');
let constants = module.require('./constants');
let currentAdvertise = 1; // every time start from first ad

start();
function start() {
    // open neobux.com
    driver.get(constants.neobux).then(() => {
        goToLoginPage();
    }, (err) => {
        if (err) {
            console.log(`Can't open neobux!`)
        }
    });

}

function goToLoginPage() {
    // try to find login button
    driver
        .findElement({xpath: constants.mainPageLoginButton})
        .then((loginButton) => {
            // Click login button
            loginButton.click();
            imageAuthentication();
        }, (err) => {
            if (err) console.log('There is no login button!');
        });
}

function imageAuthentication() {
    // try to find image
    driver
        .findElement({xpath: constants.loginPageImage})
        .then(() => {
            console.log('There is a image authentication, I will try after 30 min.');
            quit(1800000);
        }, (err) => {
            if (err) {
                console.log('No image authentication!');
                login()
            }
        });
}

function login() {
    // send username from username textfield to neobux login page
    driver.findElement({xpath: constants.loginPageUsernameField}).sendKeys(constants.usernameInput);

    // send password from password textfield to neobux login page
    driver.findElement({xpath: constants.loginPagePasswordField}).sendKeys(constants.passwordInput);

    driver.sleep(10000);

    // click neobux login button
    driver.findElement({xpath: constants.loginPageLoginButton}).click();

    // check if login was successful
    driver.findElement({xpath: constants.userPageLoginButton}).then(() => {
        console.log('Login successful');
        goToAdsPage();
    }, (err) => {
        if (err) {
            console.log('Login failed!');
        }
    });

    driver.sleep(5000); // wait 5 sec to login
}

function goToAdsPage() {
    driver.findElement({xpath: constants.userAdvertisementsPage}).then((adsButton) => {
        adsButton.getText().then((adsButtonText) => {
            if (adsButtonText === 'View Advertisements') { // check if button.text() is equals to 'View Advertisements'
                adsButton.click();
                ads();
            } else {
                driver.findElement({ xpath: constants.advertisementsPage }).then((adsButton2) => {
                    adsButton2.getText().then((adsButton2Text) => {
                        if (adsButton2Text === 'View Advertisements') {
                            adsButton2.click();
                            console.log(`There is no ads. I will try again after 3 hours.`);
                            setTimeout(() => {
                                ads();
                            }, 10800000); // wait 3 hours and try to find ads again
                        } else {
                            console.log(`Can't find View Advertisements button!`); // wait 3 hours if there is no ads and the try again
                        }
                    })
                });
            }
        });
    }, (err) => {
        if (err) console.log(`Can't find advertisements button!`)
    });
}

function ads() {
    driver.sleep(5000); // wait 5 sec browser to load

    nextAd(currentAdvertise);
    function nextAd(currentAdvertise) {
        driver.findElement({xpath: `//*[@id="tga_${currentAdvertise}"]`}).then((advertise) => { // Get advertisement
            advertise.getCssValue('color').then((isActive) => { // Get advertise color
                if (isActive === constants.activeAdColor) { // Check if advertise is active

                    advertise.click(); // Click on active advertise

                    advertise.findElement({xpath: `//*[@id="i${currentAdvertise}"]`}).then((dot) => { // Get dot
                        dot.click(); // click the dot

                        driver.getAllWindowHandles().then((handles) => { // handle new window
                            driver.switchTo().window(handles[1]).then(() => { // switch to new window
                                driver.sleep(20000);

                                driver.findElement({ xpath: constants.advertiseCloseButton }).then((inAdvertise) => { // find close button
                                    inAdvertise.click(); // click close button
                                    driver.switchTo().window(handles[0]); // switch to main window
                                    console.log(`Get add No. ${currentAdvertise}`);
                                }, (err) => {
                                    if (err) {
                                        console.log('There is no close button in advertise!');
                                        driver.close();
                                        driver.switchTo().window(handles[0]); // switch to main window
                                        ads();
                                    }
                                })
                            });
                        });
                    });
                    currentAdvertise++;
                    nextAd(currentAdvertise);

                } else {
                    currentAdvertise++;
                    nextAd(currentAdvertise);
                }
            });
        }, (err) => {
            if (err) {
                currentAdvertise = 1;
                console.log('All advertisements are clicked!');
                prize();
            }
        });
    }
}

function prize() {
    console.log('prize called');

    driver.sleep(2000);

    driver.findElement( {xpath: constants.userAdPrizeButton} ).then((adPrize) => { // find AdPrize button
        adPrize.click(); // click Prize button
        driver.getAllWindowHandles().then((handles) => { driver.switchTo().window(handles[1]); }); // switch to new window
        nextPrize(); // call nextPrize()
    }, (err) => {
        if (err) {
            driver.findElement({ xpath: constants.userAdPrizeZero} ).then(() => {
                console.log(`All AdPrize is clicked!`);
                console.log('Wait 2h to next mining!');
                quit(7200000);
            });
        }
    });
}

function nextPrize() {
    driver.sleep(13000); // loading ad

    driver.findElement({xpath: constants.adPrizeNextButton}).then((inAdvertise) => { // find button next
        inAdvertise.click().then(() => { // click button next
            nextPrize();
        }, (err) => {
            if (err) console.log(`Can't click next button`);
            console.log('There is no next button. Close window and call prize()');
            driver.close().then((main) => {
                driver.getAllWindowHandles().then((handles) => {
                    driver.switchTo().window(handles[0]);
                    console.log('Switch to main page and call prize()');
                    prize();
                });
            })
        });
    }, (err) => {
        if (err) {
            console.log('There is no next button. Close window and call prize()');
            driver.close().then((main) => {
                driver.getAllWindowHandles().then((handles) => {
                    driver.switchTo().window(handles[0]);
                    console.log('Switch to main page and call prize()');
                    prize();
                });
            }, (err) => {
                if (err) console.log(`Can't close current window and call prize()!`)
            });
        }
    })
}

function quit(time) {
    driver.quit();
    console.log('Next mining after: ' + ((time / 1000) / 60) + ' minutes.');
    setTimeout(() => {
        start();
    }, time); // wait 2 hours to next mining
}