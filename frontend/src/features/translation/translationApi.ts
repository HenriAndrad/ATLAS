import { API_BASE_URL, type SupportedLanguage } from "../../core/constants/appConstants";

interface TranslationResponse {
  translated_text: string;
  source_lang: string;
  target_lang: string;
}

/// Chama o backend para traduzir um texto. Os rótulos detectados pelo
/// COCO-SSD são sempre em inglês, então `source_lang` é fixado como "en".
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target_lang: targetLang, source_lang: "en" }),
  });

  if (!response.ok) {
    throw new Error(`Falha na tradução (status ${response.status})`);
  }

  const data = (await response.json()) as TranslationResponse;
  return data.translated_text;
}
