import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

const getIcon = (weatherCode) => {
  const request = axios.get(`http://localhost:3001/${weatherCode}/`)
  return request.then(response => response.data)
}

const getWeather = (countryName) => {
  const request = axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${countryName}&count=1&language=en&format=json`)
  return request.then(response => 
     axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${response.data.results[0].latitude}&longitude=${response.data.results[0].longitude}&current=temperature_2m,is_day,weather_code,wind_speed_10m&wind_speed_unit=ms&forecast_days=1`)
     .then(response => response.data))
}


  export default {getAll, getWeather, getIcon}

