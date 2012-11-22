var app;

function birdPage(req, res, next) {
    res.render('bird', {name: req.params.name});
}

module.exports = function(thisapp) {
    app = thisapp;
    
    app.get('/bird/:name', birdPage);
    
}