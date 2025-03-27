import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY; // Replace with a valid key

export default function WeatherDetails() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to get current location
  const getCurrentLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Enable location services to get weather updates."
      );
      setLoading(false);
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: coords.latitude, longitude: coords.longitude });

    console.log("📍 Fetched Location:", coords.latitude, coords.longitude);
    fetchWeather(coords.latitude, coords.longitude);
  };

  // Function to fetch weather data
  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      console.log("🔗 Fetching Weather Data from:", url);

      let response = await fetch(url);
      let data = await response.json();

      console.log("🌍 API Response:", JSON.stringify(data, null, 2));

      if (response.ok) {
        setWeather(data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch weather data.");
      }
    } catch (error) {
      console.log("❌ Fetch Error:", error.message);
      Alert.alert("Error", "Could not retrieve weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        🌤 Weather Details
      </Text>
      <Button title="Refresh Location & Weather" onPress={getCurrentLocation} />
      {loading && (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{ marginTop: 10 }}
        />
      )}

      {location && (
        <Text style={{ marginTop: 10 }}>
          📍 Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}

      {weather ? (
        <View style={{ marginTop: 10 }}>
          <Text>🌡 Temperature: {weather.main?.temp ?? "N/A"}°C</Text>
          <Text>
            ☁️ Condition: {weather.weather?.[0]?.description ?? "N/A"}
          </Text>
          <Text>💨 Wind Speed: {weather.wind?.speed ?? "N/A"} m/s</Text>
        </View>
      ) : (
        <Text style={{ marginTop: 10 }}>No weather data available.</Text>
      )}
    </View>
  );
}
