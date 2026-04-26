import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

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
      className={cn("flex-1", className)}
    >
      {/* Product Image */}
      <View className="relative bg-muted w-full aspect-[3/4] rounded-3xl">
        <Image
          source={{
            uri: "https://golflefleur.com/cdn/shop/files/NAUT-1-MNT-01.jpg?v=1757029019&width=1920",
          }}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          className="rounded-3xl bg-muted"
          contentFit="cover"
          transition={200}
        />
        <View className="absolute top-3 left-3 flex-row  justify-start items-center gap-2">
          {sellerAvatar ? (
            <View className="w-10 h-10 rounded-full bg-blue-500" />
          ) : (
            <View className="w-5 h-5 rounded-full bg-muted" />
          )}
          <Text
            className="text-sm font-neuton-bold text-foreground"
            numberOfLines={1}
          >
            {sellerName}
          </Text>
        </View>

        {onToggleWishlist && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full items-center justify-center bg-background/95 border border-border"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              color={isWishlisted ? "#FF4747" : "#5B3B1B"}
              fill={isWishlisted ? "#FF4747" : "transparent"}
            />
          </Pressable>
        )}
      </View>
      <Text
        className="text-base font-neuton-bold text-foreground mt-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      {/* Product Price */}
      <Text className="text-lg font-neuton text-foreground">
        ฿{price.toLocaleString()}
      </Text>
    </Pressable>
  );
}

//  <View className="relative">
//     <Image
//       source={{ uri: imageUrl }}
//       className="w-full aspect-[3/4] rounded-3xl bg-muted"
//       contentFit="cover"
//       transition={200}
//     />
//     {onToggleWishlist && (
//       <Pressable
//         onPress={(e) => {
//           e.stopPropagation();
//           onToggleWishlist();
//         }}
//         className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 items-center justify-center"
//       >
//         <Heart
//           size={16}
//           strokeWidth={2.5}
//           color={isWishlisted ? '#FF4747' : '#1A1A1A'}
//           fill={isWishlisted ? '#FF4747' : 'transparent'}
//         />
//       </Pressable>
//     )}
//   </View>
//   <View className="mt-2.5 px-1">
//     <Text className="text-base font-neuton text-foreground" numberOfLines={1}>
//       {name}
//     </Text>
//     <Text className="text-lg font-neuton-bold text-foreground mt-0.5">
//       ฿{price.toLocaleString()}
//     </Text>
//     <View className="flex-row items-center mt-1.5 gap-2">
//       {sellerAvatar ? (
//         <Image
//           source={{ uri: sellerAvatar }}
//           className="w-5 h-5 rounded-full bg-muted"
//         />
//       ) : (
//         <View className="w-5 h-5 rounded-full bg-muted" />
//       )}
//       <Text className="text-sm font-neuton text-muted-foreground" numberOfLines={1}>
//         {sellerName}
//       </Text>
//     </View>
//   </View>
