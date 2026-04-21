import { Text, View } from 'react-native';

interface StatItemProps {
  value: number | string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  const formatted =
    typeof value === 'number' && value >= 1000
      ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
      : String(value);

  return (
    <View className="flex-1 items-center">
      <Text className="text-2xl font-hell-round-bold text-foreground">
        {formatted}
      </Text>
      <Text className="text-sm font-helvetica text-muted-foreground mt-0.5">
        {label}
      </Text>
    </View>
  );
}

interface ProfileStatsProps {
  following: number;
  followers: number;
  items: number;
}

export function ProfileStats({ following, followers, items }: ProfileStatsProps) {
  return (
    <View className="flex-row py-5">
      <StatItem value={following} label="Following" />
      <StatItem value={followers} label="Followers" />
      <StatItem value={items} label="Items" />
    </View>
  );
}
