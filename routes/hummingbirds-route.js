var app;
var wiki = require('../models/wiki.js');
var fs = require('fs');
var async = require('async');
var idMap = {};

var Flickr = require('flickr-with-uploads').Flickr;


var photoCache = {};

function render(req, res, data) {
	if(req.query.data == 1) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.end(JSON.stringify(data));
		return;
	}
	res.render('bird', data);
}

var client = new Flickr('b04fabc8322a5f5f45f5b172c9c176fd', 'aa4a2055a2cdd145');
function api(method_name, data, callback) {
  // overloaded as (method_name, data, callback)
  return client.createRequest(method_name, data, true, callback).send();
}

var birdList = [
"Allen's hummingbird",
"Anna's hummingbird",
"Black-chinned hummingbird",

"Calliope hummingbird",
"Costa's hummingbird",
"Rufous Hummingbird"
];

function birdPage(req, res, next) {
	
	var birds = [];

	var q = async.queue(function(thisBird, callback) {
		api('flickr.photos.search', {text: thisBird, per_page:3, extras:'url_z,path_alias,url_q,owner_name', license:5}, function (err, response) {
			if(response.photos) {

				photos = response.photos.photo;
				birds.push({
					name:thisBird,
					photo:photos[0]
				});
				console.log(photos[0])
				callback(true);
			}else {
				callback(null);
			}
		});
		
	}, 12);
	
	q.drain = function(){
		res.render('hummingbirds', {birds:birds});
	};
	
	for (var i=0; i < birdList.length; i++) {
	    q.push(birdList[i], function(err) {
	        if(err) {
	            console.log(err);
	        }
	    });

	}
	
}

module.exports = function(thisapp) {
	app = thisapp;
	
	app.get('/hummingbirds', birdPage);
	
}