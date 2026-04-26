import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Heart, Home, Search, User } from "lucide-react-native";
import { Platform, Pressable } from "react-native";

function TabBarButton(props: any) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPress?.(e);
      }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#432004",
        tabBarInactiveTintColor: "#A3A3A3",
        tabBarShowLabel: false,
        tabBarButton: TabBarButton,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "#FFF7EC",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={26}
              strokeWidth={1.5}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Search size={26} strokeWidth={1.5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Heart
              size={26}
              strokeWidth={1.5}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User
              size={26}
              strokeWidth={1.5}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
