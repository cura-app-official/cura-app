import {
  ProfileEditScreen,
  useAutoFocusTextInput,
} from "@/components/ui/profile-edit-screen";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, TextInput } from "react-native";

const BIO_MAX_LENGTH = 160;

export default function EditBioScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useAutoFocusTextInput(inputRef);

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
    <ProfileEditScreen
      title="Bio"
      description="You can edit your bio anytime."
      isSaving={isSaving}
      onSave={onSave}
      keyboardAvoiding
    >
      <Input
        ref={inputRef}
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={BIO_MAX_LENGTH}
        placeholder="My account is all about..."
        fieldClassName="min-h-[170px]"
        className="min-h-[130px] max-h-[200px]"
      />
      <Text className="text-base font-neuton text-neutral text-right mt-2">
        {bio.length} / {BIO_MAX_LENGTH}
      </Text>
    </ProfileEditScreen>
  );
}
