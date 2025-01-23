// import React, { useRef, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import { Video } from "expo-av";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

// const { width, height } = Dimensions.get("window");

// export default function Login() {
//   const router = useRouter();
//   const videoRef = useRef(null);

//   useEffect(() => {
//     console.log("Video component mounted");
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.videoContainer}>
//         <Video
//           ref={videoRef}
//           source={require("./../assets/videos/travel.mp4")}
//           style={styles.backgroundVideo}
//           rate={1.0}
//           volume={0.0}
//           isMuted={true}
//           resizeMode="cover"
//           shouldPlay
//           isLooping
//           onError={(e) => console.log("Video Error: ", e)}
//           onLoad={() => console.log("Video loaded")}
//           onLoadStart={() => console.log("Video load start")}
//         />
//         {/* Darker gradient with stronger black tones */}
//         <LinearGradient
//           colors={[
//             "transparent",
//             "rgba(0, 0, 0, 0.4)",
//             "rgba(0, 0, 0, 0.7)",
//             "rgba(0, 0, 0, 1)",
//           ]}
//           style={styles.gradient}
//         />
//         {/* Text positioned towards the bottom */}
//         <View style={styles.overlay}>
//           <Text style={styles.overlayText}>
//             Embark on Your Simple Travel Experience
//           </Text>
//           <Text style={styles.subtitle}>
//             Enjoy a smooth, stress-free travel journey with ease and simplicity
//             every step.
//           </Text>
//         </View>
//         {/* Sign-In Button */}
//         <View style={styles.signInContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push("auth/SignIn")}
//           >
//             <Text style={styles.buttonText}>Get Started</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   videoContainer: {
//     height: height,
//     width: width,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backgroundVideo: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     width: "100%",
//     height: "100%",
//   },
//   gradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: height * 0.75, // Gradient covers 75% of the screen from the bottom
//   },
//   overlay: {
//     position: "absolute",
//     bottom: height * 0.2, // Positioned above the button
//     left: 0,
//     right: 0,
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   overlayText: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//     textAlign: "center",
//     marginBottom: 8,
//     letterSpacing: 2,
//   },
//   subtitle: {
//     color: "white",
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: "center",

//     letterSpacing: 1,
//   },
//   signInContainer: {
//     position: "absolute",
//     bottom: height * 0.075, // Positioned at 7.5% from the bottom
//     width: "100%",
//     alignItems: "center",
//   },
//   button: {
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     backgroundColor: "black",
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "white",
//     width: width * 0.8, // Set the button width to 80% of the screen width
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

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
    onPress={() => router.push("auth/SignIn")}
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
          <Button title="Get Started" variant="outline" onPress={() => {}} />
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
