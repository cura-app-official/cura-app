import { AnimatedButton } from "@/components/ui/animated-button";
import { BackButton } from "@/components/ui/back-button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ProfileStats } from "@/components/ui/profile-stats";
import {
    MOCK_FOLLOWER_COUNTS,
    MOCK_FOLLOWING_COUNTS,
    MOCK_ITEMS,
    MOCK_USERS,
} from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { getItemsBySeller, type ItemWithMedia } from "@/services/items";
import {
    getFollowerCount,
    getFollowingCount,
    getUser,
    isFollowing,
    toggleFollow,
} from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import { useCallback } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = SCREEN_WIDTH * 1.05;

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mockUser = MOCK_USERS.find((u) => u.id === id);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUser(id),
    enabled: !!id && !mockUser,
  });

  const { data: followers = 0 } = useQuery({
    queryKey: ["followers", id],
    queryFn: () => getFollowerCount(id),
    enabled: !!id && !mockUser,
  });

  const { data: following = 0 } = useQuery({
    queryKey: ["following", id],
    queryFn: () => getFollowingCount(id),
    enabled: !!id && !mockUser,
  });

  const { data: userFollowing = false } = useQuery({
    queryKey: ["following-user", user?.id, id],
    queryFn: () => (user ? isFollowing(user.id, id) : false),
    enabled: !!user && !!id && user.id !== id && !mockUser,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ["user-listings", id],
    queryFn: () => getItemsBySeller(id),
    enabled: !!id && !mockUser,
  });

  const displayProfile = mockUser ?? profile;
  const displayFollowers = mockUser
    ? (MOCK_FOLLOWER_COUNTS[id] ?? 0)
    : followers;
  const displayFollowing = mockUser
    ? (MOCK_FOLLOWING_COUNTS[id] ?? 0)
    : following;
  const displayListings = mockUser
    ? MOCK_ITEMS.filter((i) => i.seller_id === id)
    : listings;

  const handleToggleFollow = useCallback(async () => {
    if (!user || mockUser) return;
    await toggleFollow(user.id, id);
    queryClient.invalidateQueries({ queryKey: ["following-user"] });
    queryClient.invalidateQueries({ queryKey: ["followers", id] });
  }, [user, id, queryClient, mockUser]);

  if (!mockUser && (isLoading || !profile)) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  if (!displayProfile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={displayListings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        columnWrapperStyle={{ gap: 8, paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Hero section */}
            <View style={{ height: HERO_HEIGHT }} className="relative">
              {displayProfile.background_url ? (
                <Image
                  source={{ uri: displayProfile.background_url }}
                  className="absolute inset-0"
                  contentFit="cover"
                />
              ) : (
                <View className="absolute inset-0 bg-neutral-200" />
              )}

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.65)"]}
                locations={[0.3, 1]}
                className="absolute inset-0"
              />

              {/* Back button */}
              <SafeAreaView
                edges={["top"]}
                className="absolute top-0 left-0 right-0"
              >
                <View className="px-4 pt-1">
                  <BackButton className="bg-black/30" />
                </View>
              </SafeAreaView>

              {/* Name overlay */}
              <View className="absolute bottom-20 left-0 right-0 items-center px-6">
                <Text className="text-4xl font-neuton-bold text-white text-center">
                  {displayProfile.username}
                </Text>
                <Text className="text-base font-neuton text-white/70 mt-1">
                  @{displayProfile.username}
                </Text>
              </View>
            </View>

            {/* Avatar */}
            <View className="items-center -mt-14 z-10">
              <ProfileAvatar
                uri={displayProfile.avatar_url}
                size={96}
                borderWidth={2}
              />
            </View>

            {/* Action buttons */}
            {!isOwnProfile && (
              <View className="flex-row items-center justify-center gap-3 mt-5 px-8">
                <AnimatedButton
                  onPress={handleToggleFollow}
                  className={`flex-1 h-14 ${userFollowing ? "bg-gray-100" : "bg-accent"}`}
                >
                  <Text
                    className={`text-base font-neuton-bold ${
                      userFollowing ? "text-foreground" : "text-white"
                    }`}
                  >
                    {userFollowing ? "Following" : "Follow"}
                  </Text>
                </AnimatedButton>
                <AnimatedButton className="w-14 h-14 bg-gray-100">
                  <MessageCircle size={20} strokeWidth={1} color="#5B3B1B" />
                </AnimatedButton>
              </View>
            )}

            {/* Stats */}
            <View className="px-8 mt-4">
              <ProfileStats
                following={displayFollowing}
                followers={displayFollowers}
                items={displayListings.length}
              />
            </View>

            {/* Bio */}
            {displayProfile.bio && (
              <View className="mx-6 px-5 py-4 rounded-3xl bg-gray-100 mt-1">
                <Text className="text-base font-neuton text-foreground leading-6">
                  {displayProfile.bio}
                </Text>
              </View>
            )}

            {displayListings.length > 0 && (
              <Text className="text-lg font-neuton-bold text-foreground px-6 mt-7 mb-2">
                Listings
              </Text>
            )}
          </View>
        }
        renderItem={({ item }: { item: ItemWithMedia }) => (
          <Pressable
            onPress={() => router.push(`/(app)/item/${item.id}`)}
            className="flex-1"
          >
            <Image
              source={{ uri: item.item_media?.[0]?.url ?? "" }}
              className="w-full aspect-[3/4] rounded-2xl bg-muted"
              contentFit="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
}
