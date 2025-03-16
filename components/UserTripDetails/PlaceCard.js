import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";
import { useRouter } from "expo-router";

export default function PlaceCard({ place }) {
  const [photoRef, setPhotoRef] = useState(null);
  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const router = useRouter();

  // Define the function outside useEffect
  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(place.placeName);
      if (result?.results?.[0]?.photos?.[0]?.photo_reference) {
        setPhotoRef(result.results[0].photos[0].photo_reference);
      }
    } catch (error) {
      console.error("Error fetching photo reference:", error);
    }
  };

  return (
    <View
      style={{
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        borderColor: "gray",
        marginTop: 20,
        backgroundColor: "white", // Removed light blue
        alignItems: "center", // Center content inside box
      }}
    >
      <Image
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/180x120.png?text=No+Image", // Placeholder image if no photoRef
        }}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 15,
        }}
      />
      <View style={{ marginTop: 5, width: "100%" }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          {place?.placeName || "Unknown Place"}
        </Text>
        <Text style={{ fontSize: 17, color: "gray", textAlign: "center" }}>
          {place?.placeDetails}
        </Text>

        {/* Centered Button */}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "./tripDetails/LocalInfor",
              params: {
                place: JSON.stringify(place),
              },
            });
          }}
          style={{
            backgroundColor: "gray",
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignSelf: "center", // Centers button horizontally
            marginTop: 10, // Adds space above the button
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
