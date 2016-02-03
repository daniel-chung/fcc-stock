// /app/controller/stockController.server.js
'use strict';

// Main export class -----------------------------------------------------------
function StockHandler (https, bl, quandl_key) {

  // Test ----------------------------------------------------------------- //
  this.getTest = function (req, res) {
    res.send("test successful");
  };

  // Retrieve data -------------------------------------------------------- //
  this.getPrices = function (req, res) {
    var apiRoot = 'https://www.quandl.com/api/v3/datasets/WIKI/'
    var stock = req.params.stock;
    var apiOptions = '/data.json?start_date=2015-02-01&column_index=4&order=asc';
    var apiUri = apiRoot + stock + apiOptions + '&api_key=' + quandl_key;

    https.get(apiUri, function(r) {
      r.pipe(bl( function (err, data) {
        if (err)
          return console.error(err);
        var quandlResponse = data.toString('utf8');
        var qr = JSON.parse(quandlResponse);
        if (Object.keys(JSON.parse(quandlResponse)).indexOf("quandl_error") === -1) {
          var result = JSON.parse(quandlResponse).dataset_data.data;
          var jsonData = [];
          result.forEach( function(d) {
            var newObj = {};
            newObj.date = d[0];
            newObj[stock] = d[1];
            jsonData.push(newObj);
          });
          res.json(jsonData);
        }
        res.end();
      }));
    }).on('error', function(e) {
      console.error('e',e);
    });
  };

  // _Test Call API ------------------------------------------------------- //
  this.callApi = function (req, res) {
    console.log(req.body.stockName);
  };

}; // End StockHandler


// Export the handler class ----------------------------------------------------
module.exports = StockHandler;


// EOF -------------------------------------------------------------------------
