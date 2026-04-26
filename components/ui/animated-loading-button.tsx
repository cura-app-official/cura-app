import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    type LayoutChangeEvent,
    Text,
    View,
} from "react-native";
import {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { AnimatedButton } from "./animated-button";

const BUTTON_SIZE = 76;

interface AnimatedLoadingButtonProps {
  isSubmitting: boolean;
  onPress: () => void;
  title: string;
  titleClassName?: string;
  className?: string;
  disabled?: boolean;
}

export function AnimatedLoadingButton({
  isSubmitting,
  onPress,
  title,
  titleClassName,
  className,
  disabled,
}: AnimatedLoadingButtonProps) {
  const widthAnim = useSharedValue(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const measured = useRef(false);

  useEffect(() => {
    widthAnim.value = withTiming(isSubmitting ? 0 : 1, { duration: 380 });
  }, [isSubmitting, widthAnim]);

  const onLayout = (e: LayoutChangeEvent) => {
    if (!measured.current) {
      setContainerWidth(e.nativeEvent.layout.width);
      measured.current = true;
    }
  };

  const handlePress = () => {
    if (!isSubmitting && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const fullWidth = containerWidth > 0 ? containerWidth : 260;
    return {
      width: interpolate(
        widthAnim.value,
        [0, 1],
        [BUTTON_SIZE, fullWidth],
        Extrapolation.CLAMP,
      ),
      alignSelf: "center" as const,
    };
  }, [containerWidth]);

  return (
    <View onLayout={onLayout} style={{ width: "100%" }}>
      <AnimatedButton
        onPress={handlePress}
        disabled={isSubmitting || disabled}
        style={animatedStyle}
        className={cn("justify-center items-center h-[4.75rem]", className)}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            className={cn(
              "text-xl font-neuton-bold text-white",
              titleClassName,
            )}
          >
            {title}
          </Text>
        )}
      </AnimatedButton>
    </View>
  );
}
