import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#241203";
const SECONDARY_COLOR = "#edb88a";

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused ? SECONDARY_COLOR : "transparent",
                minWidth: isFocused ? 100 : 40, // Ensure enough space for text
                paddingHorizontal: isFocused ? 16 : 8,
              },
            ]}
          >
            <View style={styles.iconContainer}>
              {getIconByRouteName(
                route.name,
                isFocused ? PRIMARY_COLOR : SECONDARY_COLOR
              )}
            </View>
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.text, { color: PRIMARY_COLOR }]}
                numberOfLines={1}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "mytrip":
        return <Entypo name="location-pin" size={18} color={color} />;
      case "discover":
        return <FontAwesome name="globe" size={18} color={color} />;
      case "chatBot":
        return <MaterialIcons name="chat" size={18} color={color} />;
      case "profile":
        return <Ionicons name="people" size={18} color={color} />;
      default:
        return <Entypo name="location-pin" size={18} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    width: "70%",
    alignSelf: "center",
    bottom: 10,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 30,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
});

export default CustomNavBar;
