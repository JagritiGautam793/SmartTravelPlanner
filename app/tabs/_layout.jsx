import React from "react";
import { Tabs } from "expo-router";
import CustomNavBar from "../../components/CustomNavBar";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomNavBar {...props} />}>
      <Tabs.Screen
        name="mytrip"
        options={{
          title: "Trips",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
