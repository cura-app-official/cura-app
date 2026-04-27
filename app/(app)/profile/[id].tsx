import { ProfileScreenContent } from "@/components/profile/profile-screen-content";
import {
  MOCK_FOLLOWER_COUNTS,
  MOCK_FOLLOWING_COUNTS,
  MOCK_ITEMS,
  MOCK_USERS,
} from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { getItemsBySeller } from "@/services/items";
import {
  getFollowerCount,
  getFollowingCount,
  getUser,
  isFollowing,
  toggleFollow,
} from "@/services/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";

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

  return (
    <View className="flex-1 bg-background">
      <ProfileScreenContent
        profile={displayProfile}
        listings={displayListings}
        followers={displayFollowers}
        following={displayFollowing}
        isOwnProfile={user?.id === id}
        isFollowing={userFollowing}
        onFollowPress={handleToggleFollow}
        showBackButton
      />
    </View>
  );
}
