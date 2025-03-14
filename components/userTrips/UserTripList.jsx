import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import moment from "moment";
import UserTripCard from "./UserTripCard";
import { ObjectFlags } from "typescript";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function UserTripList({ userTrips }) {
  if (!userTrips || userTrips.length === 0) {
    return (
      <View>
        <Text>No trips available</Text>
      </View>
    );
  }

  const sortedTrips = [...userTrips].sort((a, b) => {
    // Handle Firestore timestamps
    const timeA = a.createdAt?.toDate?.() || a.createdAt;
    const timeB = b.createdAt?.toDate?.() || b.createdAt;

    // If timestamps are valid dates, compare them
    if (timeA instanceof Date && timeB instanceof Date) {
      return timeB.getTime() - timeA.getTime();
    }
  });

  const LatestTrip = JSON.parse(sortedTrips[0]?.tripData || "{}");
  const router = useRouter();

  return (
    userTrips && (
      <View>
        <View
          style={{
            marginTop: 20,
          }}
        >
          {LatestTrip?.locationInfo?.photoRef ? (
            <Image
              source={{
                uri:
                  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
                  LatestTrip.locationInfo?.photoRef +
                  "&key=" +
                  process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
              }}
              style={{
                width: "100%",
                height: 240,
                ObjectFit: "cover",
                borderRadius: 15,
              }}
            />
          ) : (
            <Image
              source={require("./../../assets/images/photo.png")}
              style={{
                width: "100%",
                height: 240,
                ObjectFit: "cover",
                borderRadius: 15,
              }}
            />
          )}
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
            }}
          >
            {userTrips[0]?.tripPlan?.location || "Unknown Location"}
          </Text>
          <Text
            style={{
              fontSize: 17,
            }}
          >
            {LatestTrip?.startDate
              ? moment(LatestTrip.startDate).format("DD MMM yyyy")
              : "No Start Date"}
          </Text>
          <Text
            style={{
              fontSize: 17,
            }}
          >
            {LatestTrip?.traveller?.title || "No Traveller Info"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/tripDetails",
              params: {
                trip: JSON.stringify(userTrips[0]),
              },
            })
          }
          style={{
            backgroundColor: "black",
            padding: 15,
            borderRadius: 15,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 15,
            }}
          >
            See Your plan
          </Text>
        </TouchableOpacity>

        {userTrips.map((trip, index) => (
          <UserTripCard trip={trip} key={index} />
        ))}
      </View>
    )
  );
}
