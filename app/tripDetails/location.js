import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Enable location services to get weather updates."
      );
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: coords.latitude, longitude: coords.longitude });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View>
      <Button title="Get Location" onPress={getCurrentLocation} />
      {location && (
        <Text>
          📍 Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default LocationComponent;
