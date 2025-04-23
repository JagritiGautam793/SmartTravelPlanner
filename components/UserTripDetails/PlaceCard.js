import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";

export default function PlaceCard({ idx, place }) {
  const [photoRef, setPhotoRef] = useState(null);
  const [pl_id, setpl_id] = useState(null);
  const router = useRouter();

  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(place.placeName);
      if (result?.results?.[0]?.place_id) {
        setpl_id(result.results[0].place_id);
      }
      if (result?.results?.[0]?.photos?.[0]?.photo_reference) {
        setPhotoRef(result.results[0].photos[0].photo_reference);
      }
    } catch (error) {
      console.error("Error fetching photo reference:", error);
    }
  };

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "./tripDetails/Pd",
          params: { pid: pl_id },
        });
      }}
      activeOpacity={0.95}
    >
      <Image
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/400x240.png?text=Place+Image",
        }}
        style={styles.image}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.placeName}>
            {place?.placeName || "Unknown Place"}
          </Text>

          <Text style={styles.placeDetails} numberOfLines={2}>
            {place?.placeDetails}
          </Text>

          <View style={styles.viewButton}>
            <FontAwesome5
              name="map-marker-alt"
              size={12}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.viewButtonText}>View Details</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 10,
    height: 240,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    justifyContent: "flex-end",
  },
  content: {
    padding: 16,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    lineHeight: 20,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  icon: {
    marginRight: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});
