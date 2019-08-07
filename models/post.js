const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  author: String,
  score: Number,
})

module.exports = mongoose.model('Post', postSchema)