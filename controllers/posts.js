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

postRouter.put('/:id', async (request, response) => {
  const body = request.body

  const post = {
    title: body.title,
    author: body.author,
    content: body.content,
    score: body.score
  }
  // Post.findByIdAndUpdate(request.params.id, post, { new: true }).then(
  //   updatedPost=>response.status(201).json(updatedPost.toJSON))
  //   .catch(error =>console.log(error))

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