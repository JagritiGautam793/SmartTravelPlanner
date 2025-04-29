import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../../../configs/FirebaseConfig";
import Toast from "react-native-toast-message";

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
        const user = userCredential.user;
        console.log(user);
        router.replace("/tabs/mytrip");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <SafeAreaView style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={20} color="black" />
        </TouchableOpacity> */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1496614932623-0a3a9743552e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.loginImage}
          />
        </View>
      </SafeAreaView>

      <View style={styles.formContainer}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            onChangeText={(value) => setFullName(value)}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(value) => setEmail(value)}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter Password"
            onChangeText={(value) => setPassword(value)}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />

          <TouchableOpacity
            onPress={onCreateAccount}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <View style={styles.socialLogin}>
            <TouchableOpacity style={styles.googleButton}>
              <AntDesign name="google" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("auth/signIn")}>
              <Text style={styles.signInLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flex: 0.35,
  },
  backButton: {
    padding: 8,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "white",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginImage: {
    width: 420,
    height: 470,
    resizeMode: "cover",
  },
  formContainer: {
    flex: 0.65,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 32,
    paddingTop: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  form: {
    flex: 1,
  },
  label: {
    color: "#333333",
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  signUpButton: {
    backgroundColor: "#FF8C00",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF8C00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginTop: 8,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 20,
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  socialLogin: {
    flexDirection: "row",
    justifyContent: "center",
  },
  googleButton: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  signInText: {
    color: "#333333",
  },
  signInLink: {
    color: "#FF8C00",
    fontWeight: "600",
    marginLeft: 4,
  },
  toastError: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  toastText: {
    color: "white",
    fontSize: 16,
  },
});
