import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import NewTripCard from "../../components/userTrips/NewTripCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfig";
import UserTripList from "../../components/userTrips/UserTripList";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && GetMyTrips();
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(
      collection(db, "UserTrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prev) => [...prev, doc.data()]);
    });

    setLoading(false);
  };

  return (
    <ScrollView
      style={{
        padding: 85,
        paddingTop: 35,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 33,
            alignItems: "center",
          }}
        >
          Next Stop!
        </Text>
      </View>

      {loading && <ActivityIndicator size={"large"} />}

      {userTrips?.length == 0 ? (
        <NewTripCard />
      ) : (
        <UserTripList userTrips={userTrips} />
      )}
    </ScrollView>
  );
}
