import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import moment from "moment";
import { useRouter } from "expo-router";
import WeatherDetails from "../../configs/WeatherDetails";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const SPACING = 12;

export default function UserTripList({ userTrips }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!userTrips || userTrips.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>No trips available</Text>
      </View>
    );
  }

  const sortedTrips = [...userTrips].sort((a, b) => {
    const timeA = a.createdAt?.toDate?.() || a.createdAt;
    const timeB = b.createdAt?.toDate?.() || b.createdAt;
    if (timeA instanceof Date && timeB instanceof Date) {
      return timeB.getTime() - timeA.getTime();
    }
  });

  const router = useRouter();

  const renderTripCard = (trip, index) => {
    const tripData = JSON.parse(trip.tripData || "{}");
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={index}
        style={{
          transform: [{ scale }],
          width: CARD_WIDTH,
          marginRight: SPACING,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tripDetails",
              params: { trip: JSON.stringify(trip) },
            })
          }
          style={{
            borderRadius: 24,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            marginBottom: 10,
            overflow: "hidden",
          }}
        >
          <View>
            <Image
              source={{
                uri: tripData.locationInfo?.photoRef
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
                  : "https://via.placeholder.com/400x200?text=No+Image",
              }}
              style={{
                width: "100%",
                height: 220,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 20,
                backdropFilter: "blur(10px)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "700",
                  marginBottom: 8,
                  textShadowColor: "rgba(0,0,0,0.3)",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {trip.tripPlan?.location || "Unknown Location"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  {tripData.startDate
                    ? moment(tripData.startDate).format("DD MMM yyyy")
                    : "No date"}
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  {tripData.traveller?.title || "No traveller info"}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <WeatherDetails />
      <View style={{ marginTop: 20, flex: 1 }}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: SPACING,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {sortedTrips.map((trip, index) => renderTripCard(trip, index))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}
