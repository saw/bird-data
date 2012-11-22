"use strict";
var fs = require('fs');


module.exports = function(app) {

    var dir = fs.readdirSync(__dirname);

    dir.forEach(function(file) {
        if(file.match(/.+\-route\.js/)) {
            require(__dirname + '/' +file)(app);
        }
    })

    
}