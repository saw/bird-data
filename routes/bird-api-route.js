var jsdom = require("jsdom");

var cache = {}, app;

var index = function(req, res){
    
    var bird = req.params.bird;

    
    if(cache[bird]) {
        res.end(JSON.stringify(cache[bird]));
    }else {
        jsdom.env(
          "http://en.wikipedia.org/wiki/" + bird,
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {

              var out = '';
              var text = window.$('#mw-content-text p').each(function(index, el){
                 out += window.$(el).html().replace(/\"\/wiki\//g, '"http://en.wikipedia.org/wiki/') + '\n'; 
              });
              res.set('Content-Type', 'text/plain');
              var outData = {
                  name:bird.replace(/_/g, ' '),
                  content:out
              };
              res.end(JSON.stringify(outData));
              cache[bird] = outData;
          }
        );
    } 
};

module.exports = function(myapp) {
    app = myapp;
    
    app.get('/api/:bird', index);
}
