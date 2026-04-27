import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

const COLORS = {
  foreground: "#5B3B1B",
  mutedForeground: "#858585",
  border: "#E8D8A8",
  error: "#FF4747",
};

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  containerClassName?: string;
  fieldClassName?: string;
  prefixClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      prefix,
      containerClassName,
      fieldClassName,
      prefixClassName,
      className,
      onFocus,
      onBlur,
      value,
      multiline,
      style,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-lg font-neuton-bold text-muted-foreground mb-3">
            {label}
          </Text>
        )}
        <View
          className={cn(
            "rounded-3xl bg-background px-5 border",
            multiline ? "min-h-[7.5rem]" : "h-[4.25rem]",
            fieldClassName,
          )}
          style={{
            borderColor: error
              ? COLORS.error
              : isFocused
                ? COLORS.foreground
                : COLORS.border,
            borderWidth: isFocused || error ? 2 : 1,
          }}
        >
          <View
            className={cn(
              "flex-row",
              multiline ? "min-h-[7.5rem] items-start" : "h-full items-center",
            )}
          >
            {prefix && (
              <Text
                className={cn(
                  "text-xl font-neuton-bold text-foreground mr-3",
                  prefixClassName,
                )}
              >
                {prefix}
              </Text>
            )}
            <TextInput
              ref={ref}
              className={cn(
                "flex-1 text-xl text-foreground font-neuton",
                !multiline && "h-full",
                className,
              )}
              style={[
                {
                  paddingTop: multiline ? 16 : 0,
                  paddingBottom: multiline ? 16 : 0,
                  textAlignVertical: multiline ? "top" : "center",
                },
                style,
              ]}
              placeholderTextColor={COLORS.mutedForeground}
              selectionColor={COLORS.foreground}
              value={value}
              multiline={multiline}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              {...props}
            />
          </View>
        </View>
        {error ? (
          <Text className="text-base font-neuton text-error ml-2 mt-1.5">
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = "Input";
