import { View, Text, TouchableOpacity } from 'react-native';
import { statsRowStyles as s } from '../../styles/home/stats-row.styles';

interface Props {
  streak: number;
  avgMood7d: string;
  totalLogs: number;
  onPressStreak?: () => void;
  onPressAvgMood?: () => void;
  onPressTotalLogs?: () => void;
}

interface StatCardProps {
  value: string | number;
  label: string;
  accentStyle?: any;
  onPress?: () => void;
}

function StatCard({ value, label, accentStyle, onPress }: StatCardProps) {
  const card = (
    <View style={s.card}>
      {accentStyle && <View style={[s.accentDot, accentStyle]} />}
      <Text style={s.value}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );

  if (!onPress) return card;

  return (
    <TouchableOpacity style={s.touchable} onPress={onPress} activeOpacity={0.82}>
      {card}
    </TouchableOpacity>
  );
}

export default function StatsRow({
  streak,
  avgMood7d,
  totalLogs,
  onPressStreak,
  onPressAvgMood,
  onPressTotalLogs,
}: Props) {
  return (
    <View style={s.row}>
      <StatCard
        value={streak}
        label="Streak"
        accentStyle={s.accentStreak}
        onPress={onPressStreak}
      />
      <StatCard
        value={avgMood7d}
        label="Mood"
        accentStyle={s.accentMood}
        onPress={onPressAvgMood}
      />
      <StatCard
        value={totalLogs}
        label="Logs"
        accentStyle={s.accentLog}
        onPress={onPressTotalLogs}
      />
    </View>
  );
}
