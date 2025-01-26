import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../../configs/FirebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSignIn = () => {
    if (!email && !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.LONG);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.replace("/tabs/mytrip");
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, error.code);
        if (errorCode == "auth/invalid-credential") {
          ToastAndroid.show("Invalid credentials", ToastAndroid.LONG);
        }
      });
  };

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.container}>
        <BlurView intensity={10} tint="light" style={styles.blurContainer}>
          <LinearGradient
            colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.9)"]}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Let's Sign You In</Text>

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
                  onChangeText={(value) => setPassword(value)}
                  placeholderTextColor="rgba(0, 0, 0, 0.5)"
                />
              </View>

              <TouchableOpacity onPress={onSignIn} style={styles.signInButton}>
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
                  style={styles.signInGradient}
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace("auth/SignUp")}
                style={styles.createAccountButton}
              >
                <Text style={styles.createAccountButtonText}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: width,
    backgroundColor: "rgba(173, 216, 230, 0.5)",
    height: height,
  },
  container: {
    flex: 1,
    color: "grey",
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
  subtitle: {
    fontWeight: "600",
    fontSize: 24,
    color: "#555555",
    marginBottom: 40,
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
});
