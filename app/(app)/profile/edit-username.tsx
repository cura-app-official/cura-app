import {
  ProfileEditScreen,
  useAutoFocusTextInput,
} from "@/components/ui/profile-edit-screen";
import { Input } from "@/components/ui/input";
import { USERNAME_DISALLOWED_CHARS_REGEX } from "@/lib/regex";
import { usernameSchema, type UsernameForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { checkUsernameAvailable, updateUser } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput } from "react-native";

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

  useAutoFocusTextInput(inputRef);

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
    <ProfileEditScreen
      title="Username"
      description="Use lowercase letters, numbers, underscores, and dots."
      isSaving={isSaving}
      onSave={handleSubmit(onSave)}
      keyboardAvoiding
    >
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Input
              ref={inputRef}
              label="Username"
              value={value}
              onBlur={onBlur}
              onChangeText={(text) =>
                onChange(
                  text.toLowerCase().replace(USERNAME_DISALLOWED_CHARS_REGEX, ""),
                )
              }
              error={errors.username?.message}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={USERNAME_MAX_LENGTH}
              placeholder="username"
            />
            <Text className="text-base font-neuton text-neutral text-right mt-2">
              {username.length} / {USERNAME_MAX_LENGTH}
            </Text>
          </>
        )}
      />
    </ProfileEditScreen>
  );
}
