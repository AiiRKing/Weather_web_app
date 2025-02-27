const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your OpenWeatherMap API key
const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const historicalWeatherUrl = 'https://api.openweathermap.org/data/3.0/onecall/timemachine?units=metric';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const weatherChartCtx = document.getElementById('weatherChart').getContext('2d');

let weatherChart;

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchCurrentWeather(city);
        fetchHistoricalWeather(city);
    }
});

// Fetch current weather
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`${currentWeatherUrl}${city}&appid=${apiKey}`);
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
        console.error('Error fetching current weather data:', error);
    }
}

// Fetch historical weather data for the last 7 days
async function fetchHistoricalWeather(city) {
    try {
        // Get latitude and longitude for the city
        const geoResponse = await fetch(`${currentWeatherUrl}${city}&appid=${apiKey}`);
        const geoData = await geoResponse.json();
        const { lat, lon } = geoData.coord;

        // Get historical data for the last 7 days
        const historicalData = [];
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        for (let i = 1; i <= 7; i++) {
            const time = currentTime - (i * 86400); // Subtract i days in seconds
            const response = await fetch(`${historicalWeatherUrl}&lat=${lat}&lon=${lon}&dt=${time}&appid=${apiKey}`);
            const data = await response.json();
            historicalData.push(data);
        }

        // Process and display historical data
        displayHistoricalData(historicalData);
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
    }
}

// Display historical data in a graph
function displayHistoricalData(data) {
    const labels = [];
    const temperatures = [];

    data.reverse().forEach((day) => {
        const date = new Date(day.current.dt * 1000).toLocaleDateString();
        labels.push(date);
        temperatures.push(day.current.temp);
    });

    if (weatherChart) {
        weatherChart.destroy(); // Destroy existing chart
    }

    weatherChart = new Chart(weatherChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}