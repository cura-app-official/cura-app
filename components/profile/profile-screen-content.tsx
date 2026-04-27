import { AnimatedButton } from "@/components/ui/animated-button";
import { BackButton } from "@/components/ui/back-button";
import {
  ProfileHeaderHero,
  PROFILE_BANNER_ASPECT_RATIO,
} from "@/components/ui/profile-header-hero";
import { ProfileStats } from "@/components/ui/profile-stats";
import { SCREEN_WIDTH } from "@/lib/dimensions";
import type { ItemWithMedia } from "@/services/items";
import type { Tables } from "@/types/database";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  CircleCheckBig,
  CircleDollarSign,
  Ellipsis,
  ListFilter,
  MapPin,
  Settings2,
  Truck,
} from "lucide-react-native";
import { useMemo, useState, type ReactNode } from "react";
import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const HERO_HEIGHT = SCREEN_WIDTH / PROFILE_BANNER_ASPECT_RATIO;
const INSTAGRAM_ICON = require("@/assets/icons/instagram-icon.svg");

const MOCK_ITEM_COLORS: Record<string, { label: string; value: string }> = {
  "item-1": { label: "Cream", value: "#F5E9D6" },
  "item-2": { label: "Blue", value: "#4C6A92" },
  "item-3": { label: "Black", value: "#1F1F1F" },
  "item-4": { label: "Oat", value: "#C8B79B" },
  "item-5": { label: "Gray", value: "#8F8C86" },
  "item-6": { label: "White", value: "#F7F3EA" },
  "item-7": { label: "Black", value: "#1F1F1F" },
  "item-8": { label: "Tan", value: "#B98254" },
  "item-9": { label: "Brown", value: "#7A4A2B" },
  "item-10": { label: "Brown", value: "#7A4A2B" },
  "item-11": { label: "Champagne", value: "#E7D0AD" },
  "item-12": { label: "Olive", value: "#6F7651" },
};

const MOCK_ITEM_STATUSES: Record<string, "available" | "sold"> = {
  "item-4": "sold",
  "item-10": "sold",
};

type StatusFilter = "all" | "available" | "sold";
type SortOption = "newest" | "oldest" | "price-high" | "price-low";
type OrderTab = "all" | "to_pay" | "to_ship" | "to_receive" | "completed";

const ORDER_SHORTCUTS: {
  key: OrderTab;
  label: string;
  icon: typeof ListFilter;
}[] = [
  { key: "all", label: "All", icon: ListFilter },
  { key: "to_pay", label: "To Pay", icon: CircleDollarSign },
  { key: "to_ship", label: "To Ship", icon: ListFilter },
  { key: "to_receive", label: "To Receive", icon: Truck },
  { key: "completed", label: "Completed", icon: CircleCheckBig },
];

interface ProfileScreenContentProps {
  profile: Tables<"users">;
  listings: ItemWithMedia[];
  followers: number;
  following: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  emptyMessage?: string;
}

