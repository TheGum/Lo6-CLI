let driver = module.require('./../config/selenium');

module.exports = {
    AdPrize: (req, res) => {
        // open neobux advertisements page
        driver.findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[3]/td/table/tbody/tr/td[3]/a'}).click();
        driver.sleep(5000);

        res.render('home/profile');

        driver
          .findElement({ xpath: '//*[@id="ap_hct"]' }) // AdPrize button
          .then((adPrize) => {
              adPrize.click();

              driver.sleep(10000); // waiting AdPrize to loading
              driver
                  .findElement({ xpath: '//*[@id="nxt_bt_a"]'})
                  .then((nextButton) => {
                    nextButton.click();
              }, (err) => {
                  if (err) console.log(`Can't find or click AdPrize next button!`)
              })



          }, (err) => {
            if (err) console.log(`Can't get the AdPrize!`)
          })

    },
    Advertisements: (req, res) => {
        // open neobux advertisements page
        driver
            .findElement({ xpath: '/html/body/div[1]/div[1]/table/tbody/tr[3]/td/table/tbody/tr/td[3]/a'})
            .click();
        driver.sleep(5000); // waiting for loading ads

        // Loop all ads
        for (let i = 1; i <= 20; i++) { // this '20' need to be number of purple ads
            res.render('home/profile');
            driver
                .findElement({ xpath: `//*[@id="desc_${i}"]` }) // Get advertisement
                .then((element) => {
                    element.click(); // click on advertisement

                element
                    .findElement({ xpath: `//*[@id="i${i}"]` }) // Get dot
                    .then((dot) => {
                        dot.click(); // click the dot

                        driver.getAllWindowHandles().then((handles) => { // handle new window
                            driver.switchTo().window(handles[1]).then(() => { // switch to new window
                                driver.sleep(20000); // loading ad

                                driver // find close button
                                    .findElement({ xpath: '//*[@id="o1"]/tbody/tr[1]/td[2]/table/tbody/tr/td[2]/a'})
                                    .then((inAdvertise) => {
                                        inAdvertise.click(); // click close button
                                        driver.switchTo().window(handles[0]); // switch to main window
                                    }, (err) => {
                                        if (err) {
                                            driver.sleep(5000); // if there is no close button wait 5 sec
                                            driver // another try to find close button
                                                .findElement({ xpath: '//*[@id="o1"]/tbody/tr[1]/td[2]/table/tbody/tr/td[2]/a'})
                                                .click(); // click close button
                                            driver.switchTo().window(handles[0]); // switch to main window
                                        }
                                    })
                            });
                        });
                    }, (err) => {
                        if (err) console.log(`Can't find or click the dot.`);
                    })
            }, (err) => {
                if (err) console.log(`Can't find or click the advertisement!`);
            });
        }

    }
};