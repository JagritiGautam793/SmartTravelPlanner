import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();

  // Reusable Button Component Inside Login.js
  const Button = ({ title, onPress, variant }) => (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" ? styles.buttonOutline : styles.buttonFilled,
      ]}
      onPress={onPress}
    >
      {variant === "filled" ? (
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonTextFilled}>{title}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.buttonTextOutline}>{title}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={{
          uri: "https://videos.pexels.com/video-files/8045117/8045117-sd_360_640_25fps.mp4",
        }}
        style={styles.backgroundVideo}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      {/* Dark Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,1)"]}
        style={styles.gradient}
      />

      {/* Safe Area Content */}
      <SafeAreaView style={styles.safeArea} edges={["right", "left", "bottom"]}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Embark on Your Simple Travel Experience
          </Text>
          <Text style={styles.subtitle}>
            Enjoy a smooth, stress-free travel journey with ease and simplicity
            every step.
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.footer}>
          <Button
            title="Get Started"
            variant="outline"
            onPress={() => router.push("/auth/signIn")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    width,
    height,
    position: "absolute",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.6,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonFilled: {
    backgroundColor: "transparent",
  },
  buttonTextOutline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextFilled: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
