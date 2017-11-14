import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/playerAnalysis.css';
import PlayerAverage from '../data/PlayerAverage';


class PlayerAnalysis extends Component {
  render() {
    return (
      <div id="canvas" className="playerCanvas">
        <div id="battingAvg"></div>
      </div>
    );
  }
  
  componentDidMount() {
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 320 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.season_year); })
    .y(function(d) { return y(d.average); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#battingAvg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // format the data
  PlayerAverage.matches.forEach(function(d) {
      d.season_year = d.season_year;
      d.average = d.average;
  });

  // Scale the range of the data
  x.domain(d3.extent(PlayerAverage.matches, function(d) { return d.season_year; }));
  y.domain([0, d3.max(PlayerAverage.matches, function(d) { return d.average; })]);

  // Add the valueline path.
  svg.append("path")
  .data([PlayerAverage.matches])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  }
}

export default PlayerAnalysis;
