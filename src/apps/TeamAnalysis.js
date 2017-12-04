import React, { Component } from 'react';

class TeamAnalysis extends Component {
  render() {
    return (
      <div>
        <h3>Team Analysis</h3>
        <hr/>
        <div className="row">
          <div className="col-12">
            <iframe title="Team analysis" src="https://visualpearl.azurewebsites.net/VAT/MapPage.html" width={window.outerWidth - 30} height= "600" style={{border: 'none'}}></iframe>
          </div>
            
          <div className="col-12">
            <div id="treeWrapper"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamAnalysis;
