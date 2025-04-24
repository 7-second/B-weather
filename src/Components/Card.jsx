// Card.jsx
import React, { useEffect, useState } from "react";
import { FaCloud, FaCloudRain, FaSearch, FaSearchLocation, FaSun, FaWind } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { WeatherData, ForecastData } from "../provider/Services"; // Removed import of fetchCitySuggestions

// Define a mapping of weather conditions to video URLs (replace with your actual video paths)
const weatherVideoMap = {
  Clear: "/videos/clear.mp4",
  Clouds: "/videos/clouds.mp4",
  Rain: "/videos/rain.mp4",
  Drizzle: "/videos/drizzle.mp4",
  Thunderstorm: "/videos/thunderstorm.mp4",
  Snow: "/videos/snow.mp4",
  Mist: "/videos/mist.mp4",
  Smoke: "/videos/mist.mp4", // Using mist as fallback
  Haze: "/videos/mist.mp4",  // Using mist as fallback
  Dust: "/videos/mist.mp4",  // Using mist as fallback
  Fog: "/videos/mist.mp4",   // Using mist as fallback
  Sand: "/videos/mist.mp4",  // Using mist as fallback
  Ash: "/videos/mist.mp4",   // Using mist as fallback
  Squall: "/videos/wind.mp4", // Using wind as fallback
  Tornado: "/videos/wind.mp4",// Using wind as fallback
};

function Card() {
  const [toglesearch, setTogleSearch] = useState(false);
  const [city, setCity] = useState("Addis Ababa"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [backgroundVideo, setBackgroundVideo] = useState(weatherVideoMap.Clear); // Default background
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleSearchToggle = () => {
    setTogleSearch(!toglesearch);
    setSearchCity("");
  };

  const handleSearchInputChange = (event) => {
    setSearchCity(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      setTogleSearch(false);
      setIsLoading(true); // Start loading
    }
  };

  useEffect(() => {
    const getWeatherAndForecast = async () => {
      setIsLoading(true); // Start loading when city changes
      try {
        const currentWeatherData = await WeatherData({ city });
        if (currentWeatherData) {
          setWeatherData(currentWeatherData);
          setError(null);
          // Update background video based on weather condition
          setBackgroundVideo(weatherVideoMap[currentWeatherData.weather[0]?.main] || weatherVideoMap.Clear);
        } else {
          setError(`Could not fetch current weather data for ${city}`);
          setWeatherData(null);
          setBackgroundVideo(weatherVideoMap.Clear); // Default on error
        }

        const forecastWeatherData = await ForecastData({ city });
        if (forecastWeatherData) {
          setForecastData(forecastWeatherData);
        } else {
          console.error(`Could not fetch forecast data for ${city}`);
          setForecastData(null);
        }
      } catch (err) {
        console.error('Error in component:', err);
        setError('An unexpected error occurred.');
        setWeatherData(null);
        setForecastData(null);
        setBackgroundVideo(weatherVideoMap.Clear); // Default on error
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    getWeatherAndForecast();
  }, [city]); // Re-fetch when the city changes

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  return (
    <>
      <div className="relative w-[500px] h-fit border-2 border-white z-10 rounded-lg text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 bg-black/50 p-4">
          <div className="   w-full flex flex-col items-end py-3   ">
            <div className="relative flex flex-col items-end">
              {toglesearch && (
                <div className="relative w-full">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search city..."
                    className="text-white w-full px-4 py-1 rounded-md outline-none bg-black/70"
                    value={searchCity}
                    onChange={handleSearchInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  />
                </div>
              )}
              <div className="w-fit h-fit absolute flex right-0 items-center p-1 bg-black/60   rounded-full cursor-pointer">
                <FaSearchLocation
                  onClick={handleSearchToggle}
                  size={23}
                  className="relative items-center justify-center   text-indigo-500"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[300px] text-white">
              Loading weather data...
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full h-fit p-4 ">
                <div className="w-full flex flex-row items-center   justify-between">
                  <div className="flex flex-col items-start justify-center">
                    <h1 className="text-[30px] underline underline-offset-4 decoration-yellow-500">
                      {weatherData?.name}, {weatherData?.sys?.country}
                    </h1>
                    <h1 className="text-[54px] flex mt-2">
                      {weatherData?.main?.temp ? Math.round(weatherData.main.temp) : ''} <span className="text-[30px]">°C</span>
                    </h1>
                    <p className="text-sm capitalize">{weatherData?.weather?.[0]?.description}</p>
                  </div>
                  <div className=" flex items-center   justify-end">
                    {weatherData?.weather?.[0]?.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt="Weather Icon"
                        width={80}
                        height={80}
                      />
                    )}
                    {!weatherData?.weather?.[0]?.icon && <FaSun size={80} className="text-yellow-500" />}
                  </div>
                </div>

                <div className="flex mt-[20px] mb-[10px] gap-[30px] justify-center ">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <h3><FaWind /></h3>
                    <h3>{weatherData?.wind?.speed} m/s</h3>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2">
                    <h3><FaDroplet /></h3>
                    <h3>{weatherData?.main?.humidity}%</h3>
                  </div>
                  {weatherData?.clouds?.all !== undefined && (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h3><FaCloud /></h3>
                      <h3>{weatherData.clouds.all}%</h3>
                    </div>
                  )}
                  <div className="flex flex-col justify-center items-center gap-2">
                    <h3>Feels like</h3>
                    <h3>{weatherData?.main?.feels_like ? Math.round(weatherData.main.feels_like) : ''}°C</h3>
                  </div>
                </div>
              </div>

              <div className="flex flex-col   mt-6 items-center py-4 rounded-b-lg">
                <div className="">
                  <h2 className="mb-[10px] text-white">Today's Forecast</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto">
                  {forecastData
                    ?.filter((item, index) => {
                      const forecastTime = new Date(item.dt * 1000);
                      const now = new Date();
                      const diffHours = (forecastTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                      return diffHours > 0 && diffHours < 24 && index % 3 === 0; // Show forecasts within the next 24 hours, every 3 hours
                    })
                    .map((item, index) => (
                      <div key={index} className="flex flex-col px-3 py-2 gap-2 items-center rounded-md bg-black/50">
                        <h3 className="text-white">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true })}</h3>
                        {item.weather[0]?.icon && (
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt="Weather Icon"
                            width={40}
                            height={40}
                          />
                        )}
                        <h3 className="text-white">{Math.round(item.main.temp)}°C</h3>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;