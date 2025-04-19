import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import { selectTravellerList } from "../constants/Option";
import { CreateTripContext } from "../../context/CreateTripContext";
import { LinearGradient } from "expo-linear-gradient";

export default function selectTraveller() {
  const navigation = useNavigation();
  const [selectedTraveller, setSelectedTraveller] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    setTripData({ ...tripData, traveller: selectedTraveller });
  }, [selectedTraveller]);

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  // Mapping travel types to more user-friendly display names and descriptions
  const travelTypeMap = {
    SOLO: {
      title: "Just Me",
      description: "Discover yourself...",
    },
    COUPLE: {
      title: "A Couple",
      description: "Embrace the journey...",
    },
    FAMILY: {
      title: "Family",
      description: "Share magical...",
    },
    FRIENDS: {
      title: "Friends",
      description: "Create unforget...",
    },
  };

  // Function to get title for traveler type
  const getTravelerTitle = (travelType) => {
    if (typeof travelType === "string") {
      return travelTypeMap[travelType]?.title || travelType;
    }
    // If it's an object with a title property, return that
    if (travelType && typeof travelType === "object" && travelType.title) {
      return travelType.title;
    }
    // Fallback
    return String(travelType || "");
  };

  // Function to get description for traveler type
  const getTravelerDescription = (travelType) => {
    if (typeof travelType === "string") {
      return travelTypeMap[travelType]?.description || "";
    }
    // If it's an object with a desc property, return that
    if (travelType && typeof travelType === "object" && travelType.desc) {
      return travelType.desc;
    }
    // Fallback
    return "";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          }}
          style={{ height: 220 }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 220,
            }}
          />
          <View style={{ padding: 20, paddingTop: 80 }}>
            <Text style={{ fontSize: 38, fontWeight: "bold", color: "white" }}>
              Travel Mode
            </Text>
            <Text style={{ fontSize: 18, color: "white", marginTop: 5 }}>
              Choose your travel companion
            </Text>
          </View>
        </ImageBackground>

        {/* Quote section */}
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 20,
            marginTop: -20,
            borderRadius: 15,
            padding: 20,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              },
              android: {
                elevation: 5,
              },
            }),
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
              color: "#555",
              fontStyle: "italic",
              lineHeight: 24,
            }}
          >
            "Travel not to escape life, but so life doesn't escape you."
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#888",
              marginTop: 8,
              textAlign: "right",
              fontFamily: Platform.OS === "ios" ? "Avenir Next" : "sans-serif",
            }}
          >
            — Anonymous
          </Text>
        </View>

        {/* Select Travel Style Section */}
        <View style={{ padding: 15 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Select Your Travel Style
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {selectTravellerList.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTraveller(item)}
                style={{
                  width: "48%",
                  marginBottom: 15,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  source={
                    getTravelerTitle(item) === "Just Me"
                      ? {
                          uri: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }
                      : getTravelerTitle(item) === "A Couple"
                      ? {
                          uri: "https://plus.unsplash.com/premium_photo-1676667573109-273586405c96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }
                      : getTravelerTitle(item) === "Family"
                      ? {
                          uri: "https://images.unsplash.com/photo-1559734840-f9509ee5677f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }
                      : {
                          uri: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }
                  }
                  style={{ height: 130 }}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      padding: 15,
                    }}
                  >
                    {selectedTraveller === item && (
                      <View
                        style={{
                          alignSelf: "flex-end",
                          backgroundColor: "#FF8C00",
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          ✓
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {getTravelerTitle(item)}
                      </Text>
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {getTravelerDescription(item)}
                      </Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Travel Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Travel Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>💼</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipHeading}>Pack Smart</Text>
              <Text style={styles.tipText}>
                Choose versatile clothing items and pack for the activities you
                plan to do.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>📱</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipHeading}>Stay Connected</Text>
              <Text style={styles.tipText}>
                Download maps and important info for offline access while
                traveling.
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ padding: 15, paddingBottom: 30 }}>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#FF8C00",
              borderRadius: 15,
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
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Continue
              </Text>
            </Link>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tipsContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tipIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipIcon: {
    fontSize: 22,
  },
  tipContent: {
    flex: 1,
  },
  tipHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
