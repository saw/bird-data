var app;
var wiki = require('../models/wiki.js');
var fs = require('fs');
var idMap = {};

var Flickr = require('flickr-with-uploads').Flickr;


var photoCache = {};

function render(req, res, data) {
	
	if(req.query.data == 1) {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.end(JSON.stringify(data));
		return;
	}
	
	if(req.query.frag == 1) {
		data.frag = true;
	}
	res.render('bird', data);
}

var client = new Flickr('b04fabc8322a5f5f45f5b172c9c176fd', 'aa4a2055a2cdd145');
function api(method_name, data, callback) {
  // overloaded as (method_name, data, callback)
  return client.createRequest(method_name, data, true, callback).send();
}

function birdPage(req, res, nextr) {
	console.log('birdpage');
	var words = false, photos = false, data = {id:req.params.name};
	console.log(req.params);
	console.time('load bird');
	var birdId;
	console.time('getid');
	var birdId = idMap[req.params.name];
	if(!birdId) {
		for (var i=0; i < req.birdList.length; i++) {
			if(req.birdList[i].name == req.params.name.replace('_',' ' )) {
				birdId = i;
				idMap[req.params.name] = i;
			}
		}
	}
	console.timeEnd('getid');
	console.log('this', req.params.name);
	var next = req.birdList[birdId + 1], prev = req.birdList[birdId -1];

	if(!birdId) {
		nextr();
		return;
	}
	data.next = next;
	data.prev = prev;
	
	if(photoCache[req.params.name]) {
		
		data.photo = photoCache[req.params.name];
		
		photos = data.photo;
		if(words && photos) {
			render(req, res, data);
		}
		
	} else {
		api('flickr.photos.search', {text: req.params.name, per_page:3, extras:'url_z'}, function (err, response) {
			if(response.photos) {
				photos = response.photos.photo;
				data.photo = photos[1];
				photoCache[req.params.name] = data.photo;
			}else {
				photos = true;
				 photoCache[req.params.name] = true;
			}
			if(words && photos) {
				render(req, res, data);
			}
		});
	}
	
	wiki.getArticle(req.params.name).then(
		function(resp) {
			resp.content = '<p>' + resp.content + '</p>';
			resp.content = resp.content.replace(/\n/g, '</p><p>');
			data.birdId = birdId;
			data.words = resp;
			words = true;
			if(words && photos) {
				render(req, res, data);
			}
		},
		function(err) {
			console.log(err);
			res.end('Could not fetch wikipedia article, logging error and moving on :(');
			fs.appendFile(__dirname + '/../errors.txt', req.params.name + ',');
		}
	);
	
}

module.exports = function(thisapp) {
	app = thisapp;
	app.get('/bird/:name', birdPage);

	
}