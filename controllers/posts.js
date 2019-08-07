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
      score: body.score
    })

    const savedPost = await post.save()
    response.status(201).json(savedPost.toJSON)
  }
  catch (exception) {
    response.status(201).json("Could not post!")
  }
})

// blogRouter.delete('/:id', async (request, response) => {
//   await Blog.findByIdAndRemove(request.params.id)
//   response.status(204).end()
// })

// blogRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const blog = {
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes,
//     user: body.user
//   }

//   const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//   response.status(201).json(result.toJSON)
// })

module.exports = postRouter