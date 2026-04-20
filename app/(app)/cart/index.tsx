import { AnimatedButton } from '@/components/ui/animated-button';
import { BackButton } from '@/components/ui/back-button';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/providers/auth-provider';
import { type CartItemWithDetails, getCartItems, removeFromCart } from '@/services/cart';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => (user ? getCartItems(user.id) : []),
    enabled: !!user,
  });

  const total = cartItems.reduce((sum, ci) => sum + (ci.item?.price ?? 0), 0);

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['in-cart'] });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3">
        <BackButton />
        <Text className="text-lg font-hell-round-bold text-foreground ml-2">
          Cart
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : cartItems.length === 0 ? (
        <EmptyState
          icon="bag-outline"
          title="Your cart is empty"
          description="Browse items and add them to your cart"
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16, paddingBottom: 20 }}
            renderItem={({ item: ci }: { item: CartItemWithDetails }) => (
              <View className="flex-row gap-3">
                <Pressable onPress={() => router.push(`/(app)/item/${ci.item.id}`)}>
                  <Image
                    source={{ uri: ci.item.item_media?.[0]?.url ?? '' }}
                    className="w-24 h-24 rounded-xl bg-muted"
                    contentFit="cover"
                  />
                </Pressable>
                <View className="flex-1 justify-between py-1">
                  <View>
                    <Text className="text-base font-hell-round-bold text-foreground" numberOfLines={1}>
                      {ci.item.item_name}
                    </Text>
                    <Text className="text-sm font-helvetica text-muted-foreground mt-0.5">
                      {ci.item.brand} · {ci.item.size}
                    </Text>
                  </View>
                  <Text className="text-base font-hell-round-bold text-foreground">
                    ₱{ci.item.price.toLocaleString()}
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleRemove(ci.id)}
                  className="self-start pt-1"
                  hitSlop={8}
                >
                  <Ionicons name="close" size={18} color="#A3A3A3" />
                </Pressable>
              </View>
            )}
          />

          <View className="border-t border-border px-6 py-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-base font-helvetica text-muted-foreground">Total</Text>
              <Text className="text-xl font-hell-round-bold text-foreground">
                ₱{total.toLocaleString()}
              </Text>
            </View>
            <AnimatedButton
              onPress={() => router.push('/(app)/checkout')}
              className="h-[4.75rem] justify-center items-center bg-accent"
            >
              <Text className="text-lg font-hell-round-bold text-white">
                Checkout
              </Text>
            </AnimatedButton>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
