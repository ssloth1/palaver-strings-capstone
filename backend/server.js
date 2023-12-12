require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Import new route files
const adminRoutes = require('./routes/adminRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const parentRoutes = require('./routes/parentRoutes')
const studentRoutes = require('./routes/studentRoutes')

// express
const app = express();

// middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Use the routes
app.use('/api/admins', adminRoutes)
app.use('/api/instructors', instructorRoutes)
//app.use('/api/parents', parentRoutes)
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




