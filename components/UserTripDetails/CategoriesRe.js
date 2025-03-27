import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { chatSession } from "../../configs/geminiReco";

const categories = [
  {
    id: 1,
    name: "Beach",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Mountain",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Camp",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Wildlife",
    image:
      "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3&q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Adventure",
    image:
      "https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20190314120927/Adventure-Sports-in-India.jpg",
  },
  {
    id: 6,
    name: "Heritage",
    image:
      "https://vajiram-prod.s3.ap-south-1.amazonaws.com/Indian_National_Trust_for_Art_and_Cultural_Heritage_INTACH_597a4c78f5.webp",
  },
];

const RECOMMENDATION_PROMPT = `
Generate top travel recommendations based on the selected category: {selectedCategory}.

Provide a mix of:
- Global Recommendations: Top destinations worldwide known for {selectedCategory} experiences.
- Local Recommendations: Popular and highly-rated places specifically in India that are known for {selectedCategory} experiences.

For each recommendation, include a specific reason highlighting the unique {selectedCategory} experience at that destination:
- If the category is "Beach," emphasize the specific beaches, water clarity, sand quality, and water activities.
- If the category is "Mountain," highlight specific peaks, scenic views, trekking routes, and mountain experiences.
- If the category is "Camp," mention specific camping grounds, nature trails, wildlife, and outdoor experiences.

Make each recommendation highly specific to the {selectedCategory} category, not just generic tourist information.

Return 10-12 concise suggestions per scope with only the destination name and a brief reason for the recommendation specific to the category.
Return ONLY a JSON object with the following structure, and no other text or explanation:
{
  "Travel Recommendations": {
    "Global Recommendations": [
      {
        "destination": "Destination Name",
        "reason": "Brief reason focusing on the {selectedCategory} experience"
      },
      ... more destination objects
    ],
    "Local Recommendations (India)": [
      {
        "destination": "Destination Name",
        "reason": "Brief reason focusing on the {selectedCategory} experience"
      },
      ... more destination objects
    ]
  }
}

Ensure the JSON is properly formatted with no trailing commas.
`;

// Modified function to fetch category-specific photo reference for a place
export const GetPhotoRef = async (placeName, category) => {
  if (!placeName) {
    console.log("No place name provided");
    return null;
  }

  try {
    // Create a more specific search query that includes the category
    const searchQuery = category
      ? `${placeName} ${category.toLowerCase()}`
      : placeName;

    console.log("Searching for:", searchQuery);

    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        searchQuery
      )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
    );
    const result = await resp.json();

    console.log("Place search result for", searchQuery, ":", result.status);

    // Check if we have results
    if (
      result.results &&
      result.results.length > 0 &&
      result.results[0].photos &&
      result.results[0].photos.length > 0
    ) {
      const photoReference = result.results[0].photos[0].photo_reference;
      console.log(
        "Photo reference retrieved for",
        searchQuery,
        ":",
        photoReference
      );
      return photoReference;
    } else {
      console.log("No photo reference found for", searchQuery);
      // Fallback to just the place name if no results with category
      if (category) {
        console.log("Trying fallback search with just the place name");
        return GetPhotoRef(placeName, null);
      }
      return null;
    }
  } catch (error) {
    console.error("Error fetching photo reference for", placeName, ":", error);
    return null;
  }
};

