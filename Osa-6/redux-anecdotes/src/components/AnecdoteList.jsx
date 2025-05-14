import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => {
      return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  })

  anecdotes.sort((a, b) => a.votes > b.votes ? -1 : 0);

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    anecdotes.map(anecdote => (
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes} votes 
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    ))
  );
}

export default AnecdoteList
