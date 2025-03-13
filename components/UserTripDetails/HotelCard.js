import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../services/GooglePlacesApi";

export default function HotelCard({ item }) {
  const [photoRef, setPhotoRef] = useState(null);

  // Define the function outside useEffect
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
    <View
      style={{
        marginRight: 20,
        width: 180,
      }}
    >
      <Image
        source={{
          uri: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/180x120.png?text=No+Image", // Placeholder image if no photoRef
        }}
        style={{
          width: 180,
          height: 120,
          borderRadius: 15,
        }}
      />
      <View
        style={{
          padding: 5,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          {item.hotelName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>*{item.rating}</Text>
          <Text>${item.price}/night</Text>
        </View>
      </View>
    </View>
  );
}
