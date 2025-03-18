import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector icons or another icon library
import gapi from "../utils/gapi";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const Pd = () => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { pid } = useLocalSearchParams();

  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

  useEffect(() => {
    if (pid) {
      getPiDetails(pid);
    }
  }, [pid]);

  const getPiDetails = async (placeID) => {
    try {
      setLoading(true);
      const pd = await gapi.placeDetail(placeID);
      setPlaceDetails(pd.result);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching place details:", err);
      setError("Failed to fetch place details.");
      setLoading(false);
    }
  };

  const openMaps = () => {
    if (
      placeDetails &&
      placeDetails.geometry &&
      placeDetails.geometry.location
    ) {
      const { lat, lng } = placeDetails.geometry.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${placeDetails.place_id}`;
      Linking.openURL(url);
    }
  };

  const openWebsite = () => {
    if (placeDetails && placeDetails.website) {
      Linking.openURL(placeDetails.website);
    }
  };

  const callPlace = () => {
    if (placeDetails && placeDetails.formatted_phone_number) {
      Linking.openURL(`tel:${placeDetails.formatted_phone_number}`);
    }
  };

  const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${API_KEY}`;
  };

  // Create dots for image carousel
  const renderDots = () => {
    if (!placeDetails || !placeDetails.photos) return null;
    return (
      <View style={styles.dotsContainer}>
        {placeDetails.photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPhotoIndex
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.5)",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentPhotoIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading place details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!placeDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No place details found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Places</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Image Carousel */}
        {placeDetails.photos && placeDetails.photos.length > 0 && (
          <View style={styles.imageCarouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {placeDetails.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: getPhotoUrl(photo.photo_reference) }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            {renderDots()}
          </View>
        )}

        {/* Name and Rating */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{placeDetails.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingTextt}>{placeDetails.rating}</Text>
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address}>{placeDetails.formatted_address}</Text>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          {placeDetails.types && placeDetails.types.includes("lodging") && (
            <View style={styles.amenityBox}>
              <Ionicons name="people-outline" size={24} color="green" />
              <Text style={styles.amenityText}>
                {placeDetails.user_ratings_total
                  ? Math.floor(placeDetails.user_ratings_total)
                  : "100+"}{" "}
                Reviews
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.amenityBox} onPress={callPlace}>
            <Ionicons name="call-outline" size={24} color="blue" />
            <Text style={styles.amenityText}>
              {placeDetails.formatted_phone_number
                ? "Call"
                : "Phone Unavailable"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.amenityBox} onPress={openMaps}>
            <Ionicons name="map-outline" size={24} color="red" />
            <Text style={styles.amenityText}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {placeDetails.editorial_summary
              ? placeDetails.editorial_summary.overview
              : "This place has a luxurious and spacious quality, so it is suitable for you when going to a staycation with your family or"}
            <Text style={styles.readMore}> Read more...</Text>
          </Text>
        </View>

        {/* View Place Button */}
        <View style={styles.viewPlaceContainer}>
          <Text style={styles.viewPlaceText}>
            {placeDetails.business_status === "OPERATIONAL"
              ? "Open Now"
              : "Closed Now"}
          </Text>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={placeDetails.website ? openWebsite : openMaps}
          >
            <Text
              style={[
                styles.bookingButtonText,
                placeDetails.business_status === "OPERATIONAL"
                  ? styles.statusOpen
                  : styles.statusClosed,
              ]}
            >
              Check
            </Text>
          </TouchableOpacity>
        </View>

        {placeDetails.reviews && placeDetails.reviews.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Top Reviews</Text>
            {placeDetails.reviews.slice(0, 3).map((review, index) => (
              <View key={index} style={styles.review}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {review.author_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewAuthor}>
                      {review.author_name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>{review.rating}</Text>
                      <Text style={styles.starIcon}>★</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  {review.text && review.text.substring(0, 150)}
                  {review.text && review.text.length > 150 ? "..." : ""}
                </Text>
                {review.text && review.text.length > 150 && (
                  <TouchableOpacity>
                    <Text style={styles.readMoreButton}>Read more</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
  },
  imageCarouselContainer: {
    width: width,
    height: width * 0.7,
    position: "relative",
  },
  mainImage: {
    width: width,
    height: width * 0.7,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingTextt: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  amenitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  amenityBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  amenityText: {
    marginTop: 6,
    fontSize: 14,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  readMore: {
    color: "#000",
    fontWeight: "bold",
  },
  viewPlaceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  viewPlaceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  openNowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  openNowText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 32,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
  },
  priceUnit: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  bookingButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 100,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // review section
  infoSection: {
    marginBottom: 24,
    marginTop: 10,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333333",
  },
  review: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewMeta: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewAuthor: {
    fontWeight: "600",
    fontSize: 15,
    color: "#333333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 2,
  },
  starIcon: {
    color: "white",
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555555",
    marginBottom: 8,
  },
  readMoreButton: {
    color: "#4a90e2",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Pd;
