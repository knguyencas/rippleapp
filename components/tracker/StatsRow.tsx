import { View, Text } from 'react-native';
import { statsRowStyles as s } from '../../styles/tracker.styles';

interface Props {
  streak: number;
  avgMood: string;
  totalDays: number;
}

export default function StatsRow({ streak, avgMood, totalDays }: Props) {
  const stats = [
    { emoji: '', num: String(streak),    label: 'Ngày streak' },
    { emoji: '', num: String(avgMood),   label: 'Mood TB tuần' },
    { emoji: '', num: String(totalDays), label: 'Ngày đã log' },
  ];
  return (
    <View style={s.row}>
      {stats.map((st, i) => (
        <View key={i} style={s.card}>
          <Text style={s.emoji}>{st.emoji}</Text>
          <Text style={s.num}>{st.num}</Text>
          <Text style={s.label}>{st.label}</Text>
        </View>
      ))}
    </View>
  );
}