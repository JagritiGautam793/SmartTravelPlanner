import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";
import { useRouter } from "expo-router";

export default function PlaceCard({ idx, place }) {
  const [photoRef, setPhotoRef] = useState(null);
  const [pl_id, setpl_id] = useState(null);

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

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

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginVertical: 15,
        marginHorizontal: 10,
      }}
    >
      {/* Image Section */}
      <View>
        <Image
          source={{
            uri: photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
              : "https://via.placeholder.com/300x200.png?text=No+Image",
          }}
          style={{ width: "100%", height: 180 }}
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 50,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            {place?.placeName || "Unknown Place"}
          </Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 14, color: "#555" }}>
          {place?.placeDetails}
        </Text>

        {/* View Place Button */}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "./tripDetails/Pd",
              params: { pid: pl_id },
            });
          }}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
            View Place
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
