import { API_BASE_URL } from "../../core/constants/appConstants";
import type { LibraryCategory } from "./types";

export async function fetchLibrary(): Promise<LibraryCategory[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/library`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar a biblioteca (status ${response.status})`);
  }

  return (await response.json()) as LibraryCategory[];
}
