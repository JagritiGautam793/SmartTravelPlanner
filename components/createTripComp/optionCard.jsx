import { View, Text } from "react-native";
import React from "react";

export default function optionCard({ option, selectedOption }) {
  return (
    <View
      style={[
        {
          padding: 25,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#f2f2f2",
          borderRadius: 15,
        },
        selectedOption?.id == option?.id && { borderWidth: 3 },
      ]}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontSize: 17,
            // fontWeight: "bold",
            color: "gray",
          }}
        >
          {option?.desc}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 30,
        }}
      >
        {option.icon}
      </Text>
    </View>
  );
}
