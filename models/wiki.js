var Promise = require('rsvp').Promise;
var fs = require('fs');
var cache = {};
var jsdom = require("jsdom");

function getArticle(name) {
    var promise = new Promise();

		// fs.readFile(__dirname + '/../articles/ipsum', 'UTF-8', function(err, data) {
		// 	promise.resolve({name:'Domestic Chicken', content:data});
		// });
		// 	
		// 	 return promise;
    if(cache[name]) {
        if(cache[name] == 'fail'){
            process.nextTick(function(){
                promise.reject('404');
            });
            
            return promise;
        }
        var out = cache[name];
        process.nextTick(function(){
			
            promise.resolve(JSON.parse(JSON.stringify(out)));
        });
        return promise;
    }else {
          
          fs.readFile(__dirname + '/../articles/' + name, 'UTF-8', function(err, data) {
              if(err) {
                  promise.reject(err);
              } else {
                  var outData = {
                      name:name.replace(/_/g, ' '),
                      content:data
                  };
                  
                  cache[name] = outData;
                  promise.resolve(JSON.parse(JSON.stringify(outData)));
              }
          });

        return promise;
    }
    
}

exports.getArticle = getArticle;
