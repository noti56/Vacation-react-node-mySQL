const express = require('express')
const app = express()
 require('dotenv').config()
require('./db')


app.use(express.json())  //json
app.use(require('cors')()) // cors

//routes

app.use('/users',require('./users'))
app.use('/vacations',require('./vacations'))




app.listen(1000, () => console.log('started on 1000'))

