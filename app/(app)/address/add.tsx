import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { addressSchema } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { createAddress } from "@/services/addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddAddressScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      address: "",
      address_details: "",
      is_default: false,
    },
  });

  const isDefault = watch("is_default");

  const onSubmit = async (values: any) => {
    if (!user) return;
    try {
      await createAddress({
        user_id: user.id,
        ...values,
        phone_number: `+66${values.phone_number}`,
      });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to save address");
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
            Add address
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-5 py-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name"
                  placeholder="Full name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number"
                  placeholder="XXXXXXXXX"
                  prefix="+66"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                  value={value}
                  error={errors.phone_number?.message}
                  keyboardType="number-pad"
                  maxLength={9}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Address"
                  placeholder="Street, city, province"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="address_details"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Address Details"
                  placeholder="Building, floor, unit (optional)"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                />
              )}
            />

            <View className="flex-row items-center justify-between h-[4.25rem] px-5 rounded-3xl bg-muted border border-border">
              <Text className="text-lg font-neuton text-foreground">
                Set as default
              </Text>
              <View className="items-center justify-center">
                <Switch
                  value={isDefault}
                  onValueChange={(val) => setValue("is_default", val)}
                  trackColor={{ true: "#8BAD80" }}
                />
              </View>
            </View>
          </View>

          <Text className="text-base font-neuton text-muted-foreground mt-2 leading-6">
            By clicking Save, you acknowledge that you have read the Privacy
            Policy.
          </Text>
        </ScrollView>

        <View className="px-6 pb-6 gap-3">
          <AnimatedLoadingButton
            isSubmitting={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Save"
          />
          <Pressable onPress={router.back} className="py-3 items-center">
            <Text className="text-lg font-neuton text-muted-foreground">
              Cancel
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
