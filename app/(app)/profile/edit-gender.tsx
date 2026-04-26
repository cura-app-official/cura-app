import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Non-binary" },
  { label: "Prefer not to say", value: "Prefer not to say" },
] as const;

export default function EditGenderScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedGender, setSelectedGender] = useState(profile?.gender ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    try {
      await updateUser(user.id, { gender: selectedGender || null });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update gender");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
        <Text className="text-3xl font-neuton-bold text-foreground">Gender</Text>
        <Text className="text-lg font-neuton text-muted-foreground mt-3 mb-6">
          Choose how you would like to appear in your profile.
        </Text>

        <View className="gap-3">
          {GENDER_OPTIONS.map((gender) => {
            const isSelected = selectedGender === gender.value;
            return (
              <Pressable
                key={gender.value}
                onPress={() => setSelectedGender(gender.value)}
                className={`rounded-3xl border px-5 py-4 ${
                  isSelected ? "bg-accent border-accent" : "bg-muted border-border"
                }`}
              >
                <Text
                  className={`text-xl font-neuton ${
                    isSelected ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {gender.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
