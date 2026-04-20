import { BackButton } from '@/components/ui/back-button';
import { EmptyState } from '@/components/ui/empty-state';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useAuth } from '@/providers/auth-provider';
import { getAddresses, deleteAddress } from '@/services/addresses';
import type { Tables } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddressListScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => (user ? getAddresses(user.id) : []),
    enabled: !!user,
  });

  const handleDelete = (id: string) => {
    Alert.alert('Delete address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAddress(id);
          queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-3">
        <View className="flex-row items-center">
          <BackButton />
          <Text className="text-lg font-hell-round-bold text-foreground ml-2">
            Shopping Info
          </Text>
        </View>
        <Pressable onPress={() => router.push('/(app)/address/add')} hitSlop={8}>
          <Ionicons name="add" size={24} color="#1A1A1A" />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1">
          <EmptyState
            icon="location-outline"
            title="No addresses yet"
            description="Add an address for faster checkout"
          />
          <View className="px-6 pb-6">
            <AnimatedButton
              onPress={() => router.push('/(app)/address/add')}
              className="py-4 items-center bg-accent rounded-xl"
            >
              <Text className="text-sm font-hell-round-bold text-white">
                Add new address
              </Text>
            </AnimatedButton>
          </View>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20, gap: 12 }}
          renderItem={({ item }: { item: Tables<'addresses'> }) => (
            <View className="p-4 rounded-xl bg-muted">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-hell-round-bold text-foreground">
                      {item.name}
                    </Text>
                    {item.is_default && (
                      <View className="px-2 py-0.5 rounded-full bg-accent">
                        <Text className="text-[10px] font-hell-round-bold text-white">
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm font-helvetica text-muted-foreground mt-1">
                    {item.phone_number}
                  </Text>
                  <Text className="text-sm font-helvetica text-foreground mt-1">
                    {item.address}
                  </Text>
                  {item.address_details && (
                    <Text className="text-sm font-helvetica text-muted-foreground mt-0.5">
                      {item.address_details}
                    </Text>
                  )}
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => router.push(`/(app)/address/${item.id}`)}
                    hitSlop={8}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#1A1A1A" />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color="#FF4747" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
