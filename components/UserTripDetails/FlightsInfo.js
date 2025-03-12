import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function FlightsInfo({ flightData }) {
  if (!flightData) {
    return null;
  }

  const arrivalPrice = flightData.arrivalFlight?.flightPrice || 0;
  const departurePrice = flightData.departureFlight?.flightPrice || 0;
  const transferPrice = flightData.airportTransfer?.price || 0;
  const arrivalFlight = flightData.arrivalFlight?.airline || "Not mentioned";
  const departureFlight =
    flightData.departureFlight?.airline || "Not mentioned";

  const totalPrice = arrivalPrice + departurePrice + transferPrice;

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.priceText}>
          Flight Total: <Text style={styles.priceAmount}>${totalPrice}</Text>
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 5,
            width: 100,
            borderRadius: 7,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              borderRadius: 7,
            }}
          >
            Book Here
          </Text>
        </TouchableOpacity>
      </View>

      <Text>Airline (Arrival Flight):{arrivalFlight}</Text>
      <Text>Airline (Departure Flight):{departureFlight}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    // padding: 8,
    // borderWidth: 1,
    // borderColor: "gray",
    padding: 10,
    backgroundColor: "#f0f8ff",
    // borderRadius: 8,
    // alignSelf: "flex-start",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceAmount: {
    fontWeight: "bold",
    color: "#2ecc71",
  },
});
