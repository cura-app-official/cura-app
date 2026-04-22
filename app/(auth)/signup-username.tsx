import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { usernameSchema, type UsernameForm } from "@/lib/validations";
import { checkUsernameAvailable } from "@/services/users";
import { useSignup } from "@/store/signup-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupUsernameScreen() {
  const { setData } = useSignup();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsernameForm>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async (values: UsernameForm) => {
    try {
      const available = await checkUsernameAvailable(values.username);
      if (!available) {
        Alert.alert("Username taken", "Please choose a different username.");
        return;
      }
      setData({ username: values.username });
      router.push("/(auth)/signup-birthdate");
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
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
            Choose a username
          </Text>
          <Text className="text-lg font-neuton text-muted-foreground mt-3 mb-10">
            This is how others will find you
          </Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="username"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username?.message}
              />
            )}
          />
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
