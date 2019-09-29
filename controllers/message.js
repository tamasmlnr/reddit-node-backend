const messageRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Message = require('../models/message')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

messageRouter.get('/', (request, response) => {
  Message.find({}).populate('userFrom', { username: 1, name: 1 }).then(m => {
    response.json(m.map(message => message.toJSON()))
  })
})

messageRouter.get('/:userToId', async (request, response) => {
  const userToId = request.params.userToId;
  Message.find({"userTo" : userToId}).populate('userFrom', { username: 1, name: 1 }).then(m => {
    response.json(m.map(message => message.toJSON()))
  })
})

messageRouter.post('/', async (request, response, next) => {
  const body = request.body
  console.log(request.headers);
  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const message = new Message({
      content: body.content,
      userFrom: userFrom._id,
      userTo: userTo.id,
      date: Date.now(),
    })

    const savedMessage = await message.save()
    response.status(201).json(savedMessage.toJSON)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = messageRouter