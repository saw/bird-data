console.time('Clean list');
var fs = require('fs');
var wiki = require(__dirname + '/models/wiki.js');
var birdList = require(__dirname + '/models/bird-list.js').birdList;
var async = require('async');

var loaded = {};

var taskList = [];
var out = [];

var q = async.queue(function(thisBird, callback) {
    if(!thisBird['name']){
        callback(null);
        return;
    }
    
    if(fs.existsSync('articles/' + thisBird['name'].replace(' ', '_'))){
        console.log(thisBird['name'] + ' already fetched.');
        if(!loaded[thisBird.name]){
            out.push(thisBird);
            loaded[thisBird.name] = true;
        }
        
        callback(null);
    }
    wiki.getArticle(thisBird['name'].replace(' ', '_')).then(
        function(resp){
            if(!loaded[thisBird.name]) {
                out.push(thisBird);
                loaded[thisBird.name] = true;
                fs.writeFile('articles/' + thisBird['name'].replace(' ','_'), resp.content);
            }
            callback(null);
            
        },
        function(err){
            console.log(thisBird['name'] + ' failed');
            callback(null);
        }
    );
}, 12);

for (var i=0; i < birdList.length; i++) {
    q.push(birdList[i], function(err) {
        if(err) {
            console.log(err);
        }
    });

}

q.drain = function(){
    
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
        console.timeEnd('Clean list');
    })
};