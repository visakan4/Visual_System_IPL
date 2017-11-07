import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/groundAnalysis.css';
import $ from 'jquery';
import data from './data.js';

class GroundAnalysis extends Component {
  render() {
    return (
	 <div id="container">
	  <p>Ground Analysis</p>
      <label for="groundNames">Ground Name</label>
	  <select id="groundNames" dir="rt1" onChange={this.drawCharts.bind(this)} onload="drawCharts(this)"></select>
	  <div id="container1" className="grid">

	  </div>
	  <div id="container2" className="grid">

	  </div>
	</div>
    );
  }
  
  componentDidMount() {
  	this.initializeVars();
  	// var value = this.init();
  	this.appendValues();
  	this.createSVGElement();
  }

  initializeVars() {
  	this.svg = null;
  	this.width = null;
  	this.height = null;
  	this.radius = null;
  	this.svg1 = null;
  	this.arc =  null;
  	this.textArc = null;
  	this.pie = null;
  	this.actual_JSON = data;
  	this.selectValues = null;
  }


  appendValues() {
    // this.actual_JSON = JSON.parse(this.actual_JSON); 
    $.each(this.actual_JSON, (index, value) => {
        $('select').append($('<option>').text(this.actual_JSON[index].groundName).val(this.actual_JSON[index].groundID));
    });
  }

  createSVGElement(){
    this.width = 400;
    this.height = 300;
    this.radius = Math.min(this.width,this.height)/2;

    this.svg = d3.select('#container1')
                .append("svg")
                .attr("width",this.width)
                .attr("height",this.height)
                .append("g")
                .attr("transform","translate(" + this.width/2 + "," + this.height/2 +")")
                .attr("class","pieCharts");


    this.svg1 = d3.select('#container2')
                .append("svg")
                .attr("width",this.width)
                .attr("height",this.height)
                .append("g")
                .attr("transform","translate(" + this.width/2 + "," + this.height/2 +")")
                .attr("class","pieCharts");

    this.arc = d3.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);

    this.textArc = d3.arc()
                .outerRadius(this.radius - 30)
                .innerRadius(this.radius - 20);


    this.pie = d3.pie()
                .value(function(d) {
                    return d;
                });
   }

drawCharts(event){
    var selectedOption = event.target.options[event.target.selectedIndex];
    var index = selectedOption.value;
    var tossarray = [];
    var battingArray = [];
    tossarray.push(this.actual_JSON[index].winPercentageWinningToss,this.actual_JSON[index].winPercentageLosingToss);
    battingArray.push(this.actual_JSON[index].winPercentagePlayingFirst,this.actual_JSON[index].winPercentagePlayingSecond);
    this.drawTossWinChart(tossarray);
    this.drawBattingFirstChart(battingArray);
}

drawTossWinChart(data){

    var color = ["red","blue"];

    var arcs = this.svg.selectAll("arc")
                  .data(this.pie(data))
                  .enter()
                  .append("g")
                  .attr("class","arc");

    arcs.append("path").attr("d",this.arc).attr("fill",function(d,i){
        return color[i];
    });

    arcs.append("text")
        .attr("transform",(d)=>{
        return "translate("+ this.textArc.centroid(d)+")"})
        .text(function(d){
        return d.data;
    })
}

drawBattingFirstChart(data){

    var color = ["yellow","green"];

    var arcs = this.svg1.selectAll("arc")
                  .data(this.pie(data))
                  .enter()
                  .append("g")
                  .attr("class","arc");

    arcs.append("path").attr("d",this.arc).attr("fill",function(d,i){
        return color[i];
    });

    arcs.append("text").attr("transform",(d)=>{
        return "translate(" + this.textArc.centroid(d) + ")"
    }).text(function(d){
        return d.data;
    });
}
}

export default GroundAnalysis;
