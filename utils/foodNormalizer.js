var fs = require('fs');

fs.readFile('feed.txt', (err, data) => {
    data = JSON.parse(data.toString())
    data = data.map(item => {
        data = {}
        data.name = item.name
        data.calories = +item.data.calories.replace(/[^\d.-]/g, '')
        data.carbohydrate = +item.data.carbohydrate.replace(/[^\d.-]/g, '')
        data.protein = +item.data.protein.replace(/[^\d.-]/g, '')
        data.fat = +item.data.fat.replace(/[^\d.-]/g, '')
        data.fibre = +item.data.fibre.replace(/[^\d.-]/g, '')
        return data
    })
    fs.writeFile('food.txt', JSON.stringify(data),(err, content) => {
        if (err) {
            return console.log(err);
        }
        console.log(data);
    })
})