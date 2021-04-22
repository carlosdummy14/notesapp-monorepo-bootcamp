const mongoose = require('mongoose')

const Note = require('../models/Note')
const {
  api,
  server,
  initialNotes,
  getAllContentsFromNotes
} = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()
})

describe('GET all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const { response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first note is about FullStack', async () => {
    const { contents } = await getAllContentsFromNotes()

    expect(contents).toContain('Aprendiendo FullStack')
  })
})

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    const newNote = {
      content: 'Proximamente async/await',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentsFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentsFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentsFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentsFromNotes()

  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)

  const { response } = await getAllContentsFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
