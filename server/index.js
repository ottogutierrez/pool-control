const express = require('express')
const volleybal = require('volleyball')
const i2c = require('i2c-bus')

const app = express()
app.use(volleybal)
app.use(express.static('public'))
const port = process.env.PORT || 3000

// app.get('/', (req,res)=> {
//     res.json("Hello from server")
// })

app.listen(port, ()=> {
  console.log(`Server listening on port ${port}`)
  const i2c1 = i2c.openSync(1)
  i2c1.writeByteSync(0x04,0x08,0x01)
  setTimeout(()=>{
    const value = i2c1.readByteSync(0x04,0x09)
    console.log(value)
  },3000)
  i2c1.closeSync()

})

