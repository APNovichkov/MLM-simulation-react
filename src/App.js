import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

import './App.css';

// Header
const Header = (props) => {
  return (
    <div className="container header">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>MLMSimulator</h1>
        </div>
      </div>
    </div>  
  )
}

// Test Button
const TestButton = (props) => {
  return (
    <div className="container header">
      <div className="row">
        <div className="col-md-12 text-center">
          <button className="btn btn-warning" style="margin-right: 10px;" onClick={runSimulation}> Run Simulation </button>
          <button className="btn btn-warning" style="margin-left: 10px;" onClick={showResults}> See Results </button>
        </div>
      </div>
    </div>  
  )
}

const TmpPlot = (props) => {
  return (
    <div className="container header">
      <div className="row">
        <div className="col-md-12 text-center">
          <div id="plot"></div>
        </div>
      </div>
    </div>  
  )
}

function runSimulation(){
  let request = 'http://localhost:8080/api/v1/mlm';
  console.log("API Request: " + request);

  axios.post(request, {headers: {'Access-Control-Allow-Origin': '*', Accept: 'application/json', 'Content-Type': 'application/json'}})
  .then(response => {
    console.log("Finished running simulation");
  }).catch(err => {
    console.log(err);
  })
}

function showResults(){
  let request = "http://localhost:8080/api/v1/mlm/ibotimeline";
  console.log("API request: " + request);

  axios.get(request, {headers: {'Access-Control-Allow-Origin': '*', Accept: 'application/json', 'Content-Type': 'application/json'}})
  .then(response => {
    console.log("Response months: " + response.data.months);
    console.log("Response nodes: " + response.data.nodes);

    var data = [];
    for(var i = 0; i < response.data.nodes.length; i++){
        data.push({
            x: response.data.months,
            y: response.data.nodes[i].values,
            name: response.data.nodes[i].nodeId
        });
    }
    
    var layout = {
          title: 'IBO Timeline Tracker: ' + response.data.nodes.length,
          xaxis: {
            title: 'Time(Months)',
            titlefont: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
          yaxis: {
            title: 'Monthly Income($)',
            titlefont: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        };
    
    Plot.newPlot(
        'plot',
        data,
        layout
    );

  })
}

function App() {

  const header = React.createElement(Header);
  const testButton = React.createElement(TestButton);
  const plot = React.createElement(TmpPlot);

  return React.createElement("div", {}, [
    header,
    testButton,
    plot
  ]);


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
