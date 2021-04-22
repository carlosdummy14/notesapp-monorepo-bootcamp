/* eslint no-undef: */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, server, getUsers } = require('./helpers')

describe.only('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  test('works as expected a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'chavito',
      name: 'Juan',
      password: 'twitch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'root',
      name: 'cualquiera',
      password: 'cualquieratambien'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const userAtEnd = await getUsers()
    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
