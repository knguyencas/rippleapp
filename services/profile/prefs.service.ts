import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = '@ripple_lang';

export type Lang = 'vi' | 'en';

export async function getLang(): Promise<Lang> {
  try {
    const raw = await AsyncStorage.getItem(LANG_KEY);
    return raw === 'en' ? 'en' : 'vi';
  } catch {
    return 'vi';
  }
}

export async function setLang(lang: Lang): Promise<void> {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
  } catch {}
}
