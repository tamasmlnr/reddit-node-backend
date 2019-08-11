const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  score: Number,
  date: Date
})

module.exports = mongoose.model('Comment', commentSchema)