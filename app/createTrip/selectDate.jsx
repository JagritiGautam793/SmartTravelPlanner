import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "../../context/CreateTripContext";
import { Ionicons } from "@expo/vector-icons";

export default function SelectDate() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const screenWidth = Dimensions.get("window").width;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "#FF6B00",
    });
  }, []);

  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      setStartDate(moment(date));
      setEndDate(null); // Clear endDate when selecting new start
    } else if (type === "END_DATE") {
      setEndDate(moment(date));
    }
  };

  const onDateContinue = () => {
    if (!startDate) {
      ToastAndroid.show("Please select a Start Date", ToastAndroid.LONG);
      return;
    }

    const calculatedEndDate = endDate || startDate;
    const totalNoOfDays = moment(calculatedEndDate).diff(startDate, "days") + 1;

    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: calculatedEndDate,
      totalNoOfDays: totalNoOfDays,
    });

    router.push("/createTrip/selectBudget");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={{ flex: 1, padding: 16, paddingTop: 80 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#222222",
            marginBottom: 20,
          }}
        >
          Travel Dates
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            marginBottom: 20,
          }}
        >
          <CalendarPicker
            onDateChange={onDateChange}
            allowRangeSelection={true}
            minDate={new Date()}
            selectedRangeStyle={{ backgroundColor: "#FF6B00" }}
            selectedDayTextStyle={{ color: "#FFFFFF", fontWeight: "600" }}
            selectedDayStyle={{ backgroundColor: "#FF6B00" }}
            todayBackgroundColor="#FFF0E6"
            todayTextStyle={{ color: "#FF6B00", fontWeight: "600" }}
            textStyle={{ color: "#333333" }}
            previousComponent={
              <View
                style={{
                  padding: 6,
                  borderRadius: 20,
                  backgroundColor: "#FFF0E6",
                }}
              >
                <Ionicons name="chevron-back" size={16} color="#FF6B00" />
              </View>
            }
            nextComponent={
              <View
                style={{
                  padding: 6,
                  borderRadius: 20,
                  backgroundColor: "#FFF0E6",
                }}
              >
                <Ionicons name="chevron-forward" size={16} color="#FF6B00" />
              </View>
            }
            monthTitleStyle={{
              fontSize: 16,
              fontWeight: "700",
              color: "#333333",
            }}
            yearTitleStyle={{
              fontSize: 16,
              fontWeight: "700",
              color: "#333333",
            }}
            dayLabelsWrapper={{
              borderBottomWidth: 1,
              paddingBottom: 6,
              borderBottomColor: "#F0F0F0",
              marginBottom: 4,
            }}
            headerWrapperStyle={{
              paddingVertical: 8,
              borderBottomWidth: 0,
            }}
            weekdays={["S", "M", "T", "W", "T", "F", "S"]}
            dayLabels={["S", "M", "T", "W", "T", "F", "S"]}
            dayOfWeekStyles={{
              0: { color: "#FF8A65" },
              6: { color: "#FF8A65" },
            }}
            width={screenWidth - 52}
            height={350}
            scaleFactor={375}
            initialDate={new Date()}
            dayShape="circle"
            firstDay={0}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: "#F0F0F0",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#FFF0E6",
                }}
              />
              <Text style={{ marginLeft: 4, fontSize: 12, color: "#666666" }}>
                Today
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#FF6B00",
                }}
              />
              <Text style={{ marginLeft: 4, fontSize: 12, color: "#666666" }}>
                Selected
              </Text>
            </View>
          </View>
        </View>

        {(startDate || endDate) && (
          <View
            style={{
              backgroundColor: "#FFF8F3",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontSize: 13, color: "#666666", marginBottom: 2 }}>
                Start Date
              </Text>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: "#333333" }}
              >
                {startDate ? startDate.format("MMM D, YYYY") : "Not selected"}
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={16} color="#FF6B00" />

            <View>
              <Text style={{ fontSize: 13, color: "#666666", marginBottom: 2 }}>
                End Date
              </Text>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: "#333333" }}
              >
                {endDate
                  ? endDate.format("MMM D, YYYY")
                  : startDate
                  ? startDate.format("MMM D, YYYY")
                  : "Not selected"}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={onDateContinue}
          style={{
            padding: 16,
            backgroundColor: "#FF6B00",
            borderRadius: 12,
            shadowColor: "#FF6B00",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
