// import { Text, View } from "react-native";
// import Login from "./../components/Login";
// import { auth } from "./../configs/FirebaseConfig";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";

// export default function Index() {
//   const router = useRouter();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       router.push("/tabs/mytrip");
//     }
//   }, [user]);

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Login />
//     </View>
//   );
// }
