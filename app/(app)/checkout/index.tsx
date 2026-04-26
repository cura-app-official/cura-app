import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/providers/auth-provider";
import { getDefaultAddress } from "@/services/addresses";
import { clearCart, getCartItems } from "@/services/cart";
import { createOrder } from "@/services/orders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronRight, Plus } from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => (user ? getCartItems(user.id) : []),
    enabled: !!user,
  });

  const { data: defaultAddress, isLoading: addressLoading } = useQuery({
    queryKey: ["default-address", user?.id],
    queryFn: () => (user ? getDefaultAddress(user.id) : null),
    enabled: !!user,
  });

  const total = cartItems.reduce((sum, ci) => sum + (ci.item?.price ?? 0), 0);

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!defaultAddress) {
      Alert.alert("No address", "Please add a shipping address first.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add address",
          onPress: () => router.push("/(app)/address/add"),
        },
      ]);
      return;
    }

    setIsSubmitting(true);
    try {
      for (const ci of cartItems) {
        await createOrder({
          buyer_id: user.id,
          seller_id: ci.item.seller_id,
          item_id: ci.item.id,
          address_id: defaultAddress.id,
          total_amount: ci.item.price,
        });
      }
      await clearCart(user.id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      Alert.alert("Order placed", "Your order has been placed successfully!", [
        { text: "OK", onPress: () => router.replace("/(app)/orders") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading || addressLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3 gap-3">
        <BackButton />
        <Text className="text-2xl font-neuton-bold text-foreground">
          Checkout
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          <Text className="text-lg font-neuton-bold text-foreground mb-3">
            Shipping Address
          </Text>
          {defaultAddress ? (
            <Pressable
              onPress={() => router.push("/(app)/address")}
              className="p-5 rounded-3xl bg-gray-100 flex-row items-center"
            >
              <View className="flex-1">
                <Text className="text-lg font-neuton-bold text-foreground">
                  {defaultAddress.name}
                </Text>
                <Text className="text-lg font-neuton text-muted-foreground mt-0.5">
                  {defaultAddress.phone_number}
                </Text>
                <Text className="text-lg font-neuton text-foreground mt-1">
                  {defaultAddress.address}
                </Text>
              </View>
              <ChevronRight size={20} strokeWidth={1.5} color="#A3A3A3" />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/(app)/address/add")}
              className="p-5 rounded-3xl bg-gray-100 flex-row items-center justify-center gap-2"
            >
              <Plus size={20} strokeWidth={1.5} color="#5B3B1B" />
              <Text className="text-lg font-neuton-bold text-foreground">
                Add shipping address
              </Text>
            </Pressable>
          )}

          <Text className="text-lg font-neuton-bold text-foreground mt-8 mb-4">
            Items
          </Text>
          <View className="gap-4">
            {cartItems.map((ci) => (
              <View key={ci.id} className="flex-row gap-4">
                <Image
                  source={{ uri: ci.item.item_media?.[0]?.url ?? "" }}
                  className="w-20 h-20 rounded-2xl bg-muted"
                  contentFit="cover"
                />
                <View className="flex-1 justify-center">
                  <Text
                    className="text-lg font-neuton-bold text-foreground"
                    numberOfLines={1}
                  >
                    {ci.item.item_name}
                  </Text>
                  <Text className="text-lg font-neuton text-muted-foreground mt-0.5">
                    ฿{ci.item.price.toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between mt-8 py-5 border-t border-border">
            <Text className="text-lg font-neuton text-muted-foreground">
              Total
            </Text>
            <Text className="text-2xl font-neuton-bold text-foreground">
              ฿{total.toLocaleString()}
            </Text>
          </View>

          <View className="py-4 border-t border-border">
            <Text className="text-base font-neuton text-muted-foreground leading-6">
              By placing this order, you agree that all items are secondhand and
              may show signs of wear as described in their listings. All sales
              are final.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 border-t border-border pt-4">
        <AnimatedLoadingButton
          isSubmitting={isSubmitting}
          onPress={handlePlaceOrder}
          title="Place order"
          disabled={cartItems.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}
