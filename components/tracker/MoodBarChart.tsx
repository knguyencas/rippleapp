import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { moodBarChartStyles as s } from '../../styles/tracker.styles';

interface DayData {
  day: string;
  score: number;
  emoji?: string;
  color?: string;
}

interface Props {
  weekData: DayData[];
  monthData: DayData[];
}

const BAR_MAX_H = 100;
const MAX_SCORE = 5;

export default function MoodBarChart({ weekData, monthData }: Props) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const data = period === 'week' ? weekData : monthData;

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Mood Chart</Text>
        <View style={s.toggle}>
          {(['week', 'month'] as const).map(p => (
            <TouchableOpacity
              key={p}
              style={[s.toggleBtn, period === p && s.toggleBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[s.toggleText, period === p && s.toggleTextActive]}>
                {p === 'week' ? 'Tuần' : 'Tháng'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.chart}>
        <View style={s.yAxis}>
          {[5, 4, 3, 2, 1].map(n => (
            <Text key={n} style={s.yLabel}>{n}</Text>
          ))}
        </View>
        <View style={s.bars}>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={[s.gridLine, { bottom: (i / 4) * BAR_MAX_H + 20 }]} />
          ))}
          {data.map((item, i) => {
            const h = (item.score / MAX_SCORE) * BAR_MAX_H;
            return (
              <View key={i} style={s.barCol}>
                <Text style={s.barEmoji}>{item.emoji ?? ''}</Text>
                <View style={s.barBg}>
                  <View style={[s.barFill, {
                    height: h,
                    backgroundColor: item.color ?? Colors.teal,
                  }]} />
                </View>
                <Text style={s.barLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}