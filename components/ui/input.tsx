import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { label, error, containerClassName, className, onFocus, onBlur, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-base font-neuton-bold text-muted-foreground mb-3">
            {label}
          </Text>
        )}
        <View
          className={cn(
            "px-5 rounded-2xl border border-border",
            isFocused && "border-2 border-black",
            error && "border border-error",
          )}
        >
          <TextInput
            ref={ref}
            className={cn(
              "text-base text-foreground font-neuton py-4 leading-[1.1]",
              className,
            )}
            placeholderTextColor="#8A6B4D"
            selectionColor="#5B3B1B"
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
        {error && (
          <Text className="text-sm font-neuton text-error ml-2 mt-1.5">
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";
