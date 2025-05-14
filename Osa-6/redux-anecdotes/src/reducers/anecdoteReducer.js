import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    handleVote(state, action) {
      const id = action.payload.id
      const updatedVote = action.payload
      return state.map(anecdote => anecdote.id !== id ? anecdote : updatedVote )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { handleVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdotes(anecdotes))
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const id = anecdote.id
    const updatedVote = {...anecdote, votes: anecdote.votes + 1}
    const updatedAnecdote = await anecdoteService.updateAnecdote(id, updatedVote)
    dispatch(handleVote(updatedAnecdote))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer