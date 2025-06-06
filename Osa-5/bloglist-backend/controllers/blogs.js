const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {

  const user = request.user

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'content missing' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user._id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

    const blogIndex = user.blogs.indexOf(request.params.id)
    user.blogs.splice(blogIndex, 1)
    await user.save()
  } 

})

module.exports = blogsRouter