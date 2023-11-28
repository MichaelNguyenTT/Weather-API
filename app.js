'use strict'

let cities = [
    {   
        name: "Benbrook, TX",
        latitude: 32.6732,
        longitude: -97.4606 
    },
    {   
        name: "Fremont, CA",
        latitude: 37.54951958175463, 
        longitude: -121.96547428412535,
    },
    {   
        name: "Mississauga, ON",
        latitude: 37.54951958175463,
        longitude: -121.96547428412535,
    }
];

//inputs
const citySelect = document.getElementById('cityDropdown');
const weatherTable = document.getElementById('weatherInfo')
// const weatherURL = "https://api.weather.gov/"

window.onload = () => {
    displayWeather()
    loadCityDropdown()
    
    citySelect.onchange = () => {
        weatherTable.innerHTML = ""
        displayWeather();
    }
};

function loadCityDropdown() {
    
    cities.forEach(city => {
        
        let cityOptions = new Option(city.name, city.name)
        citySelect.appendChild(cityOptions);
    }) 
}

function lookUpSelectedCity() {
    let cityValue = citySelect.value;

    const selectedCity = cities.find(city => city.name.includes(cityValue));

    let stationLookupURL = `https://api.weather.gov/points/${selectedCity.latitude},${selectedCity.longitude}`

    return stationLookupURL; // when city selected returns URL w/ lat & long
}

// this just returns data
async function fetchCityWeather() {
    let cityLookUpURL = lookUpSelectedCity();
    try {
        return fetch(cityLookUpURL)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
                return data;
            })
        } catch (error) {
            console.log('error', error);
        }
}


async function getWeather() {

    try {
        const weatherURL = await fetchCityWeather();
        let weatherForecast = weatherURL.properties.forecast;
        console.log(weatherForecast);
        return weatherForecast; // returns forecastURL of .properties.forecast

    } catch (error) {
        console.log('error', error);
    }
}

async function displayWeather() {
    const x = await getWeather() //!! await waits for the async function that is called to finish before moving on
    
    const y = await fetch(x)
    .then(response => response.json())
    .then(data => {return data })
    
    let forecastArray = y.properties.periods // Array 
    let weatherTable = document.getElementById('weatherInfo');
    forecastArray.forEach(item => {
        let forecastName = item.name;
        let temperature = "Temperature " + item.temperature + " " + item.temperatureUnit;
        let winds = "Winds " + item.windDirection + " " + item.windSpeed;
        let shortForecast = item.shortForecast;

        let row = weatherTable.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3)
        cell1.innerHTML = forecastName;
        cell2.innerHTML = temperature
        cell3.innerHTML = winds;
        cell4.innerHTML = shortForecast;
    })
}

