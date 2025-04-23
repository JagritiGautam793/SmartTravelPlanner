import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Image,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import UserTripList from "../../components/userTrips/UserTripList";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PulsingComp from "../../components/PulsingComp";
import ChatBotModal from "../../components/ChatbotModal";

// Updated PulsingButton with improved layout and styling
const PulsingButton = ({ onPress, size = 42, iconSize = 16 }) => {
  // Only use native-driven animations to avoid errors
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  // Setup animation sequence when component mounts
  useEffect(() => {
    // Create a pulse animation loop
    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startPulseAnimation();
  }, []);

  // Handle press in/out animations
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate rotation for spin effect
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={{ alignItems: "center" }}>
      {/* The text is now placed above the button instead of beside it */}
      <Text
        style={{
          fontSize: 12,
          color: "white",
          fontWeight: "600",
          marginBottom: 8,
          letterSpacing: 0.3,
          textShadowColor: "rgba(0, 0, 0, 0.1)",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1,
        }}
      >
        Start a new trip
      </Text>

      <View style={{ width: size, height: size, position: "relative" }}>
        {/* Static outer ring */}
        <View
          style={{
            position: "absolute",
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            left: -4,
            top: -4,
          }}
        />

        <View
          style={{
            position: "absolute",
            width: size + 4,
            height: size + 4,
            borderRadius: (size + 4) / 2,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
            left: -2,
            top: -2,
          }}
        />

        {/* Animated pulse ring using only native driver */}
        <Animated.View
          style={{
            position: "absolute",
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.3)",
            left: -6,
            top: -6,
            transform: [{ scale: pulseAnim }],
            marginBottom: 50,
          }}
        />

        {/* Main button with only transform animations */}
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.85}
        >
          <Animated.View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#FF8C00",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 5,
              transform: [{ scale: pulseAnim }, { rotate: spin }],
            }}
          >
            <FontAwesome5 name="plus" size={iconSize} color="#FF8C00" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setIsLoading(true);
    setUserTrips([]);

    try {
      // Try to include orderBy if your Firestore has an index for it
      // If you don't have an index, this might cause an error, so we have a fallback
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user?.email),
        orderBy("createdAt", "desc") // Add this if you have a createdAt field and index
      );

      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(trips);
    } catch (error) {
      // Fallback without orderBy if there's an error
      console.log("Error fetching ordered trips:", error);

      const fallbackQ = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user?.email)
      );

      const fallbackSnapshot = await getDocs(fallbackQ);
      const fallbackTrips = [];
      fallbackSnapshot.forEach((doc) => {
        fallbackTrips.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(fallbackTrips);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF9F2" }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />

      {/* Header - Restructured for better spacing */}
      <View
        style={{
          backgroundColor: "#FF8C00",
          paddingTop: 50,
          paddingBottom: 20,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        {/* Updated header layout to prevent overflow */}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between", // Changed from space-around to space-between
            alignItems: "center", // Changed from flex-start to center
            marginBottom: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
                marginBottom: 5,
              }}
            >
              My Trips
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {user?.displayName
                ? `Hello, ${user.displayName.split(" ")[0]}`
                : "Plan your next adventure"}
            </Text>
          </View>

          {/* New Trip Button in fixed position */}
          <TouchableOpacity
            onPress={() => router.push("./../createTrip/searchPlace")}
          >
            <PulsingButton
              onPress={() => router.push("./../createTrip/searchPlace")}
            />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Search your trips..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              height: 40,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats cards */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 25,
            marginTop: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              width: "48%",
              shadowColor: "#FF8C00",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255, 140, 0, 0.1)",
                padding: 10,
                borderRadius: 10,
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <FontAwesome5 name="suitcase" size={16} color="#FF8C00" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
              {userTrips.length}
            </Text>
            <Text style={{ color: "#666", fontSize: 14 }}>Total Trips</Text>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 15,
              width: "48%",
              shadowColor: "#FF8C00",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255, 140, 0, 0.1)",
                padding: 10,
                borderRadius: 10,
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <FontAwesome5 name="plane-departure" size={16} color="#FF8C00" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
              {
                userTrips.filter(
                  (trip) => new Date(trip.startDate) > new Date()
                ).length
              }
            </Text>
            <Text style={{ color: "#666", fontSize: 14 }}>Upcoming</Text>
          </View>
        </View>

        {/* Trip content */}
        <View style={{ marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#333",
              }}
            >
              Your Journeys
            </Text>
            {userTrips.length > 0 && (
              <TouchableOpacity>
                <Text
                  style={{
                    color: "#FF8C00",
                    fontWeight: "600",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View
              style={{
                padding: 40,
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <ActivityIndicator size="large" color="#FF8C00" />
              <Text style={{ marginTop: 15, color: "#666", fontSize: 16 }}>
                Loading your adventures...
              </Text>
            </View>
          ) : userTrips.length > 0 ? (
            <UserTripList userTrips={userTrips} />
          ) : (
            <View
              style={{
                padding: 30,
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Image
                source={{
                  uri: "https://img.freepik.com/free-vector/travel-time-typography-design_1308-90406.jpg",
                }}
                style={{
                  width: 200,
                  height: 150,
                  marginBottom: 20,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                No trips yet
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#666",
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 15,
                }}
              >
                Time to plan your first adventure!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("./../createTrip/searchPlace")}
                style={{
                  backgroundColor: "#FFF0E0",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 25,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="map-marker-alt"
                  size={14}
                  color="#FF8C00"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: "#FF8C00", fontWeight: "600" }}>
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <PulsingComp onPress={() => setIsChatVisible(true)} />
      <ChatBotModal
        visible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />

      {/* ChatBot Components - Moved outside of ScrollView */}
    </View>
  );
}
