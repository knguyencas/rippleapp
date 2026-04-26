import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_DIR = `${FileSystem.documentDirectory}meditation_audio/`;
const INDEX_KEY = '@ripple_meditation_downloaded';

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
  }
}

async function loadIndex(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

async function saveIndex(set: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify([...set]));
  } catch {
  }
}

export function getLocalUri(soundId: string): string {
  return `${AUDIO_DIR}${soundId}.mp3`;
}

export async function getDownloadedSet(): Promise<Set<string>> {
  const indexed = await loadIndex();
  if (indexed.size === 0) return indexed;

  const validated = new Set<string>();
  for (const id of indexed) {
    const info = await FileSystem.getInfoAsync(getLocalUri(id));
    if (info.exists && info.size > 0) validated.add(id);
  }
  if (validated.size !== indexed.size) {
    await saveIndex(validated);
  }
  return validated;
}

export async function isDownloaded(soundId: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(getLocalUri(soundId));
  return info.exists && info.size > 0;
}

export async function downloadSound(
  soundId: string,
  url: string,
  onProgress?: (ratio: number) => void
): Promise<string> {
  await ensureDir();
  const dest = getLocalUri(soundId);

  const task = FileSystem.createDownloadResumable(
    url,
    dest,
    {},
    (data) => {
      if (data.totalBytesExpectedToWrite > 0) {
        const ratio = data.totalBytesWritten / data.totalBytesExpectedToWrite;
        onProgress?.(Math.min(1, Math.max(0, ratio)));
      }
    }
  );

  const result = await task.downloadAsync();
  if (!result?.uri) {
    throw new Error('Download failed');
  }

  const index = await loadIndex();
  index.add(soundId);
  await saveIndex(index);

  return result.uri;
}

export async function deleteSound(soundId: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(getLocalUri(soundId), { idempotent: true });
  } finally {
    const index = await loadIndex();
    if (index.delete(soundId)) {
      await saveIndex(index);
    }
  }
}
