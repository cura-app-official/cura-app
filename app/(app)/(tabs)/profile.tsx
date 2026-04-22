import { AnimatedButton } from "@/components/ui/animated-button";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ProfileStats } from "@/components/ui/profile-stats";
import { MOCK_ITEMS, MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { getItemsBySeller, type ItemWithMedia } from "@/services/items";
import { getFollowerCount, getFollowingCount } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ellipsis, ExternalLink } from "lucide-react-native";
import {
    Dimensions,
    FlatList,
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = SCREEN_WIDTH * 0.7;

const MOCK_PROFILE = MOCK_USERS[0];
const MOCK_OWN_LISTINGS = MOCK_ITEMS.filter(
  (i) => i.seller_id === MOCK_PROFILE.id,
);

export default function ProfileScreen() {
  const { profile, user } = useAuth();
  const insets = useSafeAreaInsets();

  const { data: followers = 0 } = useQuery({
    queryKey: ["followers", user?.id],
    queryFn: () => (user ? getFollowerCount(user.id) : 0),
    enabled: !!user,
  });

  const { data: following = 0 } = useQuery({
    queryKey: ["following", user?.id],
    queryFn: () => (user ? getFollowingCount(user.id) : 0),
    enabled: !!user,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => (user ? getItemsBySeller(user.id) : []),
    enabled: !!user,
  });

  const displayProfile = profile ?? MOCK_PROFILE;
  const displayListings = listings.length > 0 ? listings : MOCK_OWN_LISTINGS;
  const displayFollowers = followers || 24300;
  const displayFollowing = following || 252;

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

              {/* Settings button — pinned to safe area */}
              <Pressable
                onPress={() => router.push("/(app)/settings")}
                style={{ top: insets.top + 8 }}
                className="absolute right-5 w-11 h-11 rounded-full bg-black/30 items-center justify-center"
              >
                <Ellipsis size={22} strokeWidth={2.5} color="white" />
              </Pressable>

              {/* Name overlay at bottom of hero */}
              <View className="absolute bottom-20 left-0 right-0 items-center px-6">
                <Text className="text-4xl font-neuton-bold text-white text-center">
                  {displayProfile.username}
                </Text>
                {displayProfile.instagram_link && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(displayProfile.instagram_link!)
                    }
                    className="flex-row items-center gap-1.5 mt-2"
                  >
                    <Text className="text-base font-neuton text-white/70">
                      @{displayProfile.username}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Avatar overlapping hero */}
            <View className="items-center -mt-14 z-10">
              <ProfileAvatar
                uri={displayProfile.avatar_url}
                size={96}
                borderWidth={5}
              />
            </View>

            {/* Action buttons */}
            <View className="flex-row items-center justify-center gap-3 mt-5 px-8">
              <AnimatedButton
                onPress={() => router.push("/(app)/profile/edit")}
                className="flex-1 h-14 bg-accent"
              >
                <Text className="text-base font-neuton-bold text-white">
                  Edit profile
                </Text>
              </AnimatedButton>
              {displayProfile.instagram_link && (
                <AnimatedButton
                  onPress={() =>
                    Linking.openURL(displayProfile.instagram_link!)
                  }
                  className="w-14 h-14 bg-gray-100"
                >
                  <ExternalLink size={20} strokeWidth={2.5} color="#282828" />
                </AnimatedButton>
              )}
            </View>

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

            {/* Listings header */}
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
        ListEmptyComponent={
          <View className="items-center py-12 px-8">
            <Text className="text-base font-neuton text-muted-foreground text-center leading-6">
              Your pieces will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}
