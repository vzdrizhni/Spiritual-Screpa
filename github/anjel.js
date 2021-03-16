const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

const Url = 'https://angel.co/company/linkedin/funding'

const results = [];

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
    const page = await browser.newPage();
    await page.goto(Url);
    await page.waitForSelector('#main > div.styles_component__H_9p2 > div > div > div > div > div > div > div.styles_profile__4BhYC > div > div > div.styles_component__2_Il9');
    await page.$eval('#main > div.styles_component__H_9p2 > div > div > div > div > div > div > div.styles_profile__4BhYC > div > div > div.styles_component__2_Il9 > button',
    e => {
        e.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    })
    await browser.close();
})();