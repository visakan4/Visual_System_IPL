import React, { Component } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';
import Config from '../config.js';

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 750 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

const mydata = [{
	"season_year": "01-Apr-08",
	"below_10_count": 3,
	"ten_to_thirty_count": 4,
	"thirty_plus_count": 7
}, {
	"season_year": "01-Apr-09",
	"below_10_count": 3,
	"ten_to_thirty_count": 6,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-10",
	"below_10_count": 3,
	"ten_to_thirty_count": 4,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-11",
	"below_10_count": 2,
	"ten_to_thirty_count": 7,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-12",
	"below_10_count": 4,
	"ten_to_thirty_count": 9,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-13",
	"below_10_count": 4,
	"ten_to_thirty_count": 5,
	"thirty_plus_count": 7
}, {
	"season_year": "01-Apr-14",
	"below_10_count": 2,
	"ten_to_thirty_count": 9,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-15",
	"below_10_count": 4,
	"ten_to_thirty_count": 9,
	"thirty_plus_count": 4
}, {
	"season_year": "01-Apr-16",
	"below_10_count": 4,
	"ten_to_thirty_count": 6,
	"thirty_plus_count": 2
}]

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
              onChange={(option) => {
                this.setState({ selectedOption: option });
              }}
            />
          </div>
        </div>
        <hr/>
        {this.state.selectedOption && this.state.selectedOption.value ? (
          <div className="row">
            <div className="col-12">
              <div id="battingAvg" className="graph-container"></div>
            </div>
            <div className="col-12">
              <div id="stacked" className="graph-container"></div>
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
      return response.json();
    }).then((json) => {
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      
      var parseTime = d3.timeParse("%d-%b-%y");

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.season_year); })
          .y(function(d) { return y(d.average); });

      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select("#battingAvg").html("").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // format the data
      json.forEach(function(d) {
        d.season_year = parseTime(d.season_year);
        d.average = d.average;
      });
    
      // Scale the range of the data
      x.domain(d3.extent(json, function(d) { return d.season_year; }));
      y.domain([0, d3.max(json, function(d) { return d.average; })]);
    
    
      // Add the valueline path.
      svg.append("path")
      .data([json])
        .attr("class", "line")
        .attr("d", valueline);

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
    });
  }
  
  getPlayerStats() {
    return fetch(`${Config.apiEndpoint}/playerData?playerId=${this.state.selectedOption.value}`)
  }

  renderPlayerStats(config) {
    const me = this;
		const domEle = config.element;
		const stackKey = config.key;
		const data = config.data;
		const parseDate = d3.timeParse("%d-%b-%y");
		const xScale = d3.scaleBand().range([0, width]).padding(0.1);
		const yScale = d3.scaleLinear().range([height, 0]);
		const color = d3.scaleOrdinal(d3.schemeCategory20);
		const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
		const yAxis =  d3.axisLeft(yScale);
		const svg = d3.select("#"+domEle).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var stack = d3.stack()
			.keys(stackKey)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);
	
		var layers= stack(data);
			data.sort(function(a, b) { return b.total - a.total; });
			xScale.domain(data.map(function(d) { return parseDate(d.season_year); }));
			yScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();

		var layer = svg.selectAll(".layer")
			.data(layers)
			.enter().append("g")
			.attr("class", "layer")
			.style("fill", function(d, i) { return color(i); });

		  layer.selectAll("rect")
			  .data(function(d) { return d; })
			.enter().append("rect")
			  .attr("x", function(d) { return xScale(parseDate(d.data.season_year)); })
			  .attr("y", function(d) { return yScale(d[1]); })
			  .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
			  .attr("width", xScale.bandwidth());

			svg.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + (height+5) + ")")
			.call(xAxis);

			svg.append("g")
			.attr("class", "axis axis--y")
			.attr("transform", "translate(0,0)")
			.call(yAxis);
  }

  componentDidMount() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerAverageGraph();
      this.renderPlayerStats({
        data: mydata,
        key: ['below_10_count', 'ten_to_thirty_count', 'thirty_plus_count'],
        element: 'stacked'
      });
    }
  }
  
  componentDidUpdate() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerAverageGraph();
      this.renderPlayerStats(
        {
                data: mydata,
                key: ['below_10_count', 'ten_to_thirty_count', 'thirty_plus_count'],
                element: 'stacked'
              }
      );
    }
  }
}

export default PlayerAnalysis;
