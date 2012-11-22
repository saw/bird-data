
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , hbs = require('express-hbs')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('hbs', hbs.express3({defaultLayout:__dirname + '/views/layout.hbs', partialsDir: __dirname + '/views/partials'}));
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/api/:bird', routes.bird_api);

http.createServer(app).listen(1337);

console.log("Express server listening on port 3000");
