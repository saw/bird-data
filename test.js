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

var foo = 2;

switch (foo) {
    case 1:
        console.log(1);
    case 2: 
        console.log(2);
    case 3: 
        console.log(3);
        break;
    default: 
        console.log('default');
}