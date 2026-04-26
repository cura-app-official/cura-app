import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { loginSchema, type LoginForm } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginEmailForm = Pick<LoginForm, "email">;

export default function LoginEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginEmailForm>({
    resolver: zodResolver(loginSchema.pick({ email: true })),
    defaultValues: { email: email ?? "" },
  });

  const onContinue = (values: LoginEmailForm) => {
    router.push({
      pathname: "/(auth)/login-password",
      params: { email: values.email },
    });
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
            Sign in to your account
          </Text>

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
                onSubmitEditing={handleSubmit(onContinue)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />
        </View>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onContinue)}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
