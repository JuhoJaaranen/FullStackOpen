import { useDispatch } from "react-redux"
import { handleNewAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const newAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(handleNewAnecdote(content))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div><input name='content' /></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
