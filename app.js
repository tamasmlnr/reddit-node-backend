const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const postRouter = require('./controllers/posts')

const mongoUrl = process.env.MONGO_REDDIT_URI
console.log(`connecting to ${mongoUrl}`);

mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Error connecting to database! ", err);
});

app.use(cors())
app.use(bodyParser.json())
app.use('/api/posts', postRouter)

module.exports = app