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
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { TYPOGRAPHY } from "../../lib/typography";

// Enhanced sophisticated color palette
const COLORS = {
  primary: "#FF7A00", // Rich, warm orange - slightly less saturated
  primaryLight: "rgba(255, 122, 0, 0.06)",
  primaryMedium: "rgba(255, 122, 0, 0.15)",
  primaryDark: "rgba(255, 122, 0, 0.25)",
  accent: "#1A1A1C", // Nearly black for text - slightly warmer
  background: "#FFFFFF", // Clean white background
  backgroundAlt: "#FCFCFC", // Very subtle off-white
  surface: "#FFFFFF", // Card surface
  surfaceAlt: "#F9F9F9", // Alternate surface for visual hierarchy
  border: "#F2F2F2", // Subtle border
  borderAlt: "#EBEBEB", // Slightly darker border for emphasis
  textPrimary: "#1A1A1C", // Nearly black text
  textSecondary: "#454545", // Darker gray text
  textTertiary: "#7A7A80", // Medium gray text
  textQuaternary: "#9E9E9E", // Light gray text
  success: "#56B68B", // Muted green
  neutral: "#738697", // Muted blue gray
};

// Enhanced PulsingButton with more refined aesthetics
const PulsingButton = ({ onPress, size = 56, iconSize = 18 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startPulseAnimation();
  }, []);

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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          ...TYPOGRAPHY.labelMedium,
          color: COLORS.accent,
          marginBottom: 10,
        }}
      >
        New Journey
      </Text>

      <View style={{ width: size, height: size, position: "relative" }}>
        {/* Outer pulse ring */}
        <Animated.View
          style={{
            position: "absolute",
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: COLORS.primaryLight,
            left: -10,
            top: -10,
            transform: [{ scale: pulseAnim }],
          }}
        />

        {/* Middle ring */}
        <View
          style={{
            position: "absolute",
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            backgroundColor: COLORS.primaryLight,
            left: -5,
            top: -5,
          }}
        />

        {/* Inner button */}
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Animated.View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 6,
              transform: [{ rotate: spin }],
              borderWidth: 1.5,
              borderColor: COLORS.primary,
            }}
          >
            <FontAwesome5 name="plus" size={iconSize} color={COLORS.primary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Enhanced Card component with refined shadow and border
const Card = ({ children, style, noPadding = false }) => (
  <View
    style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      padding: noPadding ? 0 : 22,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...style,
    }}
  >
    {children}
  </View>
);

