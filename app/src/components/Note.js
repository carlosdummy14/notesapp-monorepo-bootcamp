const Note = ({ note, toggleImportantOf }) => {
  const { content, date } = note
  const label = note.important
    ? 'make not important'
    : 'make important'

  return (
    <li>
      {content}
      <button onClick={toggleImportantOf}>{label}</button>
      <small>{date}</small>
    </li>
  )
}

export default Note
