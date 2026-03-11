import { Storage } from '@capacitor/storage';

const LANGUAGE_KEY = 'app_language';

export async function saveLanguage(lang: string) {
  await Storage.set({ key: LANGUAGE_KEY, value: lang });
}

export async function loadLanguage(): Promise<string | null> {
  const { value } = await Storage.get({ key: LANGUAGE_KEY });
  return value;
}
