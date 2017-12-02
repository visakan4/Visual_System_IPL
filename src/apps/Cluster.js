import React, { Component } from 'react';
import * as d3 from 'd3';
import BatsmanData from './BatsmanData';
import $ from 'jquery';
import Switch from 'react-bootstrap-switch';
import Select from 'react-select';
import _ from 'underscore';

const padding = 1.5; // separation between same-color nodes
const clusterPadding = 16; // separation between different-color nodes
const maxRadius = 24;

const colorScale = d3.scale.category20();

const m = 4; // number of distinct clusters

const color = d3.scale.category10()
    .domain(d3.range(m));

	
// The largest node for each cluster.
const clusters = new Array(m);

// to align
const margin = {top: 100	, right: 10, bottom: 20, left: 10};

const width = window.outerWidth - margin.left - margin.right;
const height = window.outerHeight - 100 - margin.top - margin.bottom;


class Cluster extends Component {
  constructor() {
    super();
    this.state = {
      nodes: []
    }
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
          	<label className="right-10">Number of clusters:</label>
          	<select id='cluster' className="custom-select">
          		<option value="0">2</option>
          		<option value="1">3</option>
          		<option value="2">4</option>
          	</select>

            <br />
            <label className="right-10">Select either bowling or batting data </label>
          	<Switch
              onChange={(el, state) => this.handleSwitch(el, state)}
              name='innings'
              onText="Batting"
              offText="Bowling"
              offColor="primary"
            />
            <br/>
            
          </div>
          <div className="col-6 text-right">
            <Select
              name="playerSelect"
              placeholder="Search a Player"
              options={this.getOptions()}
              onChange={this.searchNode.bind(this)}
            />
          </div>
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
    console.log('handleSwitch. elem:', elem);
    console.log('name:', elem.props.name);
    console.log('new state:', state);
  }
  
  searchNode(item) {
    var node = d3.select("body").selectAll("circle");
    if (item.value == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
      var selected = node.filter(function (d, i) {
        return d.player_name!= item.value;
      });
      selected.style("opacity", "0");
		  d3.select("body").selectAll("circle").transition()
        .duration(4000)
        .style("opacity", 1);
    }
  }

  componentDidMount() {  
    const data = BatsmanData;
  	const nodes = [];
    for (var i = 0; i < data.length; i++) {
  		var obj = data[i];
  		for (var key in obj){
  			var strike_rate = obj['batting_strike_rate'];	// Strike rate
  			var r = strike_rate / 10;		// radius
  			var n = obj['player_name'];		// player name
  			var div = obj['km_batting_cluster_label'];
        var batting_average = obj['batting_average'];			// division/group
  			var d = { cluster: div, radius: r, player_name: n, strike: strike_rate, batting: batting_average };
  		} 
  		if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  		nodes.push(d);
  	}
    this.setState({
      nodes: nodes
    }, () => {
      this.renderCluster();
      $('[data-toggle="tooltip"]').tooltip();
    });    
  }
  
  renderCluster() {
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

    const svg = d3.select("#clusterWrapper").append("svg")
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


    this.node = svg.selectAll("circle")
      .data(this.state.nodes)
      .enter().append("circle")
      .style("fill", function(d) { return color(d.cluster); })
      //testing to round of the circle
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'top')
      .attr('data-html', 'true')
      .attr('title', function(d) {
        return `<div>Player Name: ${d.player_name}<br/>Strike rate: ${d.strike} <br/> Batting Average: ${d.batting}</div>`;
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
      .call(node_drag);

    this.node.transition()
      .duration(750)
      .delay(function(d, i) { return i * 5; })
      .attrTween("r", function(d) {
        var i = d3.interpolate(0, d.radius);
        return function(t) { return d.radius = i(t); };
      });
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
    return function(d) {
      var cluster = clusters[d.index];
      if (cluster === d) return;
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
    };
  }
}

export default Cluster;
