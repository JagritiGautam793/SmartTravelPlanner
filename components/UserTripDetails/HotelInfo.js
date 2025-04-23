import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import HotelCard from "./HotelCard";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HotelInfo({ hotelData }) {
  if (!hotelData || hotelData.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="hotel" size={18} color="#FF8C00" />
        </View>
        <Text style={styles.title}>Recommended Hotels</Text>
      </View>

      <FlatList
        data={hotelData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <HotelCard item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 140, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
});
