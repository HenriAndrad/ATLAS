import { API_BASE_URL } from "../../core/constants/appConstants";
import { clearAdminCredentials, getAdminAuthHeader } from "./adminAuth";

async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const authHeader = getAdminAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/v1/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAdminCredentials();
  }

  return response;
}

export interface AdminCategory {
  id: number;
  name: string;
  icon_emoji: string;
}

/// Tenta uma chamada autenticada simples só pra confirmar se as
/// credenciais guardadas ainda são válidas.
export async function verifyAdminCredentials(): Promise<boolean> {
  const response = await adminFetch("/categories");
  return response.ok;
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const response = await adminFetch("/categories");
  if (!response.ok) throw new Error("Falha ao carregar categorias.");
  return response.json();
}

export async function createAdminCategory(
  name: string,
  iconEmoji: string,
): Promise<AdminCategory> {
  const response = await adminFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name, icon_emoji: iconEmoji }),
  });
  if (!response.ok) throw new Error("Falha ao criar categoria.");
  return response.json();
}

export interface WordTranslationInput {
  language_code: string;
  translated_text: string;
}

export interface WordInput {
  category_id: number;
  original_en: string;
  emoji: string;
  expected_confidence: number;
  example_sentence_en: string;
  translations: WordTranslationInput[];
}

export async function createAdminWord(word: WordInput): Promise<void> {
  const response = await adminFetch("/words", {
    method: "POST",
    body: JSON.stringify(word),
  });
  if (!response.ok) throw new Error("Falha ao criar palavra.");
}

export async function deleteAdminWord(id: number): Promise<void> {
  const response = await adminFetch(`/words/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir palavra.");
}
