// /server.js
'use strict';


// Load packages ---------------------------------------------------------------
require('dotenv').load();
var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser  = require('body-parser');
var http = require('http').createServer(app);
var https = require('https');
var io = require('socket.io')(http);
var morgan = require('morgan');
var bl = require('bl');
require('dotenv').load();


// Setup node/express app ------------------------------------------------------
var routes = require('./app/index.js');
var port = process.env.PORT || 8080;
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
}));


// Setup Express routes --------------------------------------------------------
//routes(app, https, bl);
routes(app, https, bl);


// Other routes ----------------------------------------------------------------
app.use('/view', express.static(process.cwd() + '/view'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/controller', express.static(process.cwd() + '/app/controller'));
app.use('/libraries', express.static(process.cwd() + '/app/libraries'));


// Set up socket connection ----------------------------------------------------
var currInformation = [];
io.on('connection', function(socket) {
  // Send out the current stock JSON for every new connection
  socket.emit('connection', currInformation);

  // Handle requests to add stock
  socket.on('add-stock', function(addData) {
    currInformation = addData;  // cache the most upto data information
    io.emit('add-stock', currInformation); // emit to everyone, including sender
  });

  // Handle user disconnection
  socket.on('disconnect', function() {
  });
});


// Start server ----------------------------------------------------------------
http.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});


// EOF -------------------------------------------------------------------------
