import { API_BASE_URL } from "../../core/constants/appConstants";

export interface DictionaryEntry {
  id: number;
  original_text: string;
  translated_text: string;
  language_code: string;
}

export async function fetchDictionaryEntries(languageCode: string): Promise<DictionaryEntry[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/dictionary?language_code=${encodeURIComponent(languageCode)}`,
  );
  if (!response.ok) {
    throw new Error(`Falha ao carregar o dicionário (status ${response.status})`);
  }
  return (await response.json()) as DictionaryEntry[];
}
