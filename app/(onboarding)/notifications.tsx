import { AnimatedButton } from "@/components/ui/animated-button";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { user, refreshProfile } = useAuth();

  const handleEnable = async () => {
    await Notifications.requestPermissionsAsync();
    await finishOnboarding();
  };

  const handleSkip = async () => {
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    if (user) {
      await updateUser(user.id, { is_onboarded: true });
      await refreshProfile();
    }
    router.replace("/(app)/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center items-center">
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="items-center"
        >
          <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-10">
            <Bell size={36} strokeWidth={2} color="#282828" />
          </View>

          <Text className="text-4xl font-neuton-bold text-foreground text-center">
            Stay in the loop
          </Text>
          <Text className="text-lg font-neuton text-muted-foreground mt-4 text-center leading-7 px-4">
            Get notified about new drops from creators you follow and updates on
            your orders.
          </Text>
        </Animated.View>
      </View>

      <View className="px-6 pb-6 gap-3">
        <AnimatedButton
          onPress={handleEnable}
          className="h-[4.25rem] bg-accent"
        >
          <Text className="text-lg font-neuton-bold text-white">
            Enable notifications
          </Text>
        </AnimatedButton>
        <Pressable onPress={handleSkip} className="py-4 items-center">
          <Text className="text-lg font-neuton text-muted-foreground">
            Maybe later
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
