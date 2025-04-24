import axios from "axios";

const VITE_WEATHER_URL = import.meta.env.VITE_WEATHER_URL;
const VITE_FORECAST_URL = import.meta.env.VITE_FORECAST_URL; // Corrected typo: env
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

async function WeatherData({ city }) {
  try {
    const url = `${VITE_WEATHER_URL}?q=${city}&appid=${VITE_API_KEY}&units=metric`;
    const result = await axios.get(url);
    console.log("Current Weather Data:", result);
    return result.data;
  } catch (error) {
    console.log("Can't fetch current weather data");
    console.error("Error details:", error);
    return null;
  }
}

async function ForecastData({ city }) { // Renamed to ForecastData and expects { city }
  try {
    const url = `${VITE_FORECAST_URL}?q=${city}&appid=${VITE_API_KEY}&units=metric`;
    const result = await axios.get(url);
    console.log("Forecast Data:", result);
    return result.data.list; // Assuming the forecast list is in 'data.list'
  } catch (error) {
    console.log("Can't fetch forecast data");
    console.error("Error details:", error);
    return null;
  }



}
async function fetchCitySuggestions(query) {
  try {
    if (!query.trim()) {
      return []; // Don't fetch for empty queries
    }
    const geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${VITE_API_KEY}`; // Limit to 5 suggestions
    const response = await axios.get(geocodingApiUrl);
    console.log("City Suggestions:", response.data);
    return response.data; // Array of city objects
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
}


WeatherData({ city: "Addis Ababa" }); // Call to fetch current weather on module load
ForecastData({ city: "Addis Ababa" }); // Call to fetch forecast data on module load

export { WeatherData, ForecastData ,fetchCitySuggestions}; // Export both functions