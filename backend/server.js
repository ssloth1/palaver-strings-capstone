require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Import new route files
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const instructorRoutes = require('./routes/instructorRoutes')
const parentRoutes = require('./routes/parentRoutes')
const studentRoutes = require('./routes/studentRoutes')
const messageRoutes = require('./routes/messageRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const classRoutes = require('./routes/classRoutes')
//Not sure why this is breaking
//const scheduleRoutes = require('./routes/scheduleRoutes')

// express
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('en-US', {
        hour12: true, 
    });
    console.log(timestamp, req.method, req.path);
    next();
});

// Use the routes
app.use('/api/users', userRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/instructors', instructorRoutes)
app.use('/api/parents', parentRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/classes', classRoutes);
//app.use('/api/schedule', scheduleRoutes);

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