// /app/common/d3-functions.js
'use strict';

var d3Functions = {
  visualize: function visualize (data) {
    var margin = {top: 20, right: 40, bottom: 30, left: 50}
    var width = 760 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var xScale = d3.time.scale()
        .range([0, width]);
    var yScale = d3.scale.linear()
        .range([height, 0]);
    var color = d3.scale.category10();
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    var line = d3.svg.line()
        .defined(function(d) { return d; })
        .x(function(d) { return xScale(parseDate(d.date)); })
        .y(function(d) { return yScale(d.close); });

    // Create the object
    d3.selectAll("svg g").remove()

    if (data.length > 0 ) {
      var svg = d3.select("div#svg-container svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Color domain
      color.domain(data.map(function(e){ return e.name; }));

      xScale.domain([
        d3.min(data, function(c) {
          return d3.min(c.values, function(v) { return parseDate(v.date); }); }),
        d3.max(data, function(c) {
          return d3.max(c.values, function(v) { return parseDate(v.date); }); })
      ]);

      yScale.domain([
        d3.min(data, function(c) {
          return d3.min(c.values, function(v) { return v.close; }); }),
        d3.max(data, function(c) {
          return d3.max(c.values, function(v) { return v.close; }); })
      ]);

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

      // enter selection
      var city = svg.selectAll(".company")
          .data(data)
        .enter().append("g")
          .attr("class", "company");

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

      city.append("text")
          .datum(function(d) {
            return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) {
            return "translate(" + xScale(parseDate(d.value.date)) + "," + yScale(d.value.close) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
    }
  },
};

// EOF -------------------------------------------------------------------------
