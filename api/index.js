require('dotenv').config()

require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

app.use(cors())
app.use(express.json())
app.use(express.static('../app/build'))

app.get('/', (request, response) => {
  response.send('<h1>Hola API de origen</h1>')
})

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use('/api/notes', notesRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
