export interface MoodLike {
  name: string;
  emoji: string;
}

export function findMoodByName<T extends MoodLike>(
  moods: T[],
  moodName?: string | null
): T | null {
  if (!moodName) return null;
  return moods.find((mood) => mood.name.toLowerCase() === moodName.toLowerCase()) ?? null;
}

export function getMoodEmojiByName<T extends MoodLike>(
  moods: T[],
  moodName?: string | null
): string {
  return findMoodByName(moods, moodName)?.emoji ?? '';
}

