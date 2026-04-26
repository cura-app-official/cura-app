import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { loginSchema, type LoginForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [step, setStep] = useState<"email" | "password">("email");
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    const { error } = await signIn(values.email, values.password);
    if (error) {
      Alert.alert("Sign in failed", error.message);
    } else {
      router.replace("/(app)/(tabs)");
    }
  };

  const onContinue = async () => {
    const isEmailValid = await trigger("email", { shouldFocus: true });
    if (isEmailValid) {
      setStep("password");
    }
  };

  const email = getValues("email");

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
            {step === "email"
              ? "Sign in to your account"
              : "Enter your password to continue"}
          </Text>

          {step === "email" ? (
            <Animated.View
              key="email-step"
              entering={FadeInRight.duration(220)}
              exiting={FadeOutLeft.duration(160)}
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FloatingLabelInput
                    label="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    onSubmitEditing={onContinue}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />
            </Animated.View>
          ) : (
            <Animated.View
              key="password-step"
              entering={FadeInRight.duration(220)}
              exiting={FadeOutLeft.duration(160)}
            >
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
                    onPress={() => setStep("email")}
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
            </Animated.View>
          )}
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={step === "email" ? onContinue : handleSubmit(onSubmit)}
            title={step === "email" ? "Continue" : "Login"}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
