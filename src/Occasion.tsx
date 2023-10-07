import React, { useEffect } from 'react';

const Occasion = () => {
  // Sample metadata dataset as arrays
  const metadata = [
    {
      image_path: '/path/to/image1.jpg',
      clothing_type: 'dress',
      occasion: 'formal event',
      weather: 'sunny',
    },
    {
      image_path: '/path/to/image2.jpg',
      clothing_type: 'jeans',
      occasion: 'casual outing',
      weather: 'cloudy',
    },
    // Add more entries as needed
  ];

  useEffect(() => {
    // One-hot encode 'clothing_type', 'occasion', and 'weather' columns

    // Create a set of unique values for each categorical variable
    const uniqueClothingTypes = new Set(metadata.map(item => item.clothing_type));
    const uniqueOccasions = new Set(metadata.map(item => item.occasion));
    const uniqueWeather = new Set(metadata.map(item => item.weather));

    // Create one-hot encoding for 'clothing_type' column
    const encodedClothingTypes: Record<string, number>[] = Array.from(uniqueClothingTypes).map(value => {
      const obj: Record<string, number> = {};
      metadata.forEach(item => {
        obj[`clothing_type_${value}`] = item.clothing_type === value ? 1 : 0;
      });
      return obj;
    });

    // Create one-hot encoding for 'occasion' column
    const encodedOccasions: Record<string, number>[] = Array.from(uniqueOccasions).map(value => {
      const obj: Record<string, number> = {};
      metadata.forEach(item => {
        obj[`occasion_${value}`] = item.occasion === value ? 1 : 0;
      });
      return obj;
    });

    // Create one-hot encoding for 'weather' column
    const encodedWeather: Record<string, number>[] = Array.from(uniqueWeather).map(value => {
      const obj: Record<string, number> = {};
      metadata.forEach(item => {
        obj[`weather_${value}`] = item.weather === value ? 1 : 0;
      });
      return obj;
    });

    // Update the 'metadata' array with one-hot encoded columns
    metadata.forEach((item, index) => {
      Object.assign(item, encodedClothingTypes[index], encodedOccasions[index], encodedWeather[index]);
      console.log(metadata)
    });

    // The 'metadata' array now contains one-hot encoded categorical variables
  }, []);

  // Rest of your component code...

  return(
    <div></div>
  )
};


export default Occasion;