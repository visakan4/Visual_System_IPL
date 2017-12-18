import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import GroundAnalysis from './GroundAnalysis';
import PlayerAnalysis from './PlayerAnalysis';
import TeamAnalysis from './TeamAnalysis';
import Cluster from './Cluster';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link className="navbar-brand" to="/">VAT</Link>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav ml-auto">
              <li className={`${window.location.pathname === '/groundanalysis' ? 'active' : ''} nav-item`}>
                <Link className="nav-link" to="/groundanalysis">Ground Analysis</Link>
              </li>
              <li className={`${window.location.pathname === '/playeranalysis' ? 'active' : ''} nav-item`}>
                <Link className="nav-link" to="/playeranalysis">Player Analysis</Link>
              </li>
              <li className={`${window.location.pathname === '/cluster' ? 'active' : ''} nav-item`}>
                <Link className="nav-link" to="/cluster">Cluster</Link>
              </li>
              <li className={`${window.location.pathname === '/teamanalysis' ? 'active' : ''} nav-item`}>
                <Link className="nav-link" to="/teamanalysis">Team Analysis</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container-fluid">
          <Switch>
            <Route exact path='/' component={TeamAnalysis}/>
            <Route path='/groundanalysis' component={GroundAnalysis}/>
            <Route path='/playeranalysis' component={PlayerAnalysis}/>
            <Route path='/teamanalysis' component={TeamAnalysis}/>
            <Route path='/cluster' component={Cluster}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default Dashboard;
