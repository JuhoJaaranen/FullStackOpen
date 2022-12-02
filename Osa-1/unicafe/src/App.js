import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>{props.heading}</h1>
    </div>
  )
}

const Head = (props) => {
  return (
    <>
    <h1>{props.head}</h1>
    </>
  )
}



const Stats = (props) => {
  if (props.all === 0 && props.tila === true) {
    return(
    <div>
      <p>No feedback given</p>
    </div>
    )
  }
  else if (props.all > 0) {
    return (

      <tr>
        <td>{props.nimi} {props.arvo}</td>
      </tr>
    
      )
  }
 
}

const Button = ({ Click, text }) => (
  <button onClick={Click}>
    {text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState([])

  const yht = all.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const average = yht / all.length

  const positive = good / all.length *100 +"%"

  const handleGood = () => {
    setAll(all.concat(1))
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setAll(all.concat(0))
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setAll(all.concat(-1))
    setBad(bad + 1)
  }

  const headings = {
    head1: 'give feedback',
    head2: 'statistics'
  }

  return (
    <div>
      <Header heading={headings.head1}/>
      <Button Click={handleGood} text='good'/>
      <Button Click={handleNeutral} text='neutral'/>
      <Button Click={handleBad} text='bad'/>
      <Head head={headings.head2}/>
      <table>
      <tbody>
      <Stats tila={true} all={all.length}/>
      <Stats nimi='good' arvo={good} all={all.length}/>
      <Stats nimi='neutral' arvo={neutral} all={all.length}/>
      <Stats nimi='bad' arvo={bad} all={all.length}/>
      <Stats nimi='all' arvo={all.length} all={all.length}/>
      <Stats nimi='average' arvo={average} all={all.length}/>
      <Stats nimi='positive' arvo={positive} all={all.length}/>
      </tbody>
      </table>
    </div>
  )
}

export default App