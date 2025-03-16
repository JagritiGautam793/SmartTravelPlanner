// import { View, Text, TouchableOpacity } from "react-native";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import { db } from "../firebaseConfig";
// import { doc, setDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// export default function Onboarding() {
//   // const [preferences, setPreferences] = useState({
//     travelType: [],
//     budget: "",
//     groupType: "",
//     dreamDestination: "",
//   });

//   const router = useRouter();
//   const auth = getAuth();
//   const user = auth.currentUser; // Get logged-in user

//   const handleSavePreferences = async () => {
//     if (!user) return; // Ensure user is logged in

//     await setDoc(doc(db, "users", user.uid), {
//       preferences,
//       isOnboarded: true, // ✅ Store onboarding status
//     });

//     router.replace("/"); // Redirect to the main app
//   };

//   return (
//     <View>
//       <Text>Select your travel type:</Text>
//       <TouchableOpacity
//         onPress={() =>
//           setPreferences({ ...preferences, travelType: ["Adventure"] })
//         }
//       >
//         <Text>🎢 Adventure</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleSavePreferences}>
//         <Text>Save & Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
