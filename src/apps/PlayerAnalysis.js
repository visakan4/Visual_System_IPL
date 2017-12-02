import React, { Component } from 'react';
import Select from 'react-select';
import Loader from 'react-loader';
import * as d3 from 'd3';
import Config from '../config.js';
import _ from 'underscore';

const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 550 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

class PlayerAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: {
        label: 'Search a Player'
      }
    }
  }

  getOptions(input) {
    return fetch(`${Config.apiEndpoint}/searchPlayers?query=${input}`)
      .then((response) => {
        return response.json();
      }).then((json) => {
        return { options: json };
      });
  }
  
  getInitialState() {
    return { battingAverageLoaded: false, profile: null };
  }
  
  optionChanged(option) {
    this.setState({ battingAverageLoaded: false, battingDismallsLoaded: false, selectedOption: option }, () => {
      this.renderPlayerAverageGraph();
      this.renderPlayerStats();
    });
  }
  
  render() {
    return (
      <div id="canvas" className="playerCanvas">
        
        <div className='row'>
          <div className="col-6">
            <h1 className="page-heading">Player Analysis</h1>
          </div>
          <div className="col-6">
            <Select.Async
              name="playerSelect"
              placeholder="Search a Player"
              value={this.state.selectedOption}
              loadOptions={this.getOptions}
              onChange={this.optionChanged.bind(this)}
            />
          </div>
        </div>
        <hr/>
        {this.state.selectedOption && this.state.selectedOption.value ? (
          <div className="row">
            <div className="col-6 graph-grid">
              <h5>Batting Average</h5>
              <Loader loaded={this.state.battingAverageLoaded} color="#3a7bd5">
                <div id="battingAvg" className="graph-container"></div>
              </Loader>
            </div>
            <div className="col-6 graph-grid">
              <h5>Number of Dismissals</h5>
              <Loader loaded={this.state.battingDismallsLoaded} color="#3a7bd5">
                <div id="stacked" className="graph-container"></div>
              </Loader>
            </div>
          </div>
        ) : (
          <p className="empty-text">Please select a player from the dropdown at the top</p>
        )}
        
      </div>
    );
  }
  
  getPlayerData() {
    return fetch(`${Config.apiEndpoint}/playerData?playerId=${this.state.selectedOption.value}`)
  }
  
  renderPlayerAverageGraph() {
    this.getPlayerData().then((response) => {
      this.setState({ battingAverageLoaded: true });
      return response.json();
    }).then((json) => {
      var parseDate = d3.time.format("%d-%b-%y").parse;

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      // Define the axes
      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

      var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

      // Define the line
      var valueline = d3.svg.line()
          .x(function(d) { return x(d.season_year); })
          .y(function(d) { return y(d.average); });
    
      // Adds the svg canvas
      var svg = d3.select("#battingAvg").html('')
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ -35 +","+(height/2)+")rotate(-90)")
        .text("Batting Average");

      svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2)  +","+(height-(-40))+")")  // centre below axis
        .text("Different Seasons (year)");

  
      json.forEach(function(d) {
          d.season_year = parseDate(d.season_year);
          d.average = +d.average;
      });
      
      json = _.sortBy(json, (obj) => obj.season_year );

      // Scale the range of the data
      x.domain(d3.extent(json, function(d) { return d.season_year; }));
      y.domain([0, d3.max(json, function(d) { return d.average; })]);

      // Add the valueline path.
      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(json));

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

    });
  }
  
  getPlayerStats() {
    return fetch(`${Config.apiEndpoint}/batsmanDismissal?playerId=${this.state.selectedOption.value}`)
  }

  renderPlayerStats(config) {
    this.getPlayerStats().then((response) => {
      this.setState({ battingDismallsLoaded: true });
      return response.json();
    }).then((json) => {
      const margin = { top: 20, right: 20, bottom: 50, left: 40 };
      const width = 600;
      const keys = ['below_10_count', 'ten_to_thirty_count', 'thirty_plus_count'];
      var svg = d3.select("#stacked").html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      /* Data in strings like it would be if imported from a csv */

      var data = json; //json;

      var parse = d3.time.format("%d-%b-%y").parse;


      // Transpose the data into layers
      var dataset = d3.layout.stack()(keys.map(function(element) {
        return data.map(function(d) {
          return {x: parse(d.season_year), y: +d[element]};
        });
      }));


      // Set x, y and colors
      var x = d3.scale.ordinal()
        .domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-160], 0.02);

      var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

      var colors = ["#b33040", "#d25c4d", "#f2b447"];


      // Define and draw axes
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat( function(d) { return d } );

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ -20 +","+(height/2)+")rotate(-90)")
        .text("Number of times out");

      svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ ((width/2) - 90)  +","+(height-(-40))+")")  // centre below axis
        .text("Different Seasons (year)");


      // Create groups for each series, rects for each segment 
      var groups = svg.selectAll("g.cost")
        .data(dataset)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function(d, i) { return colors[i]; });

      groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr("width", x.rangeBand())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d.y);
        });

      var legendContainer = svg.append('g')
          .attr('class', 'legendContainer')
          .style('transform', 'translate(-170px, -20px)');
    
      // Draw legend
      var legend = legendContainer.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
 
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return colors.slice().reverse()[i];});
 
      legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) { 
          switch (i) {
            case 0: return "Below 10";
            case 1: return "11-29";
            case 2: return "Thirty +";
            default: return "";
          }
        });


      // Prep the tooltip bits, initial display is hidden
      var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
    
      tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

      tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
    });
  }

  componentDidMount() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerAverageGraph();
      this.renderPlayerStats();
    }
  }
}

export default PlayerAnalysis;
