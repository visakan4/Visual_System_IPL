import React, { Component } from 'react';
import Select from 'react-select';
import Loader from 'react-loader';
import * as d3 from 'd3';
import Config from '../config.js';
import _ from 'underscore';
import {withRouter} from "react-router-dom";

const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 550 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

class PlayerAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: {
        label: 'Search a Player'
      },
      playerDetails: {}
    }
  }

  getOptions(input) {
    const self = this;
    return fetch(`${Config.apiEndpoint}/searchPlayers?query=${input}`)
      .then((response) => {
        return response.json();
      }).then((json) => {
        const queryParams = self.getQueryParams();
        if(queryParams.playerId) {
          const option = _.findWhere(json, { value: queryParams.playerId });
          if(option) {
            this.optionChanged(option);            
          }
        }
        return { options: json };
      });
  }
  
  getInitialState() {
    return { battingAverageLoaded: false, profile: null };
  }

  renderPlayerTable() {
    fetch(`${Config.apiEndpoint}/playerDetails?playerId=${this.state.selectedOption.value}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({
        playerDetails: json
      })
    });
  }
  
  optionChanged(option) {
    if(option) {
      this.props.history.push({
        pathname: '/playerAnalysis',
        search: `?playerId=${option.value}`
      });
      this.setState({ battingAverageLoaded: false, battingDismallsLoaded: false, bowlingEconomyLoaded:false, playerWicketcount : false, selectedOption: option }, () => {
        this.renderPlayerTable();
        this.renderPlayerAverageGraph();
        this.renderPlayerStats();
        this.renderPlayerEconomyGraph();
        this.renderPlayerWickets();
      });
    } 
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
              loadOptions={this.getOptions.bind(this)}
              onChange={this.optionChanged.bind(this)}
            />
          </div>
        </div>
        <hr/>
        {this.state.selectedOption && this.state.selectedOption.value ? (
        	<div>
            {this.state.playerDetails ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Player Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">Runs scored</th>
                    <th scope="col">Batting Average</th>
                    <th scope="col">Bowling Economy</th>
                    <th scope="col">Country</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{this.state.playerDetails.name}</th>
                    <td>{this.state.playerDetails.age}</td>
                    <td>{this.state.playerDetails.runsScored}</td>
                    <td>{this.state.playerDetails.average}</td>
                    <td>{this.state.playerDetails.bowlingEconomy}</td>
                    <td>{this.state.playerDetails.country}</td>
                  </tr>
                </tbody>
              </table>
            ) : " "}
          
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
	          <div className="row">
	          	<div className="col-12 graph-grid">
	              <h5>Bowling Economy</h5>
	              <Loader loaded={this.state.bowlingEconomyLoaded} color="#3a7bd5">
	                <div id="bowlingEconomy" className="graph-container"></div>
	              </Loader>
	            </div>
	            <div className="col-12 graph-grid">
	              <h5>Wicket</h5>
	              <Loader loaded={this.state.playerWicketcount} color="#3a7bd5">
	                <div id="stackedWicket" className="graph-container"></div>
	              </Loader>
	            </div>            
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
      const last = _.last(json);
      this.setState({
        playerDetails: _.extend(this.state.playerDetails, {
          runsScored: last.runs_scored,
          average: last.average.toFixed(2)
        })
      });

      
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
      // Code referred from https://bl.ocks.org/mbostock/3886208
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
          return { x: parse(d.season_year), y: +d[element] };
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
            case 0: return "Thirty +";
            case 1: return "11-29";
            case 2: return "Below 10";
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

	getPlayerEconomy() {
  	return fetch(`${Config.apiEndpoint}/bowlerEconomyRate?playerId=${this.state.selectedOption.value}`)
	}

  renderPlayerEconomyGraph() {
    this.getPlayerEconomy().then((response) => {
      this.setState({ bowlingEconomyLoaded: true });
      return response.json();
    }).then((json) => {
      if (json.length === 0) {
        d3.select("#bowlingEconomy").html("<p class='text-left'>This player is not a bowler</p>")
        this.setState({
          playerDetails: _.extend(this.state.playerDetails, {
            bowlingEconomy: "NA"
          })
        })
        return;
      }
      const last = _.last(json);
      this.setState({
        playerDetails: _.extend(this.state.playerDetails, {
          bowlingEconomy: last.overall_economy.toFixed(2)
        })
      })
    	const margin = {top: 20, right: 20, bottom: 30, left: 50};
      	var width = 600;
      	var height = 300

      // Code referred from https://bl.ocks.org/mbostock/3883245
    	var svg = d3.select("#bowlingEconomy").html("")
        			.append("svg")
        			.attr("width", width + margin.left + margin.right)
        			.attr("height", height + margin.top + margin.bottom)        			

    	width = +svg.attr("width") - margin.left - margin.right
    	height = +svg.attr("height") - margin.top - margin.bottom

    	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  		var parseTime = d3.time.format("%d-%b-%y");

  		var x = d3.time.scale()
  					.rangeRound([0, width]);

  		var y = d3.scale.linear()
  					.rangeRound([height, 0]);

  		var line = d3.svg.line()
  						.x(function(d) { return x(d.date); })
      				.y(function(d) { return y(d.overall_economy); });

  		var data = json;

    	data.forEach(function(d){
      	d.date = parseTime.parse(d.date); 
      	d.overall_economy = +d.overall_economy;
    	})

    	x.domain(d3.extent(data, function(d) { return d.date; }));
    	y.domain([0, d3.max(data, function(d) { return d.overall_economy; })]);

    	g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).orient('bottom'))
        .append("text")
        .attr("x",(width/2)+20)
        .attr("y",30)
        .attr("text-anchor", "middle")
        .text("Year");

    	g.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient('left'))
        .append("text")
        .attr('x',0 - height/2)
        .attr('y',-40)
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Economy Rate");

    	g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
      });
  }

	getPlayerWickets(){
  	return fetch(`${Config.apiEndpoint}/wicketsCountCategory?playerId=${this.state.selectedOption.value}`);
	}

	renderPlayerWickets(config) {
    this.getPlayerWickets().then((response) => {
      this.setState({ playerWicketcount	: true });
      return response.json();
    }).then((json) => {
      if (json.length === 0) {
        d3.select("#stackedWicket").html("<p class='text-left'>This player is not a bowler</p>");
        return;
      }
      const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    	const width = 600;
      var keys = ["no_of_wickets_caught", "no_of_wickets_bowled", "no_of_wickets_lbw", "no_of_wickets_caught_and_bowled","no_of_wickets_stumped","no_of_wickets_hitwicket"];
	    var legendKeys = ["Caught","Bowled","LBW","Caught And Bowled","Stumped","Hitwicket"];
      var svg = d3.select("#stackedWicket").html("")
            			.append("svg")
            			.attr("width", width + margin.left + margin.right)
            			.attr("height", height + margin.top + margin.bottom)
            			.append("g")
            			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /* Data in strings like it would be if imported from a csv */
      var data = json; //json;
      // Transpose the data into layers
      var dataset = d3.layout.stack()(keys.map(function(element) {
        return data.map(function(d) {
          return {x: d.season_id, y: +d[element]};
        });
      }));

      // Set x, y and colors
      var x = d3.scale.ordinal()
        .domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-160], 0.02);

      var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

      var colors = ["#ff8c00","#98abc5","#a05d56","#8a89a6", "#7b6888", "#6b486b"];

    	// Define and draw axes
	    var yAxis = d3.svg.axis()
  		  .scale(y)
  		  .orient("left")
  		  .ticks(5)
  		  .tickSize(-width, 0, 0)
  		  .tickFormat( function(d) { return d } );

		  var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

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
		    .text("Number of Wickets");

	  	svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
		    .attr("transform", "translate("+ ((width/2) - 90)  +","+(height-(-30))+")")  // centre below axis
		    .text("Different Seasons (year)");

		  // Create groups for each series, rects for each segment 
		  var groups = svg.selectAll("g.cost")
  		  .data(dataset)
  		  .enter().append("g")
  		  .attr("class", "cost")
  		  .style("fill", function(d,i){
  		    return colors[i]
  		  });

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


		  // Draw legend
		  var legend = svg.selectAll(".legend")
		    .data(colors)
		    .enter().append("g")
		    .attr("class", "legend")
		    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

		  legend.append("rect")
  		  .attr("x", width - 18)
  		  .attr("width", 18)
  		  .attr("height", 18)
  		  .style("fill", function(d,i){
  		    return colors[i]
  		  });
		 
		  legend.append("text")
  		  .attr("x", width + 5)
  		  .attr("y", 9)
  		  .attr("dy", ".35em")
  		  .style("text-anchor", "start")
  		  .text(function(d, i) { 
  		    return legendKeys[i];
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

  // Referred from http://www.timetler.com/2013/11/14/location-search-split-one-liner/
  getQueryParams() {
    return _.object(_.compact(_.map(this.props.location.search.slice(1).split('&'), function(item) {
      if (item) return item.split('=');
    })));
  }

  componentDidMount() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerAverageGraph();
      this.renderPlayerStats();
      this.renderPlayerEconomyGraph();
      this.renderPlayerWickets();
    }
  }
}

export default withRouter(PlayerAnalysis);
