const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "SkyCheck backend is running"
    });
});

app.get("/api/weather", async (req, res) => {

    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            error: "Please provide a city name"
        });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.error(
            "OPENWEATHER_API_KEY is missing from .env"
        );

        return res.status(500).json({
            error: "OpenWeather API key is missing"
        });
    }

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${apiKey}` +
            `&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "OpenWeather error:",
                data
            );

            if (response.status === 404) {

                return res.status(404).json({
                    error: "City not found"
                });

            }

            if (response.status === 401) {

                return res.status(401).json({
                    error:
                        "Invalid or inactive OpenWeather API key"
                });

            }

            return res.status(response.status).json({
                error:
                    data.message ||
                    "Unable to fetch weather data"
            });
        }

        res.json({

            name: data.name,

            country: data.sys.country,

            temperature: data.main.temp,

            feelsLike: data.main.feels_like,

            humidity: data.main.humidity,

            windspeed: data.wind.speed,

            condition: data.weather[0].main,

            description: data.weather[0].description,

            icon: data.weather[0].icon

        });

    } catch (error) {

        console.error(
            "Server error:",
            error
        );

        res.status(500).json({
            error:
                "Server error while fetching weather data"
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `SkyCheck backend running on http://localhost:${PORT}`
    );

});