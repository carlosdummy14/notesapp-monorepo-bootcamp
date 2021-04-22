const supertest = require('supertest')
const { app, server } = require('../index')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo FullStack',
    important: true,
    date: new Date()
  },
  {
    content: 'Siguelo en Twitch',
    important: true,
    date: new Date()
  }
]

const getAllContentsFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})

  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  server,
  initialNotes,
  getAllContentsFromNotes,
  getUsers
}
