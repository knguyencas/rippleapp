import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { healthApi, SleepSession } from '../services/health';

const BEDTIME_KEY = '@ripple_bedtime';

export function useSleepTracker() {
  const [bedtime, setBedtime] = useState<string | null>(null);     // ISO string
  const [sleeping, setSleeping] = useState(false);
  const [lastSession, setLastSession] = useState<SleepSession | null>(null);
  const [totalMinutesToday, setTotalMinutesToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {

        const stored = await AsyncStorage.getItem(BEDTIME_KEY);
        if (stored) {
          setBedtime(stored);
          setSleeping(true);
        }


        const res = await healthApi.getToday();
        const todayData = res.data;
        setTotalMinutesToday(todayData.sleep.totalMinutes);
        if (todayData.sleep.sessions.length > 0) {
          setLastSession(todayData.sleep.sessions[0]);
        }
      } catch {

      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToSleep = async () => {
    const now = new Date().toISOString();
    setBedtime(now);
    setSleeping(true);
    await AsyncStorage.setItem(BEDTIME_KEY, now);
  };

  const wakeUp = async () => {
    if (!bedtime) return;
    setSaving(true);
    try {
      const wakeTime = new Date();
      const bedtimeDate = new Date(bedtime);
      const durationMs = wakeTime.getTime() - bedtimeDate.getTime();
      const durationMinutes = Math.round(durationMs / 60000);

      if (durationMinutes < 1) {

        setSleeping(false);
        setBedtime(null);
        await AsyncStorage.removeItem(BEDTIME_KEY);
        return;
      }

      const res = await healthApi.saveSleep(
        bedtime,
        wakeTime.toISOString(),
        durationMinutes,
      );
      setLastSession(res.data);
      setTotalMinutesToday(prev => prev + durationMinutes);
    } catch {

    } finally {
      setSleeping(false);
      setBedtime(null);
      await AsyncStorage.removeItem(BEDTIME_KEY);
      setSaving(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} phút`;
    if (m === 0) return `${h} tiếng`;
    return `${h}t ${m}p`;
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  };

  return {
    sleeping,
    bedtime,
    lastSession,
    totalMinutesToday,
    loading,
    saving,
    goToSleep,
    wakeUp,
    formatDuration,
    formatTime,
    goalMinutes: 8 * 60, // 8 hours
    progress: Math.min(totalMinutesToday / (8 * 60), 1),
  };
}
