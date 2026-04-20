import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      <Ionicons name={icon} size={48} color="#D4D4D4" />
      <Text className="text-lg font-hell-round-bold text-foreground mt-4 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-sm font-helvetica text-muted-foreground mt-2 text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
