import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
}

export function BackButton({ onPress, color = '#1A1A1A' }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress ?? router.back}
      className="w-10 h-10 items-center justify-center"
      hitSlop={8}
    >
      <Ionicons name="chevron-back" size={24} color={color} />
    </Pressable>
  );
}
