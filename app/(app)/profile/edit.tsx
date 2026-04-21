import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { editProfileSchema, type EditProfileForm } from '@/lib/validations';
import { useAuth } from '@/providers/auth-provider';
import { updateUser } from '@/services/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, User } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      avatar_url: profile?.avatar_url ?? null,
      background_url: profile?.background_url ?? null,
      instagram_link: profile?.instagram_link ?? '',
      bio: profile?.bio ?? '',
    },
  });

  const avatarUrl = watch('avatar_url');
  const backgroundUrl = watch('background_url');

  const pickImage = async (field: 'avatar_url' | 'background_url') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: field === 'avatar_url' ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setValue(field, result.assets[0].uri, { shouldDirty: true });
    }
  };

  const onSubmit = async (values: EditProfileForm) => {
    if (!user) return;
    try {
      await updateUser(user.id, {
        avatar_url: values.avatar_url,
        background_url: values.background_url,
        instagram_link: values.instagram_link || null,
        bio: values.bio || null,
      });
      await refreshProfile();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-6 py-3 gap-3">
          <BackButton />
          <Text className="text-xl font-hell-round-bold text-foreground">
            Edit profile
          </Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Cover photo */}
          <Pressable
            onPress={() => pickImage('background_url')}
            className="relative h-36 rounded-3xl bg-gray-100 overflow-hidden mb-8"
          >
            {backgroundUrl && (
              <Image source={{ uri: backgroundUrl }} className="absolute inset-0" contentFit="cover" />
            )}
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <Camera size={26} strokeWidth={2} color="white" />
            </View>
          </Pressable>

          {/* Avatar */}
          <View className="items-center mb-10">
            <Pressable onPress={() => pickImage('avatar_url')} className="relative">
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} className="w-28 h-28 rounded-full bg-muted" />
              ) : (
                <View className="w-28 h-28 rounded-full bg-gray-100 items-center justify-center">
                  <User size={36} strokeWidth={2} color="#A3A3A3" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent items-center justify-center">
                <Camera size={16} strokeWidth={2.5} color="white" />
              </View>
            </Pressable>
          </View>

          {/* Form fields */}
          <View className="gap-5 pb-8">
            <Controller
              control={control}
              name="instagram_link"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Instagram link"
                  placeholder="https://instagram.com/username"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                  error={errors.instagram_link?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio"
                  placeholder="Tell people about yourself"
                  multiline
                  numberOfLines={3}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                  error={errors.bio?.message}
                  className="min-h-[100px]"
                />
              )}
            />
          </View>
        </ScrollView>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Save changes"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
