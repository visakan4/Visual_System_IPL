import React, { Component } from 'react';
import * as d3 from 'd3';
import GroundAnalysis from './GroundAnalysis';
import PlayerAnalysis from './PlayerAnalysis';
import TeamAnalysis from './TeamAnalysis';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <PlayerAnalysis />
        <GroundAnalysis />
        <TeamAnalysis />
      </div>
    );
  }
  
  componentDidMount() {
    // Write your d3js code here
  }
}

export default Dashboard;
