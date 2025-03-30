import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="mytrip"
        options={{
          tabBarLabel: "My Trip",
          tabBarLabelStyle: { color: "#007bff" },
          tabBarIcon: () => (
            <Entypo name="location-pin" size={24} color="#007bff" />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: "Discover",
          tabBarLabelStyle: { color: "#007bff" },
          tabBarIcon: () => (
            <FontAwesome name="globe" size={24} color="#007bff" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#007bff" },
          tabBarIcon: () => (
            <Ionicons name="people" size={24} color="#007bff" />
          ),
        }}
      />
    </Tabs>
  );
}
