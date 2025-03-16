import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import gapi from "../utils/gapi";

export default function LocalInfo() {
  const { place } = useLocalSearchParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [piDetails, setPiDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const parsedPlace = JSON.parse(place);
      setPlaceDetails(parsedPlace);
    } catch (e) {
      console.error("Error parsing place details:", e);
      setError("Invalid place data");
    }
  }, [place]);

  useEffect(() => {
    getPiDetails();
  }, []);

  const getPiDetails = async () => {
    try {
      const response = await gapi.nearByPlace();
      const pd = await gapi.placeDetail();
      console.log("PD:", pd);
      setPiDetails(response.data.results);
    } catch (err) {
      console.error("Error fetching PI details:", err);
      setError("Failed to fetch PI details.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading PI details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {piDetails.map((place, index) => (
        <View
          key={index}
          style={{
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{place.name}</Text>
          <Text>Vicinity: {place.vicinity}</Text>
          <Text>Type: {place.types?.join(", ")}</Text>
          <Text>
            Rating: {place.rating || "N/A"} ({place.user_ratings_total || 0}{" "}
            reviews)
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
