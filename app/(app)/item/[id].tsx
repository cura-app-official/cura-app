import { AnimatedButton } from "@/components/ui/animated-button";
import { BackButton } from "@/components/ui/back-button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { addToCart, isInCart } from "@/services/cart";
import { getItem } from "@/services/items";
import { isFollowing, toggleFollow } from "@/services/users";
import { isWishlisted, toggleWishlist } from "@/services/wishlist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Heart } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockItem = MOCK_ITEMS.find((i) => i.id === id);

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    enabled: !!id && !mockItem,
  });

  const displayItem = mockItem ?? item;

  const { data: wishlisted = false } = useQuery({
    queryKey: ["wishlisted", user?.id, id],
    queryFn: () => (user ? isWishlisted(user.id, id) : false),
    enabled: !!user && !!id && !mockItem,
  });

  const { data: inCart = false } = useQuery({
    queryKey: ["in-cart", user?.id, id],
    queryFn: () => (user ? isInCart(user.id, id) : false),
    enabled: !!user && !!id && !mockItem,
  });

  const { data: userFollowing = false } = useQuery({
    queryKey: ["following-seller", user?.id, displayItem?.seller_id],
    queryFn: () =>
      user && displayItem ? isFollowing(user.id, displayItem.seller_id) : false,
    enabled: !!user && !!displayItem && !mockItem,
  });

  const handleToggleWishlist = useCallback(async () => {
    if (!user || mockItem) return;
    await toggleWishlist(user.id, id);
    queryClient.invalidateQueries({ queryKey: ["wishlisted", user.id, id] });
    queryClient.invalidateQueries({ queryKey: ["wishlist-ids"] });
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });
  }, [user, id, queryClient, mockItem]);

  const handleToggleFollow = useCallback(async () => {
    if (!user || !displayItem || mockItem) return;
    await toggleFollow(user.id, displayItem.seller_id);
    queryClient.invalidateQueries({
      queryKey: ["following-seller", user.id, displayItem.seller_id],
    });
  }, [user, displayItem, queryClient, mockItem]);

  const handleAddToCart = useCallback(async () => {
    if (!user || mockItem) return;
    try {
      await addToCart(user.id, id);
      queryClient.invalidateQueries({ queryKey: ["in-cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch {
      Alert.alert("Error", "Could not add to cart");
    }
  }, [user, id, queryClient, mockItem]);

  const handleBuyNow = () => {
    if (mockItem) return;
    router.push("/(app)/checkout");
  };

  if (!mockItem && (isLoading || !item)) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#5B3B1B" />
      </View>
    );
  }

  if (!displayItem) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#5B3B1B" />
      </View>
    );
  }

  const images = displayItem.item_media ?? [];

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="flex-row items-center justify-between px-4 py-2">
          <BackButton />
          <Pressable
            onPress={handleToggleWishlist}
            hitSlop={8}
            className="w-12 h-12 rounded-full bg-background items-center justify-center"
          >
            <Heart
              size={22}
              strokeWidth={1.5}
              color={wishlisted ? "#FF4747" : "#5B3B1B"}
              fill={wishlisted ? "#FF4747" : "transparent"}
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
              Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH),
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
          scrollEnabled={images.length > 1}
          nestedScrollEnabled
        />
        {images.length > 1 && (
          <View className="flex-row justify-center gap-2 py-4">
            {images.map((_, i) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-foreground" : "bg-border"
                }`}
              />
            ))}
          </View>
        )}

        <View className="px-6 pt-5 pb-8">
          <Text className="text-3xl font-neuton-bold text-foreground">
            {displayItem.item_name}
          </Text>
          <Text className="text-2xl font-neuton-bold text-foreground mt-2">
            ฿{displayItem.price.toLocaleString()}
          </Text>

          {/* Seller row */}
          <Pressable
            onPress={() =>
              router.push(`/(app)/profile/${displayItem.seller_id}`)
            }
            className="flex-row items-center gap-4 mt-6 mb-6"
          >
            <ProfileAvatar
              uri={displayItem.seller?.avatar_url}
              size={44}
              borderWidth={0}
            />
            <View className="flex-1">
              <Text className="text-lg font-neuton-bold text-foreground">
                {displayItem.seller?.username}
              </Text>
            </View>
            <Pressable
              onPress={handleToggleFollow}
              className={`px-5 py-2.5 rounded-3xl ${
                userFollowing ? "bg-muted border border-border" : "bg-accent"
              }`}
            >
              <Text
                className={`text-base font-neuton-bold ${
                  userFollowing ? "text-foreground" : "text-white"
                }`}
              >
                {userFollowing ? "Following" : "Follow"}
              </Text>
            </Pressable>
          </Pressable>

          {/* Details */}
          <View className="gap-4 py-5 border-t border-border">
            <DetailRow label="Condition" value={displayItem.condition} />
            <DetailRow label="Size" value={displayItem.size} />
            <DetailRow label="Brand" value={displayItem.brand} />
            <DetailRow label="Category" value={displayItem.category} />
            {displayItem.damage_type &&
              displayItem.damage_type !== "No damage" && (
                <DetailRow label="Damage" value={displayItem.damage_type} />
              )}
            {displayItem.damage_details && (
              <DetailRow
                label="Damage details"
                value={displayItem.damage_details}
              />
            )}
            {displayItem.material && (
              <DetailRow label="Material" value={displayItem.material} />
            )}
            {displayItem.measurements && (
              <DetailRow
                label="Measurements"
                value={displayItem.measurements}
              />
            )}
          </View>

          {displayItem.description && (
            <View className="py-5 border-t border-border">
              <Text className="text-base font-neuton-bold text-muted-foreground mb-2">
                Description
              </Text>
              <Text className="text-base font-neuton text-foreground leading-6">
                {displayItem.description}
              </Text>
            </View>
          )}

          <View className="py-5 border-t border-border">
            <Text className="text-sm font-neuton text-muted-foreground leading-5">
              This is a secondhand item. By purchasing, you acknowledge that the
              item is pre-owned and may show signs of wear as described above.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView
        edges={["bottom"]}
        className="border-t border-border bg-background"
      >
        <View className="flex-row gap-3 px-6 py-3">
          {!inCart ? (
            <AnimatedButton
              onPress={handleAddToCart}
              className="flex-1 h-14 bg-muted border border-border"
            >
              <Text className="text-base font-neuton-bold text-foreground">
                Add to cart
              </Text>
            </AnimatedButton>
          ) : (
            <AnimatedButton
              onPress={() => router.push("/(app)/cart")}
              className="flex-1 h-14 bg-muted border border-border"
            >
              <Text className="text-base font-neuton-bold text-foreground">
                View cart
              </Text>
            </AnimatedButton>
          )}
          <AnimatedButton
            onPress={handleBuyNow}
            className="flex-1 h-14 bg-accent"
          >
            <Text className="text-base font-neuton-bold text-background">
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
      <Text className="text-base font-neuton text-muted-foreground">
        {label}
      </Text>
      <Text className="text-base font-neuton-bold text-foreground">
        {value}
      </Text>
    </View>
  );
}
