import { cn } from '@/lib/utils';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps extends PressableProps {
  className?: string;
  style?: ViewStyle | ReturnType<typeof useAnimatedStyle>;
  children: React.ReactNode;
}

export function AnimatedButton({
  className,
  style,
  children,
  onPress,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 200 });
      }}
      onPress={onPress}
      disabled={disabled}
      style={[animatedStyle, style]}
      className={cn('rounded-2xl bg-accent overflow-hidden', className)}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
