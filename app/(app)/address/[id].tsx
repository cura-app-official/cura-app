import { AddressFormScreen } from "@/components/address/address-form";
import type { AddressForm } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";
import { getAddresses, updateAddress } from "@/services/addresses";
import type { Tables } from "@/types/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

function toAddressFormValues(address: Tables<"addresses">): AddressForm {
  return {
    name: address.name,
    phone_number: address.phone_number.replace(/^\+66/, ""),
    address: address.address,
    address_details: address.address_details ?? "",
    is_default: address.is_default,
  };
}

export default function EditAddressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: () => (user ? getAddresses(user.id) : []),
    enabled: !!user,
  });

  const address = addresses.find((a: Tables<"addresses">) => a.id === id);

  const onSubmit = async (values: AddressForm) => {
    try {
      await updateAddress(id, {
        ...values,
        phone_number: `+66${values.phone_number}`,
      });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to update address");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="small" color="#1A1A1A" />
      </View>
    );
  }

  if (!address) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-lg font-neuton text-muted-foreground text-center">
          Address not found.
        </Text>
      </View>
    );
  }

  return (
    <AddressFormScreen
      title="Edit address"
      defaultValues={toAddressFormValues(address)}
      onSubmit={onSubmit}
    />
  );
}
