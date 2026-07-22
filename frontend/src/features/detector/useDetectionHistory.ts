import { useEffect, useState } from "react";
import type { SupportedLanguage } from "../../core/constants/appConstants";

const STORAGE_KEY = "vision-translator:detection-history";
const MAX_ENTRIES = 100;

export interface HistoryEntry {
  id: string;
  original: string;
  translated: string;
  language: SupportedLanguage;
  timestamp: number;
  favorite: boolean;
}

function readStoredHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/// Guarda o histórico de palavras "aprendidas" (toda vez que o aluno
/// toca no botão de áudio) no localStorage, com opção de favoritar.
/// Não depende de banco de dados — fica só no navegador do aluno.
export function useDetectionHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(readStoredHistory);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function addEntry(original: string, translated: string, language: SupportedLanguage) {
    setHistory((prev) => {
      // Se a mesma palavra/idioma já está no topo do histórico recente,
      // só atualiza o horário em vez de duplicar (aluno clicando várias
      // vezes seguidas no mesmo objeto).
      const existingIndex = prev.findIndex(
        (entry) => entry.original === original && entry.language === language,
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        updated.unshift({ ...existing, timestamp: Date.now() });
        return updated;
      }

      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        original,
        translated,
        language,
        timestamp: Date.now(),
        favorite: false,
      };

      return [newEntry, ...prev].slice(0, MAX_ENTRIES);
    });
  }

  function toggleFavorite(id: string) {
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, favorite: !entry.favorite } : entry)),
    );
  }

  return { history, addEntry, toggleFavorite };
}
