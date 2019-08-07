const postRouter = require('express').Router()
const Post = require('../models/post')

postRouter.get('/', (request, response) => {
  console.log(request.toJSON);
  Post.find({}).then(posts => {
    response.json(posts.map(post => post.toJSON()))
  })
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