import "react-native-get-random-values";
import { View, Text, Animated, StyleSheet } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigation, useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CreateTripContext } from "../../context/CreateTripContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchPlace() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    console.log(tripData);

    // Subtle entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tripData]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Discover new places</Text>
        <Text style={styles.subtitle}>Where would you like to go?</Text>

        <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search destinations"
            fetchDetails={true}
            onPress={(data, details = null) => {
              setTripData({
                locationInfo: {
                  name: data.description,
                  coordinates: details?.geometry.location,
                  photoRef: details?.photos[0]?.photo_reference,
                  url: details?.url,
                },
              });
              router.push("/createTrip/selectTraveller");
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
              language: "en",
            }}
            styles={{
              container: {
                flex: 0,
                width: "100%",
              },
              textInputContainer: {
                backgroundColor: "white",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
                marginTop: 12,
              },
              textInput: {
                height: 50,
                color: "#333333",
                fontSize: 16,
                backgroundColor: "transparent",
                paddingLeft: 15,
                paddingRight: 15,
              },
              predefinedPlacesDescription: {
                color: "#FF8C00",
              },
              row: {
                backgroundColor: "white",
                padding: 15,
                height: 60,
                flexDirection: "row",
                alignItems: "center",
              },
              separator: {
                height: 1,
                backgroundColor: "#F0F0F0",
              },
              description: {
                color: "#333333",
              },
              poweredContainer: {
                height: 0,
                opacity: 0,
              },
              listView: {
                backgroundColor: "white",
                borderRadius: 8,
                marginTop: 5,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
                overflow: "hidden",
                maxHeight: 200, // Added this to limit height and enable scrolling
              },
            }}
            renderRow={(data) => (
              <View style={styles.suggestionRow}>
                <MaterialIcons
                  name="place"
                  size={20}
                  color="#FF8C00"
                  style={styles.placeIcon}
                />
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.mainText} numberOfLines={1}>
                    {data.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.secondaryText} numberOfLines={1}>
                    {data.structured_formatting.secondary_text}
                  </Text>
                </View>
              </View>
            )}
            renderLeftButton={() => (
              <View style={styles.searchIcon}>
                <MaterialIcons name="search" size={24} color="#FF8C00" />
              </View>
            )}
            enablePoweredByContainer={false}
            keyboardShouldPersistTaps="handled"
            listViewDisplayed="auto"
          />
        </View>

        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Popular Destinations</Text>

          <View style={styles.recentSearchItem}>
            <MaterialIcons name="trending-up" size={20} color="#FF8C00" />
            <Text style={styles.recentSearchText}>Paris, France</Text>
          </View>

          <View style={styles.recentSearchItem}>
            <MaterialIcons name="trending-up" size={20} color="#FF8C00" />
            <Text style={styles.recentSearchText}>Kyoto, Japan</Text>
          </View>

          <View style={styles.recentSearchItem}>
            <MaterialIcons name="trending-up" size={20} color="#FF8C00" />
            <Text style={styles.recentSearchText}>New York, United States</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40, // Reduced from 75 to 40 for better spacing
  },
  title: {
    fontSize: 26, // Slightly reduced from 28
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16, // Reduced from 20
    fontWeight: "400",
  },
  searchContainer: {
    width: "100%",
    marginBottom: 24, // Reduced from 30
  },
  searchIcon: {
    height: 50, // Reduced from 55
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeIcon: {
    marginRight: 5,
  },
  suggestionTextContainer: {
    flex: 1,
    paddingLeft: 5,
  },
  mainText: {
    color: "#333333",
    fontWeight: "500",
    fontSize: 15,
  },
  secondaryText: {
    color: "#999999",
    fontSize: 13,
    marginTop: 2,
  },
  recentSearchesContainer: {
    marginTop: 16, // Reduced from 20
  },
  recentSearchesTitle: {
    fontSize: 17, // Reduced from 18
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12, // Reduced from 15
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // Reduced from 12
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recentSearchText: {
    fontSize: 15,
    color: "#333333",
    marginLeft: 10,
  },
});
