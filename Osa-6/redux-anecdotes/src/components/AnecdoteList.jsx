import { useSelector, useDispatch } from "react-redux";
import { handleLike } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch();
  anecdotes.sort((a, b) => a.votes > b.votes ? -1 : 0);

  const vote = (id) => {
    console.log('vote', id)
    dispatch(handleLike(id))
  }

  return (
    anecdotes.map(anecdote => (
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes} votes 
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    ))
  );
}

export default AnecdoteList
