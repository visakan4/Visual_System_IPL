import React, { Component } from 'react';
import * as d3 from 'd3';
import GroundAnalysis from './GroundAnalysis';
import PlayerAnalysis from './PlayerAnalysis';
import TeamAnalysis from './TeamAnalysis';
import Sidebar from 'react-sidebar';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: true
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }
    
  render() {
    var sidebarContent = <b>Sidebar content</b>;
    return (
      <div>
        <Sidebar sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          docked={true}>
          <PlayerAnalysis />
          <GroundAnalysis />
          <TeamAnalysis />
        </Sidebar>
      </div>
    );
  }
  
  componentDidMount() {
    // Write your d3js code here
  }
}

export default Dashboard;
