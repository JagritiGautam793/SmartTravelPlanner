import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
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
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    try {
      if (typeof trip === "string") {
        const parsed = JSON.parse(trip);
        setTripDetails(parsed);

        // Parse the tripData field just like in UserTripList
        if (parsed?.tripData) {
          const tripData = JSON.parse(parsed.tripData || "{}");
          setParsedTripData(tripData);
          console.log("Parsed trip data:", tripData); // For debugging
        }
      }
    } catch (error) {
      console.error("Error parsing trip data:", error);
    }
  }, [trip]);

  return (
    tripDetails && (
      <ScrollView>
        {parsedTripData?.locationInfo?.photoRef ? (
          <Image
            source={{
              uri:
                "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
                parsedTripData.locationInfo.photoRef +
                "&key=" +
                process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
            }}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 15,
            }}
          />
        ) : (
          <Image
            source={require("./../../assets/images/photo.png")}
            style={{
              width: "100%",
              height: 100,
              borderRadius: 15,
            }}
          />
        )}
        <View
          style={{
            padding: 15,
            backgroundColor: "white",
            height: "100%",
            marginTop: -30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {tripDetails?.tripPlan.location}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "gray",
                marginTop: 5,
              }}
            >
              {moment(formatData(tripDetails.tripData).startDate).format(
                "DD MMM yyyy"
              )}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "gray",
              }}
            >
              -
              {moment(formatData(tripDetails.tripData).endDate).format(
                "DD MMM yyyy"
              )}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 17,
              color: "gray",
            }}
          >
            {formatData(tripDetails.tripData).traveller.title}
          </Text>

          {/* Flights Info */}
          <FlightsInfo flightData={tripDetails?.tripPlan?.flightDetails} />

          {/* Hotel List */}

          <HotelInfo hotelData={tripDetails?.tripPlan?.hotelOptions} />

          {/* Trip Planner Info */}
          <PlanTrip planTrip={tripDetails?.tripPlan} />
        </View>
      </ScrollView>
    )
  );
}
