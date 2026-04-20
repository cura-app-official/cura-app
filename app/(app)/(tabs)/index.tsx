import { ItemCard } from '@/components/ui/item-card';
import { useAuth } from '@/providers/auth-provider';
import { getItems, type ItemWithMedia } from '@/services/items';
import { getWishlistIds, toggleWishlist } from '@/services/wishlist';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlist-ids', user?.id],
    queryFn: () => (user ? getWishlistIds(user.id) : []),
    enabled: !!user,
  });

  const handleToggleWishlist = useCallback(
    async (itemId: string) => {
      if (!user) return;
      await toggleWishlist(user.id, itemId);
      queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    [user, queryClient]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['items'] });
    setRefreshing(false);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ItemWithMedia; index: number }) => {
      const firstMedia = item.item_media?.[0];
      return (
        <View className={`flex-1 ${index % 2 === 0 ? 'pr-1.5' : 'pl-1.5'}`}>
          <ItemCard
            id={item.id}
            imageUrl={firstMedia?.url ?? ''}
            name={item.item_name}
            price={item.price}
            sellerName={item.seller?.username ?? ''}
            sellerAvatar={item.seller?.avatar_url ?? undefined}
            isWishlisted={wishlistIds.includes(item.id)}
            onToggleWishlist={() => handleToggleWishlist(item.id)}
          />
        </View>
      );
    },
    [wishlistIds, handleToggleWishlist]
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text className="text-2xl font-hell-round-bold text-foreground tracking-tight">
          cura
        </Text>
        <Pressable onPress={() => router.push('/(app)/cart')} hitSlop={8}>
          <Ionicons name="bag-outline" size={24} color="#1A1A1A" />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          columnWrapperStyle={{ marginBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
