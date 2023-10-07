import { useState } from "react";
import axios from 'axios';

interface ClothingOccasionAndWeatherProps {
    weather: string;
  }

const ClothingOccasionAndWeather: React.FC<ClothingOccasionAndWeatherProps> = ({ weather}) => {
    const [message, setMessage] = useState('');
    const [inputData, setInputData] = useState('');
    const [, setOccasion] = useState('');
    const [currentWeather, setCurrentWeather] = useState('');

    const handleChange = (e:any) => {
        setInputData(e.target.value);
    };

    const handleSubmit = async () => {
        try {
        const response = await axios.post('http://localhost:5000/api/send-data', {
            data: inputData,
        });
        setOccasion(response.data.message);
        axios.get('http://localhost:5000/message')  // Make a GET request to your Flask API
            .then((response) => {
                setMessage(response.data.predicted_occasion);
                setCurrentWeather(response.data.weather);
            })
            .catch((error) => {
                console.error("Axios GET error:", error);
            });
        } catch (error) {
        console.error('Error:', error);
        }
    };

    /**TO BE implemented: 
     * current weather suitability of a clothing only is 1 in the schema. 
     * Will add more weather suitability
     * const clothingWeatherMatch = () =>{} */   

    return(
        <div>
            <div>
            <h2>
                Predict Clothing Type's Occasion
            </h2>Clothing Types: 
            <br/> Jeans, T-shirt, Sweatshirt, Shorts, Skirt, Casual Dress, Hoodie, Cardigan, Denim Jacket, Suit ,
            Blouse, Evening Gown, Tuxedo, Evening Jacket, Ballroom Dress, Trousers, Sports Jacket, Hiking Pants, Moisture-Wicking T-shirt,
            Convertible Hiking Pants, Rain Jacket
            </div>
            <br/>
            <input
                type="text"
                placeholder="Clothing Type"
                value={inputData}
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Get Occasion</button>
            <p>Response from Python: {JSON.stringify(message)}</p>
            {/* {clothingWeatherMatch()} */}
        </div>
    )
}

export default ClothingOccasionAndWeather;