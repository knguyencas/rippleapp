import { View, Text } from 'react-native';
import { aiInsightStyles as s } from '../../styles/tracker.styles';

interface Insight {
  icon: string;
  title: string;
  desc: string;
}

export default function AIInsightCard({ insights }: { insights: Insight[] }) {
  return (
    <View>
      {insights.map((insight, i) => (
        <View key={i} style={s.card}>
          <Text style={s.icon}>{insight.icon}</Text>
          <View style={s.text}>
            <Text style={s.title}>{insight.title}</Text>
            <Text style={s.desc}>{insight.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}