import { useState, useEffect } from 'react'
import bookService from './services/persons'

const Notification = ({ message, errorColor }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

  if (message === null) {
    return null
  }

  if (errorColor === 'green') {
    notificationStyle.color = 'green'
  }
  else if (errorColor == 'red') {
    notificationStyle.color = 'red'
  }
  
  
  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  )
}

const Person = ({ person, deletePerson }) => (
  <>
  {person.name} {person.number}
  <button onClick={deletePerson}>delete</button>
  <br/> 
  </>
)

const Filter = ({nameFilter, handleFilterChange}) => (
  <div>
    filter shown with <input value={nameFilter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({addPerson, newName, handlePersonChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Persons = ({personfilter, deletePerson}) => (
  <div>
    {personfilter.map(person => 
      <Person key={person.name} person={person} deletePerson={() => deletePerson(person.id , person.name)} />
    )}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorColor, setErrorColor] = useState('')

  useEffect(() => {
    bookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    } 

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(p => p.name === newName).id
        bookService
        .update(personId, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))

          setErrorColor('green')
          setErrorMessage(
            `Changed ${newName} number to ${newNumber}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorColor('red')
          setErrorMessage(
            `Information of ${newName} has already been removed from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

      }
    }

    else {
    bookService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      setErrorColor('green')
      setErrorMessage(
        `Added ${newName}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removePerson = (id, personName) => {
    if (window.confirm(`Delete ${personName} ?`)) {
    bookService
    .deletePerson(id)
    setPersons(persons.filter(p => p.id !== id))
    
    setErrorColor('green')
    setErrorMessage(
      `Deleted ${personName}`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const personfilter = persons.filter((person) => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} errorColor={errorColor} />
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange}/>

      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handlePersonChange={handlePersonChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Persons personfilter={personfilter} deletePerson={removePerson}/>
    </div>
  )

}

export default App