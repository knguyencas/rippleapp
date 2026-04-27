import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  quickActionStyles as s,
  QuickActionAccent,
} from '../../../styles/home/quick-actions.styles';
import QuickActionCard from '../QuickActionCard';
import {
  fetchHealthToday,
  syncStepsToBackend,
  isHealthAvailable,
  ensureHealthPermissions,
} from '../../../services/tracker/health.service';

const palette = QuickActionAccent.walk;
const STEP_GOAL = 8000;

function formatSteps(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return String(n);
}

export default function WalkQuickCard() {
  const [steps, setSteps] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    const today = await fetchHealthToday();
    setSteps(today?.steps ?? null);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleSync = useCallback(async () => {
    if (!isHealthAvailable() || syncing) return;
    setSyncing(true);
    try {
      const granted = await ensureHealthPermissions();
      if (!granted) return;
      const res = await syncStepsToBackend();
      if (res?.steps != null) setSteps(res.steps);
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  const value = steps ?? 0;
  const pct = Math.min(1, value / STEP_GOAL);

  return (
    <QuickActionCard
      title="Vận động"
      goalLabel={`Mục tiêu ${STEP_GOAL.toLocaleString('vi-VN')}`}
      accent="walk"
      iconLetter="V"
    >
      <View style={s.valueRow}>
        <Text style={[s.valueBig, { color: palette.dark }]}>
          {steps == null ? '—' : value.toLocaleString('vi-VN')}
        </Text>
        <Text style={s.valueUnit}>bước</Text>
      </View>

      <View style={[s.progressTrack, { backgroundColor: palette.track }]}>
        <View
          style={[
            s.progressFill,
            { width: `${Math.round(pct * 100)}%`, backgroundColor: palette.dark },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[s.pillBtn, { backgroundColor: palette.soft }]}
        onPress={handleSync}
        disabled={syncing || !isHealthAvailable()}
        activeOpacity={0.7}
      >
        {syncing ? (
          <ActivityIndicator size="small" color={palette.primary} />
        ) : (
          <Text style={[s.pillBtnText, { color: palette.primary }]}>Tự đồng bộ</Text>
        )}
      </TouchableOpacity>
    </QuickActionCard>
  );
}
