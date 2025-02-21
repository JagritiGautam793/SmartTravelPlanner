import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import { selectTravellerList } from "../constants/Option";

export default function selectTraveller() {
  const naviagtion = useNavigation();

  useEffect(() => {
    naviagtion.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  });
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
          fontSize: 35,
          fontWeight: "bold",
          marginTop: 20,
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
            <View
              style={{
                marginVertical: 10,
              }}
            >
              <optionCard option={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
