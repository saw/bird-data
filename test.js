// var http = require('http');
// 
// http.get("http://en.wikipedia.org/wiki/Ruffed_Grouse", function(res) {
// 	
// 	var data = '';
// 	console.log("Got response: " + res.statusCode);
// 	
// 	res.on('data', function (chunk) {
//     	data += chunk;
// 	});
// 	
// 	res.on('end', function(){
// 		console.log(data);
// 	});
// }).on('error', function(e) {
//   console.log("Got error: " + e.message);
// });
var jsdom = require("jsdom");

jsdom.env(
  "http://en.wikipedia.org/wiki/Ruffed_Grouse",
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
      
      var out = '';
      var text = window.$('#mw-content-text p').each(function(index, el){
         out += window.$(el).text() + '\n'; 
      });
      console.log(out);
      
  }
);