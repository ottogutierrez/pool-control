import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client'

function App() {

  const [currentPressure, setCurrentPressure] = useState(0)
  const [isPumpOn, setIsPumpOn] = useState(0)

  //const socket = io("http://localhost:3000")
  const socket = io()
	
  socket.on('updateStatus', function(pressure, pumpStatus) {
    setCurrentPressure(pressure)
    setIsPumpOn(pumpStatus)
    //console.table(data)
  })

  return (
   <>
   <button style={{float:'right', height:'50px'}} >Turn on Pump</button>
    <h1>Pool Control</h1>
    
    <hr/>
    <h2>Status of the Pool Equipment</h2>
    <div>
      <h3>Filter Pressure (psi):</h3>
      <h3 className="status"> {currentPressure} psi </h3>
    </div>
    <div>
      <h3>Pool Pump (On/Off):</h3>
      <h3 className="status"> {isPumpOn ? "ON" : "OFF"} </h3>
    </div>
    <hr />
    <h2>Control</h2>
    
   </>
  );
}

export default App;