// Enhanced StatsCard component
const StatsCard = ({ icon, value, label }) => (
  <View
    style={{
      backgroundColor: COLORS.surface,
      borderRadius: 22,
      padding: 20,
      width: "48%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <View
      style={{
        backgroundColor: COLORS.primaryLight,
        padding: 12,
        borderRadius: 16,
        alignSelf: "flex-start",
        marginBottom: 16,
      }}
    >
      <FontAwesome5 name={icon} size={16} color={COLORS.primary} />
    </View>
    <Text
      style={{
        ...TYPOGRAPHY.displayMedium,
        color: COLORS.textPrimary,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        color: COLORS.textSecondary,
        ...TYPOGRAPHY.bodyMedium,
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  </View>
);

// Enhanced SectionHeader component
const SectionHeader = ({ title, showViewAll = false, onViewAllPress }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      marginTop: 10,
    }}
  >
    <Text style={{ ...TYPOGRAPHY.titleLarge, color: COLORS.textPrimary }}>
      {title}
    </Text>
    {showViewAll && (
      <TouchableOpacity
        onPress={onViewAllPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primaryLight,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            color: COLORS.primary,
            ...TYPOGRAPHY.labelMedium,
            marginRight: 4,
          }}
        >
          View All
        </Text>
        <FontAwesome5 name="chevron-right" size={10} color={COLORS.primary} />
      </TouchableOpacity>
    )}
  </View>
);

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const user = auth.currentUser;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setIsLoading(true);
    setUserTrips([]);

    try {
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user?.email),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(trips);
    } catch (error) {
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

  // Calculate upcoming trips count
  const upcomingTripsCount = userTrips.filter(
    (trip) => new Date(trip.startDate) > new Date()
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundAlt }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header - Enhanced inner glow */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: 54,
          paddingBottom: 20,
          position: "relative",
          zIndex: 1,
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Primary inner glow */}
        <LinearGradient
          colors={[
            "rgba(255, 140, 0, 0.12)",
            "rgba(255, 140, 0, 0)",
            "rgba(255, 140, 0, 0.12)",
          ]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Radial glow effect */}
        <View
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            right: -100,
            bottom: -100,
            backgroundColor: "transparent",
            shadowColor: "#FF8C00",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 100,
            elevation: 20,
          }}
        />

        {/* Soft inner border glow */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: 1,
            borderColor: "rgba(255, 140, 0, 0.15)",
            backgroundColor: "transparent",
          }}
        />

        {/* Multiple layered glows for depth */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "rgba(255, 140, 0, 0.1)",
            shadowColor: "#FF8C00",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "rgba(255, 140, 0, 0.1)",
            shadowColor: "#FF8C00",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        />

        {/* Content container */}
        <View style={{ position: "relative", zIndex: 2 }}>
          <View
            style={{
              paddingHorizontal: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "700",
                  color: "black",
                  marginBottom: 6,
                  letterSpacing: -0.6,
                }}
              >
                My Trips
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(62, 54, 44, 0.75)",
                  fontWeight: "500",
                  letterSpacing: 0.2,
                }}
              >
                {user?.displayName
                  ? `Welcome back, ${user.displayName.split(" ")[0]}`
                  : "Plan your next adventure"}
              </Text>
            </View>

            <PulsingButton
              onPress={() => router.push("./../createTrip/searchPlace")}
              size={46}
              iconSize={17}
            />
          </View>

          <View
            style={{
              marginHorizontal: 24,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              height: 50,
              borderWidth: 1,
              borderColor: "rgba(233, 132, 8, 0.83)",
              shadowColor: "#FF8C00",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color="rgba(255, 140, 0, 0.4)"
              style={{ marginRight: 12 }}
            />
            <TextInput
              placeholder="Search your trips..."
              placeholderTextColor="rgba(34, 33, 31, 0.3)"
              style={{
                flex: 1,
                color: "#FF8C00",
                fontSize: 15,
                height: "100%",
                fontWeight: "500",
              }}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons
                  name="close"
                  size={20}
                  color="rgba(255, 140, 0, 0.4)"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Stats Cards Row with refined shadows */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 36,
            marginTop: 8,
          }}
        >
          <StatsCard
            icon="suitcase"
            value={userTrips.length}
            label="Total Trips"
          />
          <StatsCard
            icon="plane-departure"
            value={upcomingTripsCount}
            label="Upcoming"
          />
        </View>

        {/* Enhanced Trip Content Section */}
        <View style={{ marginBottom: 36 }}>
          <SectionHeader
            title="Your Voyages"
            showViewAll={userTrips.length > 3}
            onViewAllPress={() => {}}
          />

          {isLoading ? (
            <Card style={{ padding: 50, alignItems: "center" }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text
                style={{
                  marginTop: 18,
                  color: COLORS.textSecondary,
                  ...TYPOGRAPHY.bodyMedium,
                  fontWeight: "500",
                }}
              >
                Loading your adventures...
              </Text>
            </Card>
          ) : userTrips.length > 0 ? (
            <UserTripList userTrips={userTrips} />
          ) : (
            <Card style={{ padding: 45, alignItems: "center" }}>
              <View
                style={{
                  width: 180,
                  height: 140,
                  marginBottom: 30,
                  borderRadius: 22,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.1,
                  shadowRadius: 15,
                  elevation: 8,
                }}
              >
                <Image
                  source={{
                    uri: "https://img.freepik.com/free-vector/travel-time-typography-design_1308-90406.jpg",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
              </View>
              <Text
                style={{
                  ...TYPOGRAPHY.displaySmall,
                  color: COLORS.textPrimary,
                  marginBottom: 16,
                }}
              >
                Begin Your Journey
              </Text>
              <Text
                style={{
                  ...TYPOGRAPHY.bodyMedium,
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  marginBottom: 28,
                  maxWidth: "85%",
                }}
              >
                Your story begins with the first step. Create your inaugural
                adventure now.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("./../createTrip/searchPlace")}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 28,
                  paddingVertical: 16,
                  borderRadius: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <FontAwesome5
                  name="map-marker-alt"
                  size={14}
                  color="white"
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 15,
                    letterSpacing: 0.3,
                  }}
                >
                  Create First Trip
                </Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>

        {/* Enhanced Travel Insights Section */}
        {userTrips.length > 0 && (
          <View style={{ marginBottom: 36 }}>
            <SectionHeader title="Travel Insights" />
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primaryLight,
                    padding: 12,
                    borderRadius: 14,
                    marginRight: 16,
                  }}
                >
                  <FontAwesome5
                    name="lightbulb"
                    size={16}
                    color={COLORS.primary}
                  />
                </View>
                <Text
                  style={{
                    ...TYPOGRAPHY.titleSmall,
                    color: COLORS.textPrimary,
                  }}
                >
                  Travel Tip of the Day
                </Text>
              </View>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  ...TYPOGRAPHY.bodyMedium,
                  lineHeight: 24,
                }}
              >
                Pack a portable charger for your devices. It's a lifesaver when
                exploring all day and using maps, taking photos, or staying
                connected.
              </Text>

              {/* Add a subtle "did you know" callout box for extra visual interest */}
              <View
                style={{
                  backgroundColor: COLORS.surfaceAlt,
                  padding: 16,
                  borderRadius: 14,
                  marginTop: 18,
                  borderLeftWidth: 3,
                  borderLeftColor: COLORS.primary,
                }}
              >
                <Text
                  style={{
                    ...TYPOGRAPHY.labelMedium,
                    color: COLORS.primary,
                    marginBottom: 6,
                  }}
                >
                  DID YOU KNOW?
                </Text>
                <Text
                  style={{
                    ...TYPOGRAPHY.bodySmall,
                    color: COLORS.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  Nearly 60% of travelers cite lost or dead devices as their top
                  travel frustration. Always keep your chargers in your day bag!
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Enhanced Inspiration Section with refined card design */}
        {userTrips.length > 0 && (
          <View style={{ marginBottom: 30 }}>
            <SectionHeader title="Wanderlust" />
            <Card noPadding={true} style={{ overflow: "hidden" }}>
              <View style={{ position: "relative", height: 200 }}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1682687218147-9806132dc697?q=80&w=1470&auto=format&fit=crop",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(255,255,255,0.85)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{ ...TYPOGRAPHY.labelMedium, color: COLORS.primary }}
                  >
                    Featured
                  </Text>
                </View>
              </View>
              <View style={{ padding: 22 }}>
                <Text
                  style={{
                    ...TYPOGRAPHY.titleMedium,
                    color: COLORS.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  Destination Spotlight: Kyoto
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    ...TYPOGRAPHY.bodyMedium,
                    marginBottom: 18,
                  }}
                >
                  Discover ancient temples, serene gardens, and traditional tea
                  houses in Japan's cultural capital.
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.primaryLight,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      ...TYPOGRAPHY.labelMedium,
                      marginRight: 8,
                    }}
                  >
                    Explore destination
                  </Text>
                  <FontAwesome5
                    name="arrow-right"
                    size={12}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Add an upcoming event card for better visual variety */}
        {userTrips.length > 0 && (
          <View style={{ marginBottom: 30 }}>
            <SectionHeader title="Travel Calendar" />
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <LinearGradient
                colors={[COLORS.primaryLight, "rgba(255,255,255,0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingTop: 20,
                  paddingHorizontal: 22,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border,
                }}
              >
                <Text
                  style={{
                    ...TYPOGRAPHY.titleSmall,
                    color: COLORS.textPrimary,
                  }}
                >
                  Upcoming Trip
                </Text>
              </LinearGradient>

              <View style={{ flexDirection: "row", padding: 20 }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    backgroundColor: COLORS.primaryLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <Text
                    style={{ ...TYPOGRAPHY.labelMedium, color: COLORS.primary }}
                  >
                    MAY
                  </Text>
                  <Text
                    style={{
                      ...TYPOGRAPHY.displaySmall,
                      color: COLORS.primary,
                      marginTop: -2,
                    }}
                  >
                    12
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...TYPOGRAPHY.titleSmall,
                      color: COLORS.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    Paris Getaway
                  </Text>
                  <Text
                    style={{
                      ...TYPOGRAPHY.bodySmall,
                      color: COLORS.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    May 12 - May 18, 2025
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="calendar-check"
                      size={12}
                      color={COLORS.success}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        ...TYPOGRAPHY.labelSmall,
                        color: COLORS.success,
                      }}
                    >
                      Confirmed
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    height: 38,
                    width: 38,
                    borderRadius: 12,
                    backgroundColor: COLORS.surfaceAlt,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <FontAwesome5
                    name="chevron-right"
                    size={12}
                    color={COLORS.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Enhanced Chat Assistant Button */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 24,
          right: 24,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <PulsingComp onPress={() => setIsChatVisible(true)} />
      </View>

      <ChatBotModal
        visible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </View>
  );
}
