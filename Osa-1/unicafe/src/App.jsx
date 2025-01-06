import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Heading = (props) => (
  <h1>
    {props.text}
  </h1>
)

const StatisticsLine = (props) => (
  <tr>
  <td>{props.text}</td>
  <td>{props.value}</td>
  </tr>
)

const Statistics = (props) => {
  if (props.all === 0) {
    return (
    <div>
      <p>no feedback given</p>
    </div>
    )
  }
  return (
  <table>
    <tbody>
    <StatisticsLine text="good" value={props.good} />
    <StatisticsLine text="neutral" value={props.neutral} />
    <StatisticsLine text="bad" value={props.bad} />
    <StatisticsLine text="all" value={props.all} />
    <StatisticsLine text="average" value={props.average} />
    <StatisticsLine text="positive" value={props.positive} />
    </tbody>
  </table>
)
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setAll(all + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  return (
    <div>
      <Heading text="give feedback" />
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <Heading text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={(good - bad) / all} positive={(good * 100 / all) + " %"} />
    </div>
  )
}

export default App
