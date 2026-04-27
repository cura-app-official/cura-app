import { Text, View } from "react-native";

interface StatItemProps {
  value: number | string;
  label: string;
  showDivider?: boolean;
}

function StatItem({ value, label, showDivider = false }: StatItemProps) {
  const formatted =
    typeof value === "number" && value >= 1000
      ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
      : String(value);

  return (
    <View
      className={`flex-1 items-center ${showDivider ? "border-r border-border" : ""}`}
    >
      <Text className="text-2xl font-neuton-bold text-foreground">
        {formatted}
      </Text>
      <Text className="text-base font-neuton text-muted-foreground mt-0.5">
        {label}
      </Text>
    </View>
  );
}

interface ProfileStatsProps {
  following: number;
  followers: number;
  items?: number;
}

export function ProfileStats({
  following,
  followers,
  items,
}: ProfileStatsProps) {
  const showItems = typeof items === "number";

  return (
    <View className="flex-row py-5">
      <StatItem value={following} label="Following" showDivider />
      <StatItem
        value={followers}
        label="Followers"
        showDivider={showItems}
      />
      {showItems && <StatItem value={items} label="Items" />}
    </View>
  );
}
