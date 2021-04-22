const userExtractor = require('../middlewares/userExtractor')
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response, next) => {
  try {
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1
    })

    response.json(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    const note = await Note.findById(id).populate('user', {
      username: 1,
      name: 1
    })

    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => response.json(result))
    .catch(error => next(error))
})

notesRouter.delete('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  const { userId } = request

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = notesRouter
