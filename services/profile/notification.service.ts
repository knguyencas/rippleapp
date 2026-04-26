import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PREF_KEY = '@ripple_reminder_pref';
const SCHEDULE_ID_KEY = '@ripple_reminder_id';

export interface ReminderPref {
  enabled: boolean;
  hour: number;   // 0-23
  minute: number; // 0-59
}

export const DEFAULT_PREF: ReminderPref = { enabled: false, hour: 20, minute: 0 };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function getReminderPref(): Promise<ReminderPref> {
  try {
    const raw = await AsyncStorage.getItem(PREF_KEY);
    if (!raw) return DEFAULT_PREF;
    const parsed = JSON.parse(raw);
    return {
      enabled: !!parsed.enabled,
      hour: Math.min(23, Math.max(0, parsed.hour ?? 20)),
      minute: Math.min(59, Math.max(0, parsed.minute ?? 0)),
    };
  } catch {
    return DEFAULT_PREF;
  }
}

async function savePref(pref: ReminderPref): Promise<void> {
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify(pref));
}

async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily-reminder', {
    name: 'Nhắc nhở hàng ngày',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#3AA5A5',
  });
}

async function cancelExisting(): Promise<void> {
  try {
    const id = await AsyncStorage.getItem(SCHEDULE_ID_KEY);
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
      await AsyncStorage.removeItem(SCHEDULE_ID_KEY);
    }
  } catch {}
}

export async function enableReminder(hour: number, minute: number): Promise<boolean> {
  const granted = await ensurePermission();
  if (!granted) {
    await savePref({ enabled: false, hour, minute });
    return false;
  }

  await ensureAndroidChannel();
  await cancelExisting();

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Ripple',
        body: 'Hôm nay bạn thế nào? Dành một phút ghi lại tâm trạng nhé.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
      },
    });
    await AsyncStorage.setItem(SCHEDULE_ID_KEY, id);
    await savePref({ enabled: true, hour, minute });
    return true;
  } catch (e) {
    console.warn('schedule reminder failed:', e);
    await savePref({ enabled: false, hour, minute });
    return false;
  }
}

export async function disableReminder(): Promise<void> {
  await cancelExisting();
  const pref = await getReminderPref();
  await savePref({ ...pref, enabled: false });
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
