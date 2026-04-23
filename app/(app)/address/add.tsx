import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { addressSchema } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { createAddress } from "@/services/addresses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddAddressScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

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
          <Text className="text-xl font-neuton-bold text-foreground">
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
                <View>
                  <Text className="text-base font-neuton-bold text-muted-foreground mb-3">
                    Phone Number
                  </Text>
                  <View
                    className={`flex-row items-center px-5 rounded-2xl border border-border ${
                      isPhoneFocused ? "border-2 border-black" : ""
                    } ${errors.phone_number?.message ? "border border-error" : ""}`}
                  >
                    <Text className="text-base font-neuton-bold text-foreground mr-3">
                      +66
                    </Text>
                    <TextInput
                      className="flex-1 text-base text-foreground font-neuton py-4"
                      placeholder="XXXXXXXXX"
                      placeholderTextColor="#8A6B4D"
                      selectionColor="#5B3B1B"
                      keyboardType="number-pad"
                      maxLength={9}
                      value={value}
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => {
                        setIsPhoneFocused(false);
                        onBlur();
                      }}
                      onChangeText={(text) => onChange(text.replace(/\D/g, ""))}
                    />
                  </View>
                  {errors.phone_number?.message && (
                    <Text className="text-sm font-neuton text-error ml-2 mt-1.5">
                      {errors.phone_number.message}
                    </Text>
                  )}
                </View>
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

            <View className="flex-row items-center justify-between py-3 px-5 rounded-3xl bg-muted border border-border">
              <Text className="text-base font-neuton text-foreground">
                Set as default
              </Text>
              <Switch
                value={isDefault}
                onValueChange={(val) => setValue("is_default", val)}
                trackColor={{ true: "#8BAD80" }}
              />
            </View>
          </View>

          <Text className="text-sm font-neuton text-muted-foreground mt-2 leading-5">
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
            <Text className="text-base font-neuton text-muted-foreground">
              Cancel
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
