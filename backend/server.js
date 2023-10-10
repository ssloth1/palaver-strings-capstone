require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const studentRoutes = require('./routes/student')

// express
const app = express();


// middlware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/students', studentRoutes)

// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('listening on port', process.env.PORT)
        })
    })
    .catch(err => {
        console.log('failed to connect to database', err)
    })




