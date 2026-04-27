import { BackButton } from "@/components/ui/back-button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/providers/auth-provider";
import { getOrders, type OrderWithDetails } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Package } from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = [
  { key: "to_pay", label: "To Pay" },
  { key: "to_ship", label: "To Ship" },
  { key: "to_receive", label: "To Receive" },
  { key: "completed", label: "Completed" },
] as const;

export default function OrdersScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("to_pay");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id, activeTab],
    queryFn: () => (user ? getOrders(user.id, activeTab) : []),
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "to_pay":
        return "text-error";
      case "to_ship":
        return "text-yellow-600";
      case "to_receive":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3 gap-3">
        <BackButton />
        <Text className="text-2xl font-neuton-bold text-foreground">
          My Orders
        </Text>
      </View>

      <View className="flex-row px-6 gap-2 mb-3">
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 items-center rounded-3xl ${
              activeTab === tab.key
                ? "bg-accent"
                : "bg-muted border border-border"
            }`}
          >
            <Text
              className={`text-base font-neuton-bold ${
                activeTab === tab.key ? "text-white" : "text-foreground"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description={`You have no ${activeTab.replace("_", " ")} orders`}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            gap: 12,
            paddingBottom: 20,
          }}
          renderItem={({ item: order }: { item: OrderWithDetails }) => (
            <View className="p-5 rounded-3xl bg-muted border border-border">
              <View className="flex-row gap-4">
                <Image
                  source={{ uri: order.item?.item_media?.[0]?.url ?? "" }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 16,
                    backgroundColor: "#E8D8A8",
                  }}
                  contentFit="cover"
                />
                <View className="flex-1">
                  <Text
                    className="text-lg font-neuton-bold text-foreground"
                    numberOfLines={1}
                  >
                    {order.item?.item_name}
                  </Text>
                  <Text className="text-lg font-neuton text-muted-foreground mt-0.5">
                    ฿{order.total_amount.toLocaleString()}
                  </Text>
                  <Text
                    className={`text-base font-neuton-bold mt-1.5 ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
