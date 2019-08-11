const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: String,
  author: String,
  content: String,
  score: Number,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

module.exports = mongoose.model('Post', postSchema)