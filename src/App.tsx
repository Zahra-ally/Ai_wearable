// import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from "react";
import CurrentLocation from "./CurrentLocation";
import Occasion from "./Occasion";

function App() {
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
    occasion: string; // e.g., work, party, gym, etc.
  };

  // Define a state representing the outfit and context
  type State = {
    outfit: Outfit;
    occasion: string;
    // Add other relevant state variables
  };

  // Define Q-values for state-action pairs
  type QTable = Record<string, Record<string, number>>;

  // Initialize the Q-table with zeros for each state-action pair
  const [qTable, setQTable] = useState<QTable>({});

  // Define hyperparameters for Q-learning
  const learningRate = 0.1;
  const discountFactor = 0.9;
  const explorationRate = 0.2;

  // Function to select an action (outfit recommendation) based on Q-values and exploration
  function selectAction(state: State, qTable: QTable): Outfit {
    if (Math.random() < explorationRate) {
      // Explore: Randomly select an outfit
      return generateRandomOutfit();
    } else {
      // Exploit: Choose the best casual outfit based on Q-values
      const stateKey = JSON.stringify(state);
      const actions = qTable[stateKey] || {};

      // Filter outfits for the 'casual' occasion
      const casualOutfits = outfitsByOccasion["casual"];

      if (casualOutfits.length === 0) {
        // Handle the case when there are no casual outfits defined
        return generateRandomOutfit();
      }

      // Calculate the Q-values for casual outfits
      const qValuesForCasualOutfits = casualOutfits.map((outfit) => {
        const outfitKey = JSON.stringify(outfit);
        return actions[outfitKey] || 0;
      });

      // Find the index of the best casual outfit based on Q-values
      const bestCasualOutfitIndex = qValuesForCasualOutfits.indexOf(
        Math.max(...qValuesForCasualOutfits)
      );

      return casualOutfits[bestCasualOutfitIndex];
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
    // Implement logic to generate a random outfit based on the wardrobe
    // This can be improved with more sophisticated outfit generation techniques
    // For simplicity, let's generate a random outfit here
    return {
      clothes: [
        {
          name: "Random Shirt",
          type: "Shirt",
          color: "Random",
          style: "Casual",
        },
        {
          name: "Random Pants",
          type: "Pants",
          color: "Random",
          style: "Casual",
        },
      ],
      occasion: "Casual",
    };
  }

  // Function to evaluate an outfit and provide a reward (simplified)
  function evaluateOutfit(outfit: Outfit, occasion: string): number {
    // Implement logic to evaluate the outfit and provide a reward
    // For simplicity, let's assume a fixed reward for now
    return 1;
  }

  // Train the outfit recommendation AI
  function trainOutfitRecommendationAI() {
    const numEpisodes = 1000;

    for (let episode = 1; episode <= numEpisodes; episode++) {
      let currentState: State = {
        outfit: generateRandomOutfit(),
        occasion: "Fancy",
      };

      for (let step = 1; step <= 100; step++) {
        const selectedOutfit = selectAction(currentState, qTable);

        // Simulate user feedback (reward calculation)
        const reward = evaluateOutfit(selectedOutfit, currentState.occasion);

        // Update Q-values
        const nextState: State = {
          outfit: selectedOutfit,
          occasion: "Fancy", // In this simplified example, the occasion is fixed
        };
        updateQValues(currentState, selectedOutfit, nextState, reward);

        currentState = nextState;
      }
    }
  }

  // Function to get a recommended outfit based on the learned Q-values
  function recommendOutfit(state: State): Outfit {
    return selectAction(state, qTable);
  }

  // Initialize the recommended outfit state
  const [recommendedOutfit, setRecommendedOutfit] = useState<Outfit | null>(
    null
  );

  // Simulate the outfit recommendation process when the component mounts
  useEffect(() => {
    trainOutfitRecommendationAI();
    const recommended = recommendOutfit(userState);
    setRecommendedOutfit(recommended);
  }, []);

  // Example user state
  const userState: State = {
    outfit: generateRandomOutfit(),
    occasion: "Casual",
  };

  
  return (
    <div>
      <h1>Outfit Recommendation App</h1>
      <h2>Recommended Outfit</h2>
      <pre>{JSON.stringify(recommendedOutfit, null, 2)}</pre>
      <CurrentLocation/>
      <Occasion/>
    </div>
  );
}

export default App;
