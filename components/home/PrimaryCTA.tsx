import { View, Text, TouchableOpacity } from 'react-native';
import { primaryCtaStyles as s } from '../../styles/home/primary-cta.styles';

interface Props {
  label: string;
  onPress: () => void;
}

export default function PrimaryCTA({ label, onPress }: Props) {
  return (
    <View style={s.wrap}>
      <TouchableOpacity style={s.btn} onPress={onPress} activeOpacity={0.85}>
        <Text style={s.btnText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
