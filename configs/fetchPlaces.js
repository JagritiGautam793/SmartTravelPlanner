import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

/**
 * Fetch places from Google Places API
 * @param {string} category - Place category (Beach, Mountain, Camp)
 * @param {string} location - Latitude,longitude coordinates (default: Delhi, India)
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} Array of place objects
 */
export async function fetchGooglePlaces(
  category,
  location = "28.6139,77.2090", // Default to Delhi, India
  radius = 50000
) {
  try {
    console.log(
      `🔍 Fetching places for category: ${category} at location: ${location}`
    );

    // Map our app categories to Google Places API types
    let placeType = "";
    switch (category.toLowerCase()) {
      case "beach":
        placeType = "beach";
        break;
      case "camp":
        placeType = "campsites";
        break;
      case "mountain":
        placeType = "mountain";
        break;
      default:
        placeType = "tourist_attraction";
    }

    // Add keyword to improve search relevance
    const keyword = category.toLowerCase();

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${placeType}&keyword=${keyword}&key=${GOOGLE_PLACES_API_KEY}`;

    console.log(`🌍 Fetching from URL: ${url}`);

    const response = await axios.get(url);

    if (!response.data || response.data.status !== "OK") {
      console.error(
        `❌ Google Places API Error: ${response.data?.status} - ${
          response.data?.error_message || "No error message provided"
        }`
      );
      return [];
    }

    // Map API results to our app's data structure
    const places = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || "No address available",
      rating: place.rating || "No rating",
      image: place.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        : null,
    }));

    console.log(`📊 Places extracted: ${places.length}`);
    return places;
  } catch (error) {
    console.error("❌ Error fetching places:", error.message);
    return [];
  }
}
