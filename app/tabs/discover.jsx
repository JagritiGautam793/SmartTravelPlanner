import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGooglePlaces } from "./../../configs/fetchPlaces";
import { getPersonalizedRecommendations } from "./../../configs/geminiReco";
import Recomm from "../../components/UserTripDetails/Recomm";
import FetchUserTrips from "../../components/UserTripDetails/FetchUserTrip";
import CategoriesRe from "../../components/UserTripDetails/CategoriesRe"; // ✅ Import CategoriesRe

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [places, setPlaces] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch data when category is selected
  async function handleCategorySelect(category) {
    console.log("🟢 Selected category:", category);
    setSelectedCategory(category);
    setLoading(true);

    try {
      console.log("🔍 Fetching Google Places...");
      const googlePlaces = await fetchGooglePlaces(category);
      console.log("✅ Places received:", googlePlaces.length);

      setPlaces(googlePlaces);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to render AI recommendations section
  const renderAIRecommendations = () => {
    return (
      <View style={styles.aiRecommendationsSection}>
        <Text style={styles.sectionTitle}>Working to generate your trip</Text>
        <Text style={styles.sectionTitle}>Personalized For You</Text>

        {aiRecommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationCard}>
            <Text style={styles.recommendationName}>{recommendation.name}</Text>
            <Text style={styles.recommendationDesc}>
              {recommendation.description}
            </Text>
            <Text style={styles.recommendationReason}>
              {recommendation.reason}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Places</Text>
        </View>

        {/* Render Recomm component */}
        <View>
          <Recomm />
        </View>

        {/* ✅ Categories Section transferred to CategoriesRe */}
        <View>
          <CategoriesRe
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </View>

        {/* Loading Indicator */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#FF6B6B"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Display Places from Google API */}
        <View style={styles.placesSection}>
          <Text style={styles.sectionTitle}>Popular Places</Text>
          {places.length === 0 && !loading ? (
            <Text style={styles.emptyText}>
              Select a category to see places.
            </Text>
          ) : (
            places.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                {place.image && (
                  <Image
                    source={{ uri: place.image }}
                    style={styles.placeImage}
                  />
                )}
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddress}>{place.address}</Text>
                  <Text style={styles.placeRating}>⭐ {place.rating}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* AI Recommendations Section */}
        {renderAIRecommendations()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  placesSection: { marginTop: 30, paddingHorizontal: 20 },
  placeCard: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  placeImage: { width: 80, height: 80, borderRadius: 10 },
  placeInfo: { marginLeft: 10 },
  placeName: { fontSize: 16, fontWeight: "600" },
  placeAddress: { fontSize: 14, color: "#666" },
  placeRating: { fontSize: 14, color: "#FF6B6B" },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  aiRecommendationsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recommendationCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4682B4",
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recommendationDesc: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  recommendationReason: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#666",
  },
});
