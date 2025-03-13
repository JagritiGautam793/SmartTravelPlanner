import { View, Text } from "react-native";
import React from "react";
import PlaceCard from "./PlaceCard";

export default function PlanTrip({ planTrip }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Trip Itinerary</Text>

      {Object.keys(planTrip)
        .filter((key) => key.toLowerCase().startsWith("day"))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10); // Extracts the number from "dayX"
          const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
          return numA - numB; // Sorts numerically (day1, day2, day3, ...)
        })
        .map((day, index) => (
          <View key={day} style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, marginTop: 5 }}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>

            {planTrip[day]?.activities?.map((place, idx) => (
              <PlaceCard key={idx} place={place} />
            ))}
          </View>
        ))}
    </View>
  );
}
