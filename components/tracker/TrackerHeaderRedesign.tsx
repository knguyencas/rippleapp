import { View, Text } from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { trackerHeaderRedesignStyles as s } from '../../styles/tracker/tracker-redesign.styles';
import { getGreeting } from '../../utils/home/greeting.utils';

const WEEKDAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function formatDateLine(d: Date): string {
  const wd = WEEKDAYS_VI[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${wd}, ${day}/${mo}/${d.getFullYear()}`;
}

interface Props {
  affirmText?: string;
}

export default function TrackerHeaderRedesign({ affirmText }: Props) {
  const user = useAuthStore((s) => s.user);
  const streak = useAuthStore((s) => s.streak);

  const displayName = user?.displayName || user?.username || 'bạn';
  const initials = displayName.slice(0, 1).toUpperCase();
  const today = new Date();

  return (
    <View style={s.wrap}>
      <View style={s.topRow}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={s.textBlock}>
          <Text style={s.greeting} numberOfLines={1}>
            {getGreeting(today)} {displayName}!
          </Text>
          <Text style={s.dateText}>{formatDateLine(today)}</Text>
        </View>
        <View style={s.streakBadge}>
          <Text style={s.streakIcon}>{streak > 0 ? 'F' : '~'}</Text>
          <Text style={s.streakNum}>{streak}</Text>
        </View>
      </View>

      <Text style={s.affirm}>{affirmText ?? 'Hôm nay bạn đang\nlàm rất tốt!'}</Text>
    </View>
  );
}
