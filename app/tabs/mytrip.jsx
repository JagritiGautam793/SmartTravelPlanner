import { View, Text } from "react-native";
import React, { useState } from "react";
import NewTripCard from "../../components/userTrips/NewTripCard";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);

  return (
    <View
      style={{
        padding: 85,
        paddingTop: 35,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 33,
            alignItems: "center",
          }}
        >
          Next Stop!
        </Text>
      </View>

      {userTrips?.length == 0 ? <NewTripCard /> : null}
    </View>
  );
}
