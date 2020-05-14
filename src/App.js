import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';


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
const ApiButtons = (props) => {
  return (
    <div className="container header">
      <div className="row">
        <div className="col-md-12 text-center">
          <button className="btn btn-warning" style={{marginRight: "10px"}} onClick={props.onRunSimulation}> Run Simulation </button>
          <button className="btn btn-warning" style={{marginLeft: "10px"}} onClick={props.onShowResults}> See Results </button>
        </div>
      </div>
    </div>  
  )
}

const RePlot = ({data}) => {
  return (
    <div className="container header">
      <div className="row">
        <div className="col-md-12 text-center">
          <div id="plot">
            <LineChart width={500} height={300} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5,}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              { createLines(data) }

            </LineChart>
          </div>
        </div>
      </div>
    </div>  
  )
}


function createLines(data){
  const colors = ["#82ca9d", "#8884d8", "#8893d0"];

  let lines = [];

  for(let i = 1; i < Object.keys(data[0]).length; i++){
    lines.push(<Line type="monotone" dataKey={`node${i}`} stroke={colors[i]}/>);
  }

  return lines;
}


function runSimulation(){
  let request = 'http://localhost:8080/api/v1/mlm';
  console.log("API Request: " + request);

  return axios.post(request, {headers: {'Access-Control-Allow-Origin': '*', Accept: 'application/json', 'Content-Type': 'application/json'}})
  
}

function showResults(){
  let request = "http://localhost:8080/api/v1/mlm/ibotimeline";
  console.log("API request: " + request);

  return axios.get(request, {headers: {'Access-Control-Allow-Origin': '*', Accept: 'application/json', 'Content-Type': 'application/json'}})
  
}


function App() {
  const [data, updateData] = useState({});
  const [showPlot, updateShowPlot] = useState(false);


  const handleOnRunSimulation = () => {
    console.log("Handling on run simulation");
    runSimulation();  
  }

  const handleOnShowResults = () => {
    console.log("Handling on show results");
    showResults().then(response => {
      console.log(response.data)

      let t_data = response.data.months.reduce((acc, month) => {
        // console.log(`Month: ${month}`)
        acc.push({
          'month': month
        })
        return acc;
      }, []).map((month, i) => {
        // console.log(`Month: ${month.month}`)
        response.data.nodes.map((node, j) => {
          month[`node${j+1}`] = node.values[i];
        })
        return month;
      });

      // console.log(t_data);

      updateData(t_data);
      updateShowPlot(true);
    }).catch(err => {
      console.log(err);
    })
  }
  
  return (
    <div>
      <Header/>
      <ApiButtons onRunSimulation={handleOnRunSimulation} onShowResults={handleOnShowResults}/>
      {showPlot && (<RePlot data={data}/>)}
    </div>
  );
}

export default App;
