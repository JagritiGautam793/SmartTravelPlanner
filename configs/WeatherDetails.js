import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export default function WeatherDetails() {
  const [location, setLocation] = useState(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    requestNotificationPermission();
    getCurrentLocation();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Enable notifications to get weather updates and alerts!"
      );
    }
  };

  const sendWeatherNotification = async (weatherData) => {
    let message = "";

    if (weatherData.weather?.[0]?.main === "Rain") {
      message =
        "🌧 It's a rainy day! Grab your umbrella and maybe a cup of coffee to stay cozy. ☕";
    } else if (weatherData.main?.temp > 30) {
      message =
        "🥵 It's scorching outside! Stay hydrated and wear light clothes. Maybe an ice-cream break? 🍦";
    } else if (weatherData.main?.temp < 10) {
      message =
        "🥶 Brrr... it's freezing out there! Bundle up with warm layers and a hot drink. 🧥☕";
    } else if (weatherData.weather?.[0]?.main === "Clear") {
      message =
        "🌞 Perfect weather for an adventure! Don't forget your sunglasses and sunscreen. 😎";
    } else if (weatherData.weather?.[0]?.main === "Clouds") {
      message =
        "☁️ A cloudy day ahead! Might be a great time for a scenic drive or a peaceful walk. 🚶‍♂️";
    } else if (weatherData.weather?.[0]?.main === "Snow") {
      message =
        "❄️ It's snowing! Time for some hot chocolate and a cozy blanket. ☕🛷";
    } else {
      message = `🌤 Current weather: ${weatherData.weather?.[0]?.description}. Enjoy your day!`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weather Update 🌍",
        body: message,
        sound: "default",
      },
      trigger: null,
    });
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Enable location services for weather updates."
      );
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    fetchWeather(coords.latitude, coords.longitude);
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      let response = await fetch(url);
      let data = await response.json();

      if (response.ok) {
        sendWeatherNotification(data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return null; // No UI elements
}
