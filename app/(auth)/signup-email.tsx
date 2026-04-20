import { BackButton } from '@/components/ui/back-button';
import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { Input } from '@/components/ui/input';
import { emailPasswordSchema, type EmailPasswordForm } from '@/lib/validations';
import { useAuth } from '@/providers/auth-provider';
import { createUser } from '@/services/users';
import { useSignup } from '@/store/signup-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupEmailScreen() {
  const { data: signupData, reset } = useSignup();
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailPasswordForm>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: EmailPasswordForm) => {
    try {
      const { user, error } = await signUp(values.email, values.password);
      if (error || !user) {
        Alert.alert('Sign up failed', error?.message ?? 'Something went wrong');
        return;
      }

      await createUser({
        id: user.id,
        username: signupData.username!,
        email: values.email,
        birth_date: signupData.birth_date ?? null,
        gender: signupData.gender ?? null,
      });

      reset();
      router.replace('/(onboarding)');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Something went wrong');
    }
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
            Create your account
          </Text>
          <Text className="text-base font-helvetica text-muted-foreground mt-2 mb-10">
            Almost there, {signupData.username}
          </Text>

          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="At least 8 characters"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <Text className="text-xs font-helvetica text-muted-foreground mt-4 leading-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Create account"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
