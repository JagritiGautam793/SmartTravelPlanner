import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import { selectTravellerList } from "../constants/Option";
import { CreateTripContext } from "../../context/CreateTripContext";
import { useRoute } from "@react-navigation/native";
import OptionCard from "../../components/createTripComp/OptionCard";

export default function selectTraveller() {
  const naviagtion = useNavigation();
  const [selectedTraveller, setSelectedTraveller] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  // const router=useRoute

  useEffect(() => {
    naviagtion.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  useEffect(() => {
    setTripData({ ...tripData, traveller: selectedTraveller });
  }, [selectedTraveller]);

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 25,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
          marginTop: 5,
        }}
      >
        Who's JOining
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
          Choose your Travellers
        </Text>

        <FlatList
          data={selectTravellerList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedTraveller(item)}
              style={{
                marginVertical: 5,
              }}
            >
              <OptionCard option={item} selectedOption={selectedTraveller} />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* instead of on press on touchable opacity i used link href in order to navigate  */}

      <TouchableOpacity
        // onPress={}
        style={{
          padding: 15,
          backgroundColor: "black",
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Link
          style={{
            width: "100%",
            textAlign: "center",
          }}
          href={"/createTrip/selectDate"}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 20,
            }}
          >
            Continue
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}
