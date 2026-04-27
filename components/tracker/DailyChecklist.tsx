import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import api from '../../services/core/api';
import { fetchHealthToday, syncStepsToBackend, isHealthAvailable, ensureHealthPermissions } from '../../services/tracker/health.service';
import { fetchToday as fetchMeditationToday } from '../../services/tracker/meditation.service';
import { toDateKey } from '../../utils/shared/date.utils';
import { checklistStyles as s } from '../../styles/tracker/tracker-redesign.styles';
import ChecklistItem from './ChecklistItem';
import MeditationModal from './MeditationModal';

const todayKey = () => toDateKey(new Date());

const STEP_GOAL = 8000;
const SLEEP_GOAL_MIN = 8 * 60;
const MEDIT_GOAL_MIN = 10;
const DAILY_TASK_TOTAL = 6;

export type DailyTaskId =
  | 'mood'
  | 'journal'
  | 'water'
  | 'steps'
  | 'meditation'
  | 'sleep'
  | 'done';

export interface DailySummary {
  doneCount: number;
  totalCount: number;
  percent: number;
  nextTask: DailyTaskId;
  recommendation: string;
  ctaLabel: string;
}

export interface DailyChecklistHandle {
  incrementWater: () => void;
  syncSteps: () => Promise<void>;
  openMeditation: () => void;
}

interface Props {
  onSummary: (summary: DailySummary) => void;
}

interface TodayLog {
  id: string;
  note: string | null;
}

function ratio(value: number | null, goal: number): number {
  if (value == null || goal <= 0) return 0;
  return Math.max(0, Math.min(1, value / goal));
}

