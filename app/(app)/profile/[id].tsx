import { AnimatedButton } from '@/components/ui/animated-button';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/providers/auth-provider';
import { getItemsBySeller, type ItemWithMedia } from '@/services/items';
import {
  getFollowerCount,
  getFollowingCount,
  getProfile,
  isFollowing,
  toggleFollow,
} from '@/services/profiles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id),
    enabled: !!id,
  });

  const { data: followers = 0 } = useQuery({
    queryKey: ['followers', id],
    queryFn: () => getFollowerCount(id),
    enabled: !!id,
  });

  const { data: following = 0 } = useQuery({
    queryKey: ['following', id],
    queryFn: () => getFollowingCount(id),
    enabled: !!id,
  });

  const { data: userFollowing = false } = useQuery({
    queryKey: ['following-user', user?.id, id],
    queryFn: () => (user ? isFollowing(user.id, id) : false),
    enabled: !!user && !!id && user.id !== id,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['user-listings', id],
    queryFn: () => getItemsBySeller(id),
    enabled: !!id,
  });

  const handleToggleFollow = useCallback(async () => {
    if (!user) return;
    await toggleFollow(user.id, id);
    queryClient.invalidateQueries({ queryKey: ['following-user'] });
    queryClient.invalidateQueries({ queryKey: ['followers', id] });
  }, [user, id, queryClient]);

  if (isLoading || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </SafeAreaView>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 2 }}
        ListHeaderComponent={
          <View>
            <View className="relative h-36 bg-muted">
              {profile.background_url && (
                <Image
                  source={{ uri: profile.background_url }}
                  className="absolute inset-0"
                  contentFit="cover"
                />
              )}
              <SafeAreaView edges={['top']} className="absolute top-0 left-0">
                <View className="px-2 pt-1">
                  <BackButton />
                </View>
              </SafeAreaView>
            </View>

            <View className="px-6 -mt-10">
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-20 h-20 rounded-full border-4 border-background bg-muted"
                />
              ) : (
                <View className="w-20 h-20 rounded-full border-4 border-background bg-muted items-center justify-center">
                  <Ionicons name="person" size={28} color="#A3A3A3" />
                </View>
              )}

              <View className="mt-3">
                <Text className="text-xl font-hell-round-bold text-foreground">
                  {profile.username}
                </Text>
                {profile.bio && (
                  <Text className="text-sm font-helvetica text-muted-foreground mt-1">
                    {profile.bio}
                  </Text>
                )}
                {profile.instagram_link && (
                  <Pressable
                    onPress={() => Linking.openURL(profile.instagram_link!)}
                    className="flex-row items-center gap-1 mt-1"
                  >
                    <Ionicons name="logo-instagram" size={14} color="#A3A3A3" />
                    <Text className="text-xs font-helvetica text-muted-foreground">
                      Instagram
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="flex-row gap-6 mt-4">
                <View>
                  <Text className="text-base font-hell-round-bold text-foreground">
                    {followers}
                  </Text>
                  <Text className="text-xs font-helvetica text-muted-foreground">
                    Followers
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-hell-round-bold text-foreground">
                    {following}
                  </Text>
                  <Text className="text-xs font-helvetica text-muted-foreground">
                    Following
                  </Text>
                </View>
              </View>

              {!isOwnProfile && (
                <View className="mt-5 mb-4">
                  <AnimatedButton
                    onPress={handleToggleFollow}
                    className={`py-3 items-center rounded-xl ${
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
                  </AnimatedButton>
                </View>
              )}

              {listings.length > 0 && (
                <Text className="text-sm font-hell-round-bold text-foreground mb-3 mt-2">
                  Listings
                </Text>
              )}
            </View>
          </View>
        }
        renderItem={({ item }: { item: ItemWithMedia }) => (
          <Pressable
            onPress={() => router.push(`/(app)/item/${item.id}`)}
            className="flex-1 aspect-square"
          >
            <Image
              source={{ uri: item.item_media?.[0]?.url ?? '' }}
              className="flex-1 bg-muted"
              contentFit="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
}
