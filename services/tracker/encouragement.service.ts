import api from '../core/api';

export interface EncouragementPayload {
  mood: string;
  water: string;
  steps: string;
  sleep: string;
}

export async function fetchEncouragement(): Promise<EncouragementPayload | null> {
  try {
    const res = await api.get('/encouragement');
    const d = res.data ?? {};
    return {
      mood: String(d.mood ?? ''),
      water: String(d.water ?? ''),
      steps: String(d.steps ?? ''),
      sleep: String(d.sleep ?? ''),
    };
  } catch (e) {
    console.warn('fetchEncouragement failed:', e);
    return null;
  }
}
