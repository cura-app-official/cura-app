import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import { AnimatedButton } from "./animated-button";

interface BackButtonProps {
  onPress?: () => void;
  iconSize?: number;
  useCrossIcon?: boolean;
  className?: string;
}

export function BackButton({
  onPress,
  iconSize = 22,
  useCrossIcon,
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <AnimatedButton
      onPress={handlePress}
      className={cn("bg-background rounded-[1.25rem] w-16 h-12", className)}
      accessibilityLabel="Navigate back"
    >
      {useCrossIcon ? (
        <X size={iconSize} strokeWidth={1.5} color="#5B3B1B" />
      ) : (
        <ChevronLeft size={iconSize} strokeWidth={1.5} color="#5B3B1B" />
      )}
    </AnimatedButton>
  );
}
