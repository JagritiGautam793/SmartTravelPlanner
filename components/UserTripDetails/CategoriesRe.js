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
  { id: 1, name: "Beach", image: "https://source.unsplash.com/800x600/?beach" },
  {
    id: 2,
    name: "Mountain",
    image: "https://source.unsplash.com/800x600/?mountain",
  },
  { id: 3, name: "Camp", image: "https://source.unsplash.com/800x600/?camp" },
];

const RECOMMENDATION_PROMPT = `
Generate top travel recommendations based on the selected category: {selectedCategory}.

Provide a mix of:
- Global Recommendations: Top destinations worldwide relevant to the category.
- Local Recommendations: Popular and highly-rated places specifically in India that fit the category.

For each recommendation, include a brief and specific reason highlighting the unique appeal of the destination based on the selected category:
- If the category is "Beach," emphasize the best beaches and water activities.
- If the category is "Mountain," highlight scenic views, trekking routes, and serene environments.
- If the category is "Camp," mention adventure activities, nature trails, and outdoor camping facilities.
- If the category is "Culture," focus on historical landmarks, festivals, and local traditions.
- If the category is "Adventure," mention adrenaline-pumping activities and extreme sports.

Return 10-12 concise suggestions per scope with only the destination name and a brief reason for the recommendation.
Return ONLY a JSON object with the following structure, and no other text or explanation:
{
  "Travel Recommendations": {
    "Global Recommendations": [
      {
        "destination": "Destination Name",
        "reason": "Brief reason for recommendation"
      },
      ... more destination objects
    ],
    "Local Recommendations (India)": [
      {
        "destination": "Destination Name",
        "reason": "Brief reason for recommendation"
      },
      ... more destination objects
    ]
  }
}

Ensure the JSON is properly formatted with no trailing commas.
`;

export default function CategoriesRe({ onCategorySelect, selectedCategory }) {
  const [loading, setLoading] = useState(false);
  const [debugText, setDebugText] = useState("No data yet");
  const [recommendations, setRecommendations] = useState({
    "Travel Recommendations": {
      "Global Recommendations": [],
      "Local Recommendations (India)": [],
    },
  });
  const [expandedCard, setExpandedCard] = useState(null);

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
      // Replace the placeholder in the prompt with the actual selected category
      const FP = RECOMMENDATION_PROMPT.replace(
        "{selectedCategory}",
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

  const toggleCard = (index, section) => {
    const cardId = `${section}-${index}`;
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  // Debug info about current state
  console.log("Current state:");
  console.log("- selectedCategory:", selectedCategory);
  console.log("- loading:", loading);
  console.log(
    "- recommendations available:",
    recommendations["Travel Recommendations"]["Global Recommendations"].length >
      0 ||
      recommendations["Travel Recommendations"]["Local Recommendations (India)"]
        .length > 0
  );

  // Check if we have global recommendations
  const hasGlobalRecs =
    recommendations["Travel Recommendations"]["Global Recommendations"].length >
    0;
  // Check if we have local recommendations
  const hasLocalRecs =
    recommendations["Travel Recommendations"]["Local Recommendations (India)"]
      .length > 0;

  return (
    <View style={styles.container}>
      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.name && styles.selectedCategory,
              ]}
              onPress={() => onCategorySelect(category.name)}
            >
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Debug Info Section */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>{debugText}</Text>
        <Text style={styles.debugText}>
          Selected: {selectedCategory || "none"}
        </Text>
        <Text style={styles.debugText}>Loading: {loading ? "Yes" : "No"}</Text>
        <Text style={styles.debugText}>
          Has global recs: {hasGlobalRecs ? "Yes" : "No"}
        </Text>
        <Text style={styles.debugText}>
          Has local recs: {hasLocalRecs ? "Yes" : "No"}
        </Text>
      </View>

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
                    <Text style={styles.destinationName}>
                      {item.destination}
                    </Text>
                    <Text style={styles.destinationReason}>{item.reason}</Text>
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
                    <Text style={styles.destinationName}>
                      {item.destination}
                    </Text>
                    <Text style={styles.destinationReason}>{item.reason}</Text>
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
    backgroundColor: "#f8f8f8",
  },
  // Categories styling
  categoriesSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 15,
    padding: 5,
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Debug section
  debugSection: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  debugTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: "#333",
  },

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
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
