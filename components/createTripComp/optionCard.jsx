import { View, Text } from "react-native";
import React from "react";

export default function OptionCard({ option, selectedOption }) {
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
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontSize: 10,
            // fontWeight: "bold",
            color: "gray",
          }}
        >
          {option?.desc}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 10,
        }}
      >
        {option.icon}
      </Text>
    </View>
  );
}
