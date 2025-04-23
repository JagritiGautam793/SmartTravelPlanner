import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CreateTripContext } from "../../context/CreateTripContext";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

export default function reviewTrip() {
  const navigation = useNavigation();
  const { tripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const reviewItems = [
    {
      icon: "location",
      label: "Destination",
      value: tripData?.locationInfo?.name || "Not specified",
    },
    {
      icon: "calendar",
      label: "Travel Date",
      value: `${moment(tripData?.startDate).format("DD MMM")} TO ${moment(
        tripData.endDate
      ).format("DD MMM")}  (${tripData?.totalNoOfDays} days)`,
    },
    {
      icon: "people",
      label: "Traveller",
      value: tripData?.traveller?.title || "Not specified",
    },
    {
      icon: "wallet",
      label: "Budget",
      value: tripData?.budget || "Not specified",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
          }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
            style={styles.headerGradient}
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Review your Trip</Text>
            <Text style={styles.headerSubtitle}>
              Almost ready for your adventure
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Trip Summary</Text>
          <Text style={styles.reviewSubtitle}>
            Please review your selections before we build your trip
          </Text>

          <View style={styles.divider} />

          {reviewItems.map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color="#FF8C00" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}

          {/* Quote section */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              "The journey of a thousand miles begins with a single step."
            </Text>
            <Text style={styles.quoteAuthor}>— Lao Tzu</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/createTrip/generateTrip")}
          style={styles.buildButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FF8C00", "#FF6B00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Build My Trip</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerImage: {
    height: 200,
  },
  headerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  headerContent: {
    padding: 25,
    paddingTop: 70,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: -30,
    marginHorizontal: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  reviewSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,140,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#888",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  quoteContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF8C00",
  },
  quoteText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#555",
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 13,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  buildButton: {
    borderRadius: 15,
    overflow: "hidden",
    margin: 20,
    marginTop: 10,
  },
  buttonGradient: {
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
