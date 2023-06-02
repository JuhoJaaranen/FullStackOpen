import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   


  const randomizer = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVote = (selected) => {
    const newVote = [...votes]
    newVote[selected]++
    setVotes(newVote)

  }
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <br></br>
      <p>has {votes[selected]} votes</p>
      <button onClick={randomizer}>next anecdote</button>
      <button onClick={handleVote(selected)}>vote</button>
    </div>
  )
}

export default App