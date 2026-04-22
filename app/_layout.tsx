import "@/global.css";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      if (profile && !profile.is_onboarded) {
        router.replace("/(onboarding)");
      } else {
        router.replace("/(app)/(tabs)");
      }
    } else if (
      isAuthenticated &&
      profile &&
      !profile.is_onboarded &&
      !inOnboardingGroup
    ) {
      router.replace("/(onboarding)");
    }

    if (!isNavigationReady) {
      setIsNavigationReady(true);
    }
  }, [isAuthenticated, isLoading, profile, segments]);

  if (!isNavigationReady && isLoading) {
    return <View className="flex-1 bg-background" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Neuton-Regular": require("@/assets/fonts/Neuton-Regular.ttf"),
    "Neuton-Light": require("@/assets/fonts/Neuton-Light.ttf"),
    "Neuton-ExtraLight": require("@/assets/fonts/Neuton-ExtraLight.ttf"),
    "Neuton-Italic": require("@/assets/fonts/Neuton-Italic.ttf"),
    "Neuton-Bold": require("@/assets/fonts/Neuton-Bold.ttf"),
    "Neuton-ExtraBold": require("@/assets/fonts/Neuton-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <QueryProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
