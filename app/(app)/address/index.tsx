import { BackButton } from '@/components/ui/back-button';
import { EmptyState } from '@/components/ui/empty-state';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useAuth } from '@/providers/auth-provider';
import { getAddresses, deleteAddress } from '@/services/addresses';
import type { Tables } from '@/types/database';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';
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
        <View className="flex-row items-center gap-3">
          <BackButton />
          <Text className="text-xl font-hell-round-bold text-foreground">
            Shopping Info
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/address/add')}
          hitSlop={12}
          className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
        >
          <Plus size={22} strokeWidth={2.5} color="#282828" />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#1A1A1A" />
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1">
          <EmptyState
            icon={MapPin}
            title="No addresses yet"
            description="Add an address for faster checkout"
          />
          <View className="px-6 pb-6">
            <AnimatedButton
              onPress={() => router.push('/(app)/address/add')}
              className="h-14 bg-accent"
            >
              <Text className="text-base font-hell-round-bold text-white">
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
            <View className="p-5 rounded-3xl bg-gray-100">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-hell-round-bold text-foreground">
                      {item.name}
                    </Text>
                    {item.is_default && (
                      <View className="px-3 py-1 rounded-full bg-accent">
                        <Text className="text-xs font-hell-round-bold text-white">
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-base font-helvetica text-muted-foreground mt-1.5">
                    {item.phone_number}
                  </Text>
                  <Text className="text-base font-helvetica text-foreground mt-1">
                    {item.address}
                  </Text>
                  {item.address_details && (
                    <Text className="text-base font-helvetica text-muted-foreground mt-0.5">
                      {item.address_details}
                    </Text>
                  )}
                </View>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => router.push(`/(app)/address/${item.id}`)}
                    hitSlop={12}
                  >
                    <Pencil size={18} strokeWidth={2.5} color="#282828" />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item.id)} hitSlop={12}>
                    <Trash2 size={18} strokeWidth={2.5} color="#FF4747" />
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
