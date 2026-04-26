import { useState, useCallback, useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { commonStyles as c } from '../../../styles/shared/common.styles';
import { trackerScreenStyles as s } from '../../../styles/tracker/tracker.styles';
import api from '../../../services/core/api';
import MoodCalendar, { LogItem } from '../../../components/tracker/MoodCalendar';
import MoodLineChart from '../../../components/tracker/MoodLineChart';
import WaterTracker from '../../../components/tracker/WaterTracker';
import StepsTracker from '../../../components/tracker/StepsTracker';
import SleepTracker from '../../../components/tracker/SleepTracker';
import MoodEncouragement from '../../../components/tracker/MoodEncouragement';
import { fetchEncouragement, EncouragementPayload } from '../../../services/tracker/encouragement.service';
import { useAuthStore } from '../../../stores/auth.store';
import { toDateKey } from '../../../utils/shared/date.utils';

export default function TrackerScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [encouragement, setEncouragement] = useState<EncouragementPayload | null>(null);
  const streak = useAuthStore((s) => s.streak);
  const pingStreak = useAuthStore((s) => s.pingStreak);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs?limit=300');
      setLogs(res.data ?? []);
    } catch (e) {
      console.error('Tracker fetchLogs error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchEnc = async () => {
    const enc = await fetchEncouragement();
    if (enc) setEncouragement(enc);
  };

  useFocusEffect(useCallback(() => {
    fetchLogs();
    fetchEnc();
    pingStreak();
  }, []));

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
    fetchEnc();
  };

  const logsByDate = useMemo(() => {
    const map: Record<string, LogItem[]> = {};
    for (const log of logs) {
      const k = toDateKey(new Date(log.createdAt));
      (map[k] ||= []).push(log);
    }
    for (const k in map) {
      map[k].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return map;
  }, [logs]);

  const scoreByDate = useMemo(() => {
    const out: Record<string, number> = {};
    for (const [k, items] of Object.entries(logsByDate)) {
      const sum = items.reduce((acc, l) => acc + l.moodScore, 0);
      out[k] = sum / items.length;
    }
    return out;
  }, [logsByDate]);

  return (
    <SafeAreaView style={c.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.teal} />
        }
      >
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Tracker</Text>
            <Text style={s.headerSub}>Theo dõi sức khỏe & cảm xúc</Text>
          </View>

          <View style={[s.streakBadge, streak === 0 && s.streakBadgeCold]}>
            <Text style={s.streakFlame}>{streak > 0 ? '🔥' : '🌊'}</Text>
            <View>
              <Text style={[s.streakNum, streak === 0 && s.streakNumCold]}>{streak}</Text>
              <Text style={[s.streakLabel, streak === 0 && s.streakLabelCold]}>
                {streak === 1 ? 'ngày' : 'ngày liên tục'}
              </Text>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={s.loadingIndicator} color={Colors.teal} />
        ) : (
          <>
            <MoodCalendar logsByDate={logsByDate} />
            <WaterTracker hint={encouragement?.water ?? null} />
            <StepsTracker hint={encouragement?.steps ?? null} />
            <SleepTracker hint={encouragement?.sleep ?? null} />
            <MoodLineChart scoreByDate={scoreByDate} />
            <MoodEncouragement message={encouragement?.mood ?? null} />
          </>
        )}

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
