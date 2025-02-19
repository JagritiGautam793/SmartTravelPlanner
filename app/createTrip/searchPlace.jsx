import "react-native-get-random-values";
import { View, Text } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function searchPlace() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "YOUR API KEY",
          language: "en",
        }}
      />
    </View>
  );
}
