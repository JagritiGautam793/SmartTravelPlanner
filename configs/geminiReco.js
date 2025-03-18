import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Get personalized travel recommendations from Gemini AI
 * @param {string} selectedCategory - The category of destinations (Beach, Mountain, Camp)
 * @param {string} userPreferences - User preferences as comma-separated keywords
 * @returns {Promise<Array>} - Array of recommendation objects
 */
export async function getPersonalizedRecommendations(
  selectedCategory,
  userPreferences
) {
  try {
    // Initialize the Gemini API client
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) {
      console.error("Gemini API key is missing");
      return [];
    }

    // Create a new instance with the correct API version
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log("Using Gemini model:", model.modelName);

    const prompt = `As a travel recommendation expert, suggest 5 destinations that match the following criteria:
    - Category: ${selectedCategory}
    - User Preferences: ${userPreferences}
    
    For each destination, provide:
    - Name
    - Brief description (max 2 sentences)
    - What makes it special for this specific user
    
    Format the response as a JSON array of objects with name, description, and reason properties.`;

    // Set a timeout for the request
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini API request timed out")),
          15000
        )
      ),
    ]);

    // The issue is here - The response handling needs to be fixed
    // Check if result has a response method or is already the response object
    let text;
    if (typeof result.response === "function") {
      // API version where result has a response() method
      const response = await result.response();
      text = response.text();
    } else if (result.response && typeof result.response.text === "function") {
      // API version where result.response is already an object
      text = result.response.text();
    } else if (result.text && typeof result.text === "function") {
      // API version where result itself has a text() method
      text = result.text();
    } else if (result.candidates && result.candidates[0]?.content?.parts) {
      // Newer API version structure
      text = result.candidates[0].content.parts[0]?.text || "";
    } else {
      // Fallback if we can't find the text in any expected location
      console.error("Unexpected Gemini API response structure:", result);
      return getFallbackRecommendations(selectedCategory);
    }

    console.log("Raw Gemini response:", text.substring(0, 100) + "...");

    try {
      // Check if the response looks like JSON
      if (!text.trim().startsWith("[") && !text.trim().startsWith("{")) {
        console.warn("Response is not in JSON format:", text);
        return parseNonJsonResponse(text, selectedCategory);
      }

      // Parse JSON response
      const recommendations = JSON.parse(text);

      // Ensure we have valid recommendations
      if (!Array.isArray(recommendations)) {
        console.warn("AI response is not an array:", recommendations);
        return [];
      }

      // Validate each recommendation has the required properties
      return recommendations.filter(
        (rec) =>
          rec &&
          typeof rec === "object" &&
          "name" in rec &&
          "description" in rec &&
          "reason" in rec
      );
    } catch (parseError) {
      console.error(
        "Failed to parse AI response:",
        parseError,
        "Raw text:",
        text
      );
      return parseNonJsonResponse(text, selectedCategory);
    }
  } catch (error) {
    console.error("Error getting AI recommendations:", error.message);

    // Return fallback recommendations if API fails
    return getFallbackRecommendations(selectedCategory);
  }
}

// Keeping the rest of your functions unchanged
function parseNonJsonResponse(text, category) {
  try {
    // Simple parser for text that might contain recommendations
    const recommendations = [];
    const lines = text.split("\n");

    let currentRec = null;
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Look for patterns that might indicate a new recommendation
      if (trimmedLine.match(/^\d+\.\s|^-\s[A-Z]|^[A-Z][a-zA-Z\s]+:/)) {
        if (currentRec && currentRec.name) {
          recommendations.push(currentRec);
        }

        currentRec = {
          name: trimmedLine.replace(/^\d+\.\s|-\s|:/g, "").trim(),
          description: "",
          reason: "",
        };
      } else if (currentRec && trimmedLine) {
        // Add content to description or reason
        if (!currentRec.description) {
          currentRec.description = trimmedLine;
        } else if (!currentRec.reason) {
          currentRec.reason = trimmedLine;
        }
      }
    }

    // Add the last recommendation if exists
    if (currentRec && currentRec.name) {
      recommendations.push(currentRec);
    }

    if (recommendations.length > 0) {
      return recommendations;
    }

    return getFallbackRecommendations(category);
  } catch (error) {
    console.error("Error parsing non-JSON response:", error);
    return getFallbackRecommendations(category);
  }
}

