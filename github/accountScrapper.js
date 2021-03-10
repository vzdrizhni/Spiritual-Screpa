const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);        
        (async() => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            results.map(link => {
                dataObj = {}
                page.goto(link.profileUrl)
            })        
            await browser.close();
        })();
    });
