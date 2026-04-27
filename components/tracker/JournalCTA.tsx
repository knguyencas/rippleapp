import { View, Text, TouchableOpacity } from 'react-native';
import { yellowReminderStyles as s } from '../../styles/tracker/tracker-redesign.styles';

interface Props {
  onPress: () => void;
}

export default function JournalCTA({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={s.ctaCard}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Bắt đầu viết nhật ký"
    >
      <View style={s.ctaBody}>
        <Text style={s.ctaText}>Ghi lại cảm xúc & suy nghĩ của bạn</Text>
        <View style={s.ctaPill}>
          <Text style={s.ctaPillText}>Bắt đầu viết</Text>
        </View>
      </View>
      <Text style={s.ctaArrow}>›</Text>
    </TouchableOpacity>
  );
}
