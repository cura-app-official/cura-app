import { BackButton } from '@/components/ui/back-button';
import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { birthDateGenderSchema, type BirthDateGenderForm } from '@/lib/validations';
import { useSignup } from '@/store/signup-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const;

export default function SignupBirthdateScreen() {
  const { setData } = useSignup();
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

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

  const dayRef = useRef('');
  const monthValRef = useRef('');
  const yearValRef = useRef('');

  const buildDate = () => {
    const d = dayRef.current.padStart(2, '0');
    const m = monthValRef.current.padStart(2, '0');
    const y = yearValRef.current;
    if (y.length === 4 && m.length >= 1 && d.length >= 1) {
      setValue('birth_date', `${y}-${m}-${d}`, { shouldValidate: true });
    }
  };

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
          <Text className="text-4xl font-hell-round-bold text-foreground">
            About you
          </Text>
          <Text className="text-lg font-helvetica text-muted-foreground mt-3 mb-10">
            Tell us a bit about yourself
          </Text>

          {/* DOB Fields */}
          <View className="mb-8">
            <Text className="text-base font-hell-round-bold text-neutral-600 mb-3">
              Date of birth
            </Text>
            <Controller
              control={control}
              name="birth_date"
              render={() => (
                <View className="flex-row gap-3">
                  <View className="flex-1 px-5 rounded-3xl bg-gray-100">
                    <TextInput
                      className="text-base text-foreground font-helvetica py-4 text-center"
                      placeholder="DD"
                      placeholderTextColor="#a3a3a3"
                      keyboardType="number-pad"
                      maxLength={2}
                      selectionColor="#1A1A1A"
                      onChangeText={(v) => {
                        dayRef.current = v;
                        buildDate();
                        if (v.length === 2) monthRef.current?.focus();
                      }}
                    />
                  </View>
                  <View className="flex-1 px-5 rounded-3xl bg-gray-100">
                    <TextInput
                      ref={monthRef}
                      className="text-base text-foreground font-helvetica py-4 text-center"
                      placeholder="MM"
                      placeholderTextColor="#a3a3a3"
                      keyboardType="number-pad"
                      maxLength={2}
                      selectionColor="#1A1A1A"
                      onChangeText={(v) => {
                        monthValRef.current = v;
                        buildDate();
                        if (v.length === 2) yearRef.current?.focus();
                      }}
                    />
                  </View>
                  <View className="flex-[1.4] px-5 rounded-3xl bg-gray-100">
                    <TextInput
                      ref={yearRef}
                      className="text-base text-foreground font-helvetica py-4 text-center"
                      placeholder="YYYY"
                      placeholderTextColor="#a3a3a3"
                      keyboardType="number-pad"
                      maxLength={4}
                      selectionColor="#1A1A1A"
                      onChangeText={(v) => {
                        yearValRef.current = v;
                        buildDate();
                      }}
                    />
                  </View>
                </View>
              )}
            />
            {errors.birth_date && (
              <Text className="text-sm font-helvetica text-error ml-2 mt-2">
                {errors.birth_date.message}
              </Text>
            )}
          </View>

          {/* Gender chips */}
          <View>
            <Text className="text-base font-hell-round-bold text-neutral-600 mb-3">
              Gender
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {GENDERS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() =>
                    setValue('gender', g, { shouldValidate: true })
                  }
                  className={`px-6 py-3.5 rounded-3xl ${
                    selectedGender === g ? 'bg-accent' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-base font-helvetica ${
                      selectedGender === g ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.gender && (
              <Text className="text-sm font-helvetica text-error ml-2 mt-2">
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
