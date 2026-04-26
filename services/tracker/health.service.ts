import { Platform } from 'react-native';
import api from '../core/api';
import {
  startPedometerAccumulator,
  getTodayPedometerSteps,
  isPedometerHardwareAvailable,
} from './pedometer.service';
import { toDateKey } from '../../utils/shared/date.utils';

export interface StepsToday {
  steps: number;
  date: string;
}

export interface SleepToday {
  durationMin: number;
  bedtime: string;
  wakeTime: string;
  date: string;
}

const todayKey = () => toDateKey(new Date());

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

let healthKitReady = false;
let healthConnectReady = false;

async function ensureIosPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  if (healthKitReady) return true;
  try {
    const AppleHealthKit = require('react-native-health').default;
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
        ],
        write: [],
      },
    };
    await new Promise<void>((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (err: string | null) => {
        if (err) reject(new Error(err));
        else resolve();
      });
    });
    healthKitReady = true;
    return true;
  } catch (e) {
    console.warn('HealthKit init failed:', e);
    return false;
  }
}

async function ensureAndroidPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  startPedometerAccumulator().catch(() => {});

  if (healthConnectReady) return true;
  try {
    const HC = require('react-native-health-connect');
    const available = await HC.getSdkStatus();
    if (available !== HC.SdkAvailabilityStatus.SDK_AVAILABLE) {
      return await isPedometerHardwareAvailable();
    }

    const init = await HC.initialize();
    if (!init) return await isPedometerHardwareAvailable();

    const granted = await HC.requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'SleepSession' },
    ]);
    healthConnectReady = granted && granted.length > 0;
    if (healthConnectReady) return true;

    return await isPedometerHardwareAvailable();
  } catch (e) {
    console.warn('Health Connect init failed:', e);
    return await isPedometerHardwareAvailable();
  }
}

export async function ensureHealthPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') return ensureIosPermissions();
  if (Platform.OS === 'android') return ensureAndroidPermissions();
  return false;
}

async function readStepsToday(): Promise<number | null> {
  if (Platform.OS === 'ios') {
    try {
      const AppleHealthKit = require('react-native-health').default;
      return await new Promise<number | null>((resolve) => {
        AppleHealthKit.getStepCount(
          { date: new Date().toISOString() },
          (err: string | null, res: { value: number } | null) => {
            if (err) resolve(null);
            else resolve(Math.round(res?.value ?? 0));
          }
        );
      });
    } catch {
      return null;
    }
  }
  if (Platform.OS === 'android') {
    if (healthConnectReady) {
      try {
        const HC = require('react-native-health-connect');
        const start = startOfDay(new Date()).toISOString();
        const end = new Date().toISOString();
        const res = await HC.readRecords('Steps', {
          timeRangeFilter: { operator: 'between', startTime: start, endTime: end },
        });
        const total = (res.records ?? []).reduce((acc: number, r: any) => acc + (r.count ?? 0), 0);
        if (total > 0) return Math.round(total);
      } catch {
      }
    }
    return await getTodayPedometerSteps();
  }
  return null;
}

async function readSleepLastNight(): Promise<{ bedtime: string; wakeTime: string; durationMin: number } | null> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 1);
  start.setHours(18, 0, 0, 0);

  if (Platform.OS === 'ios') {
    try {
      const AppleHealthKit = require('react-native-health').default;
      const samples: Array<{ startDate: string; endDate: string; value: string }> = await new Promise((resolve) => {
        AppleHealthKit.getSleepSamples(
          { startDate: start.toISOString(), endDate: end.toISOString(), limit: 100 },
          (err: string | null, res: any[]) => resolve(err ? [] : res ?? [])
        );
      });
      const asleep = samples.filter(
        (s) => s.value === 'ASLEEP' || s.value === 'CORE' || s.value === 'DEEP' || s.value === 'REM'
      );
      if (asleep.length === 0) return null;
      const bedtime = asleep.reduce((min, s) => (s.startDate < min ? s.startDate : min), asleep[0].startDate);
      const wakeTime = asleep.reduce((max, s) => (s.endDate > max ? s.endDate : max), asleep[0].endDate);
      const durationMin = asleep.reduce(
        (acc, s) => acc + (new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / 60000,
        0
      );
      return { bedtime, wakeTime, durationMin: Math.round(durationMin) };
    } catch {
      return null;
    }
  }
  if (Platform.OS === 'android') {
    try {
      const HC = require('react-native-health-connect');
      const res = await HC.readRecords('SleepSession', {
        timeRangeFilter: { operator: 'between', startTime: start.toISOString(), endTime: end.toISOString() },
      });
      const records: any[] = res.records ?? [];
      if (records.length === 0) return null;
      const latest = records.sort((a, b) => (a.endTime < b.endTime ? 1 : -1))[0];
      const bedtime = latest.startTime;
      const wakeTime = latest.endTime;
      const durationMin = Math.round(
        (new Date(wakeTime).getTime() - new Date(bedtime).getTime()) / 60000
      );
      return { bedtime, wakeTime, durationMin };
    } catch {
      return null;
    }
  }
  return null;
}

export async function syncStepsToBackend(): Promise<StepsToday | null> {
  const ok = await ensureHealthPermissions();
  if (!ok) return null;
  const steps = await readStepsToday();
  if (steps == null) return null;
  const localDate = todayKey();
  try {
    await api.post('/health/steps', { date: localDate, steps });
    return { steps, date: localDate };
  } catch {
    return { steps, date: localDate };
  }
}

export async function syncSleepToBackend(): Promise<SleepToday | null> {
  const ok = await ensureHealthPermissions();
  if (!ok) return null;
  const data = await readSleepLastNight();
  if (!data) return null;
  const localDate = todayKey();
  try {
    await api.post('/health/sleep', {
      bedtime: data.bedtime,
      wakeTime: data.wakeTime,
      duration: data.durationMin,
    });
    return { ...data, date: localDate };
  } catch {
    return { ...data, date: localDate };
  }
}

export async function fetchHealthSummary(days = 7) {
  try {
    const res = await api.get('/health/summary', { params: { days } });
    return res.data as {
      days: number;
      dailyData: Array<{ date: string; steps: number | null; sleepMinutes: number | null; sleepSessions: number }>;
      averages: { steps: number | null; sleepMinutes: number | null };
    };
  } catch {
    return null;
  }
}

export async function fetchHealthToday() {
  try {
    const res = await api.get('/health/today');
    return res.data as {
      date: string;
      steps: number | null;
      sleep: { sessions: any[]; totalMinutes: number };
    };
  } catch {
    return null;
  }
}

export function isHealthAvailable(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}
