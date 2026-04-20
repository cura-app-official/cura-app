import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/providers/auth-provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingsRow({ icon, label, onPress, destructive }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-6 py-4 gap-3"
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? '#FF4747' : '#1A1A1A'}
      />
      <Text
        className={`flex-1 text-base font-helvetica ${
          destructive ? 'text-error' : 'text-foreground'
        }`}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D4D4D4" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-3">
        <BackButton />
        <Text className="text-lg font-hell-round-bold text-foreground ml-2">
          Settings
        </Text>
      </View>

      <ScrollView>
        <View className="mt-2">
          <Text className="text-xs font-hell-round-bold text-muted-foreground px-6 mb-1 uppercase tracking-wider">
            Account
          </Text>
          <SettingsRow
            icon="person-outline"
            label="Edit profile"
            onPress={() => router.push('/(app)/profile/edit')}
          />
          <SettingsRow
            icon="location-outline"
            label="Shopping Info"
            onPress={() => router.push('/(app)/address')}
          />
          <SettingsRow
            icon="receipt-outline"
            label="My Orders"
            onPress={() => router.push('/(app)/orders')}
          />
        </View>

        <View className="mt-6">
          <Text className="text-xs font-hell-round-bold text-muted-foreground px-6 mb-1 uppercase tracking-wider">
            Support
          </Text>
          <SettingsRow
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingsRow
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        <View className="mt-6">
          <SettingsRow
            icon="log-out-outline"
            label="Sign out"
            onPress={handleSignOut}
            destructive
          />
        </View>

        <Text className="text-xs font-helvetica text-muted-foreground text-center mt-8 pb-8">
          Cura v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
