import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Route, BrowserRouter, Link, Router } from "react-router-dom";

const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';

const WEATHERICON = {
  clear: "./weatherStates/weather-clear.png",
  clear_night: "./weatherStates/weather-clear-night.png",
  part_clouds: "./weatherStates/weather-part-clouds.png",
  cloudy: "./weatherStates/weather-cloudy.png",
  cloudy_rains_light: "./weatherStates/weather-light-rains.png",
  heavy_rains: "./weatherStates/weather-rain-heavy.png",
  thunderstorm: "./weatherStates/weather-thunderstorm.png",
  scattered_rains: "./weatherStates/weather-scattered-showers.png",
  snowy: "./weatherStates/weather-windy.png",
  windy: "./weatherStates/weather-windy.png",
  error: "./weatherStates/weather-error.png",
}

async function getAPIdata(url) {
  const response = await fetch(url)
  let data = response.json();
  return data;
}

function getWeatherCurrentStatus(switchClause) {
  switch (switchClause) {
    case 'clear sky':
      return {
        cardImage: WEATHERICON.clear,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-success",

      }
      break;
    case 'few clouds':
      return {
        cardImage: WEATHERICON.cloudy,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-success",
      }
      break;
    case 'scattered clouds':

      return {
        cardImage: WEATHERICON.cloudy,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-success",
      }
      break;
    case 'broken clouds':

      return {
        cardImage: WEATHERICON.cloudy,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-success",
      }

      break;
    case 'overcast clouds':
      return {
        cardImage: WEATHERICON.part_clouds,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-success",
      }
    case 'shower rain':

      return {
        cardImage: WEATHERICON.cloudy_rains_light,
        eventPossibilityClass: 'warning',
        bootstrapClass: "badge-warning",
      }
      break;
    case 'moderate rain':

      return {
        cardImage: WEATHERICON.cloudy_rains_light,
        eventPossibilityClass: 'warning',
        bootstrapClass: "badge-warning",
      }
      break;
    case 'rain':
      return {
        cardImage: WEATHERICON.heavy_rains,
        eventPossibilityClass: 'unsafe',
        bootstrapClass: "badge-danger",
      }
      break;
    case 'light rain':
      return {
        cardImage: WEATHERICON.heavy_rains,
        eventPossibilityClass: 'unsafe',
        bootstrapClass: "badge-danger",
      }
      break;
    case 'thunderstorm':

      return {
        cardImage: WEATHERICON.thunderstorm,
        eventPossibilityClass: 'unsafe',
        bootstrapClass: "badge-danger",
      }
      break
    case 'snow':
      return {
        cardImage: WEATHERICON.snowy,
        eventPossibilityClass: 'safe',
        bootstrapClass: "badge-primary",
      }
      break;
    default:
      return {
        cardImage: WEATHERICON.error,
        eventPossibilityClass: 'Unknown',
        bootstrapClass: "badge-secondary",
      }
      break;
  }
}


function epochToJsDate(ts) {
  // ts = epoch timestamp
  // returns date obj 
  return new Date(ts * 1000);
}

