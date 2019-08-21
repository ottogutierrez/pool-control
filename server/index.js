const express = require('express')
const volleybal = require('volleyball')
const i2c = require('i2c-bus')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
app.use(cors())

app.use(volleybal)
app.use(express.static('public'))
const port = process.env.PORT || 3000

let i2c1

const ARDUINO_ADDRESS = 0x04
const CONTROL_PUMP = 0x06 // with this command need to send a buffer with an extra byte
const GETSTATUS_CMD = 0x09


const getStatus = (communicator)=>{
  const myBuffer = Buffer.alloc(2)
  const data = communicator.i2cReadSync(ARDUINO_ADDRESS,2,myBuffer)
  return myBuffer
}

const controlPump = (communicator, newStatus) => {
  // New status must be 0x01 for ON or 0x00 for OFF
  const myBuffer = Buffer.alloc(2)
  myBuffer[0] = CONTROL_PUMP
  myBuffer[1] = newStatus
  const dataWritten = communicator.i2cWriteSync(ARDUINO_ADDRESS,2,myBuffer)
  return dataWritten //just to verify it was correct
}

// Socket communication between server and front-end
io.once('connection', function(socket) { // io.once is used to avoid double connection
  let timerID // create timer for the scheduled updates
  // i2c communications
  i2c1 = i2c.openSync(1)
  console.log('new connection')
  const pressure = 0
  timerID = setInterval(() => {
    //console.log('message from internal, id: ' + socket.id)
    const currentStatus = getStatus(i2c1)
    const pressure = currentStatus[0]
    const pumpStatus = currentStatus[1]
    socket.emit('updateStatus',pressure, pumpStatus)
  }, 2000);

  socket.on('controlPump', function (newStatus) {
    const bytesWritten = controlPump(i2c1)
    // TODO check for errors
  })

  socket.on('disconnect', function(){
    console.log('closed connection')
    clearInterval(timerID)
    i2c1.closeSync()
  })
})

// Start the server
server.listen(port, ()=> {
  console.log(`Server listening on port ${port}`)
})

