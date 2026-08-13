const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const temperatureCard = document.getElementById("temperatureCard");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherDescription = document.getElementById("weatherDescription");
const message = document.getElementById("message");

// Search button event
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});

// Allow Enter key to search
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Get weather information
async function getWeather(city) {

    message.textContent = "Loading weather information...";

    try {

        // Step 1: Get city coordinates using Geocoding API
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to connect to the weather service.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get current weather using coordinates
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        // Convert response to JSON
        const weatherData = await weatherResponse.json();

        // Step 3: Extract current weather data
        const currentWeather = weatherData.current;

        // Step 4: Display data
        cityName.textContent = `${location.name}, ${location.country}`;

        temperature.textContent = Math.round(currentWeather.temperature_2m);

        temperatureCard.textContent =
            `${Math.round(currentWeather.temperature_2m)}°C`;

        humidity.textContent =
            `${currentWeather.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${currentWeather.wind_speed_10m} km/h`;

        weatherDescription.textContent =
            getWeatherDescription(currentWeather.weather_code);

        message.textContent = "";

    } catch (error) {

        console.error("Weather Error:", error);

        message.textContent = error.message;

        cityName.textContent = "Weather Dashboard";
        temperature.textContent = "--";
        temperatureCard.textContent = "--°C";
        humidity.textContent = "--%";
        windSpeed.textContent = "-- km/h";
        weatherDescription.textContent = "Unable to load weather data.";
    }
}

// Convert weather code into readable description
function getWeatherDescription(code) {

    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Foggy 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Drizzle 🌦️",
        55: "Heavy Drizzle 🌧️",
        61: "Light Rain 🌦️",
        63: "Rain 🌧️",
        65: "Heavy Rain 🌧️",
        71: "Light Snow 🌨️",
        73: "Snow 🌨️",
        75: "Heavy Snow ❄️",
        80: "Rain Showers 🌦️",
        81: "Rain Showers 🌧️",
        82: "Heavy Rain Showers ⛈️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with Hail ⛈️",
        99: "Thunderstorm with Hail ⛈️"
    };

    return weatherCodes[code] || "Unknown Weather";
}