function getQueryWeather(queryReq, type = 'summary', key) {
  let query;

  if (typeof (queryReq) === 'string') {
    queryReq = queryReq.toLowerCase();
    query = `https://api.openweathermap.org/data/2.5/weather?q=${queryReq}&appid=${key}&units=metric`
  } else if (typeof (queryReq) === 'object') {
    let units = 'metric'
    query = `https://api.openweathermap.org/data/2.5/onecall?lat=${queryReq.lat}&lon=${queryReq.lon}&units=${units}&appid=${key}`
  } else {
    query = `https://api.openweathermap.org/data/2.5/weather?q=${'new york'}&appid=${key}&units=metric`
  }

  return new Promise((resolve, reject) => {
    let data = getAPIdata(encodeURI(query));

    data.then(function (data) {

      // needed variables
      let location;
      let time;
      let details;
      let description;

      if (!query.includes("onecall")) {
        const QueryLocationData = {
          location_name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
        }


        localStorage.setItem("weatherData", JSON.stringify(data));
        localStorage.setItem("currentWeatherData", JSON.stringify(QueryLocationData))

        location = data.name
        time = epochToJsDate(data.dt)
        details = {
          humidity: data.main.humidity,
          temperature: data.main.temp,
          wind_speed: data.wind.speed,
        }
        description = data.weather[0].description;

      } else {

        const QueryLocationData = {
          location_name: data.timezone,
          lat: data.lat,
          lon: data.lon,
        }

        localStorage.setItem("weatherData", JSON.stringify(data));
        localStorage.setItem("currentWeatherData", JSON.stringify(QueryLocationData))

        location = QueryLocationData.location_name
        time = epochToJsDate(data.current.dt)
        details = {
          humidity: data.current.humidity,
          temperature: data.current.temp,
          wind_speed: data.current.wind_speed,
        }
        description = data.current.weather[0].description;
      }

      const weatherData = {
        location: location,
        time: time,
        description: description,
        details: details,
      }

      if (type === 'weekly') {
        resolve(data.daily)
      } else if (type === 'hourly') {
        resolve(data.hourly)
      } else {
        resolve(weatherData)
      }

    }).catch(function (error) {
      reject(error)
    })
  })




}




class SummaryComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { weatherData: null, inputState: '' }
  }

  async componentDidMount() {
    let weatherData

    if (localStorage.getItem('currentWeatherData')) {
      let currentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
      console.log(currentWeatherData);

      weatherData = await getQueryWeather(currentWeatherData, 'summary', API_KEY);
      console.log("In summary component currentweather Data");

    } else {
      weatherData = await getQueryWeather('accra', 'summary', API_KEY)
      console.log("In summary component false of that");
    }

    this.setState({
      weatherData: weatherData
    })

  }

  handleTextChange(e) {
    this.setState({
      inputState: e.target.value
    })
  }

  async searchCityData(e) {
    e.preventDefault();
    let data = await getQueryWeather(this.state.inputState, 'summary', API_KEY);
    this.setState({
      weatherData: data
    })
  }

  render() {

    const weatherData = this.state.weatherData;

    return (
      <div>

        <div className="d-flex flex-row justify-content-center mt-2">
          <Form style={{ width: "30vw" }}>
            <Form.Label>Enter Location Name</Form.Label>
            <Form.Control type="text" onChange={this.handleTextChange.bind(this)} placeholder="Enter city, or country name" />
            <Form.Control type="submit" onClick={this.searchCityData.bind(this)} value="Submit" />
          </Form>
        </div>

        <p className="text-center">Showing results for {(weatherData !== null) ? weatherData.location : "Loading"}</p>

        <div className="card mt-2">
          <div className="card-body">
            {(weatherData === null)
              ? "Loading"
              :
              <div>
                <p className="text-center font-weight-bolder">{weatherData.location}</p>
                <p>{weatherData.time.toString()}</p>
                <p className="capitalize text-center">{weatherData.description}</p>

                <div className="d-flex flex-row justify-content-center">
                  <img src={getWeatherCurrentStatus(weatherData.description).cardImage} width="315" />
                </div>

                <div className="d-flex flex-row justify-content-around">
                  <span>Humidity: {weatherData.details.humidity}%</span>
                  <span>Temperature: {weatherData.details.temperature} °C</span>
                  <span>Wind Speed: {weatherData.details.wind_speed} km/hr</span>
                </div>
              </div>
            }


          </div>
        </div>
      </div>
    )
  }

}


