fs = require('fs');

const scraperObject = {
    url: 'https://www.weightlossresources.co.uk/calories/calorie_counter/vegetables.htm',
    anotherUrl: 'https://tools.myfooddata.com/nutrient-ranking-tool/Calories/All/Highest/100g/Common/No',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('article');
        // Get the link to all the required books

        food = [];
        let result;
        let fruits = await page.$$eval('.maincontent > h2', (headers) => {
            return headers.map(item => item.innerText);
        });

        fruits = fruits.filter(elem => elem != "Can't Find What You're Looking For?").filter(elem => elem != 'How do You Keep Track?');

        relult = await Promise.all(fruits.map(async (item, index) => {
            let obj = {};
            obj.name = item;
            obj.data = await page.$eval(`.col_50_50:nth-of-type(${index + 1}) tbody`, async (nutrients) => {
                // const r = /\B\s+|\s+\B/g;                
                // await nutrients.innerText.split(" ").map(nut => nuts[nut.split(" ")[0]] = nut.split(" ")[1]);
                let nuts = nutrients.textContent.replace(/^\s+|\s+$|\s+(?=\s)/g, "").split(/[\s,]+/);
                return {
                    calories: parseFloat(nuts[1].replace(/[^\d.-]/g, '')),
                    carbohydrate: parseFloat(nuts[3].replace(/[^\d.-]/g, '')),
                    protein: parseFloat(nuts[5].replace(/[^\d.-]/g, '')),
                    fat: parseFloat(nuts[7].replace(/[^\d.-]/g, '')),
                    fibre: parseFloat(nuts[9].replace(/[^\d.-]/g, ''))
                }
            });
            food.push(obj);
        }))

        // console.log(fruits);
        // console.log(food);
        fs.writeFile('vegetables.txt', JSON.stringify(food), function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data);
        });
    },
    async hugeScrapper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.anotherUrl}...`);
        await page.goto(this.anotherUrl);
        await page.waitForSelector('#foodlistranking');

        await page.$eval('#datasourcenr',
            e => {
                e.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            })
        await page.waitFor(3000);
        await page.click('.nrbutton');
        await page.waitFor(3000);
        let urls = await page.$$eval('#foodlistranking > li', links => {
            links = links.map(el => el.querySelector('div > a').href)
            return links;
        })
        console.log(urls);

        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            dataObj.name = await newPage.$eval('#nutritionfactsresults > h1', text => text.textContent),
            dataObj.data = {
                calories: await newPage.$eval('#summaryData > div.summaryDataWrap > ul:nth-child(1) > li:nth-child(1) > span.mainNum', text => text.textContent),
                carbohydrate: await newPage.$eval('#summaryData > div.summaryDataWrap > ul:nth-child(1) > li:nth-child(4) > span.mainNum', text => text.textContent),
                protein: await newPage.$eval('#summaryData > div.summaryDataWrap > ul:nth-child(1) > li:nth-child(2) > span.mainNum', text => text.textContent),
                fat: await newPage.$eval('#summaryData > div.summaryDataWrap > ul:nth-child(1) > li:nth-child(3) > span.mainNum', text => text.textContent),
                fibre: await newPage.$eval('#summaryData > div.summaryDataWrap > ul:nth-child(2) > li:nth-child(1) > span.mainNum', text => text.textContent)
            }
            resolve(dataObj);
            await newPage.close();
        });

        urls = urls.map(item => item.substr(0, item.lastIndexOf("/")).concat("/100g"));

        const scrapedData = []

        for (link in urls) {
            let currentPageData = await pagePromise(urls[link]);
            scrapedData.push(currentPageData);
            console.log(currentPageData);
        }

        fs.writeFile('food.txt', JSON.stringify(scrapedData), function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data);
        });

    }

}

module.exports = scraperObject;