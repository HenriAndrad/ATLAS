import { API_BASE_URL } from "../../core/constants/appConstants";
import { getStoredToken } from "../../core/auth/authStorage";

async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();

  return fetch(`${API_BASE_URL}/api/v1/admin${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export interface AdminCategory {
  id: number;
  name: string;
  icon_emoji: string;
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

export async function deleteAdminCategory(id: number): Promise<void> {
  const response = await adminFetch(`/categories/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir matéria.");
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

export async function updateAdminWord(id: number, word: WordInput): Promise<void> {
  const response = await adminFetch(`/words/${id}`, {
    method: "PUT",
    body: JSON.stringify(word),
  });
  if (!response.ok) throw new Error("Falha ao atualizar palavra.");
}

export async function deleteAdminWord(id: number): Promise<void> {
  const response = await adminFetch(`/words/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir palavra.");
}

// --- Vídeos ---

export interface AdminVideo {
  id: number;
  title: string;
  video_url: string;
  category: string;
  language_code: string;
}

export async function fetchAdminVideos(): Promise<AdminVideo[]> {
  const response = await adminFetch("/videos");
  if (!response.ok) throw new Error("Falha ao carregar vídeos.");
  return response.json();
}

export async function createAdminVideo(input: {
  file: File;
  title: string;
  category: string;
  languageCode: string;
}): Promise<AdminVideo> {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("title", input.title);
  formData.append("category", input.category);
  formData.append("language_code", input.languageCode);

  const response = await adminFetch("/videos", { method: "POST", body: formData });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Falha ao adicionar vídeo.");
  }
  return response.json();
}

export async function deleteAdminVideo(id: number): Promise<void> {
  const response = await adminFetch(`/videos/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir vídeo.");
}

// --- Dicionário (upload de documento) ---

export async function uploadDictionaryDocument(
  file: File,
  languageCode: string,
): Promise<{ count: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language_code", languageCode);

  const response = await adminFetch("/dictionary/upload", { method: "POST", body: formData });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Falha ao importar o documento.");
  }
  const entries = await response.json();
  return { count: Array.isArray(entries) ? entries.length : 0 };
}

export async function deleteAdminDictionaryEntry(id: number): Promise<void> {
  const response = await adminFetch(`/dictionary/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir palavra do dicionário.");
}

// --- Contas de aluno criadas pelo admin ---

export interface AdminManagedUser {
  id: number;
  email: string;
  username: string;
  created_at: string | null;
}

export async function fetchAdminUsers(): Promise<AdminManagedUser[]> {
  const response = await adminFetch("/users");
  if (!response.ok) throw new Error("Falha ao carregar usuários.");
  return response.json();
}

export async function createAdminUser(input: {
  email: string;
  username: string;
  password: string;
}): Promise<AdminManagedUser> {
  const response = await adminFetch("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Falha ao criar conta.");
  }
  return response.json();
}

export async function deleteAdminUser(id: number): Promise<void> {
  const response = await adminFetch(`/users/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Falha ao excluir usuário.");
}

// --- Estatísticas ---

export interface AdminStats {
  users: number;
  categories: number;
  words: number;
  videos: number;
  dictionary_entries: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const response = await adminFetch("/stats");
  if (!response.ok) throw new Error("Falha ao carregar estatísticas.");
  return response.json();
}
