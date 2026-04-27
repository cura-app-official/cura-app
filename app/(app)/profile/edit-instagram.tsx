import {
  ProfileEditScreen,
  useAutoFocusTextInput,
} from "@/components/ui/profile-edit-screen";
import {
  extractInstagramUsername,
  INSTAGRAM_USERNAME_MAX_LENGTH,
  sanitizeInstagramUsername,
  toInstagramUrl,
} from "@/lib/instagram";
import type { EditInstagramForm } from "@/lib/validations";
import { editInstagramSchema } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, View } from "react-native";

export default function EditInstagramScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditInstagramForm>({
    resolver: zodResolver(editInstagramSchema),
    defaultValues: {
      instagram_username: extractInstagramUsername(profile?.instagram_link),
    },
  });

  const username = watch("instagram_username");

  useAutoFocusTextInput(inputRef);

  const onSave = async (values: EditInstagramForm) => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      await updateUser(user.id, {
        instagram_link: toInstagramUrl(values.instagram_username),
      });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update Instagram");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileEditScreen
      title="Instagram"
      description="Enter only your Instagram username."
      isSaving={isSaving}
      onSave={handleSubmit(onSave)}
      keyboardAvoiding
    >
      <Controller
        control={control}
        name="instagram_username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View className="flex-row items-center rounded-3xl border border-border px-5 h-[4.25rem]">
              <Text className="text-xl font-neuton text-muted-foreground">
                instagram.com/
              </Text>
              <TextInput
                ref={inputRef}
                value={value}
                onBlur={onBlur}
                onChangeText={(text) =>
                  onChange(sanitizeInstagramUsername(text))
                }
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={INSTAGRAM_USERNAME_MAX_LENGTH}
                placeholder="username"
                placeholderTextColor="#858585"
                selectionColor="#5B3B1B"
                className="flex-1 text-xl font-neuton text-foreground"
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-base font-neuton text-error">
                {errors.instagram_username?.message}
              </Text>
              <Text className="text-base font-neuton text-neutral">
                {username.length} / {INSTAGRAM_USERNAME_MAX_LENGTH}
              </Text>
            </View>
          </View>
        )}
      />
    </ProfileEditScreen>
  );
}
