// /app/controller/stockController.client.js
'use strict';

$(document).ready( function() {

// Set global variables --------------------------------------------------------
  var stockData = [];
  var socket = io();


// Create helper functions -------------------------------------------------------

  // Function to add/remove buttons
  function addButton(ticker) {
    $("#stock-buttons").append(
      '<button class="btn-tick-'+ticker+' btn-stock">' + ticker + "</button>");
  }
  function removeButton(ticker) {
    $("#stock-buttons").children(".btn-tick-"+ticker).remove();
  }

  // Function to add values
  function createStockObj(apiData, stockName, dataArr) {
    return {
      name: stockName,
      values: apiData.map(function(e){
        return {date: e.date, close: e[stockName]};
      })
    };
  };

  function addValue(apiData, stockName, dataArr) {
    if (apiData.length === 0)
      dataArr = [createStockObj(apiData, stockName, dataArr)];
    else
      dataArr.push(createStockObj(apiData, stockName, dataArr));
    return dataArr;
  };


// Listeners for website interaction -------------------------------------------

  // Controller for submiting form to add stocks
  $('#add-stock-form-btn').click(function(e) {
    e.preventDefault();   // Don't refresh
    var ticker = $('form').serializeArray()[0].value;
    $.get('/api/' + ticker, function (data) {
      stockData = addValue(data, ticker, stockData);
      socket.emit('add-stock', stockData);
    }, 'json');
    $(this).closest('form').find("input[type=text], textarea").val("");
  });

  // Controller for removing stocks after a button press
  $(document).on('click', '.btn-stock', function(){
    var ticker = /btn-tick-(\w+)\b/.exec($(this).attr("class"))[1];
    stockData = stockData.filter(function(e) {
      return e.name !== ticker;
    });
    $(this).remove();
    socket.emit('add-stock', stockData);
  });


// Listeners for socket integration --------------------------------------------

  // Handle data on first connection
  socket.on('connection', function(addData) {
    stockData = addData;
    var returnedTickers = addData.map(function(e) { return e.name; });
    var buttons = [];

    $("#stock-buttons").children("button").each(function(c) {
      var currClasses = $(this).attr("class");
      var currTicker = /btn\-tick\-(\w+)\b/.exec(currClasses)[1];
        buttons.push(currTicker);
    });

    for (var i=0; i< returnedTickers.length; i++) {
      if (buttons.indexOf(returnedTickers[i]) === -1)
        addButton(returnedTickers[i]);
    }

    d3Functions.visualize(stockData);
  });

  // Handle data for ubsequent connections
  socket.on('add-stock', function(addData) {
    stockData = addData;
    var returnedTickers = addData.map(function(e) { return e.name; });
    var buttons = [];

    $("#stock-buttons").children("button").each(function(c) {
      var currClasses = $(this).attr("class");
      var currTicker = /btn\-tick\-(\w+)\b/.exec(currClasses)[1];
        if (returnedTickers.indexOf(currTicker) > -1)
          buttons.push(currTicker);
        else
          removeButton(currTicker);
    });

    for (var i=0; i< returnedTickers.length; i++) {
      if (buttons.indexOf(returnedTickers[i]) === -1)
        addButton(returnedTickers[i]);
    }

    d3Functions.visualize(stockData);
  });


});

// EOF -------------------------------------------------------------------------
