import api from './api';

export interface DailyHealthData {
  date: string;
  steps: number | null;
  sleepMinutes: number | null;
  sleepSessions: number;
}

export interface HealthSummary {
  days: number;
  dailyData: DailyHealthData[];
  averages: {
    steps: number | null;
    sleepMinutes: number | null;
  };
}

export interface TodayHealth {
  date: string;
  steps: number | null;
  sleep: {
    sessions: SleepSession[];
    totalMinutes: number;
  };
}

export interface SleepSession {
  id: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
}

export const healthApi = {
  saveSteps: (date: string, steps: number) =>
    api.post('/health/steps', { date, steps }),

  saveSleep: (bedtime: string, wakeTime: string, duration: number) =>
    api.post('/health/sleep', { bedtime, wakeTime, duration }),

  getSummary: (days = 7) =>
    api.get<HealthSummary>(`/health/summary?days=${days}`),

  getToday: () =>
    api.get<TodayHealth>('/health/today'),
};
