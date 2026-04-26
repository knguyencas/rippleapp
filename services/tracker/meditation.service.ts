import api from '../core/api';

export interface MeditationSound {
  id: string;
  name: string;
  description: string;
  url: string;
  fileSizeMB: number;
  durationSec: number;
}

export interface MeditationSessionInput {
  soundId: string;
  targetMin: number;
  actualMin: number;
  startedAt: string; // ISO
  completedAt: string; // ISO
}

export interface MeditationSession {
  id: string;
  soundId: string;
  targetMin: number;
  actualMin: number;
  completed: boolean;
  startedAt: string;
  completedAt: string;
}

export interface MeditationToday {
  totalMinutes: number;
  goalMin: number;
  isFirstTime: boolean;
  sessions: MeditationSession[];
}

export async function fetchSounds(): Promise<MeditationSound[]> {
  const res = await api.get('/meditation/sounds');
  return res.data?.items ?? [];
}

export async function createSession(input: MeditationSessionInput): Promise<MeditationSession> {
  const res = await api.post('/meditation/sessions', input);
  return res.data;
}

export async function fetchToday(localDate: string): Promise<MeditationToday | null> {
  try {
    const res = await api.get('/meditation/today', { params: { localDate } });
    return res.data;
  } catch (e) {
    console.warn('meditation.fetchToday failed:', e);
    return null;
  }
}
