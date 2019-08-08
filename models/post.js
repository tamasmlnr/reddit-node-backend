const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  author: String,
  content: String,
  score: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Post', postSchema)