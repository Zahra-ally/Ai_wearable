import { useEffect, useState } from "react";
import Weather from "./Weather";

const CurrentLocation = () =>{

const [latitude, setLatitude] = useState(Number);
  const [longitude, setLongitude] = useState(Number);
  const [, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLatitude = position.coords.latitude;
          const newLongitude = position.coords.longitude;
          setLatitude(newLatitude);
          setLongitude(newLongitude);
          
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  }, [])
  return(
    <div>
        {/* <h2>Your device's current location</h2>
        <span> latitude: {latitude}  </span> <br/>
        <span> longitude: {longitude} </span> */}
        <Weather latitude={latitude} longitude={longitude} onWeatherUpdate={undefined} />
    </div>
  )
}

export default CurrentLocation;