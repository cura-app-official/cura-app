import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-base font-neuton-bold text-neutral-600 mb-3">
            {label}
          </Text>
        )}
        <View
          className={cn(
            "px-5 rounded-3xl bg-gray-100",
            error && "border border-error",
          )}
        >
          <TextInput
            ref={ref}
            className={cn(
              "text-base text-foreground font-neuton py-4 leading-[1.1]",
              className,
            )}
            placeholderTextColor="#a3a3a3"
            selectionColor="#1A1A1A"
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
