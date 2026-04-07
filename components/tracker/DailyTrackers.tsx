import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { dailyTrackersStyles as s } from '../../styles/tracker.styles';

interface TrackerItem {
  id: string;
  emoji: string;
  name: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

interface Props {
  items: TrackerItem[];
  onIncrement: (id: string) => void;
}

export default function DailyTrackers({ items, onIncrement }: Props) {
  return (
    <View style={s.wrap}>
      {items.map((item) => {
        const pct = Math.min(item.current / item.goal, 1);
        const done = item.current >= item.goal;
        return (
          <View key={item.id} style={s.card}>
            <View style={s.cardLeft}>
              <Text style={s.emoji}>{item.emoji}</Text>
              <View style={s.info}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.sub}>
                  {item.current}/{item.goal} {item.unit}
                </Text>

                <View style={s.barBg}>
                  <View style={[
                    s.barFill,
                    { width: `${pct * 100}%` as any, backgroundColor: done ? Colors.teal : item.color }
                  ]} />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[s.btn, done && s.btnDone]}
              onPress={() => !done && onIncrement(item.id)}
            >
              <Text style={[s.btnText, done && s.btnTextDone]}>
                {done ? '✓' : '+'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}