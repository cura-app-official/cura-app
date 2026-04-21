import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { addressSchema } from '@/lib/validations';
import { useAuth } from '@/providers/auth-provider';
import { getAddresses, updateAddress } from '@/services/addresses';
import type { Tables } from '@/types/database';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditAddressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => (user ? getAddresses(user.id) : []),
    enabled: !!user,
  });

  const address = addresses.find((a: Tables<'addresses'>) => a.id === id);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    values: address
      ? {
          name: address.name,
          phone_number: address.phone_number,
          address: address.address,
          address_details: address.address_details ?? '',
          is_default: address.is_default,
        }
      : undefined,
  });

  const isDefault = watch('is_default');

  const onSubmit = async (values: any) => {
    try {
      await updateAddress(id, values);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update address');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-6 py-3 gap-3">
          <BackButton />
          <Text className="text-xl font-hell-round-bold text-foreground">
            Edit address
          </Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="gap-5 py-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name"
                  placeholder="Full name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="+63 XXX XXX XXXX"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.phone_number?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Address"
                  placeholder="Street, city, province"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="address_details"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Address Details"
                  placeholder="Building, floor, unit (optional)"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                />
              )}
            />

            <View className="flex-row items-center justify-between py-3 px-5 rounded-3xl bg-gray-100">
              <Text className="text-base font-helvetica text-foreground">
                Set as default
              </Text>
              <Switch
                value={isDefault}
                onValueChange={(val) => setValue('is_default', val)}
                trackColor={{ true: '#1A1A1A' }}
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pb-6 gap-3">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Save"
          />
          <Pressable onPress={router.back} className="py-3 items-center">
            <Text className="text-base font-helvetica text-muted-foreground">
              Cancel
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
