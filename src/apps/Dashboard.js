import React, { Component } from 'react';
import * as d3 from 'd3';
import GroundAnalysis from './GroundAnalysis';
import PlayerAnalysis from './PlayerAnalysis';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <PlayerAnalysis />
        <GroundAnalysis />
      </div>
    );
  }
  
  componentDidMount() {
    // Write your d3js code here
  }
}

export default Dashboard;
