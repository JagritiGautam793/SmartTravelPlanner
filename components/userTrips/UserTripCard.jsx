import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function UserTripCard({ trip }) {
  const formatData = (data) => {
    return JSON.parse(data);
  };

  const parsedData = formatData(trip.tripData);

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: parsedData.locationInfo?.photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${parsedData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
            : "https://via.placeholder.com/400x200?text=No+Image",
        }}
        style={styles.image}
      />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.location}>{trip?.tripPlan?.location}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesome5
                name="calendar-alt"
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.infoText}>
                {moment(parsedData.startDate).format("DD MMM yyyy")}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5
                name="user-friends"
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.infoText}>{parsedData.traveller.title}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  content: {
    padding: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "rgba(255,255,255,0.9)",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
