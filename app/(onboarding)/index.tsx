import { AnimatedButton } from '@/components/ui/animated-button';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FEATURES = [
  {
    title: 'Curated pieces',
    description: 'Shop secondhand fashion from creators you love',
  },
  {
    title: 'Creator-first',
    description: 'Follow influencers, models, and artists across industries',
  },
  {
    title: 'Sustainable style',
    description: 'Give fashion a second life with every purchase',
  },
];

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-16">
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text className="text-4xl font-hell-round-bold text-foreground tracking-tight">
            Welcome to{'\n'}cura
          </Text>
        </Animated.View>

        <View className="mt-14 gap-8">
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.duration(600).delay(200 + index * 150)}
            >
              <Text className="text-lg font-hell-round-bold text-foreground">
                {feature.title}
              </Text>
              <Text className="text-base font-helvetica text-muted-foreground mt-1">
                {feature.description}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <View className="px-6 pb-6">
        <AnimatedButton
          onPress={() => router.push('/(onboarding)/notifications')}
          className="h-[4.75rem] justify-center items-center bg-accent"
        >
          <Text className="text-lg font-hell-round-bold text-white">
            Get started
          </Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}
