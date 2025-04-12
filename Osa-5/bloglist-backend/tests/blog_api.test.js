const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('blogs have an id', async () => {
  const response = await api.get('/api/blogs')
  
  const ids = response.body.map(n => Object.keys(n)[4])

  assert.strictEqual(ids.includes('id','id'), true)
})


describe('a blog ', () => {
  let authHeader

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'rootUser', passwordHash })
    user.blogs = [
      '6798ffdff19a0f548d8258ab',
      '67a21a7247cc459c4381aa21'
    ]

    await user.save()

    const loginUser = {
      username: "root",
      password: "sekret"
    }

    const login =  await api
      .post('/api/login')
      .send(loginUser)

    authHeader = {  'Authorization': `Bearer ${login.body.token}` }
    const initialblogs = helper.initialBlogs
    const blogsUser = await api.get('/api/users')
    initialblogs[0].user = blogsUser.body[0].id
    initialblogs[1].user = blogsUser.body[0].id


    await Blog.deleteMany({})
    await Blog.insertMany(initialblogs)
  })

  test('can be added', async () => {
    const newBlog = {
        title:"testing",
        author:"rootUser",
        url:"localhost",
        likes:"1"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(authHeader)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })

  test('can be added without likes', async () => {
    const newBlog = {
        _id: "67a21a7247cc459c4381aa23",
        title:"testing",
        author:"rootUser",
        url:"localhost"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(authHeader)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })

  test('without token is not added', async () => {
    const newBlog = {
      title:"testing",
      author:"rootUser",
      url:"localhost"
    }

    const startingBlogs = await api.get('/api/blogs')
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    assert.strictEqual(startingBlogs.body.length, helper.initialBlogs.length)
})

  test('without title or url is not added', async () => {
    const newBlog = {
      _id: "67a21a7247cc459c4381aa23",
      author:"rootUser",
      likes: "0"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .set(authHeader)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('can be deleted', async () => {
    const blogs = await api.get('/api/blogs')
    
    await api
      .delete(`/api/blogs/${blogs.body[1].id}`)
      .expect(204)
      .set(authHeader)

      const blogsLeft = await api.get('/api/blogs')
      assert.strictEqual(blogsLeft.body.length, helper.initialBlogs.length - 1)
      
      const idsLeft = blogsLeft.body.map(blog => blog._id)
      assert(!idsLeft.includes(helper.initialBlogs[1]._id))
  })

  test('can be updated', async () => {
    const oldBlog = await api.get(`/api/blogs/${helper.initialBlogs[0]._id}`)

    const updateBlog = await api.get(`/api/blogs/${helper.initialBlogs[0]._id}`)
    updateBlog.body.likes += 1
    
    await api
      .put(`/api/blogs/${updateBlog.body.id}`)
      .send(updateBlog.body)
      .expect(200)

    const blogAfterUpdate = await api.get(`/api/blogs/${helper.initialBlogs[0]._id}`)

    assert.strictEqual(blogAfterUpdate.body.likes - 1, oldBlog.body.likes)
  })
})

after(async () => {
    await mongoose.connection.close()
  })