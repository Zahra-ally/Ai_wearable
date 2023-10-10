import React, { useState, useEffect } from "react";
import CurrentLocation from "./CurrentLocation";
import Occasion from "./Occasion";

// Define the outfits by occasion and weather condition
const outfitsByOccasion = {
  casual: [
    {
      clothes: [
        {
          name: "Casual Shirt 1",
          type: "Shirt",
          color: "Blue",
          style: "Casual",
        },
        {
          name: "Casual Pants 1",
          type: "Pants",
          color: "Khaki",
          style: "Casual",
        },
      ],
      occasion: "Casual",
      weatherCondition: "Sunny",
    },
    // Add more casual outfits here
  ],
  fancy: [
    {
      clothes: [
        {
          name: "Fancy Dress 1",
          type: "Dress",
          color: "Red",
          style: "Fancy",
        },
        // Add more fancy outfits here
      ],
      occasion: "Fancy",
      weatherCondition: "Rainy",
    },
    // Add more fancy outfits here
  ],
  chic: [
    {
      clothes: [
        {
          name: "Chic Blouse 1",
          type: "Blouse",
          color: "White",
          style: "Chic",
        },
        {
          name: "Chic Pants 1",
          type: "Pants",
          color: "Black",
          style: "Chic",
        },
      ],
      occasion: "Chic",
      weatherCondition: "Cloudy",
    },
    // Add more chic outfits here
  ],
  // Add outfits for other occasions as needed
};

// Define types for clothing items and outfits
type ClothingItem = {
  name: string;
  type: string; // e.g., shirt, pants, shoes, etc.
  color: string;
  style: string; // e.g., casual, formal, sporty, etc.
};

type Outfit = {
  clothes: ClothingItem[];
  occasion: string;
  weatherCondition: string; // Add the weather condition property
};

// Define a state representing the outfit and context
type State = {
  outfit: Outfit;
  occasion: string;
  weatherCondition: string;
  // Add other relevant state variables
};

// Define Q-values for state-action pairs
type QTable = Record<string, Record<string, number>>;

// Initialize the Q-table with zeros for each state-action pair
const initialQTable: QTable = {};

