const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

async function searchWeather() {

    const city = cityInput.value.trim();

    error.textContent = "";

    if (!city) {
        error.textContent = "Please enter a city name";
        return;
    }

    loading.style.display = "block";
    weatherCard.style.display = "none";

    try {

        const response = await fetch(
            `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to fetch weather data"
            );
        }

        cityName.textContent =
            `${data.name}, ${data.country}`;

        temperature.textContent =
            `${Math.round(data.temperature)}°C`;

        feelsLike.textContent =
            `${Math.round(data.feelsLike)}°C`;

        humidity.textContent =
            `${data.humidity}%`;

        wind.textContent =
            `${data.windspeed} m/s`;

        condition.textContent =
            data.condition;

        description.textContent =
            data.description;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

        weatherIcon.alt =
            data.description;

        weatherCard.style.display = "block";

    } catch (err) {

        error.textContent = err.message;

    } finally {

        loading.style.display = "none";
    }
}

searchBtn.addEventListener(
    "click",
    searchWeather
);

cityInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            searchWeather();
        }

    }
);