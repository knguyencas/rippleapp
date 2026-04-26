import { View, Text } from 'react-native';
import {
  moodEncouragementStyles as s,
  encouragementHintStyles as h,
} from '../../styles/mood/mood-encouragement.styles';

interface Props {
  message: string | null;
}

export default function MoodEncouragement({ message }: Props) {
  if (!message) return null;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <Text style={s.title}>Lời nhắn cho bạn</Text>
      </View>
      <Text style={s.body}>{message}</Text>
    </View>
  );
}

export function EncouragementHint({ message }: Props) {
  if (!message) return null;

  return (
    <View style={h.wrap}>
      <Text style={h.icon}>✨</Text>
      <Text style={h.text}>{message}</Text>
    </View>
  );
}