function WeatherCard(props) {

  return (
    <div style={{ width: "280px" }} className="card m-4">
      <div className="card-header d-flex flex-row justify-content-center">
        <span style={{ fontSize: "1.3rem" }} className={`badge badge-pill text-center capitalize ${getWeatherCurrentStatus(props.data.description).bootstrapClass}`}>{getWeatherCurrentStatus(props.data.description).eventPossibilityClass}</span>
      </div>

      <div className="card-body">
        <h3 className="weather-title text-center">{props.data.title}</h3>
        <p className="weather-description text-center">{props.data.description}</p>
        <div className="d-flex flex-row justify-content-center">
          <img className="iconImg" src={getWeatherCurrentStatus(props.data.description).cardImage} width="200" alt={props.data.description} />
        </div>


        <div className="weather-details text-center"><span>Humidity: {props.data.details.humidity}%</span> <span>Temperature: {props.data.details.temperature} °C</span> <span>Wind Speed: {props.data.details.wind_speed} km/hour.</span></div>
      </div>
    </div>
  )
}

class ForcastComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locationName: "No Name", 
      weatherData: [
        {
          location: "Loading...",
          title: "Loading...",
          time: 'Loading...',
          status: 'Loading...',
          description: "Loading...",
          details: { humidity: "", temperature: "", wind_speed: "" },
        }
      ]
    }
  }

  async componentDidMount() {
    let weatherData;

    if (localStorage.getItem("currentWeatherData")) {
      let queryData = localStorage.getItem("currentWeatherData");
      queryData = JSON.parse(queryData);

      this.setState({
        locationName: queryData.location_name
      })

      console.log("In forecast component");
      weatherData = await getQueryWeather(queryData, this.props.type, API_KEY);
      let wData = [];



      weatherData.forEach(value => {
        let title;
        let temperature;
        if (this.props.type === 'weekly') {
          let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          title = (epochToJsDate(value.dt).getDay() >= 6) ? days[0] : days[epochToJsDate(value.dt).getDay() + 1]
          temperature = value.temp.max;
        }

        if (this.props.type === 'hourly') {
          if (epochToJsDate(value.dt).getHours() > 12) {
            title = epochToJsDate(value.dt).getHours() - 12;
            title += " pm";
          } else {
            title = (epochToJsDate(value.dt).getHours() === 0) ? 12 : epochToJsDate(value.dt).getHours()

            if (epochToJsDate(value.dt).getHours() === 12) {
              title += " pm";
            } else {
              title += " am";
            }
          }
          temperature = value.temp;
        }
        

        const weatherDetails = {
          location: "No location",
          title: title,
          time: 'time',
          status: 'No Status',
          description: value.weather[0].description,
          details: { humidity: value.humidity, temperature: temperature, wind_speed: value.wind_speed },
        }

        wData.push(weatherDetails);
      });

      this.setState({
        weatherData: wData
      })
    }


  }


  render() {
    // computation goes here
    return (
      <div>
        <p className="text-center my-2">Showing {this.props.type} data for  {(this.state.locationName !== null) ? this.state.locationName : "Loading"}</p>
        <div className="d-flex flex-row justify-content-center flex-wrap">
          {
            this.state.weatherData.map((data, index) =>
              <WeatherCard key={`weatherCard${index}`} data={data} />
            )
          }
        </div>
      </div>

    )
  }

}



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherData: null
    }
  }



  render() {
    return (
      <div>
        <BrowserRouter>

          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-row justify-content-around">
              <Link to="/"><Button color="twitter" active="false">Current</Button></Link>

              <Link to="/weekly"><Button color="twitter" active="false">Weekly</Button></Link>

              <Link to="/hourly"><Button color="twitter" active="false">Hourly</Button></Link>
            </div>
          </div>

          <div className="d-flex flex-row justify-content-center">
            <Route
              exact
              path="/"
              render={() => (<SummaryComponent />)} />
            <Route
              exact
              path="/weekly"
              render={() => (<ForcastComponent type={'weekly'} />)} />
            <Route
              exact
              path="/hourly"
              render={() => (<ForcastComponent type={'hourly'} />)} />
          </div>
        </BrowserRouter>

      </div >
    );
  }
}

export default App;