function App() {
  // State variables
  const [qTable, setQTable] = useState<QTable>(initialQTable);

  // Hyperparameters for Q-learning
  const learningRate = 0.1;
  const discountFactor = 0.9;
  const explorationRate = 0.2;

  // Function to select an action (outfit recommendation) based on Q-values, occasion, and weather condition
  function selectAction(
    state: State,
    qTable: QTable,
    weatherCondition: string
  ): Outfit {
    if (Math.random() < explorationRate) {
      // Explore: Randomly select an outfit
      return generateRandomOutfit();
    } else {
      // Exploit: Choose the best outfit based on Q-values, occasion, and weather
      const stateKey = JSON.stringify(state);
      const actions = qTable[stateKey] || {};

      // Explicitly specify the type of outfitsByOccasion using type assertion
      const outfitsByOccasionTyped: Record<string, Outfit[]> =
        outfitsByOccasion;

      // Find the matching occasion in outfitsByOccasionTyped
      const matchingOccasion = Object.keys(outfitsByOccasionTyped).find(
        (occasion) => occasion === state.occasion
      );

      if (!matchingOccasion) {
        // Handle the case when there are no outfits defined for the occasion
        return generateRandomOutfit();
      }

      // Filter outfits for the matched occasion
      const outfitsForOccasion = outfitsByOccasionTyped[matchingOccasion];

      // Filter outfits based on weather condition
      const suitableOutfits = outfitsForOccasion.filter((outfit) => {
        // Customize this logic based on your weather condition data
        // For example, you can check if the outfit matches the current weather condition
        if (outfit.weatherCondition === weatherCondition) {
          return true;
        }
        return false;
      });

      if (suitableOutfits.length === 0) {
        // Handle the case when there are no suitable outfits for the current weather
        return generateRandomOutfit();
      }

      // Calculate the Q-values for suitable outfits
      const qValuesForSuitableOutfits = suitableOutfits.map((outfit) => {
        const outfitKey = JSON.stringify(outfit);
        return actions[outfitKey] || 0;
      });

      // Find the index of the best outfit based on Q-values
      const bestOutfitIndex = qValuesForSuitableOutfits.indexOf(
        Math.max(...qValuesForSuitableOutfits)
      );

      return suitableOutfits[bestOutfitIndex];
    }
  }

  // Function to update Q-values based on state transitions and rewards
  function updateQValues(
    currentState: State,
    action: Outfit,
    nextState: State,
    reward: number
  ) {
    const currentStateKey = JSON.stringify(currentState);
    const nextStateKey = JSON.stringify(nextState);

    qTable[currentStateKey] = qTable[currentStateKey] || {};
    const currentQValue = qTable[currentStateKey][JSON.stringify(action)] || 0;

    const bestNextQValue = Math.max(
      ...Object.values(qTable[nextStateKey] || {}),
      0
    );

    // Q-learning update rule
    const newQValue =
      currentQValue +
      learningRate * (reward + discountFactor * bestNextQValue - currentQValue);

    qTable[currentStateKey][JSON.stringify(action)] = newQValue;
  }
  // Function to generate a random outfit (for exploration)
  function generateRandomOutfit(): Outfit {
    // Define your wardrobe of clothing items
    const wardrobe: ClothingItem[] = [
      {
        name: "Casual Shirt 1",
        type: "Shirt",
        color: "Blue",
        style: "Casual",
      },
      {
        name: "Casual Pants 1",
        type: "Pants",
        color: "Khaki",
        style: "Casual",
      },
      {
        name: "Fancy Dress 1",
        type: "Dress",
        color: "Red",
        style: "Fancy",
      },
      {
        name: "Chic Blouse 1",
        type: "Blouse",
        color: "White",
        style: "Chic",
      },
      // Add more clothing items to your wardrobe
    ];

    // Randomly select clothing items for the outfit
    const randomShirt = wardrobe[Math.floor(Math.random() * wardrobe.length)];
    const randomPants = wardrobe[Math.floor(Math.random() * wardrobe.length)];

    // Define the occasion and weather condition for the random outfit
    const occasion = "Fancy"; // You can randomly select an occasion
    const weatherCondition = "Rainy"; // You can randomly select a weather condition

    // Create and return the random outfit
    const randomOutfit: Outfit = {
      clothes: [randomShirt, randomPants],
      occasion,
      weatherCondition,
    };

    return randomOutfit;
  }

  // Function to evaluate an outfit and provide a reward (simplified)
  function evaluateOutfit(outfit: Outfit, occasion: string): number {
    // Implement logic to evaluate the outfit and provide a reward
    // For simplicity, let's assume a fixed reward for now
    return 1;
  }

  // Function to train the outfit recommendation AI
  function trainOutfitRecommendationAI() {
    const numEpisodes = 5000; // Increase the number of episodes

    for (let episode = 1; episode <= numEpisodes; episode++) {
      let currentState: State = {
        outfit: generateRandomOutfit(),
        occasion: "Fancy",
        weatherCondition: "Rainy", // Set the initial weather condition
      };

      for (let step = 1; step <= 100; step++) {
        const selectedOutfit = selectAction(
          currentState,
          qTable,
          currentState.weatherCondition
        );

        // Simulate user feedback (reward calculation)
        const reward = evaluateOutfit(selectedOutfit, currentState.occasion);

        // Update Q-values
        const nextState: State = {
          outfit: selectedOutfit,
          occasion: "Fancy", // In this simplified example, the occasion is fixed
          weatherCondition: "Rainy", // Update the weather condition here
        };
        updateQValues(currentState, selectedOutfit, nextState, reward);

        currentState = nextState;
      }
    }
  }

  // Function to get a recommended outfit based on the learned Q-values and weather condition
  function recommendOutfit(state: State, weatherCondition: string): Outfit {
    return selectAction(state, qTable, weatherCondition);
  }

  // Initialize the recommended outfit state
  const [recommendedOutfit, setRecommendedOutfit] = useState<Outfit | null>(
    null
  );

  // Simulate the outfit recommendation process when the component mounts
  useEffect(() => {
    // Simulate weather condition (you can replace this with actual weather data)
    // const weatherCondition = "Rainy"; // Example weather condition
    const weatherCondition = "Rainy"; // Example weather condition

    trainOutfitRecommendationAI();
    const recommended = recommendOutfit(userState, weatherCondition);
    setRecommendedOutfit(recommended);

    // Update the current weather condition state
    // setCurrentWeatherCondition(weatherCondition);
  }, []);

  // Example user state
  const userState: State = {
    outfit: generateRandomOutfit(),
    occasion: "Fancy",
    weatherCondition: "Rainy", // Set the initial weather condition
  };

  return (
    <div>
      <h1>Outfit Recommendation App</h1>
      <h2>Recommended Outfit</h2>
      <pre>{JSON.stringify(recommendedOutfit, null, 2)}</pre>
      <CurrentLocation />
      <Occasion />
    </div>
  );
}

export default App;
