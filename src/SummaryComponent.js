import React from "react";
import {
    getQueryWeather,
    getWeatherCurrentStatus,
    epochToJsDate
} from './utils';
import Form from 'react-bootstrap/Form';
import SavedWeatherCard from './SavedWeatherCard';
import { store } from "react-notifications-component";


const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';


function checkNotificationPromise() {
    try {
        Notification.requestPermission().then()
    } catch (e) {
        return false;
    }

    return true;
}


// NOTE: Summary component
class SummaryComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { weatherData: null, inputState: '', savedWeatherData: [], dataHasLoaded: null, permission: 'Default' }
        this.requestPermission = this.requestPermission.bind(this)
        this.showNotification = this.showNotification.bind(this)
    }

    async componentDidMount() {
        let weatherData;
        let savedWeather;

        if (localStorage.getItem('weatherData')) {
            let details;
            let description;
            let location;
            let time;

            let data = JSON.parse(localStorage.getItem('weatherData'));

            if (data.base !== undefined) {
                details = {
                    humidity: data.main.humidity,
                    temperature: data.main.temp,
                    wind_speed: data.wind.speed,
                }
                description = data.weather[0].description;
                location = data.name;
                time = epochToJsDate(data.dt);
            } else {
                details = {
                    humidity: data.current.humidity,
                    temperature: data.current.temp,
                    wind_speed: data.current.wind_speed,
                }
                description = data.current.weather[0].description;
                location = data.timezone
                time = epochToJsDate(data.current.dt);

            }


            const weatherData = {
                location: location,
                time: time,
                description: description,
                details: details,
            }

            this.setState({
                weatherData: weatherData
            })
        }

        if (localStorage.getItem('currentWeatherData')) {
            let currentWeatherData = JSON.parse(localStorage.getItem('currentWeatherData'));
            console.log(currentWeatherData);

            await getQueryWeather(currentWeatherData, 'summary', API_KEY).then((data) => {
                this.setState({
                    weatherData: data,
                    datahasLoaded: true
                })
            }).catch(err => {

                if (err) {
                    store.addNotification({
                        title: "Offline...",
                        message: "Seems like you are offline",
                        type: "danger",
                        insert: "top",
                        container: "bottom-center",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 0,
                        }
                    })
                }
                console.log(err);
            });

        } else {
            weatherData = await getQueryWeather('accra', 'summary', API_KEY)
            console.log("In summary component false of that");
        }

        savedWeather = await this.loadWeatherData().then(data => {
            this.setState({
                savedWeatherData: data
            })
        });



    }

    handleTextChange(e) {
        this.setState({
            inputState: e.target.value
        })
    }

    requestPermission(e) {
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications.")
        } else {

            if(checkNotificationPromise()){
                Notification.requestPermission().then(permission =>{
                    this.setState({
                        permission: permission
                    })
                })
            }else{
                Notification.requestPermission((permission) => {
                    this.setState({
                        permission: permission
                    })
                })
            }
  
        }
    }


    showNotification(){
        let img = './weatherStates/weather-clear.png'
        let text = 'Hey, you have new weather here'
        let notification = new Notification("Smash Weather", {body:text,image:img})
    }

    async saveWeatherData(e) {
        e.preventDefault();
        let savedWeatherData = [];

        if (localStorage.getItem('savedWeatherData')) {
            let allSavedWeatherData = JSON.parse(localStorage.getItem('savedWeatherData'));
            allSavedWeatherData.forEach(weather => {
                savedWeatherData.push(weather)
            });
        }

        savedWeatherData.push(this.state.weatherData);

        this.setState({
            savedWeatherData: savedWeatherData
        })

        localStorage.setItem('savedWeatherData', JSON.stringify(savedWeatherData));

        console.log("New Weather Data is saved");

    }

    deleteSavedWeather(e) {
        let newSavedWeatherData = []
        let savedWeatherData = this.state.savedWeatherData;

        for (let i = 0; i < savedWeatherData.length; i++) {
            if (e === i) {
                continue;
            }
            newSavedWeatherData.push(savedWeatherData[i])
        }

        localStorage.setItem('savedWeatherData', JSON.stringify(newSavedWeatherData))

        this.setState({
            savedWeatherData: newSavedWeatherData
        })
    }

    switchWeatherData(e) {
        this.setState({
            weatherData: this.state.savedWeatherData[e]
        })
    }

    async loadWeatherData() {
        let savedWeatherData = [];

        if (localStorage.getItem('savedWeatherData')) {
            let allSavedWeatherData = JSON.parse(localStorage.getItem('savedWeatherData'));
            allSavedWeatherData.forEach(weather => {
                savedWeatherData.push(weather)
            });
        }

        return savedWeatherData;
    }

    async searchCityData(e) {
        e.preventDefault();
        let data = await getQueryWeather(this.state.inputState, 'summary', API_KEY);
        this.setState({
            weatherData: data
        })
    }

    render() {
        const _savedWeather = this.state.savedWeatherData;
        const countSavedWeather = _savedWeather.length;
        const weatherData = this.state.weatherData;

        return (
            <div style={{ width: "80vw" }}>

                <div className="d-flex flex-row justify-content-center mt-2">
                    <Form className="formInput">
                        <Form.Label>Enter Location Name</Form.Label>
                        <Form.Control type="text" onChange={this.handleTextChange.bind(this)} placeholder="Enter city, or country name" />
                        <Form.Control type="submit" onClick={this.searchCityData.bind(this)} value="Submit" />
                    </Form>
                </div>

                <p className="text-center font-weight-bold">Showing results for {(weatherData !== null) ? weatherData.location : "Loading"}</p>

                <div className="card mt-2">
                    <div className="card-body">
                        {(weatherData === null)
                            ?
                            <div className="shimmerWrapper d-flex flex-column">
                                <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
                                <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "30%" }}></div>
                                <div className="align-self-center shimmer-image br shimmer-animate" style={{ width: "315px", height: "315px" }}></div>
                                <div className="d-flex flex-row justify-content-around">
                                    <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
                                    <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
                                    <div className="align-self-center shimmer-text br shimmer-animate" style={{ width: "20%" }}></div>
                                </div>

                            </div>
                            :
                            <div>
                                <p className="text-center font-weight-bolder">{weatherData.location}</p>
                                <p className="text-center">{weatherData.time.toString()}</p>
                                <p className="capitalize text-center">{weatherData.description}</p>

                                <div className="d-flex flex-row justify-content-center">
                                    <img src={getWeatherCurrentStatus(weatherData.description).cardImage} width="315" />
                                </div>

                                <div className="d-flex flex-row justify-content-around text-dark">
                                    <div className="d-flex flex-column"><i className="fa fa-cloud align-self-center" aria-hidden="true"></i> <span>Humidity: {weatherData.details.humidity}%</span></div>
                                    <div className="d-flex flex-column"><i className="fa fa-thermometer-half align-self-center" aria-hidden="true"></i> <span>Temperature: {weatherData.details.temperature} °C</span></div>
                                    <div className="d-flex flex-column"><i className="fa fa-tachometer align-self-center" aria-hidden="true"></i> <span>Wind Speed: {weatherData.details.wind_speed} km/hr</span></div>
                                </div>
                                <div className="d-flex flex-row justify-content-center mt-3"><button onClick={this.saveWeatherData.bind(this)} className="btn btn-outline-warning btn-block text-dark"><i className="fa fa-save" aria-hidden="true"></i> Save</button></div>
                            </div>
                        }

                    </div>
                </div>

                <div id="savedWeather" className="mt-3">
                    <h4 className="text-center">Saved Forecasts</h4>

                    <div className="d-flex flex-row justify-content-center flex-wrap">
                        {
                            (countSavedWeather > 0)
                                ? _savedWeather.map((data, index) =>
                                    <SavedWeatherCard key={`savedW${index}`} handleClick={this.switchWeatherData.bind(this, index)} handleDelete={this.deleteSavedWeather.bind(this, index)} Weatherdata={data} />
                                )
                                : <p>No weather has been saved</p>
                        }
                    </div>
                </div>
                <button onClick={this.requestPermission} className="btn btn-primary"> Request </button> <div>{this.state.permission}</div> 
                {
                    this.state.permission === 'granted' &&
                    <button onClick={this.showNotification} className="btn btn-warning">Start notification</button>
                }
            </div>
        )
    }

}

export default SummaryComponent;