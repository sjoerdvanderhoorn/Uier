var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Settings
let firefoxOptions = new firefox.Options();
firefoxOptions.windowSize({width: 300, height: 400});
let chromeOptions = new chrome.Options();
chromeOptions.windowSize({width: 800, height: 600});

// Load webdriver
var driver = new webdriver.Builder()
    .setFirefoxOptions(firefoxOptions)
    .setChromeOptions(chromeOptions)
    .withCapabilities({
        'browserstack.local' : 'true',
        'browserstack.localIdentifier' : 'Test123'
    })
    .forBrowser('chrome')
    .build();

// Start test
driver.get('https://www.google.com/').then(function()
{
    // Enter a search query
    driver.findElement(webdriver.By.name('q')).sendKeys('selenium');
}).then(function(){ 
    // Click the Search button
    driver.findElement(webdriver.By.name("btnK")).click();
}).then(async function ()
{
    // Wait for page to update
    // https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html
    await driver.wait(webdriver.until.elementLocated(webdriver.By.id('bcenter')), 10000, 'Could not locate the child element within the time specified');
}).then(function()
{
    // Get the title
    return driver.getTitle();
}).then(function(title)
{
    // Display the title
    console.log(title);
}).then(function(){ 
    // Done
    driver.quit();
}).catch(function(error){
    console.log("error", error);
});