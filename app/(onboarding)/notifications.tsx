import { AnimatedButton } from '@/components/ui/animated-button';
import { useAuth } from '@/providers/auth-provider';
import { updateProfile } from '@/services/profiles';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
      await updateProfile(user.id, { is_onboarded: true });
      await refreshProfile();
    }
    router.replace('/(app)/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center items-center">
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="items-center"
        >
          <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-8">
            <Ionicons name="notifications-outline" size={32} color="#1A1A1A" />
          </View>

          <Text className="text-3xl font-hell-round-bold text-foreground text-center">
            Stay in the loop
          </Text>
          <Text className="text-base font-helvetica text-muted-foreground mt-3 text-center leading-6 px-4">
            Get notified about new drops from creators you follow and updates on your orders.
          </Text>
        </Animated.View>
      </View>

      <View className="px-6 pb-6 gap-3">
        <AnimatedButton
          onPress={handleEnable}
          className="h-[4.75rem] justify-center items-center bg-accent"
        >
          <Text className="text-lg font-hell-round-bold text-white">
            Enable notifications
          </Text>
        </AnimatedButton>
        <Pressable onPress={handleSkip} className="py-4 items-center">
          <Text className="text-base font-helvetica text-muted-foreground">
            Maybe later
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
