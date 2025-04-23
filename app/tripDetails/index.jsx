import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import FlightsInfo from "../../components/UserTripDetails/FlightsInfo";
import HotelInfo from "../../components/UserTripDetails/HotelInfo";
import PlanTrip from "../../components/UserTripDetails/PlanTrip";

export default function TripDetails() {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [parsedTripData, setParsedTripData] = useState(null);

  const formatData = (data) => {
    return JSON.parse(data);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    try {
      if (typeof trip === "string") {
        const parsed = JSON.parse(trip);
        setTripDetails(parsed);

        if (parsed?.tripData) {
          const tripData = JSON.parse(parsed.tripData || "{}");
          setParsedTripData(tripData);
        }
      }
    } catch (error) {
      console.error("Error parsing trip data:", error);
    }
  }, [trip]);

  if (!tripDetails) return null;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          {parsedTripData?.locationInfo?.photoRef ? (
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${parsedTripData.locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`,
              }}
              style={styles.headerImage}
            />
          ) : (
            <Image
              source={require("./../../assets/images/photo.png")}
              style={styles.headerImage}
            />
          )}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.headerGradient}
          />

          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.tripInfo}>
              <Text style={styles.location}>
                {tripDetails?.tripPlan.location}
              </Text>
              <View style={styles.tripMetaInfo}>
                <View style={styles.infoItem}>
                  <FontAwesome5
                    name="calendar-alt"
                    size={14}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text style={styles.infoText}>
                    {moment(formatData(tripDetails.tripData).startDate).format(
                      "DD MMM"
                    )}{" "}
                    -{" "}
                    {moment(formatData(tripDetails.tripData).endDate).format(
                      "DD MMM yyyy"
                    )}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5
                    name="user-friends"
                    size={14}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text style={styles.infoText}>
                    {formatData(tripDetails.tripData).traveller.title}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <FlightsInfo flightData={tripDetails?.tripPlan?.flightDetails} />
          <HotelInfo hotelData={tripDetails?.tripPlan?.hotelOptions} />
          <PlanTrip planTrip={tripDetails?.tripPlan} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: 350,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  headerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: -280,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  tripInfo: {
    marginBottom: 20,
  },
  location: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tripMetaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  content: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 20,
  },
});
