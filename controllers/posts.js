const postRouter = require('express').Router()
const Post = require('../models/post')

postRouter.get('/', (request, response) => {
  Post.find({}).then(posts => {
    response.json(posts.map(post => post.toJSON()))
  })
})

postRouter.get('/:id', async (request, response) => {
  Post.findById(request.params.id)
    .then(post => {
      if (post) {
        response.json(post.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => response.status(400).status)
})



postRouter.post('/', async (request, response) => {

  try {
    const body = request.body

    const post = new Post({
      title: body.title,
      author: body.author,
      content: body.content,
      score: 0
    })

    const savedPost = await post.save()
    response.status(201).json(savedPost.toJSON)
  }
  catch (exception) {
    response.status(201).json("Could not post!")
  }
})

module.exports = postRouter