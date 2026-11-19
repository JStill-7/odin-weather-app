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

const celsiusConvertBtn = document.querySelector('#celsius-btn');


const cityDateTime = document.querySelector('#date-time');
const cityName = document.querySelector('#city');
const cityTemp = document.querySelector('#temp');
const forecastCards = document.querySelectorAll('.forecast-card');
const currentIcon = document.querySelector('#current-icon');

const emptyState = document.querySelector('#empty-state');
const weatherContent = document.querySelector('#weather-content');
const forecastSection = document.querySelector('#forecast-section');


let isCelsius = false;
let currentTempF = null;
let forecastDays = [];

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


form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    const data = await getWeather(city);

    if (!data) return;

    currentTempF = data.currentConditions.temp;
    forecastDays = data.days.slice(1, 6);

    // Update forecast cards
    forecastCards.forEach((card, index) => {

        const day = forecastDays[index];

        const dayElement = card.querySelector('.forecast-day');
        const iconElement = card.querySelector('.forecast-icon');

        const date = new Date(`${day.datetime}T12:00:00`);

        dayElement.textContent = date.toLocaleDateString('en-US', {
            weekday: 'short'
        });

        iconElement.src = weatherIcons[day.icon];
        iconElement.alt = day.conditions;

    });

    // Format current date and time
    const date = new Date(data.currentConditions.datetimeEpoch * 1000);

    const formattedDate = date.toLocaleString('en-US', {
        timeZone: data.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

 
    // Update main card
    cityDateTime.textContent = formattedDate;
    cityName.textContent = data.address;
    currentIcon.src = weatherIcons[data.currentConditions.icon];
    currentIcon.alt = data.currentConditions.conditions;


    // Update all temperatures
    updateTemperatureDisplays();

    // Hide welcome screen and reveal weather
    emptyState.hidden = true;
    weatherContent.hidden = false;
    forecastSection.hidden = false;

});


function updateTemperatureDisplays() {

    const mainTemp = isCelsius
        ? (currentTempF - 32) * 5 / 9
        : currentTempF;

    cityTemp.textContent = `${Math.round(mainTemp)}°${isCelsius ? 'C' : 'F'}`;

    // Update the five forecast temperatures
    forecastCards.forEach((card, index) => {
        const tempElement = card.querySelector('.forecast-temp');
        const fahrenheit = forecastDays[index].temp;

        const temperature = isCelsius
            ? (fahrenheit - 32) * 5 / 9
            : fahrenheit;

        tempElement.textContent = `${Math.round(temperature)}°${isCelsius ? 'C' : 'F'}`;
    });
}

celsiusConvertBtn.addEventListener('click', () => {

    if (currentTempF === null || forecastDays.length === 0) return;
    isCelsius = !isCelsius;

    if(isCelsius === true) {
        celsiusConvertBtn.textContent = '°F'
    } else {
        celsiusConvertBtn.textContent = '°C'
    }


    updateTemperatureDisplays();
});



console.log('weather app')

