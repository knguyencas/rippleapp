import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { sleepTrackerStyles as s } from '../../styles/tracker/tracker.styles';
import {
  syncSleepToBackend,
  fetchHealthSummary,
  fetchHealthToday,
  isHealthAvailable,
  ensureHealthPermissions,
} from '../../services/tracker/health.service';
import { EncouragementHint } from './MoodEncouragement';

const GOAL_MIN = 8 * 60;

interface Props {
  hint?: string | null;
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h}h ${m}m`;
}

function formatClock(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function SleepTracker({ hint }: Props = {}) {
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [bedtime, setBedtime] = useState<string | null>(null);
  const [wakeTime, setWakeTime] = useState<string | null>(null);
  const [avgMin, setAvgMin] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [todayRes, summaryRes] = await Promise.all([
        fetchHealthToday(),
        fetchHealthSummary(7),
      ]);
      const total = todayRes?.sleep?.totalMinutes ?? 0;
      const session = todayRes?.sleep?.sessions?.[0];
      setDurationMin(total > 0 ? total : null);
      setBedtime(session?.bedtime ?? null);
      setWakeTime(session?.wakeTime ?? null);
      setAvgMin(summaryRes?.averages?.sleepMinutes ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  const sync = useCallback(async () => {
    if (!isHealthAvailable()) return;
    setSyncing(true);
    const granted = await ensureHealthPermissions();
    if (!granted) {
      setPermissionDenied(true);
      setSyncing(false);
      return;
    }
    setPermissionDenied(false);
    const res = await syncSleepToBackend();
    if (res) {
      setDurationMin(res.durationMin);
      setBedtime(res.bedtime);
      setWakeTime(res.wakeTime);
      await load();
    }
    setSyncing(false);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await load();
        if (isHealthAvailable()) await sync();
      })();
    }, [load, sync])
  );

  const goalPct = durationMin != null ? Math.min(1, durationMin / GOAL_MIN) : 0;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.title}>Giấc ngủ</Text>
          <Text style={s.subtitle}>Mục tiêu 8 giờ/đêm</Text>
        </View>
        {(loading || syncing) && <ActivityIndicator color={Colors.teal} size="small" />}
      </View>

      {!isHealthAvailable() ? (
        <Text style={s.emptyText}>
          Tính năng đọc giấc ngủ chỉ hoạt động trên iOS/Android (Apple Health hoặc Health Connect).
        </Text>
      ) : permissionDenied ? (
        <View>
          <Text style={s.emptyText}>Chưa có quyền đọc dữ liệu giấc ngủ.</Text>
          <TouchableOpacity style={s.retryBtn} onPress={sync}>
            <Text style={s.retryText}>Cấp quyền</Text>
          </TouchableOpacity>
        </View>
      ) : durationMin == null ? (
        <Text style={s.emptyText}>
          Chưa có dữ liệu giấc ngủ đêm qua. {Platform.OS === 'android'
            ? 'Đảm bảo app theo dõi ngủ của bạn đã ghi vào Health Connect.'
            : 'Đảm bảo app ngủ của bạn (Apple Watch, AutoSleep…) đã ghi vào Apple Health.'}
        </Text>
      ) : (
        <>
          <View style={s.mainRow}>
            <View style={s.numberWrap}>
              <Text style={s.bigNumber}>{formatDuration(durationMin)}</Text>
              {bedtime && wakeTime && (
                <Text style={s.unit}>
                  {formatClock(bedtime)} → {formatClock(wakeTime)}
                </Text>
              )}
            </View>

            <View style={s.ringWrap}>
              <View style={s.ringBg} />
              <View style={[s.ringFill, { transform: [{ rotate: `${goalPct * 360}deg` }] }]} />
              <Text style={s.ringPct}>{Math.round(goalPct * 100)}%</Text>
            </View>
          </View>

          {avgMin != null && (
            <View style={s.footerRow}>
              <Text style={s.footerText}>
                Trung bình 7 ngày: <Text style={s.footerBold}>{formatDuration(avgMin)}/đêm</Text>
              </Text>
            </View>
          )}
        </>
      )}

      <EncouragementHint message={hint ?? null} />
    </View>
  );
}
