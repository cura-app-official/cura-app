import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, CONDITIONS, DAMAGE_OPTIONS } from "@/lib/constants";
import { createListingSchema, type CreateListingForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { createItem, createItemMedia } from "@/services/items";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import { useState } from "react";
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

export default function CreateListingScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [mediaUris, setMediaUris] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      item_name: "",
      brand: "",
      category: undefined,
      size: "",
      condition: undefined,
      price: undefined,
      description: "",
      damage_type: undefined,
      damage_details: "",
      material: "",
      measurements: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedCondition = watch("condition");
  const selectedDamage = watch("damage_type");

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10 - mediaUris.length,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMediaUris((prev) =>
        [...prev, ...result.assets.map((a) => a.uri)].slice(0, 10),
      );
    }
  };

  const removeMedia = (index: number) => {
    setMediaUris((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: CreateListingForm) => {
    if (!user) return;
    if (mediaUris.length === 0) {
      Alert.alert("Error", "Please add at least one photo");
      return;
    }

    try {
      const item = await createItem({
        seller_id: user.id,
        item_name: values.item_name,
        brand: values.brand,
        category: values.category,
        size: values.size,
        condition: values.condition,
        price: values.price,
        description: values.description ?? null,
        damage_type: values.damage_type ?? null,
        damage_details: values.damage_details ?? null,
        material: values.material ?? null,
        measurements: values.measurements ?? null,
      });

      const media = mediaUris.map((url, i) => ({
        item_id: item.id,
        url,
        sort_order: i,
      }));
      await createItemMedia(media);

      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });

      Alert.alert("Published!", "Your listing is now live.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to create listing");
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
            Create listing
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Photos */}
          <View className="mb-8">
            <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
              Photos
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {mediaUris.map((uri, i) => (
                  <View key={uri} className="relative">
                    <Image
                      source={{ uri }}
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: 16,
                        backgroundColor: "#F5EBDD",
                      }}
                      contentFit="cover"
                    />
                    <Pressable
                      onPress={() => removeMedia(i)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-foreground items-center justify-center"
                    >
                      <X size={12} strokeWidth={1.5} color="white" />
                    </Pressable>
                  </View>
                ))}
                {mediaUris.length < 10 && (
                  <Pressable
                    onPress={pickMedia}
                    className="w-28 h-28 rounded-2xl bg-gray-100 items-center justify-center"
                  >
                    <Camera size={28} strokeWidth={1.5} color="#A3A3A3" />
                    <Text className="text-base font-neuton text-muted-foreground mt-1">
                      {mediaUris.length}/10
                    </Text>
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>

          <View className="gap-5 pb-6">
            <Controller
              control={control}
              name="item_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Item name"
                  placeholder="e.g. Vintage denim jacket"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.item_name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="brand"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Brand"
                  placeholder="e.g. Nike, Zara, Thrifted"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.brand?.message}
                />
              )}
            />

            <View>
              <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() =>
                      setValue("category", cat, { shouldValidate: true })
                    }
                    className={`px-5 py-3 rounded-3xl ${
                      selectedCategory === cat ? "bg-accent" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-lg font-neuton ${
                        selectedCategory === cat
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.category && (
                <Text className="text-base text-error ml-2 mt-1.5">
                  {errors.category.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              name="size"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Size"
                  placeholder="e.g. S, M, L, 28, US 8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.size?.message}
                />
              )}
            />

            <View>
              <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
                Condition
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CONDITIONS.map((cond) => (
                  <Pressable
                    key={cond}
                    onPress={() =>
                      setValue("condition", cond, { shouldValidate: true })
                    }
                    className={`px-5 py-3 rounded-3xl ${
                      selectedCondition === cond ? "bg-accent" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-lg font-neuton ${
                        selectedCondition === cond
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {cond}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.condition && (
                <Text className="text-base text-error ml-2 mt-1.5">
                  {errors.condition.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Price (฿)"
                  placeholder="0"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(text) =>
                    onChange(text ? parseFloat(text) : undefined)
                  }
                  value={value?.toString() ?? ""}
                  error={errors.price?.message}
                />
              )}
            />

            <View>
              <Text className="text-lg font-neuton-bold text-neutral-600 mb-3">
                Damage
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DAMAGE_OPTIONS.map((dmg) => (
                  <Pressable
                    key={dmg}
                    onPress={() => setValue("damage_type", dmg)}
                    className={`px-5 py-3 rounded-3xl ${
                      selectedDamage === dmg ? "bg-accent" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-lg font-neuton ${
                        selectedDamage === dmg
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {dmg}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Controller
              control={control}
              name="damage_details"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Damage details"
                  placeholder="Describe any damage"
                  multiline
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description"
                  placeholder="Tell buyers about this piece"
                  multiline
                  numberOfLines={3}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                  className="min-h-[100px]"
                />
              )}
            />

            <Controller
              control={control}
              name="material"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Material"
                  placeholder="e.g. Cotton, Polyester"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                />
              )}
            />

            <Controller
              control={control}
              name="measurements"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Measurements"
                  placeholder='e.g. Chest: 40", Length: 28"'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                />
              )}
            />
          </View>
        </ScrollView>

        <View className="px-6 pb-6 border-t border-border pt-4">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Publish listing"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
