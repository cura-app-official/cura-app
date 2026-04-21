import { ItemCard } from '@/components/ui/item-card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/providers/auth-provider';
import type { ItemWithMedia } from '@/services/items';
import { getWishlistIds, getWishlistItems, toggleWishlist } from '@/services/wishlist';
import { Heart } from 'lucide-react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => (user ? getWishlistItems(user.id) : []),
    enabled: !!user,
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4">
        <Text className="text-3xl font-hell-round-bold text-foreground">
          Wishlist
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love and come back to them later"
        />
      ) : (
        <FlatList
          data={items}
          renderItem={({ item, index }: { item: ItemWithMedia; index: number }) => (
            <View className={`flex-1 ${index % 2 === 0 ? 'pr-1.5' : 'pl-1.5'}`}>
              <ItemCard
                id={item.id}
                imageUrl={item.item_media?.[0]?.url ?? ''}
                name={item.item_name}
                price={item.price}
                sellerName={item.seller?.username ?? ''}
                sellerAvatar={item.seller?.avatar_url ?? undefined}
                isWishlisted={wishlistIds.includes(item.id)}
                onToggleWishlist={() => handleToggleWishlist(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          columnWrapperStyle={{ marginBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
