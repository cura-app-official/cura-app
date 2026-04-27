import { ProfileEditScreen } from "@/components/ui/profile-edit-screen";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

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
    <ProfileEditScreen
      title="Gender"
      description="Choose how you would like to appear in your profile."
      isSaving={isSaving}
      onSave={onSave}
      descriptionClassName="mb-6"
    >
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
    </ProfileEditScreen>
  );
}
