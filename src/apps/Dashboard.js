import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { Switch, Route, Link } from 'react-router-dom';
import * as d3 from 'd3';
import GroundAnalysis from './GroundAnalysis';
import PlayerAnalysis from './PlayerAnalysis';
import Cluster from './Cluster';

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
    const sidebarContent = (
      <div className="sidenav">
        <h1 className="logo">VAT</h1>
        <Link to="/">Home</Link>
        <Link to="/groundanalysis">Ground Analysis</Link>
        <Link to="/playeranalysis">Player Analysis</Link>
        <Link to="/cluster">Cluster</Link>
      </div>

    );
    return (
      <div>
        <Sidebar sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          docked={true}
          sidebarClassName='sidebar-wrapper'>
          <div className="container-fluid page-wrapper">
            <Switch>
              <Route exact path='/' component={PlayerAnalysis}/>
              <Route path='/groundanalysis' component={GroundAnalysis}/>
              <Route path='/playeranalysis' component={PlayerAnalysis}/>
              <Route path='/cluster' component={Cluster}/>
            </Switch>
          </div>
        </Sidebar>
      </div>
    );
  }
  
  componentDidMount() {
    // Write your d3js code here
  }
}

export default Dashboard;
