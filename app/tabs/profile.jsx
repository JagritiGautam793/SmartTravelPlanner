import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../../configs/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.replace("/auth/signIn");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/signIn");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverPhotoContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          }}
          style={styles.coverPhoto}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Header icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profilePicture}>
            <Image
              source={{
                uri:
                  user.photoURL ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>
            {user.displayName || "Traveler"}
          </Text>
          <Text style={styles.profileLocation}>
            {user.email || "No email provided"}
          </Text>

          {/* Connections */}
          <View style={styles.connections}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/44.jpg" }}
              style={styles.connectionImage}
            />
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/68.jpg",
              }}
              style={styles.connectionImage}
            />
            <View style={[styles.connectionImage, styles.moreConnection]}>
              <Text style={styles.moreConnectionText}>+12</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>320</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>54</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  coverPhotoContainer: {
    height: 360,
    position: "relative",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  profileInfo: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  profileLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  connections: {
    flexDirection: "row",
    marginTop: 15,
  },
  connectionImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
    marginHorizontal: -5,
  },
  moreConnection: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  moreConnectionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  statsContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
