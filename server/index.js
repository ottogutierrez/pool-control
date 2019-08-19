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
  const data = communicator.readByteSync(ARDUINO_ADDRESS,GETSTATUS_CMD)
  console.table(data) // Need to see what go I get
  return data
}

const controlPump = (communicator, newStatus) => {
  // New status must be 0x01 for ON or 0x00 for OFF
  // TODO: need to implement this function
}

io.on('connection', function(socket) {
  let timerID // create timer for the scheduled updates
  // i2c communications
  i2c1 = i2c.openSync(1)
  console.log('new connection')
  const pressure = 0
  timerID = setInterval(() => {
    console.log('message from internal')
    const currentStatus = getStatus(i2c1)
    socket.emit('updateStatus',currentStatus)
  }, 3000);

  socket.on('disconnect', function(){
    console.log('closed connection')
    clearInterval(timerID)
    i2c1.closeSync()
  })
})


server.listen(port, ()=> {
  console.log(`Server listening on port ${port}`)
  // const i2c1 = i2c.openSync(1)
  // i2c1.writeByteSync(0x04,0x08,0x01)
  // setTimeout(()=>{
  //   const value = i2c1.readByteSync(0x04,0x09)
  //   console.log(value)
  // },3000)
  // i2c1.closeSync()

})

