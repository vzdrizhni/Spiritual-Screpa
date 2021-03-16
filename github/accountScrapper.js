const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });

        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            await newPage.setCookie(cookies.cookie)
            dataObj.name = await newPage.$eval('#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > div.vcard-names-container.float-left.col-10.col-md-12.pt-1.pt-md-3.pb-1.pb-md-3.js-sticky.js-user-profile-sticky-fields > h1 > span.p-name.vcard-fullname.d-block.overflow-hidden', text => text.textContent);
            try {
                dataObj.email = await newPage.$eval('.vcard-details > li[itemprop="email"] > .u-email', text => text.textContent)
            } catch (error) {
                dataObj.email = ''
            }
            resolve(dataObj);
            await newPage.close();
        });

        const scrapedData = []

        for (link in results) {
            console.log(results[link]);
            let currentPageData = await pagePromise(results[link].profileUrl);
            scrapedData.push(currentPageData);
            console.log(currentPageData);
        }
    });