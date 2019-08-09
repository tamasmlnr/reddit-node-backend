const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('posts')
  response.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (request, response) => {
  User.findById(request.params.id)
    .then(user => {
      if (user) {
        response.json(user.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => response.status(400).status)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter