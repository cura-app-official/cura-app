import { USERNAME_DISALLOWED_CHARS_REGEX } from "@/lib/regex";
import { usernameSchema, type UsernameForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { checkUsernameAvailable, updateUser } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const USERNAME_MAX_LENGTH = 30;

export default function EditUsernameScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UsernameForm>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: profile?.username ?? "" },
  });

  const username = watch("username");

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSave = async (values: UsernameForm) => {
    if (!user || isSaving) return;

    const nextUsername = values.username.trim();
    if (nextUsername !== profile?.username) {
      const available = await checkUsernameAvailable(nextUsername);
      if (!available) {
        Alert.alert("Username taken", "Please choose a different username.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await updateUser(user.id, { username: nextUsername });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update username");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={router.back} hitSlop={10}>
            <Text className="text-xl font-neuton text-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit(onSave)}
            hitSlop={10}
            disabled={isSaving}
          >
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
            Username
          </Text>
          <Text className="text-lg font-neuton text-muted-foreground mt-3 mb-5">
            Use lowercase letters, numbers, underscores, and dots.
          </Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View className="rounded-3xl border border-border px-5 h-[4.25rem] justify-center">
                  <TextInput
                    ref={inputRef}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) =>
                      onChange(
                        text
                          .toLowerCase()
                          .replace(USERNAME_DISALLOWED_CHARS_REGEX, ""),
                      )
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={USERNAME_MAX_LENGTH}
                    placeholder="username"
                    placeholderTextColor="#858585"
                    selectionColor="#5B3B1B"
                    className="text-xl font-neuton text-foreground"
                  />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-base font-neuton text-error">
                    {errors.username?.message}
                  </Text>
                  <Text className="text-base font-neuton text-neutral">
                    {username.length} / {USERNAME_MAX_LENGTH}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
