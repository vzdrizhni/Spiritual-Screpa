var fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');

const dataToWrite = fs.readFile('feed.txt', async function (err, contents) {
    
    var array = contents.toString().split("\n");

    const parsedArr = JSON.parse(array);
    
    const csv = new ObjectsToCsv(parsedArr);
    
    // Save to file:
    await csv.toDisk('./test.csv');
   
});
