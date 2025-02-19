import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";

export default function NewTripCard() {
  const router = useRouter();
  return (
    <View
      style={{
        padding: 20,
        marginTop: 10,
        display: "flex",
        // flexDirection: "row",
        alignItems: "center",
        // gap: 10,
      }}
    >
      <EvilIcons name="location" size={30} color="black" />
      <Text
        style={{
          fontSize: 15,
          marginTop: 10,
        }}
        numberOfLines={1}
      >
        No Trips Planned
      </Text>

      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          color: "grey",
        }}
      >
        Looks like its time to plan out a new trip !!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("./../createTrip/searchPlace")}
        style={{
          padding: 10,
          backgroundColor: "black",
          borderRadius: 15,
          paddingHorizontal: 30,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 17,
            gap: 25,
          }}
        >
          Start a new trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}
