import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'underscore';
import Switch from 'react-bootstrap-switch';
import Select from 'react-select';
import * as d3 from 'd3';
import Config from '../config.js';
import {withRouter} from "react-router-dom";

const padding = 1.5; // separation between same-color nodes
const clusterPadding = 16; // separation between different-color nodes
const maxRadius = 24;

// to align
const margin = {top: 100	, right: 10, bottom: 20, left: 10};

const width = window.outerWidth - margin.left - margin.right;
const height = window.outerHeight - 100 - margin.top - margin.bottom;


class Cluster extends Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      clusterCount: 4,
      clusterType: 'batting',
      minBowlerEconomy: 0,
      maxBowlerEconomy: 100,
      minBowlingAverage: 0,
      maxBowlingAverage: 200,
      minBattingAverage: 0,
      maxBattingAverage: 200,
      minStrikeRate: 0,
      maxStrikeRate: 300
    }
  }
  
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value});
  }
  
  clusterSizeChanged(e) {
    this.setState({
      clusterCount: e.target.value
    }, () => {
      this.renderForceLayout();
    });
  }

  render() {
    return (
      <div id="container">
        <div className='row'>
          <div className="col-6">
            <h1 className="page-heading">Cluster</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="row">
              <div className="col-3">
                <div className="form-group">
                	<label className="right-10">Clusters:</label>
                	<select id='cluster' value={this.state.clusterCount} onChange={this.clusterSizeChanged.bind(this)} className="custom-select">
                		<option value="2">2</option>
                		<option value="3">3</option>
                		<option value="4">4</option>
                	</select>
                </div>
              </div>
              <div className="col-9">
                <div className="form-group">
                  <label className="right-10">Select Batting/Bowling data </label>
                	<Switch
                    onChange={(el, state) => this.handleSwitch(el, state)}
                    name='innings'
                    onText="Batting"
                    offText="Bowling"
                    offColor="primary"
                    defaultValue={this.state.clusterType === 'batting'}
                  />
                </div>
              </div>
            </div>

            
          </div>
          <div className="col-6 text-right">
            <Select
              name="playerSelect"
              placeholder="Search a Player"
              options={this.getOptions()}
              onChange={this.searchNode.bind(this)}
            />
          </div>
          
          {
            this.state.clusterType === 'batting' ?
            (
              <div className="col-12">
                <div className="row">
                  <div className="col-2">
                    <div className="form-group">
                      <label>Minimum Strike Rate</label>
                      <input type="text"
                        className="form-control"
                      placeholder="Min. Strike Rate"
                      name="minStrikeRate"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.minStrikeRate} />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form-group">
                      <label>Maximum Strike Rate</label>
                      <input type="text"
                      className="form-control"
                      placeholder="Max. Strike Rate"
                      name="maxStrikeRate"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.maxStrikeRate}/>
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form-group">
                      <label>Minimum Average</label>
                      <input type="text" className="form-control"
                      placeholder="Min. Average"
                      name="minBattingAverage"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.minBattingAverage}/>
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form-group">
                      <label>Minimum Average</label>
                      <input type="text" className="form-control"
                      placeholder="Max. Average"
                      name="maxBattingAverage"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.maxBattingAverage}/>
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <input type="submit" value="Apply" onClick={this.renderForceLayout.bind(this)} className="btn btn-success form-control"/>
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
                <div className="col-12">
                  <div className="row">
                    <div className="col-2">
                      <div className="form-group">
                        <label>Minimum Economy</label>
                        <input type="text"
                          className="form-control"
                        placeholder="Min. Economy"
                        name="minBowlerEconomy"
                        onChange={this.handleChange.bind(this)}
                        value={this.state.minBowlerEconomy} />
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="form-group">
                        <label>Maximum Economy</label>
                        <input type="text"
                        className="form-control"
                        placeholder="Max. Economy"
                        name="maxBowlerEconomy"
                        onChange={this.handleChange.bind(this)}
                        value={this.state.maxBowlerEconomy}/>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="form-group">
                        <label>Minimum Average</label>
                        <input type="text" className="form-control"
                        placeholder="Min. Average"
                        name="minBowlingAverage"
                        onChange={this.handleChange.bind(this)}
                        value={this.state.minBowlingAverage}/>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="form-group">
                        <label>Minimum Average</label>
                        <input type="text" className="form-control"
                        placeholder="Max. Average"
                        name="maxBowlingAverage"
                        onChange={this.handleChange.bind(this)}
                        value={this.state.maxBowlingAverage}/>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="form-group">
                        <label>&nbsp;</label>
                        <input type="submit" value="Apply" onClick={this.renderForceLayout.bind(this)} className="btn btn-success form-control"/>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
        </div>
        <hr/>
        <div id="clusterWrapper" className="graph-containercluster"></div>
      </div>
    );
  }
  
  getOptions() {
    const options = [];
    _.map(this.state.nodes, (item) => {
      options.push({ value: item.player_name, label: item.player_name })
    })
    return options;
  }

  handleSwitch(elem, state) {
    this.setState({
      clusterType: (state ? 'batting' : 'bowling')
    }, () => {
      this.renderForceLayout();
    });
  }
  
  searchNode(item) {
    var node = d3.select("body").selectAll("circle");
    if (item.value === "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
      var selected = node.filter(function (d, i) {
        return d.player_name !== item.value;
      });
      selected.style("opacity", "0");
		  d3.select("body").selectAll("circle").transition()
        .duration(4000)
        .style("opacity", 1);
    }
  }

  renderForceLayout() {
    this.clusters = new Array(parseInt(this.state.clusterCount, 10));
    this.color = d3.scale.category10().domain(d3.range(this.state.clusterCount));
    let filterOptions = _.extend({}, this.state.clusterType === 'batting' ? {
      clusterCount: this.state.clusterCount,
      minBattingAverage: this.state.minBattingAverage,
      maxBattingAverage: this.state.maxBattingAverage,
      minStrikeRate: this.state.minStrikeRate,
      maxStrikeRate:this.state.maxStrikeRate 
    } : {
      clusterCount: this.state.clusterCount,
      minBowlerEconomy: this.state.minBowlerEconomy,
      maxBowlerEconomy: this.state.maxBowlerEconomy,
      minBowlingAverage: this.state.minBowlingAverage,
      maxBowlingAverage: this.state.maxBowlingAverage
    })
    fetch(`${Config.apiEndpoint}/${this.state.clusterType}ClusterValues?${$.param(filterOptions)}`).then((response) => {
      this.setState({ clusterLoaded: true });
      return response.json();
    }).then((data) => {
      const nodes = [];
      for (var i = 0; i < data.length; i++) {
    		var obj = data[i];
    		for (var key in obj){
          var average = obj[`${this.state.clusterType}_average`];			// division/group
          var dynamicParam = obj[`${this.state.clusterType === 'batting' ? 'batting_strike_rate' : 'bowling_economy'}`];	// Strike rate
          var r = (this.state.clusterType === 'batting' ? (average / 2) : (dynamicParam*1.4));		// radius
    			var n = obj['player_name'];		// player name
    			var div = obj[`km_${this.state.clusterType}_cluster_label`];
          var d = { cluster: div, radius: r, player_name: n, dynamicParam: dynamicParam, average: average, playerId: obj['player_id'] };
    		} 
    		if (!this.clusters[i] || (r > this.clusters[i].radius)) this.clusters[i] = d;
    		nodes.push(d);
    	}
      this.setState({
        nodes: nodes
      }, () => {
        this.renderCluster();
        $('[data-toggle="tooltip"]').tooltip();
      });
    });
  }
  
  componentDidMount() {
    // The largest node for each cluster.
    this.renderForceLayout(); 
  }
  
  renderCluster() {
    // Code referred from https://bl.ocks.org/newsummit/880d663dba66affaf18226113d34073d
    // Use the pack layout to initialize node positions.
    d3.layout.pack()
    .sort(null)
    .size([width, height])
    .children(function(d) { return d.values; })
    .value(function(d) { return d.radius * d.radius; })
    .nodes({
      values: d3.nest().key((d) => d.cluster).entries(this.state.nodes)
    });

    const force = d3.layout.force()
      .nodes(this.state.nodes)
      .size([width, height])
      .gravity(.02)
      .charge(0)
      .on("tick", this.tick.bind(this))
      .start();

    const svg = d3.select("#clusterWrapper").html('').append("svg")
      .attr("width", width)
      .attr("height", height);

      //  to pin point the node 
    const node_drag = d3.behavior.drag()
      .on("dragstart", function(d,i) {
        force.stop() // stops the force auto positioning before you start dragging
      })
      .on("drag", function(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
      })
      .on("dragend", function(d,i) {
        d.fixed = true; 
        force.resume();
      });
    
    const legend = svg.append('g')
      .attr("width",250)
      .attr("height",200)
      .attr('transform', 'translate(0,10)');
    
  	legend.selectAll('g')
  		.data(d3.range(this.state.clusterCount))
  		.enter()
  		.append('rect')
  		.attr('x',0)
  		.attr('y', (d,i) => (i*20) )
  		.attr('width',10)
  		.attr('height',10)
  		.style("fill",(d,i) => this.color(d));

    legend.selectAll('g')
    	.data(d3.range(this.state.clusterCount))
    	.enter()
    	.append('text')
    	.attr('x',15)
    	.attr('y',function(d,i){
    		return (i*20) + 10;
    	})
    	.text((d,i) => {
        return `Group ${i + 1}`;
    	});


    this.node = svg.selectAll("circle")
      .data(this.state.nodes)
      .enter().append("circle")
      .style("fill", (d) => this.color(d.cluster))
      //testing to round of the circle
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'top')
      .attr('data-html', 'true')
      .attr('title', (d) => {
        return `<div>Player Name: ${d.player_name}<br/>${this.state.clusterType === 'batting' ? 'Strike Rate' : 'Bowling Economy'} rate: ${d.dynamicParam} <br/> ${this.state.clusterType} Average: ${d.average}</div>`;
      })
      .call(force.drag);

    //commenting out to check
    this.node.on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr('z-index',40)
        .attr('r',25 )
        .attr('stroke-width',3)
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(500)
    		  .attr('r',d.radius)
          .attr('stroke-width',1)
      })
      .on('dblclick', function(d) {
        d.fixed = false; 
      })
      .on("click", (d) => this.navigateToPlayerAnalysis(d.playerId))
      .call(node_drag);

    this.node.transition()
      .duration(750)
      .delay(function(d, i) { return i * 5; })
      .attrTween("r", function(d) {
        var i = d3.interpolate(0, d.radius);
        return function(t) { return d.radius = i(t); };
      });
  }

  navigateToPlayerAnalysis(playerId) {
    this.props.history.push(`/playerAnalysis?playerId=${playerId}`);
  }

  tick(e) {
    this.node
      .each(this.cluster(10 * e.alpha * e.alpha))
      .each(this.collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }
  
  // Resolves collisions between d and all other circles.
  collide(alpha) {
    var quadtree = d3.geom.quadtree(this.state.nodes);
    return function(d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
  
  // Move d to be adjacent to the cluster node.
  cluster(alpha) {
    const clusters = this.clusters;
    return function(d) {
      var cluster = clusters[d.index];
      if (cluster === d) return;
      if(typeof(cluster) !== 'undefined') {
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l !== r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      }      
    };
  }
}

export default withRouter(Cluster);
