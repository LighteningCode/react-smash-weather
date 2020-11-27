
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


const getWeatherCurrentStatus = function (switchClause) {
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



const epochToJsDate = (ts) => {
    // ts = epoch timestamp
    // returns date obj 
    return new Date(ts * 1000);
}



const getQueryWeather = function (queryReq, type = 'summary', key) {
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

export {epochToJsDate,getQueryWeather,getWeatherCurrentStatus}