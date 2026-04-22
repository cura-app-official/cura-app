import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
    ChevronRight,
    CircleHelp,
    FileText,
    LogOut,
    MapPin,
    Package,
    Shield,
    Store,
    UserPen,
} from "lucide-react-native";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingsRow({
  icon: Icon,
  label,
  onPress,
  destructive,
}: SettingsRowProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-5 gap-4">
      <View className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center">
        <Icon
          size={24}
          strokeWidth={2}
          color={destructive ? "#FF4747" : "#282828"}
        />
      </View>
      <Text
        className={`flex-1 text-lg font-neuton ${
          destructive ? "text-error" : "text-foreground"
        }`}
      >
        {label}
      </Text>
      <ChevronRight size={20} strokeWidth={2.5} color="#D4D4D4" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { signOut, profile } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3 gap-3">
        <BackButton />
        <Text className="text-xl font-neuton-bold text-foreground">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-6">
          <Text className="text-sm font-neuton-bold text-muted-foreground mb-4 uppercase tracking-wider">
            Account
          </Text>
          <SettingsRow
            icon={UserPen}
            label="Edit profile"
            onPress={() => router.push("/(app)/profile/edit")}
          />
          <SettingsRow
            icon={MapPin}
            label="Shopping Info"
            onPress={() => router.push("/(app)/address")}
          />
          <SettingsRow
            icon={Package}
            label="My Orders"
            onPress={() => router.push("/(app)/orders")}
          />
          {!profile?.is_seller && (
            <SettingsRow
              icon={Store}
              label="Become a Seller"
              onPress={() => router.push("/(app)/seller/apply")}
            />
          )}
        </View>

        <View className="px-6 mt-10">
          <Text className="text-sm font-neuton-bold text-muted-foreground mb-4 uppercase tracking-wider">
            Support
          </Text>
          <SettingsRow
            icon={CircleHelp}
            label="Help Center"
            onPress={() => {}}
          />
          <SettingsRow
            icon={FileText}
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingsRow
            icon={Shield}
            label="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        <View className="px-6 mt-10">
          <SettingsRow
            icon={LogOut}
            label="Sign out"
            onPress={handleSignOut}
            destructive
          />
        </View>

        <Text className="text-sm font-neuton text-muted-foreground text-center mt-12 pb-10">
          Cura v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
