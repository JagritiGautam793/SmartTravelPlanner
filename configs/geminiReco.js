const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const RECOMMENDATIONCATEGORY_PROMPT = `
Generate top travel recommendations based on the selected category: {selectedCategory}. 

Provide a mix of:
- Global Recommendations: Top destinations worldwide relevant to the category.
- Local Recommendations: Popular and highly-rated places nearby that fit the category.

Return 10-12 concise suggestions per scope with only the destination name and a brief reason for the recommendation. 
Give the ouput in JSON format.
`;

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
          text: "Generate top travel recommendations based on the selected category: Beach.\n\nProvide a mix of:\n- Global Recommendations: Top destinations worldwide relevant to the category.\n- Local Recommendations: Popular and highly-rated places nearby that fit the category.\n\nReturn 10-12 concise suggestions per scope with only the destination name and a brief reason for the recommendation.\nGive the ouput in JSON format.\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "Beach Travel Recommendations": {\n    "Global Destinations": [\n      {\n        "destination": "Maldives",\n        "reason": "Luxury overwater bungalows, pristine white sand, and vibrant coral reefs."\n      },\n      {\n        "destination": "Bora Bora, French Polynesia",\n        "reason": "Iconic volcanic peaks, turquoise lagoons, and secluded beaches perfect for romance."\n      },\n      {\n        "destination": "Maui, Hawaii, USA",\n        "reason": "Diverse beaches for surfing, snorkeling, and relaxation, plus stunning volcanic landscapes."\n      },\n      {\n        "destination": "The Seychelles",\n        "reason": "Unique granite boulders, lush vegetation, and secluded, untouched beaches."\n      },\n      {\n        "destination": "Palawan, Philippines",\n        "reason": "El Nido and Coron offer stunning limestone cliffs, hidden lagoons, and incredible diving."\n      },\n      {\n        "destination": "Bali, Indonesia",\n        "reason": "Volcanic beaches, surfing hotspots, rice paddies, and vibrant culture."\n      },\n      {\n        "destination": "Santorini, Greece",\n        "reason": "Dramatic cliffs, white-washed villages, and unique volcanic black sand beaches."\n      },\n      {\n        "destination": "Rio de Janeiro, Brazil",\n        "reason": "Iconic beaches like Copacabana and Ipanema offer a vibrant atmosphere and stunning views."\n      },\n      {\n        "destination": "Phuket, Thailand",\n        "reason": "Beautiful beaches, turquoise waters, and a wide range of activities and nightlife."\n      },\n      {\n        "destination": "Fiji",\n        "reason": "Soft coral capital of the world, beautiful island vibe and friendly locals."\n      },\n      {\n        "destination": "Zanzibar, Tanzania",\n        "reason": "Spice Island offering pristine beaches, turquoise waters, and a rich cultural history."\n      },\n      {\n        "destination": "Amalfi Coast, Italy",\n        "reason": "Picturesque coastal towns, dramatic cliffs, and charming beaches perfect for a scenic getaway."\n      }\n    ],\n    "Local Destinations": [\n      {\n        "destination": "Miami Beach, Florida, USA",\n        "reason": "Iconic art deco architecture, vibrant nightlife, and wide sandy beaches."\n      },\n      {\n        "destination": "Outer Banks, North Carolina, USA",\n        "reason": "Beautiful beaches, historical landmarks, and great for fishing and watersports."\n      },\n      {\n        "destination": "Santa Monica, California, USA",\n        "reason": "Classic beach town with a famous pier, amusement park, and beautiful coastline."\n      },\n      {\n        "destination": "Cape Cod, Massachusetts, USA",\n        "reason": "Charming New England beaches, picturesque towns, and delicious seafood."\n      },\n      {\n        "destination": "Gulf Shores, Alabama, USA",\n        "reason": "Beautiful white-sand beaches, family-friendly atmosphere, and great for fishing."\n      },\n      {\n        "destination": "Myrtle Beach, South Carolina, USA",\n        "reason": "Known for its family-friendly attractions, wide beaches, and live entertainment."\n      },\n      {\n        "destination": "San Diego, California, USA",\n        "reason": "Beautiful beaches, perfect for swimming, surfing, or just relaxing."\n      },\n      {\n        "destination": "Hilton Head Island, South Carolina, USA",\n        "reason": "Golf courses, beautiful beaches, and a relaxed island vibe."\n      },\n      {\n        "destination": "Destin, Florida, USA",\n        "reason": "Emerald coast with white sand and clear waters."\n      },\n      {\n        "destination": "Tybee Island, Georgia, USA",\n        "reason": "Family-friendly beaches with calm waters and historical sites nearby."\n      },\n       {\n        "destination": "Virginia Beach, Virginia, USA",\n        "reason": "Boardwalk with attractions, beautiful beaches, and a vibrant atmosphere."\n      },\n      {\n        "destination": "Monterey, California, USA",\n        "reason": "Offers beaches, famous aquarium, and the scenic 17-mile drive."\n      }\n    ]\n  }\n}\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
