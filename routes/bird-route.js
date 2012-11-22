var app;
var wiki = require('../models/wiki.js');

function birdPage(req, res, next) {
    
    wiki.getArticle(req.params.name).then(
        function(resp) {
            
            resp.content = '<p>' + resp.content + '</p>';
            resp.content = resp.content.replace(/\n/g, '</p><p>');
            
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