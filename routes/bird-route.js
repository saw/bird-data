var app;
var wiki = require('../models/wiki.js');

var idMap = {};

function birdPage(req, res, next) {
    
    console.time('load bird');
    var birdId;
    console.time('getid');
    var birdId = idMap[req.params.name];
    if(!birdId) {
        for (var i=0; i < req.birdList.length; i++) {
            if(req.birdList[i].name == req.params.name.replace('_',' ' )) {
                birdId = i;
                idMap[req.params.name] = i;
            }
        }
    }
    console.timeEnd('getid');
    
    if(!birdId) {
        next();
        return;
    }
    
    wiki.getArticle(req.params.name).then(
        function(resp) {
            resp.content = '<p>' + resp.content + '</p>';
            resp.content = resp.content.replace(/\n/g, '</p><p>');
            resp.birdId = birdId;
            res.render('bird', resp);
            resp.content = 'mom';
            console.timeEnd('load bird');
        },
        function(err) {
            res.end('error');
        }
    );
    
}

module.exports = function(thisapp) {
    app = thisapp;
    
    app.get('/bird/:name', birdPage);
    
}