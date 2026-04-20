import { AnimatedButton } from '@/components/ui/animated-button';
import { useAuth } from '@/providers/auth-provider';
import { getItemsBySeller, type ItemWithMedia } from '@/services/items';
import { getFollowerCount, getFollowingCount } from '@/services/users';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { profile, user } = useAuth();

  const { data: followers = 0 } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: () => (user ? getFollowerCount(user.id) : 0),
    enabled: !!user,
  });

  const { data: following = 0 } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: () => (user ? getFollowingCount(user.id) : 0),
    enabled: !!user,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['my-listings', user?.id],
    queryFn: () => (user ? getItemsBySeller(user.id) : []),
    enabled: !!user,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
              {profile?.background_url && (
                <Image
                  source={{ uri: profile.background_url }}
                  className="absolute inset-0"
                  contentFit="cover"
                />
              )}
              <Pressable
                onPress={() => router.push('/(app)/settings')}
                className="absolute top-3 right-4"
              >
                <Ionicons name="settings-outline" size={24} color="#1A1A1A" />
              </Pressable>
            </View>

            <View className="px-6 -mt-10">
              {profile?.avatar_url ? (
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
                  {profile?.username}
                </Text>
                {profile?.bio && (
                  <Text className="text-sm font-helvetica text-muted-foreground mt-1">
                    {profile.bio}
                  </Text>
                )}
                {profile?.instagram_link && (
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

              <View className="flex-row gap-2 mt-5 mb-4">
                <AnimatedButton
                  onPress={() => router.push('/(app)/profile/edit')}
                  className="flex-1 py-3 items-center bg-muted rounded-xl"
                >
                  <Text className="text-sm font-hell-round-bold text-foreground">
                    Edit profile
                  </Text>
                </AnimatedButton>
                <AnimatedButton
                  onPress={() => router.push('/(app)/wishlist' as any)}
                  className="py-3 px-5 items-center bg-muted rounded-xl"
                >
                  <Ionicons name="heart-outline" size={18} color="#1A1A1A" />
                </AnimatedButton>
              </View>

              {!profile?.is_seller && (
                <AnimatedButton
                  onPress={() => router.push('/(app)/seller/apply')}
                  className="py-3.5 items-center bg-accent rounded-xl mb-5"
                >
                  <Text className="text-sm font-hell-round-bold text-white">
                    Sell my pieces
                  </Text>
                </AnimatedButton>
              )}

              {listings.length > 0 && (
                <Text className="text-sm font-hell-round-bold text-foreground mb-3">
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
        ListEmptyComponent={
          <View className="items-center py-10 px-6">
            <Text className="text-sm font-helvetica text-muted-foreground text-center">
              {profile?.is_seller
                ? 'No listings yet. Start selling your pieces!'
                : 'Apply to become a seller and list your pieces.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
