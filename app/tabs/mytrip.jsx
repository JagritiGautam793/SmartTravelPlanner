import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import UserTripList from "../../components/userTrips/UserTripList";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    <ScrollView
      style={{ padding: 20, backgroundColor: "white", height: "100%" }}
    >
      {/* Start a new trip option */}
      <TouchableOpacity
        onPress={() => router.push("./../createTrip/searchPlace")}
        style={{
          padding: 10,
          backgroundColor: "black",
          borderRadius: 15,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white", fontSize: 17, textAlign: "center" }}>
          Start a new trip
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ marginTop: 10, color: "gray" }}>
            Loading your trips...
          </Text>
        </View>
      ) : userTrips.length > 0 ? (
        <UserTripList userTrips={userTrips} />
      ) : (
        <View style={{ padding: 20, alignItems: "center" }}>
          <EvilIcons name="location" size={50} color="gray" />
          <Text
            style={{
              fontSize: 16,
              color: "grey",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            No trips yet. Time to plan your first adventure!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
