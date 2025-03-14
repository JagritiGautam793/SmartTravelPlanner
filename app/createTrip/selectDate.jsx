import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function selectDate() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  //   date actual date type date will be whether start date or end date
  const onDateChange = (date, type) => {
    console.log(date, type);
    if (type == "START_DATE") {
      setStartDate(moment(date));
    } else {
      setEndDate(moment(date));
    }
  };

  const onDateContinue = () => {
    if (!startDate) {
      ToastAndroid.show("Please select a Start Date", ToastAndroid.LONG);
      return;
    }

    // If endDate is null, assume it's a single-day trip
    const calculatedEndDate = endDate || startDate;
    const totalNoOfDays = moment(calculatedEndDate).diff(startDate, "days") + 1;

    console.log("Total Days:", totalNoOfDays);

    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: calculatedEndDate, // If no end date, assume the start date as end date
      totalNoOfDays: totalNoOfDays,
    });

    router.push("/createTrip/selectBudget");
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Travel Dates
      </Text>
      <View
        style={{
          marginTop: 30,
        }}
      >
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={5}
          selectedRangeStyle={{
            backgroundColor: "black",
          }}
          selectedDayTextStyle={{
            color: "white",
          }}
        />
      </View>

      <TouchableOpacity
        onPress={onDateContinue}
        style={{
          padding: 15,
          backgroundColor: "black",
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
