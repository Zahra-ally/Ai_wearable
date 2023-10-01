import axios from "axios";
import React, { useState } from "react";

interface WeatherComponentProps {
  latitude: number;
  longitude: number;
}

const Weather: React.FC<WeatherComponentProps> = ({ latitude, longitude }) => {
  const weatherDataUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,rain,snowfall&daily=weathercode&timezone=Pacific%2FAuckland&forecast_days=1`;

  const [temperature, setTemperature] = useState(Number);
  const [humidity, setHumidity] = useState(Number);
  const [precipitation, setPrecipitation] = useState(Number);
  const [showers, setShowers] = useState(Number);
  const [snowfall, setSnowfall] = useState(Number);

  // Create a new Date object
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");

  // Make the HTTP GET request to fetch weather data
  axios
    .get(weatherDataUrl)
    .then((response) => {
      // Check if the request was successful (HTTP status code 200)
      if (response.status === 200) {
        // Parse the JSON response
        const weatherData = response.data;

        // Extract the temperature, humidity, precipitation data, etc.
        if ("hourly" in weatherData) {
          // Format the time in the desired format (HH:mm)
          const formattedDateTime = `${year}-${month}-${day}T${hours}:00`;

          //find element with the correct current hour
          Array.isArray(weatherData.hourly.time);
          const currentHour = weatherData.hourly.time.indexOf(formattedDateTime);

          //extract url param
          const temperatureData = weatherData.hourly.temperature_2m;
          const relativeHumidityData = weatherData.hourly.relativehumidity_2m;
          const precipitationData =
            weatherData.hourly.precipitation_probability;
          const rainData = weatherData.hourly.rain;
          const snowfallData = weatherData.hourly.snowfall;

          // Get the value for each parameter at given hour
          setTemperature(temperatureData[currentHour]);
          setHumidity(relativeHumidityData[currentHour]);
          setPrecipitation(precipitationData[currentHour]);
          setShowers(rainData[currentHour]);
          setSnowfall(snowfallData[currentHour]);
        } else {
          console.log("Weather data not found in the response.");
        }
      } else {
        console.log("Failed to fetch weather data.");
      }
    })
    .catch((error) => {
      console.error("An error occurred while fetching weather data:", error);
    });

  return (
    <div>
      <h2>Hourly Weather of your location as of {`${hours}:00`} </h2>
      <span>Temperature: {temperature} °C</span> <br />
      <span>Humidity: {humidity} %</span> <br />
      <span>Precipitation Probability: {precipitation} %</span> <br />
      <span>Showers: {showers} mm</span> <br />
      <span>Snowfall: {snowfall} cm</span>
    </div>
  );
};

export default Weather;
