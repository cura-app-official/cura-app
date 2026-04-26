import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import {
    sellerApplicationSchema,
    type SellerApplicationForm,
} from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { submitSellerApplication } from "@/services/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellerApplyScreen() {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SellerApplicationForm>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      instagram_link: "",
      height: "",
      intro: "",
      sample_photos: [],
    },
  });

  const samplePhotos = watch("sample_photos") ?? [];

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setValue("sample_photos", [...samplePhotos, ...uris].slice(0, 6));
    }
  };

  const removePhoto = (index: number) => {
    setValue(
      "sample_photos",
      samplePhotos.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (values: SellerApplicationForm) => {
    if (!user) return;
    try {
      await submitSellerApplication({
        user_id: user.id,
        first_name: values.first_name,
        last_name: values.last_name,
        instagram_link: values.instagram_link,
        height: values.height,
        intro: values.intro ?? null,
        sample_photos: values.sample_photos ?? null,
      });
      Alert.alert(
        "Application submitted",
        "We'll review your application and get back to you soon.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to submit application");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-6 py-3 gap-3">
          <BackButton />
          <Text className="text-2xl font-neuton-bold text-foreground">
            Become a Seller
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-lg font-neuton text-muted-foreground mb-8 leading-7">
            Tell us about yourself so we can review your seller application.
          </Text>

          <View className="gap-5">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller
                  control={control}
                  name="first_name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First name"
                      placeholder="Jane"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.first_name?.message}
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last name"
                      placeholder="Doe"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.last_name?.message}
                    />
                  )}
                />
              </View>
            </View>

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
                  value={value}
                  error={errors.instagram_link?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Height"
                  placeholder="e.g. 5'7&quot; or 170cm"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.height?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="intro"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Intro"
                  placeholder="Tell us about your style"
                  multiline
                  numberOfLines={3}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                  className="min-h-[100px]"
                />
              )}
            />

            <View>
              <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
                Sample photos
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {samplePhotos.map((uri, i) => (
                  <View key={uri} className="relative w-24 h-24">
                    <Image
                      source={{ uri }}
                      className="w-24 h-24 rounded-2xl bg-muted"
                      contentFit="cover"
                    />
                    <Pressable
                      onPress={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-foreground items-center justify-center"
                    >
                      <X size={12} strokeWidth={1.5} color="white" />
                    </Pressable>
                  </View>
                ))}
                {samplePhotos.length < 6 && (
                  <Pressable
                    onPress={pickPhotos}
                    className="w-24 h-24 rounded-2xl bg-background border border-border items-center justify-center"
                  >
                    <Camera size={26} strokeWidth={1.5} color="#8A6B4D" />
                    <Text className="text-base font-neuton text-muted-foreground mt-1">
                      {samplePhotos.length}/6
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pb-6">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Submit application"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
