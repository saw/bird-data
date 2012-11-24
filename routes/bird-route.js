var app;
var wiki = require('../models/wiki.js');

function birdPage(req, res, next) {
    
    
    var birdId;
    
    for (var i=0; i < req.birdList.length; i++) {
        if(req.birdList[i].name == req.params.name.replace('_',' ' )) {
            birdId = i;
        } else {
            console.log(req.birdList[i].path);
        }
    }
    
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