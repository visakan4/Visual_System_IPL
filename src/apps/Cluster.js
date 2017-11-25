import React, { Component } from 'react';
import * as d3 from 'd3';
import BatsmanData from './BatsmanData';

const padding = 1.5; // separation between same-color nodes
const clusterPadding = 16; // separation between different-color nodes
const maxRadius = 24;

const colorScale = d3.scale.category20();

const n = 6; // total number of nodes
const m = 4; // number of distinct clusters

const color = d3.scale.category10()
    .domain(d3.range(m));

	
// The largest node for each cluster.
const clusters = new Array(m);
const nodes = [];
let masterdata;


// to align
const margin = {top: 100	, right: 10, bottom: 20, left: 10};

const width = window.outerWidth - margin.left - margin.right;
const height = window.outerHeight - 100 - margin.top - margin.bottom;


class Cluster extends Component {
  render() {
    return (
      <div id="container">
        <div className='row'>
          <div className="col-6">
            <h1 className="page-heading">Cluster</h1>
          </div>
        </div>
        <hr/>
        <div id="clusterWrapper" className="graph-containercluster"></div>
      </div>
    );
  }
  
  componentDidMount() {
    
      const data = BatsmanData;
    	for (var i = 0; i < data.length; i++) {
    		var obj = data[i];
    		masterdata = data[i];
    		for (var key in obj){
    			var strike_rate = obj['batting_strike_rate'];	// Strike rate
    			var r = strike_rate / 10;		// radius
    			var n = obj['player_name'];		// player name
    			var div = obj['km_batting_cluster_label'];
          var batting_average = obj['batting_average'];			// division/group
    			var d = {cluster: div, radius: r,player_name: n,strike : strike_rate,batting : batting_average};
    		} 
    		if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    		nodes.push(d);
    	}



      // Use the pack layout to initialize node positions.
      d3.layout.pack()
          .sort(null)
          .size([width, height])
          .children(function(d) { return d.values; })
          .value(function(d) { return d.radius * d.radius; })
          .nodes({values: d3.nest()
            .key(function(d) { return d.cluster; })
            .entries(nodes)});

      var force = d3.layout.force()
          .nodes(nodes)
          .size([width, height])
          .gravity(.02)
          .charge(0)
          .on("tick", tick)
          .start();

      var svg = d3.select("#clusterWrapper").append("svg")
          .attr("width", width)
          .attr("height", height);
	
    	//  to pin point the node 
    	var node_drag = d3.behavior.drag()
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
        
	
    	var node = svg.selectAll("circle")
        .data(nodes)
      .enter().append("circle")
        .style("fill", function(d) { return color(d.cluster); })
    	//testing to round of the circle
    	.attr('stroke','black')
          .attr('stroke-width',1)
          .attr('fill',function (d,i) { return colorScale(i) })
        .call(force.drag);
    	//commenting out to check
    	node.on('mouseover', function () {
            d3.select(this)
              .transition()
              .duration(500)
    		  .attr('z-index',40)
    		  .attr('r',20)
              .attr('stroke-width',3)
          })
          .on('mouseout', function () {
            d3.select(this)
              .transition()
              .duration(500)
    		  .attr('r',10)
              .attr('stroke-width',1)
          })
    	  .on('dblclick', function(d) {
          d.fixed = false; 
        })
     .call(node_drag)
    	   .append('title') // Tooltip
          .text(function (d) { return 'Player_Name :'+d.player_name +'\n Strike_Rate :'+d.strike +'\n batting_average :'+d.batting });
	  
	  





    node.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
          var i = d3.interpolate(0, d.radius);
          return function(t) { return d.radius = i(t); };
        });
	

    function tick(e) {
      node
          .each(cluster(10 * e.alpha * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function(d) {
   
        var cluster = clusters[d.index];
        if (cluster === d) return;
        if (cluster === undefined) {
          debugger;
        }
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
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
  }
}

export default Cluster;
