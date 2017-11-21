import React, { Component } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';

const apiEndpoint = "https://vat-backend.herokuapp.com";
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

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
    return fetch(`${apiEndpoint}/searchPlayers?query=${input}`)
      .then((response) => {
        return response.json();
      }).then((json) => {
        return { options: json };
      });
  }
  
  render() {
    return (
      <div id="canvas" className="playerCanvas">
        <Select.Async
          name="playerSelect"
          placeholder="Search a Player"
          value={this.state.selectedOption}
          loadOptions={this.getOptions}
          onChange={(option) => {
            this.setState({ selectedOption: option });
          }
          }
        />
        <div id="battingAvg"></div>
      </div>
    );
  }
  
  getPlayerData() {
    return fetch(`${apiEndpoint}/playerData?playerId=${this.state.selectedOption.value}`)
  }
  
  renderPlayerGraphs() {
    this.getPlayerData().then((response) => {
      return response.json();
    }).then((json) => {
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
                debugger;
      json.forEach(function(d) {
        d.season_year = d.season_year;
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
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
    });
  }
  
  componentDidMount() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerGraphs();
    }
  }
  
  componentDidUpdate() {
    if (this.state.selectedOption && this.state.selectedOption.value) {      
      this.renderPlayerGraphs();
    }
  }
}

export default PlayerAnalysis;
