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
import { router, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Button = ({ title, onPress, variant }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "outline" ? styles.buttonOutline : styles.buttonFilled,
    ]}
    onPress={() => router.push("/auth/signIn")}
  >
    <Text
      style={[
        styles.buttonText,
        variant === "outline"
          ? styles.buttonTextOutline
          : styles.buttonTextFilled,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function Login() {
  const router = useRouter();
  return (
    <View style={styles.container}>
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
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,1)"]}
        style={styles.gradient}
      />
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
        <View style={styles.footer}>
          <Button title="Get Started" variant="outline" />
        </View>
      </SafeAreaView>
    </View>
  );
}

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
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "white",
  },
  buttonFilled: {
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextOutline: {
    color: "white",
  },
  buttonTextFilled: {
    color: "black",
  },
});
