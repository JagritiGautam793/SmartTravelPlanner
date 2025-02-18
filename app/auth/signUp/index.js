import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Ensure this import is present
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../../../configs/FirebaseConfig";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onCreateAccount = () => {
    if (!email || !password || !fullName) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your complete credentials",
        style: styles.toastError,
        textStyle: styles.toastText,
      });

      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        router.replace("/tabs/mytrip");
        // Navigate to the next screen or show success message
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        // Show error message to user if needed
      });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/premium-photo/scattered-variety-pills-drugs-spay-bottles-thermometer-syringe-empty-shopping-trolley-cart-blue-background-pharmacy-shopping-concept_130265-10491.jpg?w=996",
      }}
      style={styles.backgroundImage}
    >
      <Toast />
      <SafeAreaView style={styles.container}>
        <BlurView intensity={10} tint="light" style={styles.blurContainer}>
          <LinearGradient
            colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)"]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              {/* <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity> */}
              <Text style={styles.title}>Create New Account</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Full Name"
                  onChangeText={(value) => setFullName(value)}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  onChangeText={(value) => setEmail(value)}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  placeholder="Enter Password"
                  onChangeText={(value) => setPassword(value)} // Corrected line
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                />
              </View>

              <TouchableOpacity
                onPress={onCreateAccount}
                style={styles.signInButton}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
                  style={styles.signInGradient}
                >
                  <Text style={styles.signInButtonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace("auth/signIn")}
                style={styles.createAccountButton}
              >
                <Text style={styles.createAccountButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  gradient: {
    borderRadius: 30,
    overflow: "hidden",
  },
  content: {
    padding: 25,
  },
  title: {
    fontWeight: "bold",
    fontSize: 32,
    color: "#333333",
    marginBottom: 5,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  signInButton: {
    marginTop: 40,
    overflow: "hidden",
    borderRadius: 15,
  },
  signInGradient: {
    padding: 18,
  },
  signInButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountButton: {
    padding: 18,
    marginTop: 20,
  },
  createAccountButtonText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
  },
  toastError: {
    backgroundColor: "black", // Set background to black
    padding: 10,
    borderRadius: 10,
  },
  toastText: {
    color: "white", // Set text color to white
    fontSize: 16,
  },
});
