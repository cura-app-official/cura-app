import { BackButton } from '@/components/ui/back-button';
import { AnimatedLoadingButton } from '@/components/ui/animated-loading-button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginForm } from '@/lib/validations';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginForm) => {
    const { error } = await signIn(values.email, values.password);
    if (error) {
      Alert.alert('Sign in failed', error.message);
    } else {
      router.replace('/(app)/(tabs)');
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
          <Text className="text-4xl font-hell-round-bold text-foreground">
            Welcome back
          </Text>
          <Text className="text-lg font-helvetica text-muted-foreground mt-3 mb-10">
            Sign in to your account
          </Text>

          <View className="gap-5">
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
                  placeholder="Enter your password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />
          </View>
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Sign in"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
