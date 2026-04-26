import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const COLORS = {
  foreground: "#5B3B1B",
  mutedForeground: "#858585",
  border: "#E8D8A8",
  error: "#FF4747",
};

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerClassName?: string;
}

export const FloatingLabelInput = forwardRef<
  TextInput,
  FloatingLabelInputProps
>(
  (
    {
      label,
      value,
      onChangeText,
      error,
      containerClassName,
      className,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const progress = useSharedValue(value ? 1 : 0);

    useEffect(() => {
      progress.value = withTiming(isFocused || value ? 1 : 0, {
        duration: 180,
      });
    }, [isFocused, progress, value]);

    const labelStyle = useAnimatedStyle(() => ({
      top: 7 + (1 - progress.value) * 10,
      fontSize: 12 + (1 - progress.value) * 5,
      color: interpolateColor(
        progress.value,
        [0, 1],
        [COLORS.mutedForeground, error ? COLORS.error : COLORS.foreground],
      ),
    }));

    const fieldStyle = useAnimatedStyle(() => ({
      borderColor: error
        ? COLORS.error
        : interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.border, COLORS.foreground],
          ),
      borderWidth: isFocused || error ? 2 : 1,
    }));

    const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <View className={cn("w-full", containerClassName)}>
        <Animated.View
          className="h-[4.25rem] rounded-3xl bg-background px-5"
          style={fieldStyle}
        >
          <Animated.Text
            pointerEvents="none"
            className="absolute left-5 font-neuton"
            style={labelStyle}
          >
            {label}
          </Animated.Text>
          <TextInput
            ref={ref}
            className={cn(
              "h-full text-xl text-foreground font-neuton",
              className,
            )}
            style={{
              paddingTop: 18,
              paddingBottom: 8,
              textAlignVertical: "top",
            }}
            placeholderTextColor={COLORS.mutedForeground}
            selectionColor={COLORS.foreground}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </Animated.View>
        {error && (
          <Text className="text-base font-neuton text-error ml-2 mt-1.5">
            {error}
          </Text>
        )}
      </View>
    );
  },
);

FloatingLabelInput.displayName = "FloatingLabelInput";
