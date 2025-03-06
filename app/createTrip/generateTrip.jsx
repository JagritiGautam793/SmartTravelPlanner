import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { CreateTripContext } from "../../context/CreateTripContext";
import { AI_PROMPT } from "../constants/Option";
import { chatSession } from "../../configs/GemAi";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    tripData && GeneratePrompt();
  }, [tripData]);
  const GeneratePrompt = async () => {
    setLoading(true);
    const prompt_final = AI_PROMPT.replace(
      "{location}",
      tripData?.locationInfo?.name
    )
      .replace("{totalDays}", tripData?.totalNoOfDays)
      .replace("{totalNight}", tripData?.totalNoOfDays - 1)
      .replace("{traveller}", tripData?.traveller?.title)
      .replace("{budget}", tripData?.budget)
      .replace("{totalDays}", tripData?.totalNoOfDays)
      .replace("{totalNight}", tripData?.totalNoOfDays - 1);

    console.log(prompt_final);
    const result = await chatSession.sendMessage(prompt_final);
    console.log(result.response.text());
    const tripResp = JSON.parse(result.response.text());
    setLoading(false);
    const docId = Date.now().toString();
    const resultf = await setDoc(doc(db, "UserTrips", docId), {
      userEmail: user.email,
      tripData: tripResp,
    });

    router.push("tabs/mytrip");
  };
  return (
    <View
      style={{
        padding: 25,
        // marginTop: 5,
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        Please Wait..
      </Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Working to generate trip
      </Text>

      <LottieView
        source={require("../../assets/fonts/loading.json")} // Update path as needed
        autoPlay
        loop
        style={{ width: 200, height: 200 }} // Adjust size
      />
    </View>
  );
}
