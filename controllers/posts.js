const postRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

postRouter.get('/', (request, response) => {
  Post.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { content: 1 })
    .then(posts => {
      response.json(posts.map(post => post.toJSON()))
    })
})


postRouter.delete('/:id', async (request, response) => {
  console.log(request.params.id);
  Post.findByIdAndDelete(request.params.id)
    .then(posts => {
      response.status(201);
    })
})

postRouter.get('/:id', async (request, response) => {
  Post.findById(request.params.id)

    .populate({
      path: 'user',
      populate: [
        { path: 'username' }
      ],
      path: 'comments',
      populate: [
        { path: 'user' },
        {
          path: 'username',
        }
      ]
    })
    .then(post => {
      if (post) {
        response.json(post.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => response.status(400).status)
})

postRouter.put('/:id', async (request, response) => {
  const body = request.body

  const post = {
    title: body.title,
    author: body.author,
    content: body.content,
    score: body.score,
    date: body.date,
    comments: body.comments,
    upvotes: body.upvotes,
    downvotes: body.downvotes,
    savedBy: body.savedBy
  }

  Post.findByIdAndUpdate(request.params.id, post, { new: true })
    .then(post => {
      if (post) {
        response.json(post.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => response.status(400).status)
})

postRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    console.log(user);
    const post = new Post({
      title: body.title,
      author: user.username,
      content: body.content,
      comments: [],
      score: 0,
      upvotes: [],
      downvotes: [],
      savedBy: [],
      user: user._id,
      date: Date.now()
    })

    const savedPost = await post.save()
    user.posts = user.posts.concat(savedPost._id)
    await user.save()
    response.json(savedPost)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = postRouter