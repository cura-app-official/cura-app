import { BackButton } from '@/components/ui/back-button';
import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { birthDateGenderSchema, type BirthDateGenderForm } from '@/lib/validations';
import { useSignup } from '@/store/signup-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const;

export default function SignupBirthdateScreen() {
  const { setData } = useSignup();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BirthDateGenderForm>({
    resolver: zodResolver(birthDateGenderSchema),
    defaultValues: { birth_date: '', gender: undefined },
  });

  const selectedGender = watch('gender');

  const onSubmit = (values: BirthDateGenderForm) => {
    setData({ birth_date: values.birth_date, gender: values.gender });
    router.push('/(auth)/signup-email');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="px-6 pt-2">
          <BackButton />
        </View>
        <View className="flex-1 px-6 pt-8">
          <Text className="text-3xl font-hell-round-bold text-foreground">
            About you
          </Text>
          <Text className="text-base font-helvetica text-muted-foreground mt-2 mb-10">
            Tell us a bit about yourself
          </Text>

          <View className="mb-6">
            <Controller
              control={control}
              name="birth_date"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Birth date"
                  placeholder="YYYY-MM-DD"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.birth_date?.message}
                  keyboardType="numbers-and-punctuation"
                />
              )}
            />
          </View>

          <View>
            <Text className="text-sm font-helvetica text-muted-foreground mb-3">
              Gender
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() =>
                    setValue('gender', g, { shouldValidate: true })
                  }
                  className={`px-5 py-3 rounded-full ${
                    selectedGender === g ? 'bg-accent' : 'bg-muted'
                  }`}
                >
                  <Text
                    className={`text-sm font-helvetica ${
                      selectedGender === g ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.gender && (
              <Text className="text-xs font-helvetica text-error mt-1.5">
                {errors.gender.message}
              </Text>
            )}
          </View>
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
