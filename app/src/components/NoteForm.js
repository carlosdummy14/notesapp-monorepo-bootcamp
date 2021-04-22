import { useState, useRef } from 'react'
import Togglable from './Togglable'

export default function NoteForm ({ addNote, handleLogout }) {
  const [newNote, setNewNote] = useState('')
  const togglableRef = useRef()

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: false
    }

    addNote(noteObject)
    setNewNote('')
    togglableRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel='Create New Note' ref={togglableRef}>
      <h3>Create a new note</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Write your note here'
          value={newNote}
          onChange={handleChange}
        />
        <button>Create note</button>
      </form>
      <div>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </Togglable>
  )
}
