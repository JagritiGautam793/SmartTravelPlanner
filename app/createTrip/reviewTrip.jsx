import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CreateTripContext } from "../../context/CreateTripContext";
import moment from "moment";

export default function reviewTrip() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTititle: "",
    });
  }, []);
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Review your Trip
      </Text>

      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Before generating your trip,please review your selection
        </Text>

        {/* Destination Info */}

        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text
              style={{
                fontSize: 20,
                color: "gray",
              }}
            >
              Destination
            </Text>
            <Text style={{ fontSize: 20 }}>{tripData?.locationInfo?.name}</Text>
          </View>
        </View>

        {/* Date Selection Info  */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text
              style={{
                fontSize: 20,
                color: "gray",
              }}
            >
              TravelDate
            </Text>
            <Text style={{ fontSize: 20 }}>
              {moment(tripData?.startDate).format("DD MMM") +
                " TO " +
                moment(tripData.endDate).format("DD MMM") +
                "  "}
              ({tripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>

        {/* select Budget Info */}

        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text
              style={{
                fontSize: 20,
                color: "gray",
              }}
            >
              Traveller travelling
            </Text>
            <Text>{tripData?.traveller?.title}</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text
              style={{
                fontSize: 20,
                color: "gray",
              }}
            >
              Budget selected
            </Text>
            <Text>{tripData?.budget}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        //   onPress={() => onClickContinue()}
        style={{
          padding: 15,
          backgroundColor: "white",
          borderRadius: 15,
          marginTop: 80,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 20,
          }}
        >
          Build My trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}