function uniqueValues(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function getItemColor(item: ItemWithMedia) {
  return MOCK_ITEM_COLORS[item.id] ?? { label: "Neutral", value: "#C8B79B" };
}

function getItemStatus(item: ItemWithMedia) {
  return (
    MOCK_ITEM_STATUSES[item.id] ??
    (item.status === "sold" ? "sold" : "available")
  );
}

function sortListings(listings: ItemWithMedia[], sort: SortOption) {
  return [...listings].sort((a, b) => {
    if (sort === "price-high") return b.price - a.price;
    if (sort === "price-low") return a.price - b.price;

    const aTime = new Date(a.created_at ?? 0).getTime();
    const bTime = new Date(b.created_at ?? 0).getTime();
    return sort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}

function FilterChip({
  label,
  selected,
  onPress,
  left,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  left?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full border ${
        selected ? "bg-accent border-accent" : "bg-muted border-border"
      }`}
    >
      {left}
      <Text
        className={`text-base font-neuton ${
          selected ? "text-white" : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OrdersQuickCard({
  title,
  onViewHistory,
  onSelectTab,
}: {
  title: string;
  onViewHistory: () => void;
  onSelectTab: (tab: OrderTab) => void;
}) {
  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-2xl font-neuton-bold text-foreground">{title}</Text>
        <Pressable onPress={onViewHistory} hitSlop={8}>
          <Text className="text-xl font-neuton text-muted-foreground">
            View history &gt;
          </Text>
        </Pressable>
      </View>
      <View className="rounded-3xl bg-muted border border-border px-3 py-5">
        <View className="flex-row items-start justify-between">
          {ORDER_SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Pressable
                key={`${title}-${shortcut.key}`}
                onPress={() => onSelectTab(shortcut.key)}
                className="flex-1 items-center px-1"
              >
                <Icon size={26} strokeWidth={1.5} color="#1A1A1A" />
                <Text className="text-base font-neuton text-foreground mt-2 text-center">
                  {shortcut.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function ProfileScreenContent({
  profile,
  listings,
  followers,
  following,
  isOwnProfile = false,
  isFollowing = false,
  onFollowPress,
  showBackButton = false,
  showSettingsButton = false,
  emptyMessage = "Pieces will show up here.",
}: ProfileScreenContentProps) {
  const insets = useSafeAreaInsets();
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const isSeller = Boolean(profile.is_seller);
  const instagramLink = profile.instagram_link;

  const categories = useMemo(
    () => uniqueValues(listings.map((item) => item.category)),
    [listings],
  );
  const sizes = useMemo(
    () => uniqueValues(listings.map((item) => item.size)),
    [listings],
  );
  const colors = useMemo(() => {
    const byLabel = new Map<string, { label: string; value: string }>();
    listings.forEach((item) => {
      const color = getItemColor(item);
      byLabel.set(color.label, color);
    });
    return Array.from(byLabel.values());
  }, [listings]);

  const filteredListings = useMemo(() => {
    const filtered = listings.filter((item) => {
      const status = getItemStatus(item);
      const color = getItemColor(item).label;

      return (
        (statusFilter === "all" || statusFilter === status) &&
        (!categoryFilter || item.category === categoryFilter) &&
        (!sizeFilter || item.size === sizeFilter) &&
        (!colorFilter || color === colorFilter)
      );
    });

    return sortListings(filtered, sort);
  }, [categoryFilter, colorFilter, listings, sizeFilter, sort, statusFilter]);

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter(null);
    setSizeFilter(null);
    setColorFilter(null);
    setSort("newest");
  };

  const openInstagram = () => {
    if (!instagramLink) return;
    void Linking.openURL(instagramLink);
  };

  const renderListing = ({ item }: { item: ItemWithMedia }) => {
    const imageUrl = item.item_media?.[0]?.url;

    return (
      <Pressable
        onPress={() => router.push(`/(app)/item/${item.id}`)}
        className="flex-1"
      >
        <View className="w-full aspect-[3/4] rounded-2xl bg-muted overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-base font-neuton text-muted-foreground text-center">
                No image
              </Text>
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          className="text-base font-neuton-bold text-foreground mt-2"
        >
          {item.item_name}
        </Text>
        <Text className="text-base font-neuton text-muted-foreground">
          ฿{item.price.toLocaleString()}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={isSeller ? filteredListings : []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        columnWrapperStyle={{ gap: 8, paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <View className="mb-6">
            <ProfileHeaderHero
              heroHeight={HERO_HEIGHT}
              backgroundUri={profile.background_url}
              avatarUri={profile.avatar_url}
              avatarSize={100}
              avatarBorderWidth={4}
              backgroundOverlay={
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.65)"]}
                  locations={[0.3, 1]}
                  className="absolute inset-0"
                />
              }
              topOverlay={
                <>
                  {showBackButton && (
                    <SafeAreaView
                      edges={["top"]}
                      className="absolute top-0 left-0 right-0"
                    >
                      <View className="px-4 pt-1">
                        <BackButton />
                      </View>
                    </SafeAreaView>
                  )}

                  {showSettingsButton && (
                    <Pressable
                      onPress={() => router.push("/(app)/settings")}
                      style={{ top: insets.top + 8 }}
                      className="absolute right-5 w-11 h-11 rounded-full bg-background/90 border border-border items-center justify-center"
                    >
                      <Ellipsis size={22} strokeWidth={1.5} color="#5B3B1B" />
                    </Pressable>
                  )}
                </>
              }
            />

            <View className="flex-col items-center">
              <Text className="text-3xl font-neuton-bold text-foreground mt-3">
                {profile.username}
              </Text>

              <View className="flex-row items-center justify-center gap-3 mt-5 px-8">
                {isOwnProfile ? (
                  <>
                    {instagramLink && (
                      <AnimatedButton
                        onPress={openInstagram}
                        className="px-6 h-14 bg-transparent border border-border flex-row gap-2"
                      >
                        <Image
                          source={INSTAGRAM_ICON}
                          style={{ width: 20, height: 20 }}
                          contentFit="contain"
                        />
                        <Text className="text-lg font-neuton-bold text-foreground">
                          Instagram
                        </Text>
                      </AnimatedButton>
                    )}
                    <AnimatedButton
                      onPress={() => router.push("/(app)/profile/edit")}
                      className="px-6 h-14 "
                    >
                      <Text className="text-lg font-neuton-bold text-white">
                        Edit Profile
                      </Text>
                    </AnimatedButton>
                  </>
                ) : (
                  <>
                    {instagramLink && (
                      <AnimatedButton
                        onPress={openInstagram}
                        className="px-6 h-14 bg-transparent border border-border flex-row gap-2"
                      >
                        <Image
                          source={INSTAGRAM_ICON}
                          style={{ width: 20, height: 20 }}
                          contentFit="contain"
                        />
                        <Text className="text-lg font-neuton-bold text-foreground">
                          Instagram
                        </Text>
                      </AnimatedButton>
                    )}
                    <AnimatedButton
                      onPress={onFollowPress}
                      className={`px-6 h-14 ${
                        isFollowing ? "bg-muted" : "bg-accent"
                      }`}
                    >
                      <Text
                        className={`text-lg font-neuton-bold ${
                          isFollowing ? "text-foreground" : "text-white"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Text>
                    </AnimatedButton>
                  </>
                )}
              </View>
            </View>

            <View className="px-8 mt-4">
              <ProfileStats
                following={following}
                followers={followers}
                items={isSeller ? listings.length : undefined}
              />
            </View>

            {profile.bio && (
              <View className="mx-6 px-5 py-4 rounded-3xl bg-muted border border-border mt-1">
                <Text className="text-lg font-neuton text-foreground leading-7">
                  {profile.bio}
                </Text>
              </View>
            )}

            {isOwnProfile && (
              <View className="mx-6 mt-6">
                <OrdersQuickCard
                  title="Buying"
                  onViewHistory={() =>
                    router.push({
                      pathname: "/(app)/orders",
                      params: { tab: "completed" },
                    })
                  }
                  onSelectTab={(tab) =>
                    router.push({
                      pathname: "/(app)/orders",
                      params: { tab },
                    })
                  }
                />
                {isSeller && (
                  <OrdersQuickCard
                    title="Selling"
                    onViewHistory={() =>
                      router.push({
                        pathname: "/(app)/orders/selling",
                        params: { tab: "completed" },
                      })
                    }
                    onSelectTab={(tab) =>
                      router.push({
                        pathname: "/(app)/orders/selling",
                        params: { tab },
                      })
                    }
                  />
                )}
                <Pressable
                  onPress={() => router.push("/(app)/address")}
                  className="rounded-3xl border border-border bg-muted px-5 py-4 flex-row items-center gap-3"
                >
                  <MapPin size={22} strokeWidth={1.5} color="#5B3B1B" />
                  <Text className="text-lg font-neuton-bold text-foreground">
                    Shipping Address
                  </Text>
                </Pressable>
              </View>
            )}

            {isSeller && (
              <View className="flex-row items-center justify-between px-6 mt-7 mb-2">
                <View>
                  <Text className="text-xl font-neuton-bold text-foreground">
                    Items on sell
                  </Text>
                  <Text className="text-base font-neuton text-muted-foreground">
                    {listings.length} listings
                  </Text>
                </View>
                <Pressable
                  onPress={() => setFilterOpen(true)}
                  hitSlop={10}
                  className="w-12 h-12 rounded-full bg-muted border border-border items-center justify-center"
                >
                  <Settings2 size={20} strokeWidth={1.5} color="#5B3B1B" />
                </Pressable>
              </View>
            )}
          </View>
        }
        renderItem={renderListing}
        ListEmptyComponent={
          isSeller ? (
            <View className="items-center py-12 px-8">
              <Text className="text-lg font-neuton text-muted-foreground text-center leading-7">
                {listings.length > 0
                  ? "No products match these filters."
                  : emptyMessage}
              </Text>
            </View>
          ) : null
        }
      />

      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable
          onPress={() => setFilterOpen(false)}
          className="flex-1 justify-end bg-black/30"
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="max-h-[85%] bg-background rounded-t-[2rem] px-6 pt-5 pb-8"
          >
            <View className="w-12 h-1.5 rounded-full bg-border self-center mb-5" />
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-neuton-bold text-foreground">
                  Filter products
                </Text>
                <Text className="text-base font-neuton text-muted-foreground mt-1">
                  {listings.length} products from this seller
                </Text>
              </View>
              <Pressable onPress={resetFilters} hitSlop={10}>
                <Text className="text-lg font-neuton-bold text-accent">
                  Reset
                </Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-neuton-bold text-foreground mt-6 mb-3">
                Status
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <FilterChip
                  label="All"
                  selected={statusFilter === "all"}
                  onPress={() => setStatusFilter("all")}
                />
                <FilterChip
                  label="In stock"
                  selected={statusFilter === "available"}
                  onPress={() => setStatusFilter("available")}
                />
                <FilterChip
                  label="Out of stock"
                  selected={statusFilter === "sold"}
                  onPress={() => setStatusFilter("sold")}
                />
              </View>

              <Text className="text-lg font-neuton-bold text-foreground mt-6 mb-3">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    label={category}
                    selected={categoryFilter === category}
                    onPress={() =>
                      setCategoryFilter(
                        categoryFilter === category ? null : category,
                      )
                    }
                  />
                ))}
              </View>

              <Text className="text-lg font-neuton-bold text-foreground mt-6 mb-3">
                Size
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {sizes.map((size) => (
                  <FilterChip
                    key={size}
                    label={size}
                    selected={sizeFilter === size}
                    onPress={() =>
                      setSizeFilter(sizeFilter === size ? null : size)
                    }
                  />
                ))}
              </View>

              <Text className="text-lg font-neuton-bold text-foreground mt-6 mb-3">
                Color
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {colors.map((color) => (
                  <FilterChip
                    key={color.label}
                    label={color.label}
                    selected={colorFilter === color.label}
                    onPress={() =>
                      setColorFilter(
                        colorFilter === color.label ? null : color.label,
                      )
                    }
                    left={
                      <View
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: color.value }}
                      />
                    }
                  />
                ))}
              </View>

              <Text className="text-lg font-neuton-bold text-foreground mt-6 mb-3">
                Sort
              </Text>
              <View className="flex-row flex-wrap gap-2 pb-2">
                <FilterChip
                  label="Date: New to old"
                  selected={sort === "newest"}
                  onPress={() => setSort("newest")}
                />
                <FilterChip
                  label="Date: Old to new"
                  selected={sort === "oldest"}
                  onPress={() => setSort("oldest")}
                />
                <FilterChip
                  label="Price: High to low"
                  selected={sort === "price-high"}
                  onPress={() => setSort("price-high")}
                />
                <FilterChip
                  label="Price: Low to high"
                  selected={sort === "price-low"}
                  onPress={() => setSort("price-low")}
                />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
