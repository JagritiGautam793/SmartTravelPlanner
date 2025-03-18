import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";
import { FontAwesome } from "@expo/vector-icons"; // For star rating icon

export default function HotelCard({ item }) {
  const [photoRef, setPhotoRef] = useState(null);

  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(item.hotelName);
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
    <View style={styles.card}>
      {/* Hotel Image */}
      <Image
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/180x120.png?text=No+Image",
        }}
        style={styles.image}
      />

      {/* Hotel Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#f39c12" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>${item.price}/night</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginRight: 20,
    width: 180,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 8,
  },
  hotelName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontWeight: "bold",
    color: "#e74c3c",
    fontSize: 14,
  },
});
