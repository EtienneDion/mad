'use strict';

var express = require('express');
// var formidable = require('formidable');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
var fs = require('fs')
, util = require('util')
, path = require('path');

var consolidate = require('consolidate');

app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', './app/templates');

app.configure(function() {
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: './tmp/upload' }));
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);

    // use livereload middleware
    app.use(require('grunt-contrib-livereload/lib/utils').livereloadSnippet);

});


app.get('/', function(req, res){
	res.render('index', {greeting: 'bonjour'});
	// res.render('hello', {greeting: 'bonjour'});
});

app.get('/upload', function(req, res){
    res.render('upload');
});


app.configure('development', function(){
    app.use(express.errorHandler());
});


app.post('/upload', function(req, res, next){

    console.log(req.files.displayImage.path);


    fs.readFile(req.files.displayImage.path, function (err, data) {

        var newPath = path.resolve(__dirname + "/../upload/" + req.files.displayImage.path);
        console.log(newPath);





        imageMagick(req.files.displayImage.path)
            .resize(200, 200)
            .write(newPath, function (err) {
                if (!err) {
                    console.log(' hooray! ');

                    console.log('-> upload done', err);
                    res.set('Content-Type', 'text/html');
                    res.send(200);
                };
            });



    });

});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

exports = module.exports = server;

exports.use = function() {
	app.use.apply(app, arguments);
};