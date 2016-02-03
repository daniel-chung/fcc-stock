// /app/controllers/pollViewController.client.js

'use strict';

(function () {

  function d3Viz (data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50}
    var width = 760 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    // Creat the object
    var svg = d3.select("#svg-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = JSON.parse(data);
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  };

/*
  var sampleData = [
    {date:'2-Apr-12', close:	618.63},
    {date:'3-Apr-12', close:	629.32},
    {date:'4-Apr-12', close:	624.31},
    {date:'5-Apr-12', close:	633.68},
    {date:'9-Apr-12', close:	636.23},
    {date:'10-Apr-12', close:	628.44},
    {date:'11-Apr-12', close:	626.20},
    {date:'12-Apr-12', close:	622.77},
    {date:'13-Apr-12', close:	605.23},
    {date:'16-Apr-12', close:	580.13},
    {date:'17-Apr-12', close:	609.70},
    {date:'18-Apr-12', close:	608.34},
    {date:'19-Apr-12', close:	587.44},
    {date:'20-Apr-12', close:	572.98},
    {date:'23-Apr-12', close:	571.70},
    {date:'24-Apr-12', close:	560.28},
    {date:'25-Apr-12', close:	610.00},
    {date:'26-Apr-12', close:	607.70},
    {date:'27-Apr-12', close:	603.00},
    {date:'30-Apr-12', close:	583.98},
  ];
*/


function test(data) {
  console.log('test result:', JSON.parse(data));
}


  //d3Viz(sampleData);
  //var currUrl = window.location.pathname.split( '/' );
  var apiUrl = appUrl+'/api/AAPL'; //+currUrl[2];
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, d3Viz));
  //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, test));

})();
