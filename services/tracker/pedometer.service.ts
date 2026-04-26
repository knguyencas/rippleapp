import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toDateKey } from '../../utils/shared/date.utils';

const KEY_PREFIX = '@ripple_pedometer_';

let subscription: { remove: () => void } | null = null;
let currentDayKey: string | null = null;
let todaySteps = 0;
let lastCumulative = 0;
let started = false;

const todayKey = () => toDateKey(new Date());

async function loadDay(key: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PREFIX + key);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

async function saveDay(key: string, steps: number) {
  try {
    await AsyncStorage.setItem(KEY_PREFIX + key, String(Math.round(steps)));
  } catch {}
}

export async function isPedometerHardwareAvailable(): Promise<boolean> {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return false;
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function startPedometerAccumulator(): Promise<boolean> {
  if (started) return true;
  if (Platform.OS !== 'android') return false;

  const available = await isPedometerHardwareAvailable();
  if (!available) return false;

  try {
    const perm = await Pedometer.requestPermissionsAsync();
    if (perm.status !== 'granted') return false;
  } catch {
    return false;
  }

  currentDayKey = todayKey();
  todaySteps = await loadDay(currentDayKey);
  lastCumulative = 0;

  try {
    subscription = Pedometer.watchStepCount((result) => {
      const newKey = todayKey();
      const cumulative = result?.steps ?? 0;
      const delta = Math.max(0, cumulative - lastCumulative);
      lastCumulative = cumulative;

      if (newKey !== currentDayKey) {
        currentDayKey = newKey;
        todaySteps = delta;
      } else {
        todaySteps += delta;
      }
      saveDay(currentDayKey, todaySteps);
    });
  } catch {
    return false;
  }

  started = true;
  return true;
}

export function stopPedometerAccumulator() {
  if (subscription) {
    try { subscription.remove(); } catch {}
    subscription = null;
  }
  started = false;
  lastCumulative = 0;
}

export async function getTodayPedometerSteps(): Promise<number | null> {
  const key = todayKey();

  if (started && key === currentDayKey) {
    return todaySteps;
  }

  const stored = await loadDay(key);
  return stored > 0 ? stored : null;
}
