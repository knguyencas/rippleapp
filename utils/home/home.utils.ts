interface MoodLike {
  name: string;
}

interface ScoredMoodLog {
  moodScore: number;
}

export function getMoodInfoByName<T extends MoodLike>(
  moods: T[],
  moodName?: string | null
): T | null {
  if (!moodName) return null;
  return moods.find((mood) => mood.name.toLowerCase() === moodName.toLowerCase()) ?? null;
}

export function calculateAverageMood(logs: ScoredMoodLog[]): string {
  if (logs.length === 0) return '-';
  const avg = logs.reduce((sum, log) => sum + log.moodScore, 0) / logs.length;
  return avg.toFixed(1);
}

