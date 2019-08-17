const express = require('express')
const volleybal = require('volleyball')
//const i2c = require('i2c-bus')


const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


app.use(volleybal)
app.use(express.static('public'))
const port = process.env.PORT || 3000

// app.get('/', (req,res)=> {
//     res.json("Hello from server")
// })

const getStatus = (communicator)=>{
  return communicator.readByteSync(0x04,0x09)
}

io.on('connection', function(socket) {
  let timerID // create timer for the scheduled updates
  // i2c communications
  const i2c1 = i2c.openSync(1)
  console.log('new connection')
  const pressure = 0
  timerID = setInterval(() => {
    console.log('message from internal')
    const currentStatus = getStatus(ic21)
    socket.emit('updateStatus',currentStatus)
  }, 1000);

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

