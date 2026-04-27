import { Image } from "expo-image";
import { User } from "lucide-react-native";
import { View } from "react-native";

interface ProfileAvatarProps {
  uri?: string | null;
  size?: number;
  borderWidth?: number;
}

export function ProfileAvatar({
  uri,
  size = 96,
  borderWidth = 4,
}: ProfileAvatarProps) {
  const outerSize = size + borderWidth * 2;

  return (
    <View
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: outerSize / 2,
        borderWidth,
      }}
      className="border-background bg-muted items-center justify-center overflow-hidden"
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <User size={size * 0.35} strokeWidth={1.5} color="#8A6B4D" />
      )}
    </View>
  );
}
