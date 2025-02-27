const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod === 200) {
            const { name, main, weather, wind } = data;
            weatherInfo.innerHTML = `
                <h2>${name}</h2>
                <p>Temperature: ${main.temp}°C</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
                <p>Weather: ${weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
            `;
        } else {
            weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}