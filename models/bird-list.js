var fs = require('fs');

var birds = fs.readFileSync(__dirname + '/../cleanlist.csv', 'UTF-8');

var birdList = birds.split(/\n/);

var birdArr = [];

var len = birdList.length;

var thisBird = [];
for (var i=0; i < len; i++) {
    thisBird = birdList[i].split(',');
    
    birdArr.push({latin:thisBird[0], path:'/bird/' +thisBird[1], name:thisBird[1].replace('_', ' ')});
}

exports.birdList = birdArr;

