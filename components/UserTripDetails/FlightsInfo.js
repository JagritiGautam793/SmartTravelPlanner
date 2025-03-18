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
    <View style={styles.card}>
      {/* Total Price Section */}
      <View style={styles.header}>
        <Text style={styles.priceText}>
          Flight Total: <Text style={styles.priceAmount}>${totalPrice}</Text>
        </Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Here</Text>
        </TouchableOpacity>
      </View>

      {/* Flight Details */}
      <View style={styles.flightDetails}>
        <Text style={styles.detailText}>
          ✈ <Text style={styles.boldText}>Arrival Flight:</Text> {arrivalFlight}
        </Text>
        <Text style={styles.detailText}>
          🛫 <Text style={styles.boldText}>Departure Flight:</Text>{" "}
          {departureFlight}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "600",
  },
  priceAmount: {
    fontWeight: "bold",
    color: "#27ae60",
  },
  bookButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  flightDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
});
