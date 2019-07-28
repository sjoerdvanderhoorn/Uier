var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Settings

let firefoxOptions = new firefox.Options();
firefoxOptions.windowSize({ width: 800, height: 600 });
const firefoxServiceBuilder = new firefox.ServiceBuilder(__dirname + "/../drivers/" + process.platform + "/geckodriver.exe");

let chromeOptions = new chrome.Options();
chromeOptions.windowSize({ width: 800, height: 600 });
chrome.setDefaultService(new chrome.ServiceBuilder(__dirname + "/../drivers/" + process.platform + "/chromedriver.exe").build());

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
            .forBrowser(run.browser)
            .setFirefoxService(firefoxServiceBuilder)
            .build();
        // Navigate to start URL
        await driver.get(run.urlDomain + run.urlPath);
        // Loop over steps
        for (var i = 0; i < run.steps.length; i++) {
            // Start
            var step = run.steps[i];
            // Log
            console.log(i, step.command);
            // Process commands
            try {
                if (step.command == "navigate") {
                    await driver.get(step.value);
                }
                if (step.command == "click") {
                    await driver.findElement(getLocator(step.target_type, step.target_query)).click();
                }
                if (step.command == "clickText") {
                    await driver.findElement(getLocator(step.target_type, step.target_query)).click();
                }
                if (step.command == "input") {
                    await driver.findElement(getLocator(step.target_type, step.target_query)).sendKeys(step.value);
                }
                if (step.command == "assertTitle") {
                    var title = await driver.getTitle();
                    if (!title.includes(step.value)) {
                        throw "Text not found in title:\n" + title;
                    }
                }
                if (step.command == "assertText") {
                    var html = await driver.executeScript("return document.body.innerText;");
                    if (!html.includes(step.value)) {
                        throw "Text not found in page.";
                    }
                }
                if (step.command == "assertValue") {
                    var value = await driver.findElement(getLocator(step.target_type, step.target_query)).getAttribute("value");
                    if (!value.includes(step.value)) {
                        throw "Text not found in field:\n" + value;
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
            if (i + 1 == run.steps.length) {
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

        function getLocator(target_type, target_query) {
            var element = {};
            element[target_type] = target_query;
            return element;
        }
    }
}