function getFallbackRecommendations(category) {
  console.log("Using fallback recommendations for:", category);

  const fallbacks = {
    Beach: [
      {
        name: "Bora Bora",
        description:
          "A paradise island with crystal-clear lagoons and overwater bungalows. Perfect for snorkeling and relaxation.",
        reason:
          "Offers pristine beaches and spectacular scenic views perfect for nature lovers.",
      },
      {
        name: "Maldives",
        description:
          "An archipelago of 1,000+ coral islands with stunning white-sand beaches. Known for luxury resorts and vibrant marine life.",
        reason:
          "Combines adventure opportunities with breathtaking natural beauty.",
      },
      {
        name: "Copacabana Beach, Brazil",
        description:
          "Famous beach in Rio de Janeiro with golden sands and vibrant atmosphere. Known for sports and lively culture.",
        reason:
          "Offers both natural beauty and opportunities for adventure activities.",
      },
      {
        name: "Maya Bay, Thailand",
        description:
          "Stunning bay surrounded by limestone cliffs made famous by 'The Beach' movie. Recently reopened with conservation measures.",
        reason:
          "Provides a perfect combination of natural beauty and adventure in a protected environment.",
      },
      {
        name: "Whitehaven Beach, Australia",
        description:
          "Famous for its pure white silica sand and turquoise waters. Located in the heart of the Great Barrier Reef.",
        reason:
          "Offers pristine natural beauty and nearby adventure opportunities for snorkeling and diving.",
      },
    ],
    Mountain: [
      {
        name: "Swiss Alps",
        description:
          "Iconic mountain range with breathtaking peaks and valleys. Perfect for hiking, skiing and taking in panoramic views.",
        reason:
          "Offers some of the world's most spectacular scenic views and outdoor adventure opportunities.",
      },
      {
        name: "Patagonia",
        description:
          "Dramatic mountain landscapes spanning Argentina and Chile. Known for jagged peaks, glaciers, and diverse ecosystems.",
        reason:
          "A paradise for adventurous nature lovers with unparalleled scenic views.",
      },
      {
        name: "Rocky Mountains",
        description:
          "Extensive mountain range with diverse wildlife and outdoor activities. Features numerous national parks including Yellowstone.",
        reason:
          "Perfect for experiencing mountain adventure with incredible natural scenery.",
      },
      {
        name: "Himalayas",
        description:
          "Home to the world's highest peaks including Mount Everest. Offers trekking routes for all experience levels.",
        reason:
          "The ultimate destination for those seeking majestic mountain views and challenging adventures.",
      },
      {
        name: "New Zealand Southern Alps",
        description:
          "Spectacular mountain range with diverse landscapes from forests to glaciers. Featured in many films including Lord of the Rings.",
        reason:
          "Combines breathtaking scenic beauty with numerous adventure opportunities in a pristine environment.",
      },
    ],
    Camp: [
      {
        name: "Yosemite National Park",
        description:
          "Iconic park with granite cliffs, waterfalls, and ancient sequoias. Offers numerous campgrounds with varying levels of amenities.",
        reason:
          "Provides the perfect balance of adventure and natural scenery for camping enthusiasts.",
      },
      {
        name: "Banff National Park",
        description:
          "Canada's oldest national park with stunning mountain landscapes and turquoise lakes. Features well-maintained campgrounds and hiking trails.",
        reason:
          "Offers spectacular scenic views with excellent camping facilities in pristine nature.",
      },
      {
        name: "Lake District, UK",
        description:
          "Beautiful mountainous region with lakes, forests and quaint villages. Provides a mix of wild camping and serviced sites.",
        reason:
          "Perfect for nature lovers seeking scenic landscapes with a touch of adventure.",
      },
      {
        name: "Kruger National Park",
        description:
          "One of Africa's largest game reserves with diverse wildlife and safari experiences. Offers everything from basic camping to luxury glamping.",
        reason:
          "Combines adventure with unforgettable natural experiences in a unique setting.",
      },
      {
        name: "Joshua Tree National Park",
        description:
          "Desert landscape with unique rock formations and the distinctive Joshua trees. Popular for stargazing and rock climbing.",
        reason:
          "Provides a unique desert camping experience with spectacular views and adventure activities.",
      },
    ],
  };

  return fallbacks[category] || [];
}
