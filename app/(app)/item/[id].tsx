import { AnimatedButton } from '@/components/ui/animated-button';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/providers/auth-provider';
import { getItem } from '@/services/items';
import { addToCart, isInCart } from '@/services/cart';
import { isFollowing, toggleFollow } from '@/services/users';
import { isWishlisted, toggleWishlist } from '@/services/wishlist';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(id),
    enabled: !!id,
  });

  const { data: wishlisted = false } = useQuery({
    queryKey: ['wishlisted', user?.id, id],
    queryFn: () => (user ? isWishlisted(user.id, id) : false),
    enabled: !!user && !!id,
  });

  const { data: inCart = false } = useQuery({
    queryKey: ['in-cart', user?.id, id],
    queryFn: () => (user ? isInCart(user.id, id) : false),
    enabled: !!user && !!id,
  });

  const { data: userFollowing = false } = useQuery({
    queryKey: ['following-seller', user?.id, item?.seller_id],
    queryFn: () =>
      user && item ? isFollowing(user.id, item.seller_id) : false,
    enabled: !!user && !!item,
  });

  const handleToggleWishlist = useCallback(async () => {
    if (!user) return;
    await toggleWishlist(user.id, id);
    queryClient.invalidateQueries({ queryKey: ['wishlisted', user.id, id] });
    queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  }, [user, id, queryClient]);

  const handleToggleFollow = useCallback(async () => {
    if (!user || !item) return;
    await toggleFollow(user.id, item.seller_id);
    queryClient.invalidateQueries({
      queryKey: ['following-seller', user.id, item.seller_id],
    });
  }, [user, item, queryClient]);

  const handleAddToCart = useCallback(async () => {
    if (!user) return;
    try {
      await addToCart(user.id, id);
      queryClient.invalidateQueries({ queryKey: ['in-cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch {
      Alert.alert('Error', 'Could not add to cart');
    }
  }, [user, id, queryClient]);

  const handleBuyNow = () => {
    router.push('/(app)/checkout');
  };

  if (isLoading || !item) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </SafeAreaView>
    );
  }

  const images = item.item_media ?? [];

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between px-4 py-2">
          <BackButton color="#1A1A1A" />
          <Pressable onPress={handleToggleWishlist} hitSlop={8}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={24}
              color={wishlisted ? '#FF4747' : '#1A1A1A'}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setCurrentIndex(
              Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
            );
          }}
          renderItem={({ item: media }) => (
            <Image
              source={{ uri: media.url }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.25 }}
              contentFit="cover"
              className="bg-muted"
            />
          )}
          keyExtractor={(m) => m.id}
          scrollEnabled={false}
          nestedScrollEnabled
        />
        {images.length > 1 && (
          <View className="flex-row justify-center gap-1.5 py-3">
            {images.map((_, i) => (
              <View
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === currentIndex ? 'bg-foreground' : 'bg-border'
                }`}
              />
            ))}
          </View>
        )}

        <View className="px-6 pt-4 pb-8">
          <Text className="text-2xl font-hell-round-bold text-foreground">
            {item.item_name}
          </Text>
          <Text className="text-xl font-hell-round-bold text-foreground mt-1">
            ₱{item.price.toLocaleString()}
          </Text>

          <Pressable
            onPress={() => router.push(`/(app)/profile/${item.seller_id}`)}
            className="flex-row items-center gap-3 mt-5 mb-5"
          >
            {item.seller?.avatar_url ? (
              <Image
                source={{ uri: item.seller.avatar_url }}
                className="w-10 h-10 rounded-full bg-muted"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-muted items-center justify-center">
                <Ionicons name="person" size={16} color="#A3A3A3" />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-base font-hell-round-bold text-foreground">
                {item.seller?.username}
              </Text>
            </View>
            <Pressable
              onPress={handleToggleFollow}
              className={`px-4 py-2 rounded-full ${
                userFollowing ? 'bg-muted' : 'bg-accent'
              }`}
            >
              <Text
                className={`text-sm font-hell-round-bold ${
                  userFollowing ? 'text-foreground' : 'text-white'
                }`}
              >
                {userFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </Pressable>

          <View className="gap-4 py-4 border-t border-border">
            <DetailRow label="Condition" value={item.condition} />
            <DetailRow label="Size" value={item.size} />
            <DetailRow label="Brand" value={item.brand} />
            <DetailRow label="Category" value={item.category} />
            {item.damage_type && item.damage_type !== 'No damage' && (
              <DetailRow label="Damage" value={item.damage_type} />
            )}
            {item.damage_details && (
              <DetailRow label="Damage details" value={item.damage_details} />
            )}
            {item.material && (
              <DetailRow label="Material" value={item.material} />
            )}
            {item.measurements && (
              <DetailRow label="Measurements" value={item.measurements} />
            )}
          </View>

          {item.description && (
            <View className="py-4 border-t border-border">
              <Text className="text-sm font-helvetica text-muted-foreground mb-1">
                Description
              </Text>
              <Text className="text-base font-helvetica text-foreground leading-6">
                {item.description}
              </Text>
            </View>
          )}

          <View className="py-4 border-t border-border">
            <Text className="text-xs font-helvetica text-muted-foreground leading-4">
              This is a secondhand item. By purchasing, you acknowledge that the
              item is pre-owned and may show signs of wear as described above.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="border-t border-border bg-background">
        <View className="flex-row gap-2 px-6 py-3">
          {!inCart ? (
            <AnimatedButton
              onPress={handleAddToCart}
              className="flex-1 py-4 items-center bg-muted rounded-xl"
            >
              <Text className="text-sm font-hell-round-bold text-foreground">
                Add to cart
              </Text>
            </AnimatedButton>
          ) : (
            <AnimatedButton
              onPress={() => router.push('/(app)/cart')}
              className="flex-1 py-4 items-center bg-muted rounded-xl"
            >
              <Text className="text-sm font-hell-round-bold text-foreground">
                View cart
              </Text>
            </AnimatedButton>
          )}
          <AnimatedButton
            onPress={handleBuyNow}
            className="flex-1 py-4 items-center bg-accent rounded-xl"
          >
            <Text className="text-sm font-hell-round-bold text-white">
              Buy now
            </Text>
          </AnimatedButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm font-helvetica text-muted-foreground">{label}</Text>
      <Text className="text-sm font-hell-round-bold text-foreground">{value}</Text>
    </View>
  );
}
