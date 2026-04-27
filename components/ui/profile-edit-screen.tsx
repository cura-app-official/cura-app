import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, type ReactNode, type RefObject } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileEditScreenProps {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void | Promise<void>;
  children: ReactNode;
  keyboardAvoiding?: boolean;
  descriptionClassName?: string;
}

export function useAutoFocusTextInput(
  inputRef: RefObject<TextInput | null>,
  delay = 100,
) {
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), delay);
    return () => clearTimeout(timer);
  }, [delay, inputRef]);
}

export function ProfileEditScreen({
  title,
  description,
  isSaving,
  onSave,
  children,
  keyboardAvoiding = false,
  descriptionClassName,
}: ProfileEditScreenProps) {
  const handleSave = () => {
    if (isSaving) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    void onSave();
  };

  const content = (
    <>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={router.back} hitSlop={10}>
          <Text className="text-xl font-neuton text-foreground">Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} hitSlop={10} disabled={isSaving}>
          <Text
            className={`text-xl font-neuton-bold ${
              isSaving ? "text-neutral" : "text-accent"
            }`}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-neuton-bold text-foreground">
          {title}
        </Text>
        <Text
          className={cn(
            "text-lg font-neuton text-muted-foreground mt-3 mb-5",
            descriptionClassName,
          )}
        >
          {description}
        </Text>

        {children}
      </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
