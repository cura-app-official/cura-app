import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
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
          className="w-full aspect-[3/4] rounded-3xl bg-muted"
          contentFit="cover"
          transition={200}
        />
        {onToggleWishlist && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 items-center justify-center"
          >
            <Heart
              size={16}
              strokeWidth={2.5}
              color={isWishlisted ? '#FF4747' : '#1A1A1A'}
              fill={isWishlisted ? '#FF4747' : 'transparent'}
            />
          </Pressable>
        )}
      </View>
      <View className="mt-2.5 px-1">
        <Text className="text-base font-helvetica text-foreground" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-lg font-hell-round-bold text-foreground mt-0.5">
          ₱{price.toLocaleString()}
        </Text>
        <View className="flex-row items-center mt-1.5 gap-2">
          {sellerAvatar ? (
            <Image
              source={{ uri: sellerAvatar }}
              className="w-5 h-5 rounded-full bg-muted"
            />
          ) : (
            <View className="w-5 h-5 rounded-full bg-muted" />
          )}
          <Text className="text-sm font-helvetica text-muted-foreground" numberOfLines={1}>
            {sellerName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
