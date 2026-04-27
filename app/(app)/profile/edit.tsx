import { BackButton } from "@/components/ui/back-button";
import {
  ProfileHeaderHero,
  PROFILE_BANNER_ASPECT_RATIO,
} from "@/components/ui/profile-header-hero";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { extractInstagramUsername } from "@/lib/instagram";
import { SCREEN_WIDTH } from "@/lib/dimensions";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatGender(gender?: string | null) {
  if (!gender) return "";
  return gender === "Non-binary" ? "Other" : gender;
}

const HERO_HEIGHT = SCREEN_WIDTH / PROFILE_BANNER_ASPECT_RATIO;
const BANNER_PICKER_ASPECT: [number, number] = [3, 2];

function ProfileRow({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value?: string | null;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-5 py-5">
      <Text className="w-28 text-xl font-neuton text-foreground">{label}</Text>
      <Text
        className={`flex-1 text-xl font-neuton ${
          value ? "text-foreground" : "text-neutral"
        }`}
        numberOfLines={label === "Bio" ? 2 : 1}
      >
        {value || placeholder}
      </Text>
      <ChevronRight size={22} strokeWidth={1.5} color="#858585" />
    </Pressable>
  );
}

export default function EditProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const instagramUsername = extractInstagramUsername(profile?.instagram_link);
  const [pendingAvatarUri, setPendingAvatarUri] = useState<string | null>(null);
  const [pendingBackgroundUri, setPendingBackgroundUri] = useState<string | null>(
    null,
  );
  const [isSavingImages, setIsSavingImages] = useState(false);
  const hasPendingImages = Boolean(pendingAvatarUri || pendingBackgroundUri);

  const pickImage = async (field: "avatar_url" | "background_url") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to select an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: field === "avatar_url" ? [1, 1] : BANNER_PICKER_ASPECT,
      quality: 0.8,
    });

    if (result.canceled) return;
    const selectedUri = result.assets[0]?.uri;
    if (!selectedUri) return;

    if (field === "avatar_url") {
      setPendingAvatarUri(selectedUri);
      return;
    }

    setPendingBackgroundUri(selectedUri);
  };

  const handleSaveImages = async () => {
    if (!user || !hasPendingImages || isSavingImages) return;

    try {
      setIsSavingImages(true);

      await updateUser(user.id, {
        ...(pendingAvatarUri ? { avatar_url: pendingAvatarUri } : {}),
        ...(pendingBackgroundUri
          ? { background_url: pendingBackgroundUri }
          : {}),
      });
      await refreshProfile();
      setPendingAvatarUri(null);
      setPendingBackgroundUri(null);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update image");
    } finally {
      setIsSavingImages(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-6 py-3 gap-3">
          <BackButton />
          <View className="flex-1 flex-row items-center justify-between">
            <Text className="text-2xl font-neuton-bold text-foreground">
              Edit Profile
            </Text>
            <Pressable
              onPress={handleSaveImages}
              disabled={!hasPendingImages || isSavingImages}
              hitSlop={10}
            >
              <Text
                className={`text-xl font-neuton-bold ${
                  hasPendingImages && !isSavingImages
                    ? "text-accent"
                    : "text-neutral"
                }`}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <ProfileHeaderHero
              heroHeight={HERO_HEIGHT}
              backgroundUri={pendingBackgroundUri ?? profile?.background_url}
              avatarSize={128}
              avatarBorderWidth={4}
              onBackgroundPress={() => pickImage("background_url")}
              onAvatarPress={() => pickImage("avatar_url")}
              backgroundOverlay={
                <View
                  className={`absolute inset-0 items-center justify-center ${
                    pendingBackgroundUri ?? profile?.background_url
                      ? "bg-black/15"
                      : "bg-muted"
                  }`}
                >
                  <Camera
                    size={26}
                    strokeWidth={1.5}
                    color={
                      pendingBackgroundUri ?? profile?.background_url
                        ? "#FFF7EC"
                        : "#8A6B4D"
                    }
                  />
                </View>
              }
              renderAvatar={() =>
                pendingAvatarUri ?? profile?.avatar_url ? (
                  <View className="relative">
                    <Image
                      source={{ uri: pendingAvatarUri ?? profile?.avatar_url ?? "" }}
                      style={{
                        width: 128,
                        height: 128,
                        borderRadius: 64,
                        borderWidth: 4,
                        borderColor: "#F3E8D8",
                        backgroundColor: "#F5EBDD",
                      }}
                      contentFit="cover"
                    />
                    <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent items-center justify-center border-2 border-background">
                      <Camera size={16} strokeWidth={1.5} color="#FFF7EC" />
                    </View>
                  </View>
                ) : (
                  <View className="relative">
                    <ProfileAvatar
                      uri={null}
                      size={128}
                      borderWidth={4}
                    />
                    <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent items-center justify-center border-2 border-background">
                      <Camera size={16} strokeWidth={1.5} color="#FFF7EC" />
                    </View>
                  </View>
                )
              }
            />
          </View>

          <View className="rounded-3xl overflow-hidden border border-border mb-10">
            <ProfileRow
              label="Username"
              value={profile?.username}
              placeholder="Add username"
              onPress={() => router.push("/(app)/profile/edit-username")}
            />
            <ProfileRow
              label="Bio"
              value={profile?.bio}
              placeholder="Write a short description about who you are"
              onPress={() => router.push("/(app)/profile/edit-bio")}
            />
            <ProfileRow
              label="Instagram"
              value={
                instagramUsername ? `instagram.com/${instagramUsername}` : ""
              }
              placeholder="Add Instagram"
              onPress={() => router.push("/(app)/profile/edit-instagram")}
            />
            <ProfileRow
              label="Gender"
              value={formatGender(profile?.gender)}
              placeholder="Add gender"
              onPress={() => router.push("/(app)/profile/edit-gender")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
