import {
  AddressFormScreen,
  EMPTY_ADDRESS_VALUES,
} from "@/components/address/address-form";
import type { AddressForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { createAddress } from "@/services/addresses";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export default function AddAddressScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const onSubmit = async (values: AddressForm) => {
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
    <AddressFormScreen
      title="Add address"
      defaultValues={EMPTY_ADDRESS_VALUES}
      onSubmit={onSubmit}
      showPrivacyNotice
    />
  );
}
