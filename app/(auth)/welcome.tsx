import { AnimatedButton } from "@/components/ui/animated-button";
import { router } from "expo-router";
import { Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 justify-end">
        <View
          className="rounded-t-[3rem] bg-background px-6 pt-8"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="mb-16">
            <Text className="text-6xl font-neuton-bold text-foreground tracking-tight">
              cura
            </Text>
            <Text className="text-xl font-neuton text-muted-foreground mt-2">
              Curated fashion from{"\n"}your favorite creators
            </Text>
          </View>

          <View className="gap-3">
            <AnimatedButton
              onPress={() => router.push("/(auth)/signup-username")}
              className="bg-accent"
            >
              <Text className="text-xl font-neuton-bold text-white">
                Create account
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => router.push("/(auth)/login-email")}
              className="bg-transparent border border-border"
            >
              <Text className="text-xl font-neuton-bold text-foreground">
                Sign in
              </Text>
            </AnimatedButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
