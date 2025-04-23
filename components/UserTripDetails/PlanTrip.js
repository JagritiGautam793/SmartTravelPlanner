import { View, Text, StyleSheet } from "react-native";
import React from "react";
import PlaceCard from "./PlaceCard";
import { FontAwesome5 } from "@expo/vector-icons";

export default function PlanTrip({ planTrip }) {
  if (!planTrip) return null;

  const days = Object.keys(planTrip)
    .filter((key) => key.toLowerCase().startsWith("day"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="route" size={18} color="#FF8C00" />
        </View>
        <Text style={styles.title}>Your Trip Itinerary</Text>
      </View>

      {days.map((day, dayIndex) => (
        <View key={day} style={styles.dayContainer}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayNumber}>{dayIndex + 1}</Text>
            </View>
            <Text style={styles.dayTitle}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
          </View>

          <View style={styles.timeline}>
            {planTrip[day]?.activities?.map((place, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineLine} />
                <View style={styles.timelineDot} />
                <View style={styles.cardContainer}>
                  <PlaceCard place={place} idx={idx} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
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
    marginBottom: 25,
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
  dayContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  timeline: {
    paddingLeft: 16,
  },
  timelineItem: {
    position: "relative",
    paddingLeft: 24,
  },
  timelineLine: {
    position: "absolute",
    left: 0,
    top: 25,
    bottom: -25,
    width: 2,
    backgroundColor: "rgba(255, 140, 0, 0.2)",
  },
  timelineDot: {
    position: "absolute",
    left: -4,
    top: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF8C00",
  },
  cardContainer: {
    flex: 1,
  },
});
