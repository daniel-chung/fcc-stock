// /app/index.js
'use strict';

// Set up ----------------------------------------------------------------------
var path = process.cwd();
var quandl_key = process.env.QUANDL_API_KEY;
var StockHandler = require(path + '/app/controller/stockController.server.js');


// Main index function ---------------------------------------------------------
module.exports = function (app, https, bl) {
  var stockHandler = new StockHandler(https, bl, quandl_key);

  // HOME PAGE (with login links) ----------------------------------------- //
  app.route('/')
    .get(function (req, res) {
      res.sendFile(path + '/view/index.html');
    });

	// API CALLS ------------------------------------------------------------ //
  app.route('/api/:stock')
    .get(function (req, res, next) {
        console.log('api route', req.url);
        next();
      },
      stockHandler.getPrices);

  // Tests ---------------------------------------------------------------- //
  /*var testJson = require(path + '/app/d3/data.json'); //(with path)
  app.route('/test')
    .get(function (req, res) {
      res.send("Test successful!");
    });

  app.route('/test/d3')
    .get(function (req, res) {
      res.sendFile(path + '/app/d3/d3_index.html');
    });

  app.route('/test/data')
    .get(function (req, res) {
      res.json(testJson);
    });
  */

};

// EOF -------------------------------------------------------------------------
