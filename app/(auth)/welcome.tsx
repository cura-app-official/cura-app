import { AnimatedButton } from "@/components/ui/animated-button";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-end px-6 pb-10">
        <View className="mb-16">
          <Text className="text-6xl font-neuton-bold text-foreground tracking-tight">
            cura
          </Text>
          <Text className="text-xl font-neuton text-muted-foreground mt-4 leading-7">
            Curated fashion from{"\n"}your favorite creators
          </Text>
        </View>

        <View className="gap-3">
          <AnimatedButton
            onPress={() => router.push("/(auth)/signup-username")}
            className="h-[4.25rem] bg-accent"
          >
            <Text className="text-lg font-neuton-bold text-white">
              Create account
            </Text>
          </AnimatedButton>

          <AnimatedButton
            onPress={() => router.push("/(auth)/login")}
            className="h-[4.25rem] bg-gray-100"
          >
            <Text className="text-lg font-neuton-bold text-foreground">
              Sign in
            </Text>
          </AnimatedButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
