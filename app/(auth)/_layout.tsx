import { SignupContext, type SignupData } from '@/store/signup-store';
import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';

export default function AuthLayout() {
  const [data, setDataState] = useState<Partial<SignupData>>({});

  const setData = useCallback((updates: Partial<SignupData>) => {
    setDataState((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => setDataState({}), []);

  return (
    <SignupContext.Provider value={{ data, setData, reset }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup-username" />
        <Stack.Screen name="signup-birthdate" />
        <Stack.Screen name="signup-email" />
      </Stack>
    </SignupContext.Provider>
  );
}
