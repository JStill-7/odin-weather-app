import './styles.css';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-search');

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
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    getWeather(city);
});



console.log('weather app')