import { View, Text } from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  return (
    <View
      style={{
        padding: 25,
        // marginTop: 5,
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        Please Wait..
      </Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Working to generate trip
      </Text>

      <LottieView
        source={require("../../assets/fonts/loading.json")} // Update path as needed
        autoPlay
        loop
        style={{ width: 200, height: 200 }} // Adjust size
      />
    </View>
  );
}
