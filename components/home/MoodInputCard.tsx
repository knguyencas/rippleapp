import { View, Text, TouchableOpacity } from 'react-native';
import { moodInputCardStyles as s } from '../../styles/home/mood-input-card.styles';

interface Props {
  loggedToday: boolean;
  todayMoodLabel?: string | null;
  todayNote?: string | null;
  onPress: () => void;
}

export default function MoodInputCard({ loggedToday, todayMoodLabel, todayNote, onPress }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.prompt}>Hôm nay tâm trạng bạn thế nào?</Text>
      <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
        <View style={[s.halo, loggedToday && s.haloLogged]}>
          <View style={[s.heartCore, loggedToday && s.heartCoreLogged]}>
            <Text style={s.heartGlyph}>{loggedToday ? 'OK' : '+'}</Text>
          </View>
        </View>
        <Text style={s.title}>
          {loggedToday
            ? (todayMoodLabel ?? 'Đã ghi tâm trạng hôm nay')
            : 'Chạm để ghi lại tâm trạng'}
        </Text>
        <Text style={s.sub}>
          {loggedToday ? 'Chạm để cập nhật' : 'Chọn mood bằng emotion wheel'}
        </Text>
        {loggedToday && todayNote ? (
          <Text style={s.loggedNote} numberOfLines={2}>{todayNote}</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}
