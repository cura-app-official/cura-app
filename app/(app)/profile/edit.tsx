import { BackButton } from "@/components/ui/back-button";
import { extractInstagramUsername } from "@/lib/instagram";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/users";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, ChevronRight, User } from "lucide-react-native";
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

  const pickImage = async (field: "avatar_url" | "background_url") => {
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: field === "avatar_url" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      await updateUser(user.id, { [field]: result.assets[0].uri });
      await refreshProfile();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update image");
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
          <Text className="text-2xl font-neuton-bold text-foreground">
            Edit Profile
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Pressable
              onPress={() => pickImage("background_url")}
              className="relative h-[256px] rounded-3xl bg-muted border border-border overflow-hidden"
            >
              {profile?.background_url && (
                <Image
                  source={{ uri: profile.background_url }}
                  className="absolute inset-0"
                  contentFit="cover"
                />
              )}
              <View
                className={`absolute inset-0 items-center justify-center ${
                  profile?.background_url ? "bg-black/15" : "bg-muted"
                }`}
              >
                <Camera
                  size={26}
                  strokeWidth={1.5}
                  color={profile?.background_url ? "#FFF7EC" : "#8A6B4D"}
                />
              </View>
            </Pressable>

            <View className="items-center -mt-16">
              <Pressable
                onPress={() => pickImage("avatar_url")}
                className="relative"
              >
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-32 h-32 rounded-full bg-muted border-2 border-background"
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-32 h-32 rounded-full bg-muted border-2 border-background items-center justify-center">
                    <User size={36} strokeWidth={1.5} color="#8A6B4D" />
                  </View>
                )}
                <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent items-center justify-center border-2 border-background">
                  <Camera size={16} strokeWidth={1.5} color="#FFF7EC" />
                </View>
              </Pressable>
            </View>
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
