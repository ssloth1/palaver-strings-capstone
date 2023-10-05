require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

// express
const app = express();

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes should go below here:
//...................


// connect to database
mongoose.connect(process.env.MONGO_URI) 
    .then(() => {
        console.log('connected to mongodb')
        app.listen(process.env.PORT, () => {
            console.log('listening on port ' + process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })

app.get('/', (req, res) => {
    res.json({message: 'Hello World'})
})


