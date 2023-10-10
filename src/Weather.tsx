import axios from "axios";
import React, { useEffect, useState } from "react";
import weatherSchema from "./WeatherSchema/weatherschema";
import ClothingOccasionAndWeather from "./ClothingOccasionAndWeather";

interface WeatherComponentProps {
  latitude: number;
  longitude: number;
  onWeatherUpdate: any;
}

const Weather: React.FC<WeatherComponentProps> = ({
  latitude,
  longitude,
  onWeatherUpdate,
}) => {
  const weatherDataUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weathercode&timezone=Pacific%2FAuckland&forecast_days=1`;

  // Create a new Date object
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const [currentWeatherCondition, setCurrentWeatherCondition] = useState("");

  const getDescriptionByCode = (codeToFind: number) => {
    const foundWeather = weatherSchema.find(
      (weather) => weather.code === codeToFind
    );

    if (foundWeather) {
      return foundWeather.description;
    } else {
      return "Code not found";
    }
  };

  // Make the HTTP GET request to fetch weather data
  axios
    .get(weatherDataUrl)
    .then((response) => {
      // Check if the request was successful (HTTP status code 200)
      if (response.status === 200) {
        // Parse the JSON response
        const weatherData = response.data;

        // Extract the weathercode
        if ("hourly" in weatherData) {
          // Format the time in the desired format (HH:mm)
          const formattedDateTime = `${year}-${month}-${day}T${hours}:00`;

          //find element with the correct current hour
          Array.isArray(weatherData.hourly.time);
          const currentHour =
            weatherData.hourly.time.indexOf(formattedDateTime);

          //extract url param
          const weatherCodeData = weatherData.hourly.weathercode;

          setCurrentWeatherCondition(
            getDescriptionByCode(weatherCodeData[currentHour])
          );
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
      <h2>
        Weather condition of your location is '{currentWeatherCondition}' as of{" "}
        {`${hours}:00`}
      </h2>
      <ClothingOccasionAndWeather weather={currentWeatherCondition} />
    </div>
  );
};

export default Weather;
