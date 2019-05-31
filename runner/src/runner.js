var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Settings
let firefoxOptions = new firefox.Options();
firefoxOptions.windowSize({ width: 300, height: 400 });
let chromeOptions = new chrome.Options();
chromeOptions.windowSize({ width: 800, height: 600 });

module.exports = {
    run: async function(test) {
        var outputSteps = [];
        // Load webdriver
        var driver = new webdriver.Builder()
            .setFirefoxOptions(firefoxOptions)
            .setChromeOptions(chromeOptions)
            .withCapabilities({
                'browserstack.local': 'true',
                'browserstack.localIdentifier': 'uierRun'
            })
            .forBrowser('chrome')
            .build();
        for (var i = 0; i < test.steps.length; i++) {
            // Start
            var step = test.steps[i];
            // Log
            console.log(i, step.command);
            // Take screenshot
            step.screenshot = await driver.takeScreenshot();
            // Process commands
            try {
                if (step.command == "navigate") {
                    await driver.get(step.value);
                }
                if (step.command == "click") {
                    await driver.findElement({ css: step.target }).click();
                }
                if (step.command == "clickText") {
                    await driver.findElement({ partialLinkText: step.target }).click();
                }
                if (step.command == "input") {
                    await driver.findElement({ css: step.target }).sendKeys(step.value);
                }
                if (step.command == "assertTitle") {
                    var title = await driver.getTitle();
                    if (title.includes(step.value)) {
                        console.log(true, title);
                    } else {
                        console.log(false, title);
                    }
                }
                if (step.command == "assertText") {
                    var title = await driver.getTitle();
                    if (title.includes(step.value)) {
                        console.log(true, title);
                    } else {
                        console.log(false, title);
                    }
                }
                // Mark step as passed
                step.passed = true;
            } catch (error) {
                step.error = error.toString();
            }
            // Output results
            outputSteps.push(step);
            // Pause until next step
            await driver.sleep(1000);
            // If there was an error, exit
            if (step.error) {
                console.log("ERROR", step.error);
                return await exit({ status: "fail" });
            }
            // If this was the last step, exit
            if (i + 1 == test.steps.length) {
                console.log("DONE");
                return await exit({ status: "pass" });
            }
        }

        async function exit(results) {
            // Test done, close
            await driver.quit();
            // Return results
            results.steps = outputSteps;
            return await results;
        }
    }
}