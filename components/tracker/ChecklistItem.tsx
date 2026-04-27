import { View, Text, TouchableOpacity } from 'react-native';
import { checklistStyles as s } from '../../styles/tracker/tracker-redesign.styles';

export type ChecklistTrailing =
  | { type: 'plus'; onPress: () => void }
  | { type: 'done' }
  | { type: 'open'; onPress: () => void };

interface Props {
  title: string;
  sub: string;
  iconLetter: string;
  iconBg: string;
  iconColor: string;
  isNew?: boolean;
  dashed?: boolean;
  trailing: ChecklistTrailing;
}

export default function ChecklistItem({
  title,
  sub,
  iconLetter,
  iconBg,
  iconColor,
  isNew,
  dashed,
  trailing,
}: Props) {
  const renderTrailing = () => {
    if (trailing.type === 'done') {
      return (
        <View style={s.trailingBtn}>
          <Text style={s.trailingDoneText}>OK</Text>
        </View>
      );
    }
    if (trailing.type === 'plus') {
      return (
        <TouchableOpacity style={s.trailingBtn} onPress={trailing.onPress} activeOpacity={0.7}>
          <Text style={s.trailingBtnText}>+</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={s.trailingBtn} onPress={trailing.onPress} activeOpacity={0.7}>
        <Text style={s.trailingBtnText}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.item, dashed && s.itemDashed]}>
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Text style={[s.iconLetter, { color: iconColor }]}>{iconLetter}</Text>
      </View>

      <View style={s.body}>
        <View style={s.titleRow}>
          <Text style={s.title}>{title}</Text>
          {isNew && (
            <View style={s.newBadge}>
              <Text style={s.newBadgeText}>MỚI</Text>
            </View>
          )}
        </View>
        <Text style={s.sub}>{sub}</Text>
      </View>

      {renderTrailing()}
    </View>
  );
}
