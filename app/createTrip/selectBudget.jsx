import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import { selectBudgetOptions } from "../constants/Option";
import { CreateTripContext } from "../../context/CreateTripContext";
import { LinearGradient } from "expo-linear-gradient";

export default function selectBudget() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (selectedOption) {
      setTripData({
        ...tripData,
        budget: selectedOption?.title,
      });
    }
  }, [selectedOption]);

  const onClickContinue = () => {
    if (!selectedOption) {
      ToastAndroid.show("Please select your budget", ToastAndroid.SHORT);
      return;
    }
    router.push("/createTrip/reviewTrip");
  };

  // Budget tips data
  const budgetTips = [
    {
      icon: "💰",
      title: "Track Expenses",
      description:
        "Use a travel app to monitor your spending and stay within budget.",
    },
    {
      icon: "🍽️",
      title: "Local Dining",
      description:
        "Eat where locals eat to enjoy authentic food at better prices.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop",
          }}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
            style={styles.headerGradient}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Budget</Text>
            <Text style={styles.headerSubtitle}>
              Choose spending money for your trip
            </Text>
          </View>
        </ImageBackground>

        {/* Quote section */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Travel is the only thing you buy that makes you richer."
          </Text>
          <Text style={styles.quoteAuthor}>— Anonymous</Text>
        </View>

        {/* Budget Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Select Your Budget</Text>

          {selectBudgetOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOption(item)}
              style={styles.optionCard}
            >
              <LinearGradient
                colors={
                  selectedOption?.id === item.id
                    ? ["rgba(255,140,0,0.05)", "rgba(255,140,0,0.15)"]
                    : ["#fff", "#fff"]
                }
                style={[
                  styles.optionGradient,
                  selectedOption?.id === item.id && styles.selectedOption,
                ]}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.optionIconContainer,
                      selectedOption?.id === item.id &&
                        styles.selectedOptionIcon,
                    ]}
                  >
                    <Text style={styles.optionIcon}>
                      {item.title.includes("Low")
                        ? "💰"
                        : item.title.includes("Medium")
                        ? "💰💰"
                        : "💰💰💰"}
                    </Text>
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    <Text style={styles.optionDescription}>
                      {item.subTitle}
                    </Text>
                  </View>
                  {selectedOption?.id === item.id && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Budget Tips</Text>

          {budgetTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipHeading}>{tip.title}</Text>
                <Text style={styles.tipText}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onClickContinue}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
    height: 200,
  },
  headerTextContainer: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 70 : 60,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  quoteContainer: {
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
  },
  quoteText: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#555",
    fontStyle: "italic",
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "right",
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "sans-serif",
  },
  optionsContainer: {
    padding: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  optionCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionGradient: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    borderColor: "#FF8C00",
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  selectedOptionIcon: {
    backgroundColor: "rgba(255,140,0,0.15)",
  },
  optionIcon: {
    fontSize: 22,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  checkmarkContainer: {
    backgroundColor: "#FF8C00",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
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
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  continueButton: {
    padding: 16,
    backgroundColor: "#FF8C00",
    borderRadius: 15,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
