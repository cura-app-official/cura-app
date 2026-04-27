import { ProfileScreenContent } from "@/components/profile/profile-screen-content";
import { MOCK_ITEMS, MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { getItemsBySeller } from "@/services/items";
import { getFollowerCount, getFollowingCount } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";

const MOCK_PROFILE = MOCK_USERS[0];
const MOCK_OWN_LISTINGS = MOCK_ITEMS.filter(
  (i) => i.seller_id === MOCK_PROFILE.id,
);

export default function ProfileScreen() {
  const { profile, user } = useAuth();

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
      <ProfileScreenContent
        profile={displayProfile}
        listings={displayListings}
        followers={displayFollowers}
        following={displayFollowing}
        isOwnProfile
        showSettingsButton
        emptyMessage="Your pieces will show up here."
      />
    </View>
  );
}
