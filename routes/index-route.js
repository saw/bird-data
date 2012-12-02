var fs = require('fs');

var app;


function homePage(req, res, next) {
    res.render('index',{birds:req.birdList, list:JSON.stringify(req.birdList)});
}

module.exports = function(thisapp) {
    app = thisapp;
    
    app.get('/', homePage);
    
}