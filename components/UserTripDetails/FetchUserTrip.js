import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import Recomm from "./Recomm";

export default function FetchUserTrips({ onTripsFetched }) {
  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    try {
      console.log("Fetching trips for user:", user?.email);
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user?.email)
      );
      const querySnapshot = await getDocs(q);
      const trips = [];

      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      console.log("Fetched Trips:", trips); // 🔥 Debugging before setting state
      setUserTrips(trips);
      onTripsFetched(trips); // Pass trips to the parent component
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
    setLoading(false);
  };

  return <Recomm userTrips={userTrips} />;
}
