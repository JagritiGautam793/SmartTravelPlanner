import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

export default function PlanTrip({ planTrip }) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Trip Itinerary</Text>

      {Object.keys(planTrip)
        .filter((key) => key.toLowerCase().includes("day"))
        .map((day, index) => (
          <View key={index} style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 20, marginTop: 5 }}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>

            {planTrip[day]?.activities?.map((place, idx) => (
              <View
                key={idx}
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
                  source={require("./../../assets/images/photo.png")}
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
                  <Text
                    style={{ fontSize: 17, color: "gray", textAlign: "center" }}
                  >
                    {place?.placeDetails}
                  </Text>

                  {/* Centered Button */}
                  <TouchableOpacity
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
            ))}
          </View>
        ))}
    </View>
  );
}
