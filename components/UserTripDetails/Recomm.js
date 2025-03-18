import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import { CreateTripContext } from "../../context/CreateTripContext";
import { chatSession } from "../../configs/GenRecomm";

export default function Recomm() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({
    recommendations: [],
  });
  const user = auth.currentUser;

  const GenerateRecommendation = async (trips = userTrips) => {
    setLoading(true);
    // Collect details from past trips (locations and names)
    const locations = trips
      .map((trip) => trip.tripPlan?.location)
      .filter((location) => location) // Filter out undefined/null locations
      .join(", ");
    const tripNames = trips
      .map((trip) => trip.tripName)
      .filter((name) => name) // Filter out undefined/null names
      .join(", ");

    // Construct the prompt with explicit JSON structure request
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

    // Log the generated prompt to the console
    console.log("Generated Recommendation Prompt:", FINAL_REC_PROMPT);
    try {
      const result = await chatSession.sendMessage(FINAL_REC_PROMPT);
      console.log("Jagfr", result.response.text());

      // Parse the JSON response
      try {
        // Try to parse the text response as JSON
        let responseText = result.response.text();

        // Try to extract JSON if there's additional text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseText = jsonMatch[0];
        }

        const parsedResponse = JSON.parse(responseText);
        setRecommendations(parsedResponse);
      } catch (parseError) {
        console.error("Error parsing AI response as JSON:", parseError);
        // Fallback to empty recommendations if parsing fails
        setRecommendations({ recommendations: [] });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations({ recommendations: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]); // Fetch when user is available

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
      setUserTrips(trips); // ✅ Update state inside Recomm

      // Call GenerateRecommendation with the fetched trips
      if (trips.length > 0) {
        GenerateRecommendation(trips); // Now passing trips correctly
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
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Recommended Destinations
      </Text>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading recommendations...
        </Text>
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
        <Text style={{ textAlign: "center", marginTop: 20 }}>
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
});
