import { View, Text } from 'react-native';
import { yellowReminderStyles as s } from '../../styles/tracker/tracker-redesign.styles';

interface Props {
  message: string;
}

export default function SoraMessage({ message }: Props) {
  return (
    <View style={s.msgCard}>
      <View style={s.msgMascot}>
        <Text style={s.msgMascotText}>S</Text>
      </View>
      <View style={s.msgBody}>
        <Text style={s.msgTitle}>Lời nhắn từ Sora</Text>
        <Text style={s.msgText}>{message}</Text>
      </View>
    </View>
  );
}
