var fs = require('fs');

const dataToWrite = fs.readFile('feed.txt', function(err, contents) {
    console.log(contents);
    fs.writeFile('data.csv', contents, 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    });
});

// JSON.parse(dataToWrite);
// console.log(dataToWrite);

// fs.writeFile('data.csv', dataToWrite, 'utf8', function (err) {
//     if (err) {
//         console.log('Some error occured - file either not saved or corrupted file saved.');
//     } else {
//         console.log('It\'s saved!');
//     }
// });