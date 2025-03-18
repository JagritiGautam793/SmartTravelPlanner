import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Cover Photo with Gradient Overlay */}
      <View style={styles.coverPhotoContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          }}
          style={styles.coverPhoto}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />

        {/* Header Icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="shopping-cart" size={18} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="cog" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profilePicture}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>Christian Slater</Text>
          <Text style={styles.profileLocation}>San Francisco, CA</Text>

          {/* Connections */}
          <View style={styles.connections}>
            <View style={styles.connection}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/44.jpg",
                }}
                style={styles.connectionImage}
              />
            </View>
            <View style={styles.connection}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/68.jpg",
                }}
                style={styles.connectionImage}
              />
            </View>
            <View style={[styles.connection, styles.moreConnection]}>
              <Text style={styles.moreConnectionText}>+12</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1,250</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>239</Text>
          <Text style={styles.statLabel}>Experiences</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>125</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* Activities Section */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>My Activities</Text>

        {/* Activity Card */}
        <View style={styles.activityCard}>
          <View style={styles.activityContent}>
            <View style={styles.activityImage}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
                }}
                style={styles.activityImg}
              />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>
                Valley of the king & beyond
              </Text>
              <Text style={styles.activityLocation}>Giza</Text>
              <View style={styles.activityDate}>
                <View style={styles.activityDateIcon} />
                <Text style={styles.activityDateText}>17/08/2019</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.activityAction}>
              <FontAwesome name="calendar" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Card */}
        <View style={styles.activityCard}>
          <View style={styles.activityContent}>
            <View style={styles.activityImage}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1548574505-5e239809ee19",
                }}
                style={styles.activityImg}
              />
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Beaches of carribean</Text>
              <Text style={styles.activityLocation}>Bahamas</Text>
              <View style={styles.activityDate}>
                <View style={styles.activityDateIcon} />
                <Text style={styles.activityDateText}>17/08/2019</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.activityAction}>
              <FontAwesome name="calendar" size={16} color="white" />
            </TouchableOpacity>
          </View>
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
    justifyContent: "space-between",
    padding: 15,
    position: "relative",
    zIndex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
    overflow: "hidden",
    marginBottom: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  connections: {
    flexDirection: "row",
    marginTop: 15,
  },
  connection: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "white",
    overflow: "hidden",
    marginHorizontal: -5,
  },
  connectionImage: {
    width: "100%",
    height: "100%",
  },
  moreConnection: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  moreConnectionText: {
    fontSize: 12,
    color: "#333",
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: -20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
  activitiesSection: {
    padding: 30,
    paddingTop: 30,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
    overflow: "hidden",
  },
  activityContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  activityImage: {
    width: 40,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginRight: 15,
    overflow: "hidden",
  },
  activityImg: {
    width: "100%",
    height: "100%",
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 3,
  },
  activityLocation: {
    fontSize: 12,
    color: "#666",
  },
  activityDate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  activityDateIcon: {
    width: 12,
    height: 12,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginRight: 5,
  },
  activityDateText: {
    fontSize: 11,
    color: "#999",
  },
  activityAction: {
    width: 40,
    height: 40,
    backgroundColor: "#1e88e5",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});

export default ProfileScreen;
