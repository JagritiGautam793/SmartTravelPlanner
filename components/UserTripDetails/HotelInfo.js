import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import HotelCard from "./HotelCard";

export default function HotelInfo({ hotelData }) {
  return (
    <View
      style={{
        marginTop: -20,
      }}
    >
      <Text
        style={{
          fontFamily: "bold",
          fontSize: 15,
        }}
      >
        Hotel Recommendation
      </Text>
      <FlatList
        data={hotelData}
        style={{
          marginTop: 8,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => <HotelCard item={item} />}
      />
    </View>
  );
}
