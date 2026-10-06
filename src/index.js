import './styles.css';
import clearDay from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/clear-day.png';
import clearNight from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/clear-night.png';
import cloudyDay from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/partly-cloudy-day.png';
import cloudyNight from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/partly-cloudy-night.png';
import cloudy from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/cloudy.png';
import rain from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/rain.png';
import showersDay from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/showers-day.png';
import snow from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/snow.png';
import snowShowersDay from '../assets/WeatherIcons-main/WeatherIcons-main/PNG/1st Set - Monochrome/snow-showers-day.png';

const weatherIcons = {
    'clear-day': clearDay,
    'clear-night': clearNight,
    'partly-cloudy-day':cloudyDay,
    'partly-cloudy-night':cloudyNight,
    cloudy: cloudy,
    rain: rain,
    'showers-day': showersDay,
    snow: snow,
    'snow-showers-day': snowShowersDay
};



const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-search');

const cityContainer = document.querySelector('.city-container');
const cityDateTime = document.querySelector('#date-time');
const cityName = document.querySelector('#city');
const cityTemp = document.querySelector('#temp');
const forecastCards = document.querySelectorAll('.forecast-card');

const foreCastContainer = document.querySelector('.forecast-container');

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Weather request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}


form.addEventListener('submit', async(event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    const data = await getWeather(city);

    forecastCards.forEach((card, index) => {
    const day = data.days[index + 1];

    const dayElement = card.querySelector('.forecast-day');
    const tempElement = card.querySelector('.forecast-temp');
    const iconElement = card.querySelector('.forecast-icon');
    

    const date = new Date(`${day.datetime}T12:00:00`);

    dayElement.textContent = date.toLocaleDateString('en-US', {
        weekday: 'short'
    });

    tempElement.textContent = day.temp;

    //weather icon if statememt  here

    forecastCards.forEach((card, index) => {
    const day = data.days[index];

    const iconElement = card.querySelector('.forecast-icon');

    iconElement.src = weatherIcons[day.icon];
    iconElement.alt = day.conditions;
});


    console.log(day.icon);
});
    

    const date = new Date(data.currentConditions.datetimeEpoch * 1000);

    const formattedDate = date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
});


    //clear placeholder first
    cityName.textContent = '';
    cityTemp.textContent = '';
    cityDateTime.textContent = '';
    //foreCastContainer.textContent = '';
    //forecastCard.textContent = '';




    //update main card temp,name,time,date
    cityDateTime.textContent = formattedDate;
    cityName.textContent = data.address;
    cityTemp.textContent = data.currentConditions.temp;
    
    
    // dayElement.textContent = data.days[0].temp;
    // tempElement.textContent = data.days[0].temp;
    // iconElement.src = data.days[0].icon;  
});



console.log('weather app')