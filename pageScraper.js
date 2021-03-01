fs = require('fs');

const scraperObject = {
    url: 'https://www.weightlossresources.co.uk/calories/calorie_counter/vegetables.htm',
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
    }

}

module.exports = scraperObject;