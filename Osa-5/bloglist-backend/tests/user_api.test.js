const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const User = require('../models/user')

describe('when there is initially one user at db', () => {

    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', name: 'rootUser', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
  
    test('user with the same username is not added', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'root',
        name: 'admin',
        password: 'salainen',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
  
  test('too short user or password is not added', async () => {
    const usersAtStart = await helper.usersInDb()
    const incorrectUser = {
      username: 'ml',
      name: 'Matti',
      password: 'sl',
    }
  
    await api
      .post('/api/users')
      .send(incorrectUser)
      .expect(400)
  
    const usersAtEnd = await helper.usersInDb()
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })