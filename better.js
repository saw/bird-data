var fs = require('fs');
var wiki = require(__dirname + '/models/wiki.js');
var birdList = require(__dirname + '/models/bird-list.js').birdList;
var async = require('async');

var taskList = [];
var out = [];

for (var i=0; i < 10; i++) {
    
    
    taskList.push(function(callback){
        var thisBird = birdList[i];
        return function(callback) {
            if(!thisBird['name']){
                callback(null);
                return;
            }
            wiki.getArticle(thisBird['name'].replace(' ', '_')).then(
                function(resp){
                    console.log(thisBird['name'] + ' ok.');
                    out.push(thisBird);
                    callback(null);
                },
                function(err){
                    console.log(thisBird['name'] + ' failed');
                    callback(null);
                }
            );
        }
    }())
}

async.series(taskList, function(err, results){
    
    //sort by name
    out = out.sort(function(a, b){
       if(a.name.toUpperCase() < b.name.toUpperCase()) {
           return -1;
       } 
       if(a.name.toUpperCase() > b.name.toUpperCase()) {
           return 1;
       }
       
       return 0;
    });
    
    var outArr = [];
    out.forEach(function(el, index, array) {
        outArr.push(el.latin + ',' + el.name.replace(' ', '_'));
    });
    
    fs.writeFile('cleanlist.csv', outArr.join("\n"), function(){
        console.log('Clean version written at cleanlist.csv');
    })
});