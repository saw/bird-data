var app;

function homePage(req, res, next) {
    res.render('index');
}

module.exports = function(thisapp) {
    app = thisapp;
    
    app.get('/', homePage);
    
}