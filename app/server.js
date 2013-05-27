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

app.configure('development', function(){
    app.use(express.errorHandler());
});


app.get('/', function(req, res){
	res.render('index', {greeting: 'bonjour'});
	// res.render('hello', {greeting: 'bonjour'});
});

app.get('/upload', function(req, res){
    res.render('upload');
});

app.get('/draw', function(req, res){
    res.render('draw');
});



app.post('/upload', function(req, res, next){

    var apath = req.files.displayImage.path;
    fs.readFile(apath, function (err, data) {
        console.log(apath);
        var pathArray = apath.split(path.sep);
        console.log(pathArray);
        console.log(pathArray[pathArray.length - 1]);
        var newPath = path.resolve(__dirname + "/../public/upload/" + pathArray[pathArray.length - 1]);
        console.log(newPath);

        imageMagick(apath)
            .resize(400, 400)
            .write(newPath, function (err) {
                if (!err) {
                    console.log(' hooray! ');

                    console.log('-> upload done', err);
                    res.set('Content-Type', 'application/json');

                    res.send(200, JSON.stringify({ path: "upload/"+ pathArray[pathArray.length - 1] }));
                } else {
                    console.log('err', err);
                    res.set('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({ error: err }));
                }
            });



    });

});

app.get('/crop', function(req, res, next){
    console.log(req.query.image, req.query.zone);
    var imagePath = req.query.image;
    var zone =  req.query.zone;
    var filename = imagePath.replace(/^upload\//,"");
    var base64Data = zone.replace(/^data:image\/png;base64,/,"");
    var pngfilename =  filename.replace(/.jpg/,".png");
    console.log(pngfilename);
    var zonePathResolved = path.resolve(__dirname + "/../tmp/zone/"+pngfilename);
    var newPath =  __dirname + "/../public/cropped/" + pngfilename;
    var newPathResolved = path.resolve(newPath);
    var imagePathResolved = path.resolve(__dirname + "/../public/" + imagePath);
    fs.writeFile(zonePathResolved, base64Data, 'base64', function(err) {
        if(!err){
            console.log("cropped");

            console.log(imagePathResolved, zonePathResolved, newPathResolved);


            imageMagick(imagePathResolved)
                .mask(zonePathResolved)
                .compose("Subtract")
                .write(newPathResolved, function (err){
                    if(!err){
                        console.log("masqued");
                        res.set('Content-Type', 'application/json');
                        res.send(200, JSON.stringify({ path: "/cropped/" + filename }));
                    } else {
                        console.log(err);
                        res.set('Content-Type', 'application/json');
                        res.send(500, JSON.stringify({ error: err, step:"masqued" }));
                    }
                });
        } else {
            res.set('Content-Type', 'application/json');
            res.send(500, JSON.stringify({ error: err, step: "cropped" }));
        }
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