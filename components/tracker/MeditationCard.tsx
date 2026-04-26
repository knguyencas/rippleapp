import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { meditationCardStyles as s } from '../../styles/tracker/meditation-card.styles';
import {
  fetchToday,
  type MeditationToday,
} from '../../services/tracker/meditation.service';
import { toDateKey } from '../../utils/shared/date.utils';
import MeditationModal from './MeditationModal';

export default function MeditationCard() {
  const [data, setData] = useState<MeditationToday | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const today = await fetchToday(toDateKey(new Date()));
    setData(today);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalMin = data?.totalMinutes ?? 0;
  const goalMin = data?.goalMin ?? 10;
  const pct = Math.min(1, totalMin / goalMin);

  const buttonLabel =
    totalMin === 0 ? 'Bắt đầu thiền'
    : totalMin >= goalMin ? 'Thiền thêm'
    : 'Tiếp tục';

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Thiền</Text>
          <Text style={s.subtitle}>Mục tiêu {goalMin} phút/ngày</Text>
        </View>
        {loading && <ActivityIndicator color={Colors.teal} size="small" />}
      </View>

      <View style={s.mainRow}>
        <View style={s.numberWrap}>
          <Text style={s.bigNumber}>{totalMin}</Text>
          <Text style={s.unit}>phút hôm nay</Text>
        </View>

        <View style={s.progressWrap}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
          </View>
          <Text style={s.progressText}>{Math.round(pct * 100)}%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={s.actionBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={s.actionBtnText}>{buttonLabel}</Text>
      </TouchableOpacity>

      <MeditationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSessionSaved={() => { void load(); }}
      />
    </View>
  );
}
