const commentRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

commentRouter.get('/', (request, response) => {
  Comment.find({}).populate('user', { username: 1, name: 1 }).then(comments => {
    response.json(posts.map(post => post.toJSON()))
  })
})

commentRouter.get('/:id', async (request, response) => {
  Comment.findById(request.params.id).populate('user', { username: 1, name: 1 }).populate('post', { title: 1, content: 1 })
    .then(comment => {
      if (comment) {
        response.json(comment.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => response.status(400).status)
})

commentRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const post = await Post.findById(body.post)

    const comment = new Comment({
      content: body.content,
      user: user._id,
      post: body.post,
      score: 0
    })

    const savedComment = await comment.save()
    user.comments = user.comments.concat(savedComment._id)
    post.comments = post.comments.concat(savedComment.id)
    await user.save()
    await post.save()
    response.status(201).json(savedComment.toJSON)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = commentRouter