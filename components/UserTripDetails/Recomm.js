import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import { CreateTripContext } from "../../context/CreateTripContext";
import { chatSession } from "../../configs/GenRecomm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const CACHE_KEY = "travel_recommendations_cache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function Recomm() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({
    recommendations: [],
  });
  const user = auth.currentUser;

  const GenerateRecommendation = async (
    trips = userTrips,
    forceFetch = false
  ) => {
    setLoading(true);

    try {
      // Check cache first if not forcing a fetch
      if (!forceFetch) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < CACHE_EXPIRY) {
            setRecommendations(data);
            setLoading(false);
            return;
          }
        }
      }

      // Collect details from past trips (locations and names)
      const locations = trips
        .map((trip) => trip.tripPlan?.location)
        .filter((location) => location)
        .join(", ");
      const tripNames = trips
        .map((trip) => trip.tripName)
        .filter((name) => name)
        .join(", ");

      const FINAL_REC_PROMPT = `Based on the user's past trips (Locations: ${locations}, Trip Names: ${tripNames}), suggest 5-6 new destinations. 

      Return ONLY a JSON object with the following structure, and no other text or explanation:
      {
        "recommendations": [
          {
            "destination": "City/Region Name, Country",
            "reason": "A short paragraph explaining why this destination fits the user's preferences based on past trips",
            "activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"]
          },
          ... more destination objects
        ]
      }
      
      Each destination should include exactly 4 activities. Ensure the JSON is properly formatted with no trailing commas.`;

      const result = await chatSession.sendMessage(FINAL_REC_PROMPT);
      let responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }

      const parsedResponse = JSON.parse(responseText);

      // Cache the new recommendations
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: parsedResponse,
          timestamp: Date.now(),
        })
      );

      setRecommendations(parsedResponse);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations({ recommendations: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    try {
      console.log("Fetching trips for user:", user?.email);
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user?.email)
      );
      const querySnapshot = await getDocs(q);
      const trips = [];

      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched Trips for recommendation:", trips);
      setUserTrips(trips);

      if (trips.length > 0) {
        GenerateRecommendation(trips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Recommended Destinations</Text>
        <TouchableOpacity
          style={styles.shuffleButton}
          onPress={() => GenerateRecommendation(userTrips, true)}
          disabled={loading}
        >
          <FontAwesome
            name="refresh"
            size={20}
            color={loading ? "#999" : "#0066cc"}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading recommendations...</Text>
        </View>
      ) : recommendations.recommendations &&
        recommendations.recommendations.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recommendations.recommendations.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                expandedCard === index && styles.expandedCard,
              ]}
              onPress={() => toggleCard(index)}
              activeOpacity={0.9}
            >
              <Text style={styles.destination}>{item.destination}</Text>

              {(expandedCard === index || expandedCard === null) && (
                <Text style={styles.reason}>{item.reason}</Text>
              )}

              {expandedCard === index && (
                <View style={styles.activitiesContainer}>
                  <Text style={styles.activitiesHeader}>
                    Recommended Activities:
                  </Text>
                  {item.activities.map((activity, actIndex) => (
                    <View key={actIndex} style={styles.activityItem}>
                      <Text style={styles.activityBullet}>•</Text>
                      <Text style={styles.activity}>{activity}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.tapPrompt}>
                {expandedCard === index
                  ? "Tap to collapse"
                  : "Tap for activities"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>
          {userTrips.length > 0
            ? "No recommendations available. Try again later."
            : "No past trips found. Add some trips to get recommendations."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandedCard: {
    backgroundColor: "#fff",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  destination: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0066cc",
  },
  reason: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
    lineHeight: 22,
  },
  activitiesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  activitiesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 8,
  },
  activityBullet: {
    fontSize: 16,
    marginRight: 8,
    color: "#0066cc",
  },
  activity: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  tapPrompt: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  shuffleButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
});
