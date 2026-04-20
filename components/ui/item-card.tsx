import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface ItemCardProps {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  sellerName: string;
  sellerAvatar?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  className?: string;
}

export function ItemCard({
  id,
  imageUrl,
  name,
  price,
  sellerName,
  sellerAvatar,
  isWishlisted = false,
  onToggleWishlist,
  className,
}: ItemCardProps) {
  return (
    <Pressable
      onPress={() => router.push(`/item/${id}`)}
      className={cn('flex-1', className)}
    >
      <View className="relative">
        <Image
          source={{ uri: imageUrl }}
          className="w-full aspect-[3/4] rounded-2xl bg-muted"
          contentFit="cover"
          transition={200}
        />
        {onToggleWishlist && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 items-center justify-center"
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={16}
              color={isWishlisted ? '#FF4747' : '#1A1A1A'}
            />
          </Pressable>
        )}
      </View>
      <View className="mt-2 px-0.5">
        <Text className="text-sm font-helvetica text-foreground" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-base font-hell-round-bold text-foreground mt-0.5">
          ₱{price.toLocaleString()}
        </Text>
        <View className="flex-row items-center mt-1.5 gap-1.5">
          {sellerAvatar ? (
            <Image
              source={{ uri: sellerAvatar }}
              className="w-4 h-4 rounded-full bg-muted"
            />
          ) : (
            <View className="w-4 h-4 rounded-full bg-muted" />
          )}
          <Text className="text-xs font-helvetica text-muted-foreground" numberOfLines={1}>
            {sellerName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
