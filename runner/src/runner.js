var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Settings
let firefoxOptions = new firefox.Options();
firefoxOptions.windowSize({ width: 300, height: 400 });
let chromeOptions = new chrome.Options();
chromeOptions.windowSize({ width: 800, height: 600 });

module.exports = {
    run: async function(run) {
        var outputSteps = [];
        // Load webdriver
        var driver = new webdriver.Builder()
            .setFirefoxOptions(firefoxOptions)
            .setChromeOptions(chromeOptions)
            .withCapabilities({
                'browserstack.local': 'true',
                'browserstack.localIdentifier': 'uierRun'
            })
            .forBrowser('firefox')
            .build();
        // Navigate to start URL
        await driver.get(run.urlDomain + run.test.urlPath);
        // Loop over steps
        for (var i = 0; i < run.test.steps.length; i++) {
            // Start
            var step = run.test.steps[i];
            // Log
            console.log(i, step.command);
            // Process commands
            try {
                if (step.command == "navigate") {
                    await driver.get(step.value);
                }
                if (step.command == "click") {
                    await driver.findElement(getLocator(step.target)).click();
                }
                if (step.command == "clickText") {
                    await driver.findElement(getLocator(step.target)).click();
                }
                if (step.command == "input") {
                    await driver.findElement(getLocator(step.target)).sendKeys(step.value);
                }
                if (step.command == "assertTitle") {
                    var title = await driver.getTitle();
                    if (!title.includes(step.value)) {
                        throw "Text not found in title:\n" + title;
                    }
                }
                // Mark step as passed
                step.passed = true;
            } catch (error) {
                step.error = error.toString();
            }
            // Pause until next step
            await driver.sleep(1000);
            // Take screenshot
            step.screenshot = await driver.takeScreenshot();
            // Output results
            outputSteps.push(step);
            // If there was an error, exit
            if (step.error) {
                console.log("ERROR", step.error);
                return await exit({ status: "fail" });
            }
            // If this was the last step, exit
            if (i + 1 == run.test.steps.length) {
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

        function getLocator(target) {
            var element = {};
            element[target.type] = target.query;
            return element;
        }
    }
}