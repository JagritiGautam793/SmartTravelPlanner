const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  //   want op in json format
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "enerated Recommendation Prompt: Based on the user's past trips (Locations: Sikkim, India, Paris, France, Jaipur, Rajasthan, India, Goa, India, Delhi, India, Spain (Multi-City), Marbella, Spain, Goa, India, Trip Names: , , , , , , , ), suggest new destinations or activities.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Okay, based on the user's travel history, here are some recommendations:\n\n**Analysis of Past Trips:**\n\n*   **India Focus:** The user has a strong interest in traveling within India, experiencing both cultural and natural destinations.  They've visited:\n    *   **Sikkim:** Known for its Himalayan landscapes, monasteries, and trekking.\n    *   **Jaipur, Rajasthan:**  A major cultural hub, famous for forts, palaces, and vibrant markets.\n    *   **Goa (2 trips):** Primarily known for beaches, nightlife, and a mix of Indian and Portuguese culture.\n    *   **Delhi:** The capital of India, full of historical monuments, diverse cuisine, and bustling city life.\n*   **International Exploration:** The user has also ventured outside India:\n    *   **Paris, France:** A classic European city known for its art, history, fashion, and romance.\n    *   **Spain (Multi-City) & Marbella, Spain:** Suggests an interest in European culture, architecture, food, and coastal destinations.\n\n**Recommendations Based on This Analysis:**\n\nConsidering this mix, here's a breakdown of potential destinations and activities, categorized for clarity:\n\n**1.  Expanding Indian Exploration (Culture & History):**\n\n*   **Varanasi, Uttar Pradesh:** One of the oldest living cities in the world, a deeply spiritual place on the banks of the Ganges River.  This would resonate with the spiritual aspect potentially enjoyed in Sikkim.\n    *   **Activity:** Witness the Ganga Aarti ceremony, explore the narrow lanes, take a boat ride on the Ganges.\n*   **Khajuraho, Madhya Pradesh:** Famous for its ancient temples with intricate and often erotic sculptures. A unique and historically significant site.\n    *   **Activity:** Temple tours, learn about the Chandela dynasty.\n*   **Kerala (Backwaters & Munnar):**  A state with stunning natural beauty. Focus on:\n    *   **Backwaters:** Houseboat stay, exploring the waterways.\n    *   **Munnar:** Tea plantations, hills, and hiking.\n*   **Udaipur, Rajasthan:** \"The City of Lakes\" offers a romantic and regal experience, similar to Jaipur but with a different ambiance.\n    *   **Activity:** Boat ride on Lake Pichola, visit the City Palace, enjoy rooftop dining.\n*   **Hampi, Karnataka:** Ruins of the Vijayanagara Empire. An otherworldly landscape with ancient temples and rock formations.\n    *   **Activity:** Explore the ruins, visit Virupaksha Temple, climb Matanga Hill for sunset views.\n\n**2.  Expanding Indian Exploration (Nature & Adventure):**\n\n*   **Meghalaya:** Known as the \"Abode of the Clouds,\" offers living root bridges, waterfalls, and lush landscapes. A great alternative to Sikkim with different characteristics.\n    *   **Activity:** Visit Cherrapunjee and Mawlynnong (the cleanest village in Asia), explore the caves.\n*   **Andaman and Nicobar Islands:**  Beautiful beaches, diving, snorkeling, and a chance to relax in a tropical paradise. A different beach experience compared to Goa.\n    *   **Activity:** Scuba diving, snorkeling, visit Radhanagar Beach (Havelock Island).\n*   **Spiti Valley, Himachal Pradesh:** High-altitude desert mountain valley, known for its stark beauty, Buddhist monasteries, and adventure activities.\n    *   **Activity:** Trekking, visiting monasteries (Key Monastery), stargazing.\n\n**3.  International Destinations (Culture & History - Europe Focus):**\n\n*   **Rome, Italy:** Similar to Paris in its historical significance but with a different cultural feel.  Ancient ruins, stunning churches, and delicious food.\n    *   **Activity:** Visit the Colosseum, Roman Forum, Vatican City, throw a coin in the Trevi Fountain.\n*   **Florence, Italy:** The birthplace of the Renaissance. Art, architecture, and leather goods.\n    *   **Activity:** Visit the Uffizi Gallery, see Michelangelo's David, climb the Duomo.\n*   **Lisbon, Portugal:** Beautiful architecture, stunning views, and delicious seafood.  Could be a good alternative to Spain for a European trip.\n    *   **Activity:** Ride Tram 28, visit Jerónimos Monastery, explore the Alfama district.\n*   **Amsterdam, Netherlands:** Canals, museums, and a relaxed atmosphere.\n    *   **Activity:** Visit the Anne Frank House, Rijksmuseum, take a canal cruise.\n\n**4.  International Destinations (Beaches & Relaxation):**\n\n*   **Greek Islands (Santorini, Mykonos, Crete):**  Beautiful beaches, whitewashed villages, and vibrant nightlife.\n    *   **Activity:** Relax on the beaches, explore the villages, enjoy the nightlife.\n*   **Bali, Indonesia:**  Beaches, rice paddies, temples, and a rich culture.\n    *   **Activity:** Surf, visit temples, relax on the beaches, explore the rice terraces.\n*   **Thailand (Phuket, Krabi):**  Beautiful beaches, islands, and delicious food.\n    *   **Activity:** Island hopping, snorkeling, diving, enjoy Thai massage.\n\n**Prompt Improvement:**\n\nTo give more specific recommendations, more information is needed.  Consider asking the user these questions:\n\n*   **What did you enjoy most about each of your previous trips?** (Specific aspects are more helpful than generalities.)\n*   **What is your budget for your next trip?**\n*   **What time of year are you planning to travel?**\n*   **What are you looking for in your next trip?** (Relaxation, adventure, culture, food, etc.)\n*   **Who are you traveling with?** (Solo, couple, family, etc.)\n\nBy knowing their preferences, budget, travel time, and travel companions, you can provide much more tailored and relevant recommendations.\n",
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
