import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

export default function FlightsInfo({ flightData }) {
  if (!flightData) return null;

  const arrivalPrice = flightData.arrivalFlight?.flightPrice || 0;
  const departurePrice = flightData.departureFlight?.flightPrice || 0;
  const transferPrice = flightData.airportTransfer?.price || 0;
  const arrivalFlight = flightData.arrivalFlight?.airline || "Not mentioned";
  const departureFlight =
    flightData.departureFlight?.airline || "Not mentioned";
  const totalPrice = arrivalPrice + departurePrice + transferPrice;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="plane" size={18} color="#FF8C00" />
        </View>
        <Text style={styles.title}>Flight Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.priceHeader}>
          <View>
            <Text style={styles.priceLabel}>Total Flight Cost</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Flights</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flightDetailsContainer}>
          <View style={styles.flightDetail}>
            <View style={styles.flightIcon}>
              <FontAwesome5 name="plane-arrival" size={16} color="#4CAF50" />
            </View>
            <View style={styles.flightInfo}>
              <Text style={styles.flightLabel}>Arrival Flight</Text>
              <Text style={styles.flightValue}>
                {arrivalFlight} - ${arrivalPrice}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.flightDetail}>
            <View style={styles.flightIcon}>
              <FontAwesome5 name="plane-departure" size={16} color="#F44336" />
            </View>
            <View style={styles.flightInfo}>
              <Text style={styles.flightLabel}>Departure Flight</Text>
              <Text style={styles.flightValue}>
                {departureFlight} - ${departurePrice}
              </Text>
            </View>
          </View>

          {transferPrice > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.flightDetail}>
                <View style={styles.flightIcon}>
                  <FontAwesome5 name="shuttle-van" size={16} color="#2196F3" />
                </View>
                <View style={styles.flightInfo}>
                  <Text style={styles.flightLabel}>Airport Transfer</Text>
                  <Text style={styles.flightValue}>${transferPrice}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  priceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
  },
  bookButton: {
    backgroundColor: "#FF8C00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  flightDetailsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  flightDetail: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  flightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flightInfo: {
    flex: 1,
  },
  flightLabel: {
    fontSize: 14,
    color: "#95A5A6",
    marginBottom: 4,
  },
  flightValue: {
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
});
