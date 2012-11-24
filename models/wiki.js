var Promise = require('rsvp').Promise;
var cache = {};
var jsdom = require("jsdom");

function getArticle(name) {
    var promise = new Promise();

    if(cache[name]) {
        if(cache[name] == 'fail'){
            process.nextTick(function(){
                promise.reject('404');
            });
            
            return promise;
        }
        var out = cache[name];
        process.nextTick(function(){
            promise.resolve(out);
        });
        return promise;
    }else {
        jsdom.env(
          "http://en.wikipedia.org/wiki/" + name,
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
              if(errors) {
                  console.log('errors', errors)
              }
              var out = '';
              var text = window.$('#mw-content-text p').each(function(index, el){
                 out += window.$(el).html().replace(/\"\/wiki\//g, '"http://en.wikipedia.org/wiki/') + '\n'; 
              });
              
              if(out == '') {
                  promise.reject('No content');
                  cache[name] = 'fail';
                  return;
              }

              var outData = {
                  name:name.replace(/_/g, ' '),
                  content:out
              };
              
              promise.resolve(outData);
              cache[name] = outData;
          }
        );
        return promise;
    }
    
}

exports.getArticle = getArticle;