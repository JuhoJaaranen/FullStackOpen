import { useEffect, useState } from 'react'
import infoService from './services/countries'
// HUOM!!!!! descriptions.json hostataan lokaalissa verkossa json-server:in avulla

const Search = ({countrySearch, handleSearchChange}) => (
  <div>
    find countries <input value={countrySearch} onChange={handleSearchChange} />
  </div>
)
const Country = ({name, show}) => (
  <>
    {name.common}
    <button onClick={show}>show</button>
    <br/>
  </>
)

const SingleCountry = ({country}) => {
  const languages = Object.values(country.languages)
  const [cityWeather, setCityWeather] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState(null)

  useEffect(() => {
    infoService
      .getWeather(country.name.common)
      .then(weather => {
        setCityWeather(weather)
        getWeatherIcon(weather)
      })
  }, [])

  const getWeatherIcon = (weather) => {
    infoService
      .getIcon(weather.current.weather_code)
      .then(icon => 
        setWeatherIcon(icon)
      )
  }

  const nightOrDay = () => {
    if (cityWeather.current.is_day === 0) {
      return weatherIcon.night.image
    }
    else {
      return weatherIcon.night.image
    }
  }
  
  if (!cityWeather, !weatherIcon) {
    return null
  }
  else {
    //nightOrDay(cityWeather.current.weather_code)
  return (
 <div>
  <h1>{country.name.common}</h1>
  <p>
  capital {country.capital}<br/>
  area {country.area}
  </p>
  <strong>languages:</strong>
  <ul>
    {languages.map(language =>
      <li key={language}> {language} </li>
    )}
  </ul>
    <img src={country.flags.png} width="200" height="200"/>
    <h2>Weather in {country.name.common}</h2>
    <p>temperature {cityWeather.current.temperature_2m} Celcius</p>
    <img src={nightOrDay()} />
    <p>Wind {cityWeather.current.wind_speed_10m} m/s</p>
 </div>
 )
}
}

const Countries = ({ countries, countrySearch, showCountry}) => {
  const filter = countries.filter((country) => country.name.common.toLowerCase().includes(countrySearch.toLowerCase()))
  if (filter.length < 11 && filter.length > 1 ) {
  return (
 <div>
  {filter.map(country => 
    <Country key={country.name.common} name={country.name} show={() => showCountry(country.name.common)}/>
  )}
  </div>
  )
  }
  else if (filter.length === 1) {
    return (
    <div>
      {filter.map(country => 
        <SingleCountry key={country.area} country={country}/>
      )}
    </div>
    )
  }
  else {
    return (
    <div>
      Too many matches, specify another filter
    </div>
    )
  }
}

const App = () => {
  const [countrySearch, setCountrySearch] = useState('')
  const [countries, setCountries] = useState(null)

  const handleSearchChange = (event) => {
    setCountrySearch(event.target.value)
  }

  const showCountry = (country) => {
    setCountrySearch(country)
  }

  useEffect(() => {
    infoService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  if (!countries) { 
    return null 
  }
  else {
  return(
    <div>
      <Search handleSearchChange={handleSearchChange}/>
      <Countries countries={countries} countrySearch={countrySearch} showCountry={showCountry}/>
    </div>
  )
  }
}

export default App