import { View, Text, TouchableOpacity } from 'react-native';
import { trackerIconsRowStyles as s } from '../../styles/tracker/tracker-redesign.styles';

interface Cell {
  label: string;
  glyph: string;
  bg: string;
  color: string;
  onPress?: () => void;
}

const CELLS: Cell[] = [
  { label: 'VẬN ĐỘNG', glyph: 'V', bg: '#F4D8B0', color: '#5A3010' },
  { label: 'TÂM TRẠNG', glyph: 'M', bg: '#FFD8D8', color: '#6B1F26' },
  { label: 'NƯỚC', glyph: 'N', bg: '#C4DDED', color: '#1A4A6B' },
  { label: 'GIẤC NGỦ', glyph: 'G', bg: '#E0D8F0', color: '#3A2A6B' },
  { label: 'THIỀN', glyph: 'T', bg: '#D8E8D8', color: '#1F3F26' },
];

export default function TrackerIconsRow() {
  return (
    <View style={s.section}>
      <Text style={s.title}>Theo dõi của tôi</Text>
      <View style={s.row}>
        {CELLS.map((cell) => (
          <TouchableOpacity
            key={cell.label}
            style={[s.cell, { backgroundColor: cell.bg }]}
            activeOpacity={0.85}
            onPress={cell.onPress}
            accessibilityLabel={cell.label}
          >
            <View style={s.cellGlyphBox}>
              <Text style={[s.cellGlyph, { color: cell.color }]}>{cell.glyph}</Text>
            </View>
            <Text style={[s.cellLabel, { color: cell.color }]}>{cell.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
