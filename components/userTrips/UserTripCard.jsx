import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";

export default function UserTripCard({ trip }) {
  const formatData = (data) => {
    return JSON.parse(data);
  };
  return (
    <View
      style={{
        marginTop: 15,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
            formatData(trip.tripData).locationInfo?.photoRef +
            "&key=" +
            process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
        }}
        style={{
          width: 100,
          height: 100,

          borderRadius: 15,
        }}
      />

      <View>
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {trip?.tripPlan?.location}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "gray",
          }}
        >
          {moment(formatData(trip.tripData).startDate).format("DD MMM yyyy")}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "gray",
          }}
        >
          Travelling:
          {formatData(trip.tripData).traveller.title}
        </Text>
      </View>
    </View>
  );
  s;
}
