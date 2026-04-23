import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="item/[id]"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="cart/index"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="checkout/index"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="settings/index"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="address/index"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="address/add"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="address/[id]"
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="seller/apply"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="listing/create"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="orders/index"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
