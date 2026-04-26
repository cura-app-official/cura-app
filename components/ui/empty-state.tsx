import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 pb-32">
      <Icon size={48} strokeWidth={1.5} color="#8A6B4D" />
      <Text className="text-2xl font-neuton-bold text-foreground mt-5 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-lg font-neuton text-muted-foreground mt-2 text-center leading-7">
          {description}
        </Text>
      )}
    </View>
  );
}
