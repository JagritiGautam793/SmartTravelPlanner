import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";
import { FontAwesome } from "@expo/vector-icons";

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
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/250x180.png?text=Hotel+Image",
        }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.hotelName} numberOfLines={1}>
          {item.hotelName}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>
            ${item.price}
            <Text style={styles.perNight}>/night</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 15,
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
    height: 180,
  },
  infoContainer: {
    padding: 15,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#FFB800",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3436",
  },
  perNight: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#95A5A6",
  },
  bookButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
