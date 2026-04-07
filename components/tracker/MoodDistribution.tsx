import { View, Text } from 'react-native';
import { moodDistStyles as s } from '../../styles/tracker.styles';

interface MoodDist {
  name: string;
  emoji: string;
  count: number;
  pct: number;
  color: string;
}

export default function MoodDistribution({ data }: { data: MoodDist[] }) {
  return (
    <View style={s.card}>
      <View style={s.bar}>
        {data.map((m, i) => (
          <View
            key={i}
            style={[
              s.barSeg,
              {
                flex: m.pct,
                backgroundColor: m.color,
                borderTopLeftRadius: i === 0 ? 6 : 0,
                borderBottomLeftRadius: i === 0 ? 6 : 0,
                borderTopRightRadius: i === data.length - 1 ? 6 : 0,
                borderBottomRightRadius: i === data.length - 1 ? 6 : 0,
              }
            ]}
          />
        ))}
      </View>
      {data.map((m, i) => (
        <View key={i} style={[s.row, i < data.length - 1 && s.rowBorder]}>
          <View style={s.left}>
            <View style={[s.dot, { backgroundColor: m.color }]} />
            <Text style={s.emoji}>{m.emoji}</Text>
            <Text style={s.name}>{m.name}</Text>
          </View>
          <View style={s.right}>
            <Text style={s.pct}>{m.pct}%</Text>
            <Text style={s.count}>{m.count} ngày</Text>
          </View>
        </View>
      ))}
    </View>
  );
}