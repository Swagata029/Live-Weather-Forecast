# Weatherly - Live Weather Forecast 🌦️

A modern and responsive real-time weather dashboard built with React.js, Tailwind CSS, and WeatherAPI.

Weatherly provides current weather conditions, hourly weather trends, a 3-day forecast, air quality information, UV index, sunrise and sunset times, automatic location detection, and dynamic weather effects.

## Features

### Real-Time Weather

- Current temperature
- Feels-like temperature
- Weather condition
- Minimum and maximum temperature
- Humidity
- Wind speed and direction
- Wind gusts
- Atmospheric pressure
- Visibility
- Cloud coverage
- UV Index
- Air Quality Index (AQI)
- Dew point
- Wind chill
- Humidex
- Rain probability
- Sunrise and sunset
- Moon phase
- Last updated time

### Location Detection

- Automatically detects the user's location using the Browser Geolocation API
- Displays weather based on latitude and longitude
- Allows users to search for weather by city
- Uses a fallback location when location permission is unavailable

### 3-Day Forecast

The dashboard provides a 3-day weather forecast including:

- Daily weather conditions
- Maximum temperature
- Minimum temperature
- Rain probability
- Expected precipitation
- Snow information
- Sunrise and sunset information

### Hourly Weather Chart

Interactive weather visualization built using Recharts.

The hourly chart displays:

- Temperature
- Feels-like temperature
- Rain probability
- Cloud coverage

### Air Quality

The application displays the Air Quality Index provided by WeatherAPI and converts the index into an easy-to-understand category.

| AQI Index | Category |
|-----------|----------|
| 1 | Good |
| 2 | Moderate |
| 3 | Unhealthy for Sensitive Groups |
| 4 | Unhealthy |
| 5 | Very Unhealthy |
| 6 | Hazardous |

### UV Index

The UV index is displayed along with a corresponding risk level:

- Low
- Moderate
- High
- Very High
- Extreme

### Dynamic Weather Backgrounds

The application dynamically changes its visual appearance based on the current weather condition.

Examples:

- Sunny weather → bright sky gradient
- Cloudy weather → cloudy gradient
- Rainy weather → darker rainy gradient
- Snowy weather → cool snowy gradient

### Weather Animations

Weather-specific animations are displayed based on the current conditions:

- Animated rain
- Falling snow
- Sunlight effects

These effects create a more immersive weather experience.

### Dark Mode

Users can switch between light and dark interface modes.

The selected theme is saved using LocalStorage so that the preference remains after refreshing the page.

---

## Tech Stack

### Frontend

- React.js
- JavaScript
- Tailwind CSS
- Vite

### Libraries

- Axios - API requests
- Recharts - Weather data visualization
- React Icons - UI icons
- Lottie React - Animated weather graphics

### APIs and Browser Technologies

- WeatherAPI - Real-time weather and forecast data
- Browser Geolocation API - Automatic location detection
- LocalStorage API - Theme and recent search persistence

---

## Project Structure

```text
Live-Weather-Forecast/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Forecast.jsx
│   │   ├── HourlyChart.jsx
│   │   ├── RainEffect.jsx
│   │   ├── SnowEffect.jsx
│   │   ├── SunlightEffect.jsx
│   │   └── WeatherIcon.jsx
│   │
│   ├── services/
│   │   └── weatherApi.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
---

## Author 👩‍💻

### Swagata Talekar

**Email:** talekarswagata2629@gmail.com

**LinkedIn:** https://www.linkedin.com/in/swagata-talekar
