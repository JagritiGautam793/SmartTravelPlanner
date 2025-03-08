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
      <Image />

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
