import { BackButton } from "@/components/ui/back-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3 gap-3">
        <BackButton />
        <Text className="text-xl font-neuton-bold text-foreground">
          Notifications
        </Text>
      </View>

      <EmptyState
        icon={Bell}
        title="No notifications yet"
        description="We'll notify you when something important happens"
      />
    </SafeAreaView>
  );
}
