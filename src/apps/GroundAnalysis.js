import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/groundAnalysis.css';
import $ from 'jquery';
import data from './data.js';

class GroundAnalysis extends Component {

  	render() {
    	return (
	 		<div id="container">
	 			<div id ="container3">
	 				<p>Ground Analysis</p>
					<label for="groundNames">Ground Name</label>
  					<select id="groundNames" dir="rt1" onChange={this.drawCharts.bind(this)}></select>
	 			</div>
	  			<div id="container1" className="grid"></div>
	  			<div id="container2" className="grid"></div>
			</div>
    	);
  	}

  
	componentDidMount() {
	  	this.initializeVars();
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
	  	this.actual_JSON = data;
	  	this.pie = null;
	  	this.selectValues = null;
	  	this.color = ["red","blue"];
	  	this.colorBatting = ["yellow","green"];
	}


	appendValues() {
		$.each(this.actual_JSON, (index, value) => {
	        $('select').append($('<option>').text(this.actual_JSON[index].groundName).val(this.actual_JSON[index].groundID));
	    });
	}


	createSVGElement(){
	    this.width = 750;
		this.height = 300;
	    this.radius = Math.min(this.width,this.height)/2;

	    this.svg = d3.select('#container1')
	                .append("svg")
	                .attr("width",this.width)
	                .attr("height",this.height)
	                .attr("transform","translate(200,0)")
	                .append("g")
	                .attr("transform","translate(" + 150 + "," + this.height/2 +")")
	                .attr("class","pieCharts");


	    this.svg1 = d3.select('#container2')
	                .append("svg")
	                .attr("width",this.width)
	                .attr("height",this.height)
	                .attr("transform","translate(200,0)")
	                .append("g")
	                .attr("transform","translate(" + 150 + "," + this.height/2 +")")
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

        this.legend = this.svg.append('svg').attr("width",250).attr("height",200).attr("transform","translate(160,30)").attr("display","none");

    	this.legend.selectAll('g')
    		  .data(this.color)
    		  .enter()
    		  .append('rect')
    		  .attr('x',0)
    		  .attr('y',function(d,i){
    		  	return i*20;
    		  })
    		  .attr('width',10)
    		  .attr('height',10)
    		  .style("fill",(d,i)=>{
    		  	return this.color[i];
    		  })

	    this.legend.selectAll('g')
	    	  .data(this.color)
	    	  .enter()
	    	  .append('text')
	    	  .attr('x',15)
	    	  .attr('y',function(d,i){
	    	  	return (i*20) + 10;
	    	  })
	    	  .text(function(d,i){
	    	  	 if(i==0){
    	  	 		return "Win Percentage When Toss won";
	    	  	 }
	    	  	 else if (i==1){
	    	  	 	return "Win Percentage When Toss lost";
	    	  	 }
	    	  })


        this.legend1 = this.svg1.append('svg').attr("width",250).attr("height",200).attr("transform","translate(160,30)").attr("display","none");

    	this.legend1.selectAll('g')
    		  .data(this.colorBatting)
    		  .enter()
    		  .append('rect')
    		  .attr('x',0)
    		  .attr('y',function(d,i){
    		  	return i*20;
    		  })
    		  .attr('width',10)
    		  .attr('height',10)
    		  .style("fill",(d,i)=>{
    		  	return this.colorBatting[i];
    		  })

	    this.legend1.selectAll('g')
	    	  .data(this.colorBatting)
	    	  .enter()
	    	  .append('text')
	    	  .attr('x',15)
	    	  .attr('y',function(d,i){
	    	  	return (i*20) + 10;
	    	  })
	    	  .text(function(d,i){
	    	  	 if(i==0){
    	  	 		return "Win Percentage Batting First";
	    	  	 }
	    	  	 else{
	    	  	 	return "Win Percentage Batting Second";
	    	  	 }
	    	  })

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

		this.legend.attr("display","block");

	    var arcs = this.svg.selectAll("arc")
	                  .data(this.pie(data))
	                  .enter()
	                  .append("g")
	                  .attr("class","arc");

	    arcs.append("path").attr("d",this.arc).attr("fill",(d,i)=>{
	        return this.color[i];
	    });


	    arcs.append("text")
	        .attr("transform",(d)=>{
	        return "translate("+ this.textArc.centroid(d)+")"})
	        .text(function(d){
	        return d.data;
	    })

	}


	drawBattingFirstChart(data){

		this.legend1.attr("display","block");

	    var arcs = this.svg1.selectAll("arc")
	                  .data(this.pie(data))
	                  .enter()
	                  .append("g")
	                  .attr("class","arc");

	    arcs.append("path").attr("d",this.arc).attr("fill",(d,i)=>{
	        return this.colorBatting[i];
	    });

	    arcs.append("text").attr("transform",(d)=>{
	        return "translate(" + this.textArc.centroid(d) + ")"
	    }).text(function(d){
	        return d.data;
	    });


	}
}

export default GroundAnalysis;
