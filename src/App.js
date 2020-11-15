import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Route, BrowserRouter, Link, Router } from "react-router-dom";
import SummaryComponent from "./SummaryComponent";
import './utils';
import {
  getQueryWeather,
  getWeatherCurrentStatus,
  epochToJsDate
} from './utils';


const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';


function WeatherCard(props) {

  return (
    (!props.data.description)
      ?
      <div style={{ width: "280px" }} className="weatherCard card m-2">

        <div className="shimmerWrapper">
          <div className="card-body p-2">
            <div className="d-flex flex-column justify-content-center">
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "30%" }}></div>
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "40%" }}></div>
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
            </div>

            <div className="d-flex flex-row justify-content-center">
              <div className="align-self-center shimmer-image br shimmer-animate" style={{ width: "120px", height: "120px" }}></div>
            </div>


            <div className="weather-details text-center text-secondary d-flex flex-row justify-content-between mx-4" style={{ fontSize: "0.85rem" }}>
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
              <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>

      </div>
      :
      <div style={{ width: "280px" }} className="weatherCard card m-2">

        <div className="card-body p-2">
          <div className="d-flex flex-row justify-content-center">
            <span style={{ fontSize: "1.3rem", width: "80%" }} className={`badge badge-pill text-center capitalize ${getWeatherCurrentStatus(props.data.description).bootstrapClass}`}>{getWeatherCurrentStatus(props.data.description).eventPossibilityClass}</span>
          </div>

          <h4 className="weather-title text-center">{props.data.title}</h4>
          <p className="weather-description text-center mb-0 capitalize">{props.data.description}</p>
          <div className="d-flex flex-row justify-content-center">
            <img className="iconImg" src={getWeatherCurrentStatus(props.data.description).cardImage} width="200" alt={props.data.description} />
          </div>


          <div className="weather-details text-center text-secondary d-flex flex-row justify-content-between mx-4" style={{ fontSize: "0.85rem" }}>
            <div><i className="fa fa-cloud" aria-hidden="true"></i> <span> {props.data.details.humidity}%</span></div>
            <div><i className="fa fa-thermometer-half" aria-hidden="true"></i><span> {props.data.details.temperature} °C </span></div>
            <div><i className="fa fa-tachometer" aria-hidden="true"></i><span> {props.data.details.wind_speed} km/hr </span></div>
          </div>
        </div>
      </div>
  )
}

function processForcastData(forcastType,data){
  let wData = [];

  data.forEach(value => {
    let title;
    let temperature;
    if (forcastType === 'weekly') {
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      title = (epochToJsDate(value.dt).getDay() >= 6) ? days[0] : days[epochToJsDate(value.dt).getDay() + 1]
      temperature = value.temp.max;
    }

    if (forcastType === 'hourly') {
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

  return wData;
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
          description: null,
          details: { humidity: "", temperature: "", wind_speed: "" },
        }
      ]
    }
  }

  async componentDidMount() {
    let weatherData;


    if (localStorage.getItem('weatherData')) {
      let data = JSON.parse(localStorage.getItem('weatherData'));

      if (this.props.type === 'weekly') {
        weatherData = data.daily;
      }
      if (this.props.type === 'hourly') {
        weatherData = data.hourly;
      }

      let wData = processForcastData(this.props.type,weatherData)
     
      this.setState({
        weatherData: wData
      })
    }


    if (localStorage.getItem("currentWeatherData")) {
      let queryData = localStorage.getItem("currentWeatherData");
      queryData = JSON.parse(queryData);

      this.setState({
        locationName: queryData.location_name
      })

      weatherData = await getQueryWeather(queryData, this.props.type, API_KEY).catch(err => console.log(err));
      let wData;

      if (weatherData) {
        wData = processForcastData(this.props.type,weatherData)
        this.setState({
          weatherData: wData
        })
      }
      
    }

  }


  render() {
    // computation goes here
    return (
      <div>
        <p className="text-center my-2 font-weight-bold">Showing {this.props.type} data for  {(this.state.locationName !== null) ? this.state.locationName : "Loading"}</p>
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
      <div className="mt-3 mb-5">
        <BrowserRouter>

          <div className="d-flex flex-row justify-content-center mt-2">
            <div className="d-flex flex-row justify-content-around">

              <div className="btn-group btn-group-lg" role="group">
                <Link to="/" className="text-white btn btn-primary">Current</Link>
                <Link to="/weekly" className="text-white btn btn-primary">Weekly</Link>
                <Link to="/hourly" className="text-white btn btn-primary">Hourly</Link>
              </div>

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
