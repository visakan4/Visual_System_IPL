import React, { Component } from 'react';

const divStyle = {
  border:'none',
  'margin-left':'180px'
}

class TeamAnalysis extends Component {
  render() {
    return (
      <div>
        <h3>Team Analysis</h3>
        <hr/>
        {/* We have deployed these two visualisation in another server as we were facing problems with reach framework in our server*/}
        <div className="row">
          <div className="col-12">
            <iframe title="Team analysis" src="https://visualpearl.azurewebsites.net/others/MapPage.html" width={window.outerWidth - 30} height= "800" style={{border: 'none'}}></iframe>
          </div>
          <div className="col-12">
            <div id="treeWrapper" style={{'text-align': 'center'}}>
              <iframe title="Team analysis" src="https://visualpearl.azurewebsites.net/VA/treeMap.html" width={window.outerWidth - 30} height= "800" style={divStyle}></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamAnalysis;
