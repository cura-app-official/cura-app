import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { Image } from "expo-image";
import { type ReactNode } from "react";
import { Pressable, View } from "react-native";

export const PROFILE_BANNER_ASPECT_RATIO = 3 / 2;

interface ProfileHeaderHeroProps {
  backgroundUri?: string | null;
  avatarUri?: string | null;
  heroHeight: number;
  avatarSize?: number;
  avatarBorderWidth?: number;
  topOverlay?: ReactNode;
  backgroundOverlay?: ReactNode;
  onBackgroundPress?: () => void;
  onAvatarPress?: () => void;
  renderAvatar?: () => ReactNode;
}

export function ProfileHeaderHero({
  backgroundUri,
  avatarUri,
  heroHeight,
  avatarSize = 100,
  avatarBorderWidth = 4,
  topOverlay,
  backgroundOverlay,
  onBackgroundPress,
  onAvatarPress,
  renderAvatar,
}: ProfileHeaderHeroProps) {
  const avatarOuterSize = avatarSize + avatarBorderWidth * 2;

  const avatar = renderAvatar ? (
    renderAvatar()
  ) : (
    <ProfileAvatar
      uri={avatarUri}
      size={avatarSize}
      borderWidth={avatarBorderWidth}
    />
  );

  return (
    <View
      className="relative"
      style={{ height: heroHeight + avatarOuterSize / 2 }}
    >
      <Pressable
        disabled={!onBackgroundPress}
        onPress={onBackgroundPress}
        style={{ height: heroHeight }}
        className="overflow-hidden bg-muted"
      >
        {backgroundUri ? (
          <Image
            source={{ uri: backgroundUri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View className="absolute inset-0 bg-muted" />
        )}
        {backgroundOverlay}
      </Pressable>

      {topOverlay}

      <View
        className="absolute left-0 right-0 items-center"
        style={{ top: heroHeight - avatarOuterSize / 2 }}
      >
        <Pressable disabled={!onAvatarPress} onPress={onAvatarPress}>
          {avatar}
        </Pressable>
      </View>
    </View>
  );
}
