const express = require('express')
const volleybal = require('volleyball')

const app = express()
app.use(volleybal)

const port = process.env.PORT || 3000

app.get('/', (req,res)=> {
    res.json("Hello from server")
})

app.listen(port, ()=> console.log(`Server listening on port ${port}`))

