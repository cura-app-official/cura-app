import { ItemCard } from "@/components/ui/item-card";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { getItems, type ItemWithMedia } from "@/services/items";
import { getWishlistIds, toggleWishlist } from "@/services/wishlist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Bell, ShoppingBag } from "lucide-react-native";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ["wishlist-ids", user?.id],
    queryFn: () => (user ? getWishlistIds(user.id) : []),
    enabled: !!user,
  });

  const displayItems = items.length > 0 ? items : MOCK_ITEMS;

  const handleToggleWishlist = useCallback(
    async (itemId: string) => {
      if (!user) return;
      await toggleWishlist(user.id, itemId);
      queryClient.invalidateQueries({ queryKey: ["wishlist-ids"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    [user, queryClient],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["items"] });
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ItemWithMedia; index: number }) => {
      const firstMedia = item.item_media?.[0];
      return (
        <View className={`flex-1 ${index % 2 === 0 ? "pr-1.5" : "pl-1.5"}`}>
          <ItemCard
            id={item.id}
            imageUrl={firstMedia?.url ?? ""}
            name={item.item_name}
            price={item.price}
            sellerName={item.seller?.username ?? ""}
            sellerAvatar={item.seller?.avatar_url ?? undefined}
            isWishlisted={wishlistIds.includes(item.id)}
            onToggleWishlist={() => handleToggleWishlist(item.id)}
          />
        </View>
      );
    },
    [wishlistIds, handleToggleWishlist],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => router.push("/(app)/notifications")}
          hitSlop={8}
        >
          <Bell size={24} strokeWidth={1.5} color="#5B3B1B" />
        </Pressable>
        <Text className="text-3xl font-neuton-bold text-foreground tracking-tight">
          cura
        </Text>
        <Pressable onPress={() => router.push("/(app)/cart")} hitSlop={8}>
          <ShoppingBag size={24} strokeWidth={1.5} color="#5B3B1B" />
        </Pressable>
      </View>

      <FlatList
        data={displayItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        columnWrapperStyle={{ marginBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
