import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const BIO_MAX_LENGTH = 160;

export default function EditBioScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSave = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      await updateUser(user.id, { bio: bio.trim() || null });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update bio");
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
          <Pressable onPress={onSave} hitSlop={10} disabled={isSaving}>
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
          <Text className="text-3xl font-neuton-bold text-foreground">Bio</Text>
          <Text className="text-lg font-neuton text-muted-foreground mt-3 mb-5">
            You can edit your bio anytime.
          </Text>

          <View className="rounded-3xl border border-border px-5 py-4 min-h-[170px]">
            <TextInput
              ref={inputRef}
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={BIO_MAX_LENGTH}
              placeholder="My account is all about..."
              placeholderTextColor="#858585"
              selectionColor="#5B3B1B"
              className="min-h-[130px] text-xl font-neuton text-foreground"
              style={{ textAlignVertical: "top" }}
            />
          </View>
          <Text className="text-base font-neuton text-neutral text-right mt-2">
            {bio.length} / {BIO_MAX_LENGTH}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
