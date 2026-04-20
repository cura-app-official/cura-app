import { ItemCard } from '@/components/ui/item-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/providers/auth-provider';
import { searchCreators, searchItems, type ItemWithMedia } from '@/services/items';
import { getWishlistIds, toggleWishlist } from '@/services/wishlist';
import type { Tables } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'items' | 'creators' | 'categories';

export default function SearchScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('items');

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlist-ids', user?.id],
    queryFn: () => (user ? getWishlistIds(user.id) : []),
    enabled: !!user,
  });

  const { data: itemResults = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['search-items', query],
    queryFn: () => searchItems(query),
    enabled: query.length >= 2 && activeTab === 'items',
  });

  const { data: creatorResults = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['search-creators', query],
    queryFn: () => searchCreators(query),
    enabled: query.length >= 2 && activeTab === 'creators',
  });

  const handleToggleWishlist = useCallback(
    async (itemId: string) => {
      if (!user) return;
      await toggleWishlist(user.id, itemId);
      queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] });
    },
    [user, queryClient]
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'items', label: 'Items' },
    { key: 'creators', label: 'Creators' },
    { key: 'categories', label: 'Categories' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-hell-round-bold text-foreground mb-4">
          Search
        </Text>
        <Input
          placeholder="Search items, brands, creators..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          className="bg-muted"
        />
      </View>

      <View className="flex-row px-6 py-3 gap-2">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab.key ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <Text
              className={`text-sm font-helvetica ${
                activeTab === tab.key ? 'text-white' : 'text-foreground'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'items' && (
        <>
          {itemsLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#1A1A1A" />
            </View>
          ) : query.length < 2 ? (
            <EmptyState
              icon="search-outline"
              title="Search for items"
              description="Find pieces by name, brand, or category"
            />
          ) : itemResults.length === 0 ? (
            <EmptyState icon="search-outline" title="No items found" />
          ) : (
            <FlatList
              data={itemResults}
              renderItem={({ item, index }: { item: ItemWithMedia; index: number }) => (
                <View className={`flex-1 ${index % 2 === 0 ? 'pr-1.5' : 'pl-1.5'}`}>
                  <ItemCard
                    id={item.id}
                    imageUrl={item.item_media?.[0]?.url ?? ''}
                    name={item.item_name}
                    price={item.price}
                    sellerName={item.seller?.username ?? ''}
                    isWishlisted={wishlistIds.includes(item.id)}
                    onToggleWishlist={() => handleToggleWishlist(item.id)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
              columnWrapperStyle={{ marginBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === 'creators' && (
        <>
          {creatorsLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#1A1A1A" />
            </View>
          ) : query.length < 2 ? (
            <EmptyState
              icon="people-outline"
              title="Search for creators"
              description="Find your favorite influencers and artists"
            />
          ) : creatorResults.length === 0 ? (
            <EmptyState icon="people-outline" title="No creators found" />
          ) : (
            <FlatList
              data={creatorResults}
              renderItem={({ item }: { item: Tables<'profiles'> }) => (
                <Pressable
                  onPress={() => router.push(`/(app)/profile/${item.id}`)}
                  className="flex-row items-center px-6 py-3 gap-3"
                >
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: item.avatar_url }}
                      className="w-12 h-12 rounded-full bg-muted"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-muted items-center justify-center">
                      <Ionicons name="person" size={20} color="#A3A3A3" />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-hell-round-bold text-foreground">
                      {item.username}
                    </Text>
                    {item.bio && (
                      <Text
                        className="text-sm font-helvetica text-muted-foreground mt-0.5"
                        numberOfLines={1}
                      >
                        {item.bio}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-2 py-2">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => {
                  setActiveTab('items');
                  setQuery(cat);
                }}
                className="px-5 py-3 rounded-full bg-muted"
              >
                <Text className="text-sm font-helvetica text-foreground">{cat}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