const DailyChecklist = forwardRef<DailyChecklistHandle, Props>(({ onSummary }, ref) => {
  const [todayLog, setTodayLog] = useState<TodayLog | null>(null);
  const [glasses, setGlasses] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [steps, setSteps] = useState<number | null>(null);
  const [sleepMin, setSleepMin] = useState<number | null>(null);
  const [meditMin, setMeditMin] = useState(0);
  const [meditModalVisible, setMeditModalVisible] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValue = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const [waterRes, healthToday, meditToday] = await Promise.all([
        api.get('/water/today', { params: { localDate: todayKey() } }),
        fetchHealthToday(),
        fetchMeditationToday(todayKey()),
      ]);
      const todayRes = await api.get('/logs/today').catch(() => null);
      setTodayLog(todayRes?.data?.log ?? null);
      setGlasses(Number(waterRes.data?.glasses ?? 0));
      setWaterGoal(Number(waterRes.data?.goal ?? 8));
      setSteps(healthToday?.steps ?? null);
      setSleepMin(healthToday?.sleep?.totalMinutes ?? null);
      setMeditMin(meditToday?.totalMinutes ?? 0);
    } catch {
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, []);

  const incrementWater = () => {
    setGlasses((prev) => {
      const next = Math.min(30, prev + 1);
      if (next !== prev) {
        pendingValue.current = next;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          const v = pendingValue.current;
          if (v == null) return;
          try { await api.put('/water', { localDate: todayKey(), glasses: v }); } catch {}
        }, 500);
      }
      return next;
    });
  };

  const syncSteps = async () => {
    if (!isHealthAvailable()) return;
    const granted = await ensureHealthPermissions();
    if (!granted) return;
    const res = await syncStepsToBackend();
    if (res?.steps != null) setSteps(res.steps);
  };

  useImperativeHandle(ref, () => ({
    incrementWater,
    syncSteps,
    openMeditation: () => setMeditModalVisible(true),
  }));

  const moodDone = !!todayLog;
  const journalDone = !!todayLog?.note?.trim();
  const waterDone = glasses >= waterGoal;
  const sleepDone = sleepMin != null && sleepMin >= SLEEP_GOAL_MIN;
  const stepsDone = steps != null && steps >= STEP_GOAL;
  const meditDone = meditMin >= MEDIT_GOAL_MIN;
  const meditFirstTime = meditMin === 0;

  useEffect(() => {
    const taskProgress = {
      mood: moodDone ? 1 : 0,
      journal: journalDone ? 1 : 0,
      water: ratio(glasses, waterGoal),
      steps: ratio(steps, STEP_GOAL),
      meditation: ratio(meditMin, MEDIT_GOAL_MIN),
      sleep: ratio(sleepMin, SLEEP_GOAL_MIN),
    };
    const doneCount = Object.values(taskProgress).filter((value) => value >= 1).length;
    const percent = (Object.values(taskProgress).reduce((sum, value) => sum + value, 0) / DAILY_TASK_TOTAL) * 100;

    let nextTask: DailyTaskId = 'done';
    let recommendation = 'Hôm nay đủ nhịp rồi.';
    let ctaLabel = 'Xem nhật ký';

    if (!moodDone) {
      nextTask = 'mood';
      recommendation = 'Vote tâm trạng trước nhé.';
      ctaLabel = 'Chọn tâm trạng';
    } else if (!journalDone) {
      nextTask = 'journal';
      recommendation = 'Viết vài dòng nhật ký.';
      ctaLabel = 'Viết log';
    } else if (!waterDone) {
      nextTask = 'water';
      recommendation = 'Uống thêm nước nào.';
      ctaLabel = 'Uống nước';
    } else if (!stepsDone) {
      nextTask = 'steps';
      recommendation = 'Bạn sắp làm được rồi, cố lên.';
      ctaLabel = 'Đồng bộ bước';
    } else if (!meditDone) {
      nextTask = 'meditation';
      recommendation = 'Thiền thêm một chút.';
      ctaLabel = 'Bắt đầu thiền';
    } else if (!sleepDone) {
      nextTask = 'sleep';
      recommendation = 'Theo dõi giấc ngủ đêm qua.';
      ctaLabel = 'Xem giấc ngủ';
    }

    onSummary({
      doneCount,
      totalCount: DAILY_TASK_TOTAL,
      percent,
      nextTask,
      recommendation,
      ctaLabel,
    });
  }, [
    glasses,
    journalDone,
    meditDone,
    meditMin,
    moodDone,
    onSummary,
    sleepDone,
    sleepMin,
    steps,
    stepsDone,
    todayLog,
    waterDone,
    waterGoal,
  ]);

  return (
    <View style={s.section}>
      <View style={s.headerRow}>
        <Text style={s.sectionTitle}>Việc hôm nay</Text>
        <TouchableOpacity onPress={() => router.push('/tabs/journal')}>
          <Text style={s.meta}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <ChecklistItem
        title="Vote tâm trạng"
        sub={moodDone ? 'Đã ghi nhận mood hôm nay' : 'Chọn mood để bắt đầu ngày'}
        iconLetter="M"
        iconBg="#FFD8D8"
        iconColor="#A03844"
        trailing={
          moodDone
            ? { type: 'done' }
            : { type: 'open', onPress: () => router.push('/tabs/home') }
        }
      />

      <ChecklistItem
        title="Viết log"
        sub={journalDone ? 'Đã viết nhật ký hôm nay' : 'Ghi vài dòng cảm xúc'}
        iconLetter="L"
        iconBg="#FFF3CD"
        iconColor="#8B6F2A"
        trailing={
          journalDone
            ? { type: 'done' }
            : { type: 'open', onPress: () => router.push('/tabs/journal/new') }
        }
      />

      <ChecklistItem
        title="Uống nước"
        sub={`${glasses}/${waterGoal} ly hôm nay`}
        iconLetter="N"
        iconBg="#DEEBFF"
        iconColor="#2E6F8E"
        trailing={
          waterDone
            ? { type: 'done' }
            : { type: 'plus', onPress: incrementWater }
        }
      />

      <ChecklistItem
        title="Vận động"
        sub={
          steps == null
            ? 'Chưa có dữ liệu hôm nay'
            : `${steps.toLocaleString('vi-VN')}/${STEP_GOAL.toLocaleString('vi-VN')} bước`
        }
        iconLetter="V"
        iconBg="#F4D8B0"
        iconColor="#A0651A"
        trailing={
          stepsDone
            ? { type: 'done' }
            : { type: 'plus', onPress: syncSteps }
        }
      />

      <ChecklistItem
        title="Thiền"
        sub={`${meditMin}/${MEDIT_GOAL_MIN} phút hôm nay`}
        iconLetter="T"
        iconBg="#D8E8D8"
        iconColor="#3D7A4A"
        isNew={meditFirstTime}
        dashed={meditFirstTime}
        trailing={
          meditDone
            ? { type: 'done' }
            : { type: 'plus', onPress: () => setMeditModalVisible(true) }
        }
      />

      <ChecklistItem
        title="Giấc ngủ"
        sub={
          sleepMin == null
            ? 'Chưa có dữ liệu đêm qua'
            : `${(sleepMin / 60).toFixed(1)}/8 giờ đêm qua`
        }
        iconLetter="G"
        iconBg="#E0D8F0"
        iconColor="#6B5AAA"
        trailing={
          sleepDone
            ? { type: 'done' }
            : { type: 'open', onPress: () => router.push('/tabs/tracker') }
        }
      />

      <MeditationModal
        visible={meditModalVisible}
        onClose={() => setMeditModalVisible(false)}
        onSessionSaved={() => { void load(); }}
      />
    </View>
  );
});

DailyChecklist.displayName = 'DailyChecklist';

export default DailyChecklist;
