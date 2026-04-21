import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      <Icon size={48} strokeWidth={1.5} color="#D4D4D4" />
      <Text className="text-xl font-hell-round-bold text-foreground mt-5 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-base font-helvetica text-muted-foreground mt-2 text-center leading-6">
          {description}
        </Text>
      )}
    </View>
  );
}
