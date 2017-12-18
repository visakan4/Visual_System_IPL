import React, { Component } from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import Config from '../config.js';

const width = 450;
const height = 300;
const radius = Math.min(width,height)/2;
const colors = ["#1cbbd0","#c8d85a"];
const colorBatting = ["#ff2a59","#89b2dd"];
const arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
const textArc = d3.svg.arc().outerRadius(radius - 30).innerRadius(radius - 20);

class GroundAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      selectedGround: 'Select a Ground',
      groundData: []
    }
  }
  
	render() {
  	return (
   		<div id="container">
        <div className='row'>
          <div className="col-6">
            <h1 className="page-heading">Ground Analysis</h1>
          </div>
          <div className="col-6 text-right">
            <select className="custom-select"
              id="groundNames"
              dir="rt1"
              onChange={ this.drawCharts.bind(this) }
              >
              <option default hidden>Select a Ground</option>
            </select>
          </div>
        </div>
        <hr/>
        
        <div className="row" style={{display: `${this.state.selectedGround && this.state.selectedGround.value ? '' : 'none'}`}}>
          <div className="col-6">
            <div id="container1" className="graph-container"></div>
          </div>
          <div className="col-6">
        		<div id="container2" className="graph-container"></div>
          </div>
        </div>
      
        <p className="empty-text" style={{display: `${this.state.selectedGround && this.state.selectedGround.value ? 'none' : ''}`}}>
          Please select a player from the dropdown at the top
        </p>
  		</div>
  	);
	}

  
	componentDidMount() {
    fetch(`${Config.apiEndpoint}/groundData`).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ groundData: json })
    	this.appendValues();
    	this.createSVGElement();
    });
	}

	appendValues() {
    $.each(this.state.groundData, (index, value) => {
      $('select').append(
        $('<option>').text(this.state.groundData[index].groundName).val(this.state.groundData[index].groundID)
      );
    });
	}

	createSVGElement(){
    const svg1 = d3.select('#container1').html('')
      .append("svg")
      .attr("width",width)
      .attr("height",height);
      
    this.pieChart1 = svg1.append("g")
      .attr("transform","translate(" + 150 + "," + height/2 +")")
      .attr("class","pieCharts");

    const svg2 = d3.select('#container2')
      .append("svg")
      .attr("width",width)
      .attr("height",height);
    
    this.pieChart2 = svg2.append("g")
      .attr("transform","translate(" + 150 + "," + height/2 +")")
      .attr("class","pieCharts");

    this.pie = d3.layout.pie().value((d) => d);

    this.legend = svg1.append('g')
      .attr("width",250)
      .attr("height",200)
      .attr('transform', 'translate(' + (width - 130) + ',' + (height - 40) + ')');

  	this.legend.selectAll('g')
  		.data(colors)
  		.enter()
  		.append('rect')
  		.attr('x', 0)
  		.attr('y', function(d,i) {
  			return i*20;
  		})
  		.attr('width', 10)
  		.attr('height', 10)
  		.style("fill", (d,i) => {
  			return colors[i];
  		});

    this.legend.selectAll('g')
    	.data(colors)
    	.enter()
    	.append('text')
    	.attr('x', 15)
    	.attr('y', function(d,i) {
    		return (i*20) + 10;
    	})
    	.text(function(d,i) {
    		 if (i===0) {
  	   		return "Win Percentage When Toss won";
    		 }
    		 else if (i===1) {
    		 	return "Win Percentage When Toss lost";
    		 }
    	});

    this.legend1 = svg2.append('g')
      .attr("width", 250)
      .attr("height", 200)
      .attr('transform', 'translate(' + (width - 130) + ',' + (height - 40) + ')');

  	this.legend1.selectAll('g')
  		.data(colorBatting)
  		.enter()
  		.append('rect')
  		.attr('x', 0)
  		.attr('y', function(d,i) {
  			return i*20;
  		})
  		.attr('width', 10)
  		.attr('height', 10)
  		.style("fill", (d,i) => {
  			return colorBatting[i];
  		});

    this.legend1.selectAll('g')
    	.data(colorBatting)
    	.enter()
    	.append('text')
    	.attr('x', 15)
    	.attr('y', function(d,i) {
    		return (i*20) + 10;
    	})
    	.text(function(d,i) {
    		 if (i===0){
  	   		return "Win Percentage Batting First";
    		 }
    		 else{
    		 	return "Win Percentage Batting Second";
    		 }
    	});
	}

	//drawCharts
	drawCharts(event){
    const selectedOption = event.target.options[event.target.selectedIndex];
    this.setState({ selectedGround: selectedOption });
    const index = selectedOption.value;
    const tossarray = [];
    const battingArray = [];
    tossarray.push(this.state.groundData[index].winPercentageWinningToss, this.state.groundData[index].winPercentageLosingToss);
    battingArray.push(this.state.groundData[index].winPercentagePlayingFirst, this.state.groundData[index].winPercentagePlayingSecond);
    this.drawTossWinChart(tossarray);
    this.drawBattingFirstChart(battingArray);
	}


	drawTossWinChart(data, pieChart){
    const arcs = this.pieChart1.html('').selectAll("arc")
                  .data(this.pie(data))
                  .enter()
                  .append("g")
                  .attr("class", "arc");

    arcs.append("path").attr("d", arc).attr("fill", (d,i) => {
      return colors[i];
    });

    arcs.append("text")
      .attr("transform",(d)=>{
      return "translate("+ textArc.centroid(d)+")"})
      .text(function(d) {
        return d.data.toFixed(2) + "%";
      });
	}

	drawBattingFirstChart(data, pieChart){
    const arcs = this.pieChart2.html('')
                  .selectAll("arc")
                  .data(this.pie(data))
                  .enter()
                  .append("g")
                  .attr("class","arc");

    arcs.append("path").attr("d",arc).attr("fill", (d,i) => {
      return colorBatting[i];
    });

    arcs.append("text").attr("transform", (d) => {
      return "translate(" + textArc.centroid(d) + ")"
    }).text(function(d) {
      return d.data.toFixed(2) + "%";
    });
	}
}

export default GroundAnalysis;
