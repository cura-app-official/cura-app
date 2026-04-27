import { AnimatedLoadingButton } from "@/components/ui/animated-loading-button";
import { BackButton } from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { addressSchema, type AddressForm } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type AddressFormInput = z.input<typeof addressSchema>;

export const EMPTY_ADDRESS_VALUES: AddressForm = {
  name: "",
  phone_number: "",
  address: "",
  address_details: "",
  is_default: false,
};

interface AddressFormScreenProps {
  title: string;
  defaultValues: AddressForm;
  onSubmit: (values: AddressForm) => Promise<void> | void;
  showPrivacyNotice?: boolean;
}

export function AddressFormScreen({
  title,
  defaultValues,
  onSubmit,
  showPrivacyNotice = false,
}: AddressFormScreenProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormInput, unknown, AddressForm>({
    resolver: zodResolver(addressSchema),
    values: defaultValues,
  });

  const isDefault = watch("is_default");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-6 py-3 gap-3">
          <BackButton />
          <Text className="text-2xl font-neuton-bold text-foreground">
            {title}
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

          {showPrivacyNotice && (
            <Text className="text-base font-neuton text-muted-foreground mt-2 leading-6">
              By clicking Save, you acknowledge that you have read the Privacy
              Policy.
            </Text>
          )}
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
