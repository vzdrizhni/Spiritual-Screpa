const scraperObject = {
    url: 'https://www.weightlossresources.co.uk/calories/calorie_counter/vegetables.htm',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('article');
        // Get the link to all the required books
        let obj = {};
        let fruits = await page.$$eval('.maincontent > h2', (headers) => {
            return headers.map(item => item.innerText);
        });

        fruits = fruits.filter(elem => elem != "Can't Find What You're Looking For?").filter(elem => elem != 'How do You Keep Track?');

        fruits.forEach(async(item, index) => {
            obj[item] = await page.$$eval(`.col_50_50:nth-of-type(${index + 1}) tbody tr`, (nutrients) => {
                return nutrients;
            })
        });

        console.log(fruits.length);
        console.log(obj);    
       
    }
    
}

module.exports = scraperObject;