import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ripple_chat_history';
const MAX_MESSAGES = 300;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: Date;
}

export async function loadChatHistory(): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredMessage[];
    if (!Array.isArray(parsed)) return [];

    const cutoff = Date.now() - TTL_MS;
    return parsed
      .filter((m) => m && typeof m.time === 'string' && new Date(m.time).getTime() >= cutoff)
      .map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        time: new Date(m.time),
      }));
  } catch {
    return [];
  }
}

export async function saveChatHistory(messages: ChatMessage[]): Promise<void> {
  try {
    const cutoff = Date.now() - TTL_MS;
    const filtered = messages.filter((m) => m.time.getTime() >= cutoff);
    const capped = filtered.length > MAX_MESSAGES
      ? filtered.slice(filtered.length - MAX_MESSAGES)
      : filtered;

    const serialized: StoredMessage[] = capped.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.text,
      time: m.time.toISOString(),
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {}
}

export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}
