const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (data) => console.log(data))
    .on('end', () => {
        console.log(results);        
    });

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({
//         path: 'example.png'
//     });

//     await browser.close();
// })();