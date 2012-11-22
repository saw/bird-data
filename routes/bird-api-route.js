
var wiki = require("../models/wiki");

var cache = {}, app;

var index = function(req, res){
    
    var bird = req.params.bird;
    wiki.getArticle(bird).then(function(resp){
        res.set('Content-Type', 'text/plain');
        res.end(JSON.stringify(resp));
    })

};

module.exports = function(myapp) {
    app = myapp;
    
    app.get('/api/:bird', index);
}
