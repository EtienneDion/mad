var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('hola!');
});

console.log("express start");


module.exports = app;