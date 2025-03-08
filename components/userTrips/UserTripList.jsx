import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import moment from "moment";
import UserTripCard from "./UserTripCard";

export default function UserTripList({ userTrips }) {
  if (!userTrips || userTrips.length === 0) {
    return (
      <View>
        <Text>No trips available</Text>
      </View>
    );
  }

  const LatestTrip = JSON.parse(userTrips[0]?.tripData || "{}");

  return (
    <View>
      <View>
        <Text>UserTripList</Text>
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
  );
}
