import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { loginSchema, type LoginForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginPasswordForm = Pick<LoginForm, "password">;

export default function LoginPasswordScreen() {
  const { signIn } = useAuth();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const passwordRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPasswordForm>({
    resolver: zodResolver(loginSchema.pick({ password: true })),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/login-email");
      return;
    }

    const focusFrame = requestAnimationFrame(() => {
      passwordRef.current?.focus();
    });
    const focusTimer = setTimeout(() => {
      passwordRef.current?.focus();
    }, 50);

    return () => {
      cancelAnimationFrame(focusFrame);
      clearTimeout(focusTimer);
    };
  }, [email]);

  const onSubmit = async (values: LoginPasswordForm) => {
    if (!email) return;

    const { error } = await signIn(email, values.password);
    if (error) {
      Alert.alert("Sign in failed", error.message);
    } else {
      router.replace("/(app)/(tabs)");
    }
  };

  const onChangeEmail = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="px-6 pt-2">
          <BackButton />
        </View>

        <View className="flex-1 px-6 pt-8">
          <Text className="text-4xl font-neuton-bold text-foreground">
            Welcome back
          </Text>
          <Text className="text-xl font-neuton text-muted-foreground mt-3 mb-10">
            Enter your password to continue
          </Text>

          <View className="rounded-2xl border border-border px-5 py-4 mb-5">
            <Text className="text-base font-neuton text-muted-foreground">
              Signing in as
            </Text>
            <View className="flex-row items-center justify-between mt-1">
              <Text
                className="text-lg font-neuton-bold text-foreground flex-1 mr-3"
                numberOfLines={1}
              >
                {email}
              </Text>
              <Text
                className="text-lg font-neuton-bold text-accent"
                onPress={onChangeEmail}
              >
                Change
              </Text>
            </View>
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FloatingLabelInput
                ref={passwordRef}
                label="Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
              />
            )}
          />
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Login"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
