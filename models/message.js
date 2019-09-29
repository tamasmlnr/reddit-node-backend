const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  content: String,
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date
})

module.exports = mongoose.model('Message', messageSchema)