export default function CategoriesRe({ onCategorySelect, selectedCategory }) {
  const [categoryPhotoRef, setCategoryPhotoRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugText, setDebugText] = useState("No data yet");
  const [recommendations, setRecommendations] = useState({
    "Travel Recommendations": {
      "Global Recommendations": [],
      "Local Recommendations (India)": [],
    },
  });
  const [expandedCard, setExpandedCard] = useState(null);
  // State to store photo references for each recommendation
  const [photoRefs, setPhotoRefs] = useState({
    global: {},
    local: {},
  });

  // Fetch photo for selected category
  useEffect(() => {
    if (selectedCategory) {
      fetchPhotoForCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchPhotoForCategory = async (category) => {
    // Use the category name as the search term
    const photoReference = await GetPhotoRef(category, null); // No need to pass category here
    setCategoryPhotoRef(photoReference);
  };

  useEffect(() => {
    console.log(
      "Component mounted or selectedCategory changed:",
      selectedCategory
    );
    setDebugText(`Selected category: ${selectedCategory || "none"}`);

    if (selectedCategory) {
      GenerateCategory();
    }
  }, [selectedCategory]);

  const GenerateCategory = async () => {
    setLoading(true);
    setDebugText(`Loading recommendations for ${selectedCategory}...`);
    console.log("Starting to generate recommendations for:", selectedCategory);

    try {
      // Replace all placeholders in the prompt with the actual selected category
      const FP = RECOMMENDATION_PROMPT.replace(
        /{selectedCategory}/g,
        selectedCategory
      );
      console.log("Final prompt:", FP);

      // Make the API call to Gemini
      const result = await chatSession.sendMessage(FP);
      const responseText = result.response.text();
      console.log("Response:", responseText);

      // Try to extract JSON if there's additional text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        setRecommendations(parsedResponse);
        setDebugText("Data successfully parsed from API");
        console.log(
          "Parsed response:",
          JSON.stringify(parsedResponse, null, 2)
        );

        // Fetch photos for all recommendations
        fetchPhotosForRecommendations(parsedResponse);
      } else {
        // If no JSON pattern found, try parsing the whole response
        try {
          const parsedResponse = JSON.parse(responseText);
          setRecommendations(parsedResponse);
          setDebugText("Data successfully parsed from API (whole response)");
          console.log(
            "Parsed response:",
            JSON.stringify(parsedResponse, null, 2)
          );

          // Fetch photos for all recommendations
          fetchPhotosForRecommendations(parsedResponse);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          setDebugText(`Error parsing: ${parseError.message}`);
          // Set default empty recommendations on parse error
          setRecommendations({
            "Travel Recommendations": {
              "Global Recommendations": [],
              "Local Recommendations (India)": [],
            },
          });
        }
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setDebugText(`Error: ${error.message}`);
      setRecommendations({
        "Travel Recommendations": {
          "Global Recommendations": [],
          "Local Recommendations (India)": [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Updated function to fetch category-specific photos for recommendations
  const fetchPhotosForRecommendations = async (recommendationsData) => {
    const globalRefs = {};
    const localRefs = {};

    // Fetch photos for global recommendations
    const globalRecommendations =
      recommendationsData["Travel Recommendations"]["Global Recommendations"];
    for (let i = 0; i < globalRecommendations.length; i++) {
      const place = globalRecommendations[i].destination;
      const photoRef = await GetPhotoRef(place, selectedCategory);
      globalRefs[i] = photoRef;
    }

    // Fetch photos for local recommendations
    const localRecommendations =
      recommendationsData["Travel Recommendations"][
        "Local Recommendations (India)"
      ];
    for (let i = 0; i < localRecommendations.length; i++) {
      const place = localRecommendations[i].destination;
      const photoRef = await GetPhotoRef(place, selectedCategory);
      localRefs[i] = photoRef;
    }

    // Update state with all photo references
    setPhotoRefs({
      global: globalRefs,
      local: localRefs,
    });

    console.log("Finished fetching all photo references");
  };

  const toggleCard = (index, section) => {
    const cardId = `${section}-${index}`;
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  // Check if we have global recommendations
  const hasGlobalRecs =
    recommendations["Travel Recommendations"]["Global Recommendations"].length >
    0;
  // Check if we have local recommendations
  const hasLocalRecs =
    recommendations["Travel Recommendations"]["Local Recommendations (India)"]
      .length > 0;

  // Function to get image URL from photo reference
  const getPhotoUrl = (photoRef) => {
    if (!photoRef) return null;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  };

  return (
    <View style={styles.container}>
      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => onCategorySelect(category.name)}
            >
              <View
                style={[
                  styles.categoryImageContainer,
                  selectedCategory === category.name && styles.selectedCategory,
                ]}
              >
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Debug Info Section */}

      {/* Recommendations Display */}
      {selectedCategory ? (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationTitle}>
            {selectedCategory} Recommendations
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066cc" />
              <Text style={styles.loadingText}>
                Generating recommendations...
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.resultsContainer}>
              {/* Global Recommendations */}
              <Text style={styles.categoryHeader}>Global Destinations</Text>

              {hasGlobalRecs ? (
                recommendations["Travel Recommendations"][
                  "Global Recommendations"
                ].map((item, index) => (
                  <TouchableOpacity
                    key={`global-${index}`}
                    style={styles.recommendationCard}
                    onPress={() => toggleCard(index, "global")}
                    activeOpacity={0.9}
                  >
                    {/* Recommendation image */}
                    {photoRefs.global[index] && (
                      <Image
                        source={{ uri: getPhotoUrl(photoRefs.global[index]) }}
                        style={styles.recommendationImage}
                      />
                    )}
                    <View style={styles.recommendationContent}>
                      <Text style={styles.destinationName}>
                        {item.destination}
                      </Text>
                      <Text style={styles.destinationReason}>
                        {item.reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  No global recommendations available
                </Text>
              )}

              {/* Local Recommendations */}
              <Text style={[styles.categoryHeader, { marginTop: 20 }]}>
                Indian Destinations
              </Text>
              {hasLocalRecs ? (
                recommendations["Travel Recommendations"][
                  "Local Recommendations (India)"
                ].map((item, index) => (
                  <TouchableOpacity
                    key={`local-${index}`}
                    style={styles.recommendationCard}
                    onPress={() => toggleCard(index, "local")}
                    activeOpacity={0.9}
                  >
                    {/* Recommendation image */}
                    {photoRefs.local[index] && (
                      <Image
                        source={{ uri: getPhotoUrl(photoRefs.local[index]) }}
                        style={styles.recommendationImage}
                      />
                    )}
                    <View style={styles.recommendationContent}>
                      <Text style={styles.destinationName}>
                        {item.destination}
                      </Text>
                      <Text style={styles.destinationReason}>
                        {item.reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  No local recommendations available
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.selectCategoryContainer}>
          <Text style={styles.selectCategoryText}>
            Select a category to see recommendations
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  // Categories styling
  categoriesSection: {
    marginTop: 2,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  seeAllText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "500",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 20,
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },

  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginTop: 4,
  },

  // Debug section

  // Recommendations styling
  recommendationsContainer: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  recommendationTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginTop: 4,
  },
  selectedCategory: {
    borderColor: "#FF6B6B",
    borderWidth: 3,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    flex: 1,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0066cc",
  },
  recommendationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  recommendationContent: {
    padding: 16,
  },
  recommendationImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  destinationReason: {
    fontSize: 15,
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },
  categoryImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryHeaderImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
    fontStyle: "italic",
  },
  selectCategoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectCategoryText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
